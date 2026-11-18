import { createHash } from "node:crypto";
import type { ReplyStore } from "./report-replies.js";
import type { ReportReply, ReplyDraft } from "../src/app/reports/reply-contracts.js";
import { ReportError } from "./report-service.js";
import { evalRedis } from "./report-store.js";
import { d1Query, d1QueryFirst, d1Execute, isD1Configured } from "./d1-client.js";

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

// Resilient in-memory store for drafts and replies
const inMemoryDrafts = new Map<string, ReplyDraft>();
const inMemoryReplies = new Map<string, ReportReply[]>();
const claimLocks = new Map<string, number>();

export const replyStore: ReplyStore = {
  async draft(id) {
    if (isD1Configured()) {
      try {
        const data = await d1QueryFirst<any>(
          'SELECT * FROM report_replies WHERE id = ?',
          ['draft_' + id]
        );
        if (data) {
          return {
            reportId: data.report_id,
            subject: data.subject,
            body: data.body,
            revision: Number(data.revision),
            updatedAt: data.updated_at,
            updatedBy: data.created_by,
          };
        }
      } catch (err) {
        console.warn('D1 reply draft error, falling back:', err);
      }
    }

    try {
      const raw = await evalRedis(`return redis.call('GET',KEYS[1])`, [
        PREFIX + "draft:" + id,
      ]);
      if (raw) return JSON.parse(String(raw));
    } catch {
      // Redis unavailable
    }

    return inMemoryDrafts.get(id) || null;
  },

  async saveDraft(draft) {
    const now = new Date().toISOString();

    if (isD1Configured()) {
      try {
        const draftId = 'draft_' + draft.reportId;
        const existing = await d1QueryFirst<any>(
          'SELECT revision FROM report_replies WHERE id = ?',
          [draftId]
        );

        const currentRev = existing ? Number(existing.revision) : 0;
        if (currentRev !== Number(draft.revision)) {
          throw new ReportError(
            409,
            "This draft changed in another tab. Reload the conversation before saving.",
          );
        }

        const nextRev = currentRev + 1;
        const savedDraft: ReplyDraft = {
          ...draft,
          revision: nextRev,
          updatedAt: now,
        };

        await d1Execute(
          `INSERT INTO report_replies (id, report_id, subject, body, state, revision, created_by, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             subject = excluded.subject,
             body = excluded.body,
             state = excluded.state,
             revision = excluded.revision,
             created_by = excluded.created_by,
             updated_at = excluded.updated_at`,
          [
            draftId,
            draft.reportId,
            draft.subject,
            draft.body,
            'draft',
            nextRev,
            draft.updatedBy || 'owner',
            now,
          ]
        );

        inMemoryDrafts.set(draft.reportId, savedDraft);
        return savedDraft;
      } catch (err) {
        if (err instanceof ReportError) throw err;
        console.warn('D1 save draft error, falling back:', err);
      }
    }

    try {
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
    } catch (err) {
      if (err instanceof ReportError) throw err;
      console.warn("Primary Redis reply saveDraft failed, using in-memory store:", err);
    }

    const current = inMemoryDrafts.get(draft.reportId);
    const currentRev = current?.revision ?? 0;
    if (currentRev !== draft.revision) {
      throw new ReportError(
        409,
        "This draft changed in another tab. Reload the conversation before saving.",
      );
    }
    const nextRev = currentRev + 1;
    const savedDraft: ReplyDraft = {
      ...draft,
      revision: nextRev,
      updatedAt: now,
    };
    inMemoryDrafts.set(draft.reportId, savedDraft);
    return savedDraft;
  },

  async list(id) {
    if (isD1Configured()) {
      try {
        const data = await d1Query<any>(
          `SELECT * FROM report_replies WHERE report_id = ? AND state != 'draft' ORDER BY created_at DESC`,
          [id]
        );

        if (Array.isArray(data) && data.length > 0) {
          return data.map((row: any) => ({
            id: row.id,
            reportId: row.report_id,
            to: '',
            subject: row.subject,
            body: row.body,
            createdAt: row.created_at,
            createdBy: row.created_by,
            state: row.state as any,
          }));
        }
      } catch (err) {
        console.warn('D1 reply list error, falling back:', err);
      }
    }

    try {
      const raw = (await evalRedis(
        `local ids=redis.call('ZREVRANGE',KEYS[1],0,-1);local rows={};for _,id in ipairs(ids) do local r=redis.call('GET',ARGV[1]..id);if r then table.insert(rows,r) end end;return rows`,
        [PREFIX + "report:" + id],
        [PREFIX + "record:"],
      )) as string[];
      if (Array.isArray(raw) && raw.length > 0) {
        return raw.map((r) => JSON.parse(r) as ReportReply);
      }
    } catch {
      // Redis unavailable
    }

    return inMemoryReplies.get(id) || [];
  },

  async reserve(reply) {
    if (isD1Configured()) {
      try {
        const existing = await d1QueryFirst<any>(
          'SELECT * FROM report_replies WHERE id = ?',
          [reply.id]
        );

        if (existing) {
          return {
            created: false,
            reply: {
              id: existing.id,
              reportId: existing.report_id,
              to: reply.to,
              subject: existing.subject,
              body: existing.body,
              createdAt: existing.created_at,
              createdBy: existing.created_by,
              state: existing.state as any,
            },
          };
        }

        await d1Execute(
          `INSERT INTO report_replies (id, report_id, subject, body, state, created_by, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            reply.id,
            reply.reportId,
            reply.subject,
            reply.body,
            reply.state,
            reply.createdBy || 'owner',
            reply.createdAt || new Date().toISOString(),
            new Date().toISOString(),
          ]
        );

        const repList = inMemoryReplies.get(reply.reportId) || [];
        inMemoryReplies.set(reply.reportId, [reply, ...repList]);
        return { created: true, reply };
      } catch (err) {
        console.warn('D1 reply reserve error, falling back:', err);
      }
    }

    try {
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
    } catch {
      const repList = inMemoryReplies.get(reply.reportId) || [];
      const existing = repList.find((r) => r.id === reply.id);
      if (existing) return { created: false, reply: existing };
      inMemoryReplies.set(reply.reportId, [reply, ...repList]);
      return { created: true, reply };
    }
  },

  async claim(id) {
    const now = Date.now();
    const existingLock = claimLocks.get(id);
    if (existingLock && existingLock > now) {
      return false;
    }
    claimLocks.set(id, now + 60000);

    try {
      return (
        Number(
          await evalRedis(
            `if redis.call('SET',KEYS[1],'1','NX','EX',60) then return 1 end;return 0`,
            [PREFIX + "lock:" + id],
          ),
        ) === 1
      );
    } catch {
      return true;
    }
  },

  async finish(reply) {
    if (isD1Configured()) {
      try {
        await d1Execute(
          `UPDATE report_replies SET state = ?, updated_at = ? WHERE id = ?`,
          [reply.state, new Date().toISOString(), reply.id]
        );

        if (reply.state === 'accepted') {
          // Clear draft if it matches
          const draftId = 'draft_' + reply.reportId;
          const draftRow = await d1QueryFirst<any>(
            'SELECT subject, body, revision FROM report_replies WHERE id = ?',
            [draftId]
          );

          if (
            draftRow &&
            draftRow.body?.trim() === reply.body?.trim() &&
            draftRow.subject?.trim() === reply.subject?.trim()
          ) {
            await d1Execute(
              `UPDATE report_replies SET subject = '', body = '', revision = ?, updated_at = ? WHERE id = ?`,
              [Number(draftRow.revision) + 1, new Date().toISOString(), draftId]
            );
          }
        }
      } catch (err) {
        console.warn('D1 finish reply error, falling back:', err);
      }
    }

    try {
      await evalRedis(
        FINISH_REPLY_LUA,
        [key(reply.id), PREFIX + "lock:" + reply.id, PREFIX + 'draft:' + reply.reportId],
        [JSON.stringify(reply)],
      );
    } catch {
      // In-memory fallback
      claimLocks.delete(reply.id);
      const draft = inMemoryDrafts.get(reply.reportId);
      if (
        reply.state === 'accepted' &&
        draft &&
        draft.body.trim() === reply.body.trim() &&
        draft.subject.trim() === reply.subject.trim()
      ) {
        draft.body = '';
        draft.subject = '';
        draft.revision = draft.revision + 1;
      }
    }
  },
};
