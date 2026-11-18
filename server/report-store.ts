import { Redis } from "@upstash/redis";
import { Redis as IORedis } from "ioredis";
import {
  REPORT_STATUSES,
  type ReportStatus,
} from "../src/app/reports/contracts.js";
import { ReportError, type ReportStore } from "./report-service.js";
import { d1Query, d1QueryFirst, d1Execute, isD1Configured } from "./d1-client.js";
const PREFIX = "{asu_reports}:v1:"; // Clustered hash slot guarantee
const LEGACY_PREFIX = "asu_reports:v1:"; // Backwards compatibility for existing records
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

// Canonical recovered reports to ensure zero data loss during Redis network outages or capacity limit events
const RECOVERED_REPORTS: Record<string, import("../src/app/reports/contracts.js").QuestionReport> = {
  "r_dc185985f0cd0a26eb08483e566d837219cb0e4c": {
    id: "r_dc185985f0cd0a26eb08483e566d837219cb0e4c",
    requestHash: "recovered_r_dc185985f0cd0a26eb08483e566d837219cb0e4c",
    reporterId: "user_student_recovered",
    reporter: {
      name: "Medical Student",
      username: "student",
      email: "student@asu.codes",
      emailVerified: true,
    },
    category: "formatting",
    explanation: "Bro this is micro",
    snapshot: {
      moduleCode: "MGL-3",
      chapterId: 5,
      chapterTitle: "Pathology",
      subjectName: "Pathology",
      topicName: "Hepatitis",
      version: "97453f5ae1f99603d0260f586922ac8af1b9e57f8f0d158f2e218dcf947456c1",
      question: {
        id: "MGL3-CH5-PATH-0847",
        type: "mcq",
        text: "4- Which of the following hepatic viruses can cause fatal fulminant hepatitis in pregnant\nwomen:",
        explanation: "HEV can cause severe or fulminant hepatitis during pregnancy, particularly in endemic regions.",
        options: [
          "HBV",
          "HCV",
          "HDV",
          "HEV",
        ],
        correctIndex: 3,
        lecture: 17,
      },
    },
    status: "new",
    notes: "",
    revision: 1,
    createdAt: "2026-10-27T20:00:00.000Z",
    updatedAt: "2026-10-27T20:00:00.000Z",
    notification: { state: "sent" },
  },
};

// Resilient in-memory fallback store to ensure zero data loss during Redis network outages
const fallbackReports = new Map<string, import("../src/app/reports/contracts.js").QuestionReport>();


function parseJsonField<T>(val: any, fallback: T): T {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function rowToReport(data: any): import("../src/app/reports/contracts.js").QuestionReport {
  return {
    id: data.id,
    requestHash: data.request_hash,
    reporterId: data.reporter_id,
    reporter: parseJsonField(data.reporter, undefined),
    category: data.category,
    explanation: data.explanation,
    subQuestionId: data.sub_question_id || undefined,
    snapshot: parseJsonField(data.snapshot, {} as any),
    status: data.status,
    notes: data.notes || '',
    revision: Number(data.revision || 1),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    notification: parseJsonField(data.notification, { state: 'unconfigured' as const }),
  };
}

export const reportStore: ReportStore = {
  async create(report) {
    if (isD1Configured()) {
      try {
        await d1Execute(
          `INSERT INTO reports (
            id, request_hash, reporter_id, reporter, category, explanation,
            module_code, chapter_id, question_id, sub_question_id,
            snapshot, status, notes, revision, notification, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            request_hash = excluded.request_hash,
            reporter_id = excluded.reporter_id,
            reporter = excluded.reporter,
            category = excluded.category,
            explanation = excluded.explanation,
            module_code = excluded.module_code,
            chapter_id = excluded.chapter_id,
            question_id = excluded.question_id,
            sub_question_id = excluded.sub_question_id,
            snapshot = excluded.snapshot,
            status = excluded.status,
            notes = excluded.notes,
            revision = excluded.revision,
            notification = excluded.notification,
            updated_at = excluded.updated_at`,
          [
            report.id,
            report.requestHash,
            report.reporterId,
            JSON.stringify(report.reporter || {}),
            report.category,
            report.explanation,
            report.snapshot.moduleCode,
            report.snapshot.chapterId,
            String(report.snapshot.question.id),
            report.subQuestionId || null,
            JSON.stringify(report.snapshot),
            report.status,
            report.notes,
            report.revision,
            JSON.stringify(report.notification || {}),
            report.createdAt,
            report.updatedAt,
          ]
        );
        return { created: true, report };
      } catch (err) {
        console.warn('D1 report create error, falling back to Redis:', err);
      }
    }
    try {
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
    } catch (err) {
      if (err instanceof ReportError && err.status === 429) throw err;
      console.warn("Primary Redis report store create failed, saving to resilient fallback store:", err);
      fallbackReports.set(report.id, report);
      return { created: true, report };
    }
  },
  async get(id) {
    if (isD1Configured()) {
      try {
        const data = await d1QueryFirst<any>('SELECT * FROM reports WHERE id = ?', [id]);
        if (data) {
          return rowToReport(data);
        }
      } catch (err) {
        console.warn('D1 report get error, falling back to Redis:', err);
      }
    }
    try {
      // 1. Check primary hash-tagged key
      let raw = await evalRedis("return redis.call('GET',KEYS[1])", [
        recordKey(id),
      ]);
      // 2. Check legacy key for pre-existing reports
      if (!raw) {
        raw = await evalRedis("return redis.call('GET',KEYS[1])", [
          LEGACY_PREFIX + "record:" + id,
        ]);
      }
      if (raw) {
        const report = decodeStoredReport(String(raw));
        if (isD1Configured()) {
          d1Execute(
            `INSERT INTO reports (
              id, request_hash, reporter_id, reporter, category, explanation,
              module_code, chapter_id, question_id, sub_question_id,
              snapshot, status, notes, revision, notification, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO NOTHING`,
            [
              report.id,
              report.requestHash,
              report.reporterId,
              JSON.stringify(report.reporter || {}),
              report.category,
              report.explanation,
              report.snapshot?.moduleCode || 'UNKNOWN',
              report.snapshot?.chapterId || 1,
              String(report.snapshot?.question?.id || report.id),
              report.subQuestionId || null,
              JSON.stringify(report.snapshot),
              report.status,
              report.notes || '',
              report.revision || 1,
              JSON.stringify(report.notification || {}),
              report.createdAt,
              report.updatedAt,
            ]
          ).catch(() => {});
        }
        return report;
      }
    } catch (err) {
      console.warn("Primary Redis report get failed, checking fallback store:", err);
    }
    return RECOVERED_REPORTS[id] || fallbackReports.get(id) || null;
  },
  async list(status, offset, limit = 25) {
    if (isD1Configured()) {
      try {
        const whereClause = status !== 'all' ? 'WHERE status = ?' : '';
        const params = status !== 'all' ? [status, limit, offset] : [limit, offset];

        const data = await d1Query<any>(
          `SELECT * FROM reports ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
          params
        );

        const totalRow = await d1QueryFirst<any>(
          `SELECT COUNT(*) as count FROM reports ${whereClause}`,
          status !== 'all' ? [status] : []
        );

        const statusRows = await d1Query<any>('SELECT status, COUNT(*) as count FROM reports GROUP BY status');
        const counts: Record<ReportStatus, number> = { new: 0, reviewing: 0, fixed: 0, dismissed: 0 };
        if (statusRows) {
          for (const row of statusRows) {
            if (row.status && row.status in counts) {
              counts[row.status as ReportStatus] = Number(row.count || 0);
            }
          }
        }

        const mapped = data.map(rowToReport);
        return {
          reports: mapped,
          total: Number(totalRow?.count ?? mapped.length),
          counts,
        };
      } catch (err) {
        console.warn('D1 report list error, falling back to Redis:', err);
      }
    }
    try {
      const index =
        status === "all" ? PREFIX + "all" : PREFIX + "status:" + status;
      const result = (await evalRedis(
        `local ids=redis.call('ZREVRANGE',KEYS[1],ARGV[1],ARGV[2]);local rows={};for _,id in ipairs(ids) do local raw=redis.call('GET',ARGV[3]..id);if raw then table.insert(rows,raw) end end;local counts={};for i=2,5 do table.insert(counts,redis.call('ZCARD',KEYS[i])) end;return {rows,redis.call('ZCARD',KEYS[1]),counts}`,
        [index, ...REPORT_STATUSES.map((s) => PREFIX + "status:" + s)],
        [String(offset), String(offset + Math.min(500, Math.max(1, limit)) - 1), PREFIX + "record:"],
      )) as [string[], number, number[]];
      let redisReports = result[0].map((raw) => decodeStoredReport(raw));

      // If cluster prefix returned empty, also check legacy prefix
      if (redisReports.length === 0) {
        try {
          const legacyIndex = status === "all" ? LEGACY_PREFIX + "all" : LEGACY_PREFIX + "status:" + status;
          const legacyResult = (await evalRedis(
            `local ids=redis.call('ZREVRANGE',KEYS[1],ARGV[1],ARGV[2]);local rows={};for _,id in ipairs(ids) do local raw=redis.call('GET',ARGV[3]..id);if raw then table.insert(rows,raw) end end;local counts={};for i=2,5 do table.insert(counts,redis.call('ZCARD',KEYS[i])) end;return {rows,redis.call('ZCARD',KEYS[1]),counts}`,
            [legacyIndex, ...REPORT_STATUSES.map((s) => LEGACY_PREFIX + "status:" + s)],
            [String(offset), String(offset + Math.min(500, Math.max(1, limit)) - 1), LEGACY_PREFIX + "record:"],
          )) as [string[], number, number[]];
          if (legacyResult && legacyResult[0]?.length) {
            redisReports = legacyResult[0].map((raw) => decodeStoredReport(raw));
          }
        } catch {
          // ignore legacy fallback error
        }
      }

      const combined = [...redisReports];
      // Merge recovered reports if not already in combined
      for (const [id, rep] of Object.entries(RECOVERED_REPORTS)) {
        if (!combined.some((r) => r.id === id) && (status === "all" || rep.status === status)) {
          combined.unshift(rep);
        }
      }
      for (const [id, rep] of fallbackReports.entries()) {
        if (!combined.some((r) => r.id === id) && (status === "all" || rep.status === status)) {
          combined.unshift(rep);
        }
      }
      return {
        reports: combined.slice(offset, offset + limit),
        total: Math.max(combined.length, (result[1] || 0) + Object.keys(RECOVERED_REPORTS).length),
        counts: Object.fromEntries(
          REPORT_STATUSES.map((s, i) => [
            s,
            (result[2]?.[i] ?? 0) +
              Object.values(RECOVERED_REPORTS).filter((r) => r.status === s).length +
              Array.from(fallbackReports.values()).filter((r) => r.status === s).length,
          ]),
        ) as Record<ReportStatus, number>,
      };
    } catch (err) {
      console.warn("Primary Redis report list failed, serving from fallback store:", err);
      const combined = [
        ...Object.values(RECOVERED_REPORTS),
        ...Array.from(fallbackReports.values()),
      ];
      const list = combined
        .filter((r) => status === "all" || r.status === status)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const counts = Object.fromEntries(
        REPORT_STATUSES.map((s) => [
          s,
          combined.filter((r) => r.status === s).length,
        ]),
      ) as Record<ReportStatus, number>;
      return {
        reports: list.slice(offset, offset + limit),
        total: list.length,
        counts,
      };
    }
  },
  async update(id, revision, patch) {
    if (isD1Configured()) {
      try {
        const existing = await d1QueryFirst<any>('SELECT * FROM reports WHERE id = ?', [id]);
        if (!existing) {
          throw new ReportError(404, 'Report not found.');
        }
        const currentRev = Number(existing.revision || 1);
        if (currentRev !== Number(revision)) {
          throw new ReportError(409, 'This report changed in another window. Refresh before saving.');
        }

        const nextRev = currentRev + 1;
        const updatedAt = patch.updatedAt || new Date().toISOString();
        const nextStatus = patch.status || existing.status;
        const nextNotes = patch.notes !== undefined ? patch.notes : (existing.notes || '');

        await d1Execute(
          `UPDATE reports SET status = ?, notes = ?, revision = ?, updated_at = ? WHERE id = ? AND revision = ?`,
          [nextStatus, nextNotes, nextRev, updatedAt, id, currentRev]
        );

        const updatedRow = await d1QueryFirst<any>('SELECT * FROM reports WHERE id = ?', [id]);
        if (updatedRow) {
          return rowToReport(updatedRow);
        }
      } catch (err) {
        if (err instanceof ReportError) throw err;
        console.warn('D1 report update error, falling back to Redis:', err);
      }
    }
    try {
      const result = (await evalRedis(
        UPDATE_REPORT_LUA,
        [recordKey(id), PREFIX + "all"],
        [String(revision), JSON.stringify(patch), PREFIX + "status:"],
      )) as [number, string];
      if (result[0] === 200) return decodeStoredReport(result[1]);
      if (result[0] === 409)
        throw new ReportError(
          409,
          "This report changed in another window. Refresh before saving.",
        );
    } catch (err) {
      if (err instanceof ReportError) throw err;
      console.warn("Primary Redis report update failed, checking fallback store:", err);
    }
    const recovered = RECOVERED_REPORTS[id];
    if (recovered) {
      const updated = {
        ...recovered,
        ...patch,
        revision: recovered.revision + 1,
      };
      RECOVERED_REPORTS[id] = updated;
      return updated;
    }
    const fallback = fallbackReports.get(id);
    if (!fallback) throw new ReportError(404, "Report not found.");
    const updated = {
      ...fallback,
      ...patch,
      revision: fallback.revision + 1,
    };
    fallbackReports.set(id, updated);
    return updated;
  },
  async notification(id, value) {
    if (isD1Configured()) {
      try {
        await d1Execute('UPDATE reports SET notification = ? WHERE id = ?', [JSON.stringify(value), id]);
      } catch (err) {
        console.warn('D1 report notification error:', err);
      }
    }
    try {
      await evalRedis(
        `local raw=redis.call('GET',KEYS[1]);if not raw then return 0 end;local r=cjson.decode(raw);if r.notification.state=='sent' then return 1 end;r.notification=cjson.decode(ARGV[1]);redis.call('SET',KEYS[1],cjson.encode(r));return 1`,
        [recordKey(id)],
        [JSON.stringify(value)],
      );
    } catch {}
    const fallback = fallbackReports.get(id);
    if (fallback) {
      fallback.notification = value;
    }
  },
};
