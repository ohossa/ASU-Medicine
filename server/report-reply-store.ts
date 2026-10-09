import { createHash } from "node:crypto";
import type { ReplyStore } from "./report-replies.js";
import type { ReportReply } from "../src/app/reports/reply-contracts.js";
import { ReportError } from "./report-service.js";
import { evalRedis } from "./report-store.js";
const PREFIX = "asu_report_replies:v1:";
export const RESERVE_REPLY_LUA = `local raw=redis.call('GET',KEYS[1]);if raw then return {0,raw} end
local identical=redis.call('GET',KEYS[3]);if identical then local previous=redis.call('GET',ARGV[4]..identical);if previous then return {0,previous} end end
redis.call('SET',KEYS[1],ARGV[1]);redis.call('SET',KEYS[3],ARGV[3]);redis.call('ZADD',KEYS[2],ARGV[2],ARGV[3]);return {1,ARGV[1]}`;
const key = (id: string) => PREFIX + "record:" + id;
export const SAVE_REPLY_DRAFT_LUA = `local raw=redis.call('GET',KEYS[1]);local revision=0;if raw then revision=cjson.decode(raw).revision end;if revision~=tonumber(ARGV[1]) then return {409,''} end;local draft=cjson.decode(ARGV[2]);draft.revision=revision+1;local saved=cjson.encode(draft);redis.call('SET',KEYS[1],saved);return {200,saved}`;
export const FINISH_REPLY_LUA = `
redis.call('SET',KEYS[1],ARGV[1]);redis.call('DEL',KEYS[2]);
local reply=cjson.decode(ARGV[1]);local raw=redis.call('GET',KEYS[3]);
if reply.state=='accepted' and raw then
 local draft=cjson.decode(raw);local function trim(s) return (s:gsub('^%s+',''):gsub('%s+$','')) end
 if trim(draft.body)==reply.body and trim(draft.subject)==reply.subject then
  draft.body='';draft.subject='';draft.revision=draft.revision+1;draft.updatedBy=reply.createdBy;draft.updatedAt=reply.createdAt;redis.call('SET',KEYS[3],cjson.encode(draft));
 end
end;return 1`;
export const replyStore: ReplyStore = {
  async draft(id) {
    const raw = await evalRedis(`return redis.call('GET',KEYS[1])`, [
      PREFIX + "draft:" + id,
    ]);
    return raw ? JSON.parse(String(raw)) : null;
  },
  async saveDraft(draft) {
    const result = (await evalRedis(
      SAVE_REPLY_DRAFT_LUA,
      [PREFIX + "draft:" + draft.reportId],
      [String(draft.revision), JSON.stringify(draft)],
    )) as [number, string];
    if (Number(result[0]) === 409)
      throw new ReportError(
        409,
        "This draft changed in another tab. Reload the conversation before saving.",
      );
    return JSON.parse(result[1]);
  },
  async list(id) {
    const raw = (await evalRedis(
      `local ids=redis.call('ZREVRANGE',KEYS[1],0,-1);local rows={};for _,id in ipairs(ids) do local r=redis.call('GET',ARGV[1]..id);if r then table.insert(rows,r) end end;return rows`,
      [PREFIX + "report:" + id],
      [PREFIX + "record:"],
    )) as string[];
    return raw.map((r) => JSON.parse(r) as ReportReply);
  },
  async reserve(reply) {
    const result = (await evalRedis(
      RESERVE_REPLY_LUA,
      [
        key(reply.id),
        PREFIX + "report:" + reply.reportId,
        PREFIX +
          "content:" +
          createHash("sha256")
            .update(JSON.stringify([reply.reportId, reply.subject, reply.body]))
            .digest("hex"),
      ],
      [
        JSON.stringify(reply),
        String(Date.parse(reply.createdAt)),
        reply.id,
        PREFIX + "record:",
      ],
    )) as [number, string];
    return { created: Number(result[0]) === 1, reply: JSON.parse(result[1]) };
  },
  async claim(id) {
    return (
      Number(
        await evalRedis(
          `if redis.call('SET',KEYS[1],'1','NX','EX',60) then return 1 end;return 0`,
          [PREFIX + "lock:" + id],
        ),
      ) === 1
    );
  },
  async finish(reply) {
    await evalRedis(
      FINISH_REPLY_LUA,
      [key(reply.id), PREFIX + "lock:" + reply.id, PREFIX + 'draft:' + reply.reportId],
      [JSON.stringify(reply)],
    );
  },
};
