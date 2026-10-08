import { Redis } from "@upstash/redis";
import { Redis as IORedis } from "ioredis";
import {
  REPORT_STATUSES,
  type ReportStatus,
} from "../src/app/reports/contracts.js";
import { ReportError, type ReportStore } from "./report-service.js";
const PREFIX = "asu_reports:v1:"; // Never matched by progress sync's asu_data namespace.
let runEval:
  | ((script: string, keys: string[], args: string[]) => Promise<unknown>)
  | undefined;
export function evalRedis(
  script: string,
  keys: string[],
  args: string[] = [],
): Promise<unknown> {
  if (!runEval) {
    if (process.env.REDIS_URL) {
      const client = new IORedis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 1,
        connectTimeout: 5000,
      });
      runEval = (s, k, a) => client.eval(s, k.length, ...k, ...a);
    } else {
      const url =
        process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
      const token =
        process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
      if (!url || !token)
        throw new ReportError(
          503,
          "Reporting is being configured. Please try again later.",
        );
      const client = new Redis({ url, token, automaticDeserialization: false });
      runEval = (s, k, a) => client.eval(s, k, a);
    }
  }
  return runEval(script, keys, args);
}
// Atomic creation, idempotency, rate limit and indexes. Report records NEVER expire.
export const CREATE_REPORT_LUA = `
local existing=redis.call('GET',KEYS[1]); if existing then return {0,existing} end
local count=tonumber(redis.call('GET',KEYS[4]) or '0'); if count>=10 then return {-1,''} end
redis.call('INCR',KEYS[4]); if count==0 then redis.call('EXPIRE',KEYS[4],3600) end
redis.call('SET',KEYS[1],ARGV[1]); redis.call('ZADD',KEYS[2],ARGV[2],ARGV[3]); redis.call('ZADD',KEYS[3],ARGV[2],ARGV[3]); return {1,ARGV[1]}`;
export const UPDATE_REPORT_LUA = `
local raw=redis.call('GET',KEYS[1]); if not raw then return {404,''} end
local r=cjson.decode(raw); if r.revision~=tonumber(ARGV[1]) then return {409,''} end
local patch=cjson.decode(ARGV[2]); local old=r.status
r.status=patch.status;r.notes=patch.notes;r.updatedAt=patch.updatedAt;r.updatedBy=patch.updatedBy;r.revision=r.revision+1
local score=redis.call('ZSCORE',KEYS[2],r.id) or '0'
redis.call('ZREM',ARGV[3]..old,r.id);redis.call('ZADD',ARGV[3]..r.status,score,r.id)
local result=cjson.encode(r);redis.call('SET',KEYS[1],result);return {200,result}`;
// Keep immutable snapshot JSON opaque to Lua cjson (which can change empty arrays).
export function encodeStoredReport(
  report: import("../src/app/reports/contracts.js").QuestionReport,
): string {
  return JSON.stringify({
    ...report,
    snapshot: JSON.stringify(report.snapshot),
  });
}
export function decodeStoredReport(
  raw: string,
): import("../src/app/reports/contracts.js").QuestionReport {
  const report = JSON.parse(raw);
  if (typeof report.snapshot === "string")
    report.snapshot = JSON.parse(report.snapshot);
  return report;
}
const recordKey = (id: string) => PREFIX + "record:" + id;
export const reportStore: ReportStore = {
  async create(report) {
    const result = (await evalRedis(
      CREATE_REPORT_LUA,
      [
        recordKey(report.id),
        PREFIX + "all",
        PREFIX + "status:new",
        PREFIX + "rate:" + report.reporterId,
      ],
      [
        encodeStoredReport(report),
        String(Date.parse(report.createdAt)),
        report.id,
      ],
    )) as [number, string];
    if (result[0] === -1)
      throw new ReportError(
        429,
        "You have sent several reports. Please try again in an hour.",
      );
    return { created: result[0] === 1, report: decodeStoredReport(result[1]) };
  },
  async get(id) {
    const raw = await evalRedis("return redis.call('GET',KEYS[1])", [
      recordKey(id),
    ]);
    return raw ? decodeStoredReport(String(raw)) : null;
  },
  async list(status, offset, limit = 25) {
    const index =
      status === "all" ? PREFIX + "all" : PREFIX + "status:" + status;
    const result = (await evalRedis(
      `local ids=redis.call('ZREVRANGE',KEYS[1],ARGV[1],ARGV[2]);local rows={};for _,id in ipairs(ids) do local raw=redis.call('GET',ARGV[3]..id);if raw then table.insert(rows,raw) end end;local counts={};for i=2,5 do table.insert(counts,redis.call('ZCARD',KEYS[i])) end;return {rows,redis.call('ZCARD',KEYS[1]),counts}`,
      [index, ...REPORT_STATUSES.map((s) => PREFIX + "status:" + s)],
      [String(offset), String(offset + Math.min(500, Math.max(1, limit)) - 1), PREFIX + "record:"],
    )) as [string[], number, number[]];
    return {
      reports: result[0].map((raw) => decodeStoredReport(raw)),
      total: result[1],
      counts: Object.fromEntries(
        REPORT_STATUSES.map((s, i) => [s, result[2][i]]),
      ) as Record<ReportStatus, number>,
    };
  },
  async update(id, revision, patch) {
    const result = (await evalRedis(
      UPDATE_REPORT_LUA,
      [recordKey(id), PREFIX + "all"],
      [String(revision), JSON.stringify(patch), PREFIX + "status:"],
    )) as [number, string];
    if (result[0] !== 200)
      throw new ReportError(
        result[0],
        result[0] === 409
          ? "This report changed in another window. Refresh before saving."
          : "Report not found.",
      );
    return decodeStoredReport(result[1]);
  },
  async notification(id, value) {
    await evalRedis(
      `local raw=redis.call('GET',KEYS[1]);if not raw then return 0 end;local r=cjson.decode(raw);if r.notification.state=='sent' then return 1 end;r.notification=cjson.decode(ARGV[1]);redis.call('SET',KEYS[1],cjson.encode(r));return 1`,
      [recordKey(id)],
      [JSON.stringify(value)],
    );
  },
};
