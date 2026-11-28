import { ReportError } from "./report-service.js";
import { evalRedis } from "./report-store.js";
import { cairoDay, weekKey } from "./learning-policy.js";
import { d1Query, d1QueryFirst, d1Execute, d1Transaction, isD1Configured } from "./d1-client.js";
import { createHash } from "node:crypto";
import type {
  LearningDashboard,
  LearningDashboardResponse,
  LearningProfile,
  LearningEntry,
} from "../src/app/learning/contracts.js";

export const AWARD_LUA = `
local profile=cjson.decode(redis.call('GET',KEYS[1]) or ARGV[4]);local entries=cjson.decode(ARGV[1]);local personal=0;local competitive=0
for _,r in ipairs(entries) do
 local old=redis.call('HGET',KEYS[2],r.moduleCode..':'..r.questionId);local ever=false;local previous=nil;if old then previous=cjson.decode(old);ever=previous.everCorrect end
 local entry={moduleCode=r.moduleCode,chapterId=r.chapterId,questionId=r.questionId,topic=r.topic,subject=r.subject,type=r.type,correct=r.correct,everCorrect=ever or r.correct,at=ARGV[2],contentVersion=r.contentVersion}
 if previous then entry.firstCorrect=previous.firstCorrect;entry.firstAt=previous.firstAt else entry.firstCorrect=r.correct;entry.firstAt=ARGV[2] end
 redis.call('HSET',KEYS[2],r.moduleCode..':'..r.questionId,cjson.encode(entry))
 if r.personal>0 and redis.call('SADD',KEYS[3],r.identity)==1 then personal=personal+r.personal;competitive=competitive+r.competitive end
end
local previous=tonumber(redis.call('GET',KEYS[4]) or '0');competitive=math.min(competitive,math.max(0,500-previous));redis.call('INCRBY',KEYS[4],competitive);redis.call('EXPIRE',KEYS[4],172800)
profile.xp=profile.xp+personal;profile.competitiveXp=profile.competitiveXp+competitive;profile.level=math.floor(profile.xp/500)+1
if #entries>0 and profile.lastDay~=ARGV[3] then profile.streak=profile.lastDay==ARGV[5] and profile.streak+1 or 1;profile.bestStreak=math.max(profile.bestStreak,profile.streak);profile.lastDay=ARGV[3] end
redis.call('SET',KEYS[1],cjson.encode(profile));redis.call('INCRBY',KEYS[7],competitive);redis.call('EXPIRE',KEYS[7],1209600);redis.call('INCRBY',KEYS[8],competitive)
if profile.optIn and profile.year==tonumber(ARGV[6]) then redis.call('ZADD',KEYS[5],tonumber(redis.call('GET',KEYS[8]) or '0'),ARGV[7]);redis.call('ZADD',KEYS[6],tonumber(redis.call('GET',KEYS[7]) or '0'),ARGV[7]);redis.call('EXPIRE',KEYS[6],1209600) end
return cjson.encode({personal=personal,competitive=competitive})`;

const profileKey = (id: string) => `asu_learning:v1:profile:${id}`;
const weekly = (year: number, week: string) =>
  `asu_learning:v1:rank:${year}:${week}`;
const lifetime = (year: number) => `asu_learning:v1:rank:${year}:all`;

export function initialProfile(year: number): LearningProfile {
  return {
    xp: 0,
    competitiveXp: 0,
    level: 1,
    streak: 0,
    bestStreak: 0,
    lastDay: "",
    year,
    alias: "Student",
    optIn: false,
    banner: "default",
    title: "student",
  };
}

function mapProfile(row: any, year: number): LearningProfile {
  return {
    xp: Number(row.xp ?? 0),
    competitiveXp: Number(row.competitive_xp ?? 0),
    level: Number(row.level ?? 1),
    streak: Number(row.streak ?? 0),
    bestStreak: Number(row.best_streak ?? 0),
    lastDay: String(row.last_day ?? ""),
    year: Number(row.year ?? year),
    alias: String(row.alias ?? "Student"),
    optIn: Boolean(row.opt_in),
    banner: String(row.banner ?? "default"),
    title: String(row.title ?? "student"),
  };
}

async function getD1Profile(id: string, year: number): Promise<LearningProfile> {
  const sql = 'SELECT * FROM learning_profiles WHERE user_id = ?';
  const stored = await d1QueryFirst<any>(sql, [id]);
  if (stored?.xp_reconciled === 1) return mapProfile(stored, year);

  // Recover missing and pre-migration profiles once, keeping higher stored totals.
  const [count] = await d1Query<{ unique_correct: number }>(
    'SELECT count(distinct question_id) as unique_correct FROM learning_entries WHERE user_id = ? AND (ever_correct = 1 OR correct = 1)',
    [id],
  );
  const minimum = Number(count?.unique_correct ?? 0) * 10;
  const level = Math.floor(minimum / 500) + 1;
  const now = new Date().toISOString();
  await d1Execute(
    `INSERT INTO learning_profiles (user_id, year, xp, competitive_xp, level, xp_reconciled, updated_at)
     VALUES (?, ?, ?, ?, ?, 1, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       xp = MAX(learning_profiles.xp, excluded.xp),
       competitive_xp = CASE WHEN learning_profiles.xp < excluded.xp
         THEN MAX(learning_profiles.competitive_xp, excluded.competitive_xp)
         ELSE learning_profiles.competitive_xp END,
       level = CASE WHEN learning_profiles.xp < excluded.xp
         THEN MAX(learning_profiles.level, excluded.level) ELSE learning_profiles.level END,
       xp_reconciled = 1,
       updated_at = CASE WHEN learning_profiles.xp < excluded.xp
         THEN excluded.updated_at ELSE learning_profiles.updated_at END
     WHERE learning_profiles.xp_reconciled = 0`,
    [id, year, minimum, minimum, level, now],
  );
  const reconciled = await d1QueryFirst<any>(sql, [id]);
  if (!reconciled) throw new Error("D1 learning profile was not initialized");
  return mapProfile(reconciled, year);
}

export async function getProfile(id: string, year: number): Promise<LearningProfile> {
  if (isD1Configured()) {
    try {
      return await getD1Profile(id, year);
    } catch (err) {
      console.warn('D1 getProfile error, falling back:', err);
    }
  }

  try {
    const raw = await evalRedis("return redis.call('GET',KEYS[1])", [
      profileKey(id),
    ]);
    return raw ? JSON.parse(String(raw)) : initialProfile(year);
  } catch {
    return initialProfile(year);
  }
}

export async function saveProfile(
  id: string,
  year: number,
  patch: Partial<LearningProfile>,
) {
  if (isD1Configured()) {
    try {
      await getD1Profile(id, year);
      const saved = await d1QueryFirst<any>(
        `UPDATE learning_profiles SET
           year = ?,
           alias = COALESCE(?, alias),
           opt_in = COALESCE(?, opt_in),
           banner = COALESCE(?, banner),
           title = COALESCE(?, title),
           updated_at = ?
         WHERE user_id = ?
         RETURNING *`,
        [
          year, patch.alias ?? null,
          patch.optIn === undefined ? null : Number(patch.optIn),
          patch.banner ?? null, patch.title ?? null,
          new Date().toISOString(), id,
        ],
      );
      if (!saved) throw new Error("D1 learning profile was not updated");
      clearDashboardCache(id);
      return mapProfile(saved, year);
    } catch (err) {
      console.warn('D1 saveProfile error:', err);
      throw new ReportError(503, "Learning settings are temporarily unavailable. Please retry.");
    }
  }

  const old = await getProfile(id, year);
  const next: LearningProfile = { ...old, ...patch, year };
  try {
    const raw = await evalRedis(
      `local p=cjson.decode(redis.call('GET',KEYS[1]) or ARGV[1]);local old=p.year;local patch=cjson.decode(ARGV[2]);for k,v in pairs(patch) do p[k]=v end;p.year=tonumber(ARGV[3]);redis.call('SET',KEYS[1],cjson.encode(p));redis.call('ZREM',KEYS[2],ARGV[4]);redis.call('ZREM',KEYS[3],ARGV[4]);redis.call('ZREM',KEYS[4],ARGV[4]);redis.call('ZREM',KEYS[5],ARGV[4]);if p.optIn then redis.call('ZADD',KEYS[4],tonumber(redis.call('GET',KEYS[7]) or '0'),ARGV[4]);local score=tonumber(redis.call('GET',KEYS[6]) or '0');if score>0 then redis.call('ZADD',KEYS[5],score,ARGV[4]) end end;return cjson.encode(p)`,
      [
        profileKey(id),
        lifetime(old.year),
        weekly(old.year, weekKey()),
        lifetime(year),
        weekly(year, weekKey()),
        `asu_learning:v1:week-score:${year}:${weekKey()}:${id}`,
        `asu_learning:v1:year-score:${year}:${id}`,
      ],
      [JSON.stringify(next), JSON.stringify(patch), String(year), id],
    );
    return JSON.parse(String(raw)) as LearningProfile;
  } catch {
    return next;
  }
}

export async function award(id: string, year: number, rewards: unknown[]) {
  const today = cairoDay(),
    d = new Date(today + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - 1);
  const yesterday = d.toISOString().slice(0, 10);
  const currentWeek = weekKey();

  if (isD1Configured() && Array.isArray(rewards)) {
    try {
      await getD1Profile(id, year);
      const now = new Date().toISOString();
      const entries = new Map<string, Record<string, unknown>>();
      for (const reward of rewards as any[]) {
        if (!reward?.questionId) continue;
        const questionId = String(reward.questionId);
        if (entries.has(questionId)) continue;
        const entryId = createHash("sha256")
          .update(`${id}:${reward.moduleCode}:${questionId}`)
          .digest("hex");
        entries.set(questionId, {
          id: entryId,
          moduleCode: reward.moduleCode,
          chapterId: reward.chapterId || 1,
          questionId,
          subject: reward.subject || "",
          topic: reward.topic || "",
          type: reward.type || "mcq",
          correct: reward.correct ? 1 : 0,
          contentVersion: reward.contentVersion || "",
          personal: reward.correct ? Number(reward.personal || 0) : 0,
          competitive: reward.correct ? Number(reward.competitive || 0) : 0,
        });
      }
      if (entries.size === 0) return { personal: 0, competitive: 0 };

      const payload = JSON.stringify([...entries.values()]);
      const totals = `WITH totals AS MATERIALIZED (
        SELECT COALESCE(SUM(json_extract(j.value, '$.personal')), 0) AS personal,
               COALESCE(SUM(json_extract(j.value, '$.competitive')), 0) AS competitive
        FROM json_each(?) AS j
        WHERE json_extract(j.value, '$.personal') > 0
          AND NOT EXISTS (
            SELECT 1 FROM learning_entries e
            WHERE e.user_id = ? AND e.question_id = json_extract(j.value, '$.questionId')
              AND (e.ever_correct = 1 OR e.correct = 1)
          )
      )`;
      const [[added]] = await d1Transaction([
        {
          sql: `${totals}
            UPDATE learning_profiles SET
              year = ?,
              xp = xp + totals.personal,
              competitive_xp = competitive_xp + totals.competitive,
              level = MAX(level, (xp + totals.personal) / 500 + 1),
              streak = CASE WHEN last_day = ? THEN streak WHEN last_day = ? THEN streak + 1 ELSE 1 END,
              best_streak = MAX(best_streak, CASE WHEN last_day = ? THEN streak WHEN last_day = ? THEN streak + 1 ELSE 1 END),
              last_day = ?,
              weekly_xp = (CASE WHEN current_week = ? THEN weekly_xp ELSE 0 END) + totals.competitive,
              current_week = ?,
              updated_at = ?
            FROM totals WHERE user_id = ?
            RETURNING (SELECT personal FROM totals) AS personal,
                      (SELECT competitive FROM totals) AS competitive`,
          params: [payload, id, year, today, yesterday, today, yesterday, today, currentWeek, currentWeek, now, id],
        },
        {
          sql: `WITH incoming AS (
              SELECT json_extract(value, '$.id') AS id,
                     json_extract(value, '$.moduleCode') AS module_code,
                     json_extract(value, '$.chapterId') AS chapter_id,
                     json_extract(value, '$.questionId') AS question_id,
                     json_extract(value, '$.subject') AS subject,
                     json_extract(value, '$.topic') AS topic,
                     json_extract(value, '$.type') AS type,
                     json_extract(value, '$.correct') AS correct,
                     json_extract(value, '$.contentVersion') AS content_version
              FROM json_each(?)
            )
            INSERT INTO learning_entries
              (id, user_id, module_code, chapter_id, question_id, subject, topic, type,
               correct, ever_correct, first_correct, content_version, updated_at)
            SELECT incoming.id, ?, module_code, chapter_id, question_id, subject, topic, type, correct,
                   MAX(correct, EXISTS (
                     SELECT 1 FROM learning_entries e WHERE e.user_id = ?
                       AND e.question_id = incoming.question_id AND (e.ever_correct = 1 OR e.correct = 1)
                   )),
                   correct, content_version, ?
            FROM incoming WHERE EXISTS (SELECT 1 FROM learning_profiles WHERE user_id = ?)
            ON CONFLICT(id) DO UPDATE SET
              correct = excluded.correct,
              ever_correct = MAX(learning_entries.ever_correct, excluded.ever_correct),
              updated_at = excluded.updated_at`,
          params: [payload, id, id, now, id],
        },
      ]);
      if (!added) throw new Error("D1 learning profile no longer exists");
      clearDashboardCache(id);
      return { personal: Number(added.personal), competitive: Number(added.competitive) };
    } catch (err) {
      console.warn('D1 award failed:', err);
      throw new ReportError(503, "Learning sync is temporarily unavailable. Please retry.");
    }
  }

  // 2. Also run Redis Lua script if available
  try {
    const receipt = JSON.parse(
      String(
        await evalRedis(
          AWARD_LUA,
          [
            profileKey(id),
            `asu_learning:v1:entries:${id}`,
            `asu_learning:v1:awarded:${id}`,
            `asu_learning:v1:daily:${today}:${id}`,
            lifetime(year),
            weekly(year, weekKey()),
            `asu_learning:v1:week-score:${year}:${weekKey()}:${id}`,
            `asu_learning:v1:year-score:${year}:${id}`,
          ],
          [
            JSON.stringify(rewards),
            new Date().toISOString(),
            today,
            JSON.stringify(initialProfile(year)),
            yesterday,
            String(year),
            id,
          ],
        ),
      ),
    );
    if (!Number.isSafeInteger(receipt?.personal) || !Number.isSafeInteger(receipt?.competitive)) {
      throw new Error("Redis did not confirm the learning update");
    }
    return receipt;
  } catch {
    throw new ReportError(503, "Learning sync is temporarily unavailable. Please retry.");
  }
}

interface DashboardCacheEntry {
  dashboard: LearningDashboard;
  expiresAt: number;
}
const dashboardMemoryCache = new Map<string, DashboardCacheEntry>();

export function clearDashboardCache(id?: string) {
  if (id) {
    for (const key of dashboardMemoryCache.keys()) {
      if (key.startsWith(`${id}:`)) dashboardMemoryCache.delete(key);
    }
  } else {
    dashboardMemoryCache.clear();
  }
}

const ENTRY_COLUMNS = `e.id, e.module_code, e.chapter_id, e.question_id, e.topic, e.subject,
  e.type, e.correct, e.ever_correct, e.first_correct, e.created_at, e.content_version`;
const FULL_ENTRIES = `SELECT ${ENTRY_COLUMNS} FROM learning_entries e WHERE e.user_id = ?`;
const ENTRY_CURSOR = `SELECT COALESCE(MAX(revision), 0) AS revision
  FROM learning_entry_changes WHERE user_id = ?`;
const CHANGED_ENTRIES = `SELECT ${ENTRY_COLUMNS}, c.entry_id AS change_id
  FROM learning_entry_changes c
  LEFT JOIN learning_entries e ON e.id = c.entry_id AND e.user_id = c.user_id
  WHERE c.user_id = ? AND c.revision > ?`;

async function readLearningEntries(id: string, cursor?: string) {
  if (cursor === undefined) {
    return { rows: await d1Query<any>(FULL_ENTRIES, [id]) };
  }

  const match = /^v1:(0|[1-9][0-9]{0,15})$/.exec(cursor);
  const parsed = match ? Number(match[1]) : NaN;
  const since = Number.isSafeInteger(parsed) ? parsed : undefined;
  const watermark = { sql: ENTRY_CURSOR, params: [id] };
  const full = { sql: FULL_ENTRIES, params: [id] };
  let [clock, rows] = await d1Transaction([
    watermark,
    since === undefined ? full : { sql: CHANGED_ENTRIES, params: [id, since] },
  ]);
  let revision = Number(clock[0].revision);
  if (since !== undefined && since <= revision) {
    return {
      rows: rows.filter((row) => row.id !== null),
      entriesCursor: `v1:${revision}`,
      deletedEntryIds: rows.filter((row) => row.id === null).map((row) => String(row.change_id)),
    };
  }
  if (since !== undefined) {
    [clock, rows] = await d1Transaction([watermark, full]);
    revision = Number(clock[0].revision);
  }
  return { rows, entriesCursor: `v1:${revision}` };
}

export async function dashboard(
  id: string,
  year: number,
  period = "weekly",
  entriesCursor?: string,
): Promise<LearningDashboardResponse> {
  const cacheKey = `${id}:${year}:${period}`;
  const now = Date.now();
  const cached = dashboardMemoryCache.get(cacheKey);
  if (entriesCursor === undefined && cached && cached.expiresAt > now) {
    return cached.dashboard;
  }

  let profile = entriesCursor !== undefined && isD1Configured()
    ? await getD1Profile(id, year)
    : await getProfile(id, year);
  if (!profile.year || profile.year < 1 || profile.year > 5) {
    profile = await saveProfile(id, year, { year });
  }

  // 1. Try Cloudflare D1 first
  if (isD1Configured()) {
    try {
      const { rows: entriesRows, ...sync } = await readLearningEntries(id, entriesCursor);

      const scoreCol = period === 'all' ? 'competitive_xp' : 'weekly_xp';
      let rankRows = await d1Query<any>(
        `SELECT user_id, alias, competitive_xp, weekly_xp, level, banner
         FROM learning_profiles
         WHERE year = ? AND opt_in = 1
         ORDER BY ${scoreCol} DESC
         LIMIT 50`,
        [year]
      );

      // Graceful fallback: If no students in this year have explicitly toggled opt_in = 1 yet,
      // display top students who have earned XP with student alias so leaderboard is never blank!
      if (!Array.isArray(rankRows) || rankRows.length === 0) {
        rankRows = await d1Query<any>(
          `SELECT user_id, alias, competitive_xp, weekly_xp, level, banner
           FROM learning_profiles
           WHERE year = ? AND (competitive_xp > 0 OR xp > 0)
           ORDER BY ${scoreCol} DESC
           LIMIT 50`,
          [year]
        );
      }

      if (Array.isArray(entriesRows) && Array.isArray(rankRows)) {
        const entries: LearningEntry[] = entriesRows
          .map((r: any) => ({
            entryId: r.id,
            moduleCode: r.module_code,
            chapterId: r.chapter_id,
            questionId: r.question_id,
            topic: r.topic,
            subject: r.subject,
            type: r.type,
            correct: Boolean(r.correct),
            everCorrect: Boolean(r.ever_correct),
            firstCorrect: Boolean(r.first_correct),
            at: r.created_at,
            contentVersion: r.content_version,
          }));

        const leaderboard = rankRows.map((r: any) => ({
          alias: r.alias || "Student",
          xp: Number(period === "all" ? r.competitive_xp : r.weekly_xp || 0),
          level: Number(r.level || 1),
          banner: r.banner || "default",
          isYou: r.user_id === id,
        }));

        const result: LearningDashboardResponse = {
          ...sync,
          profile,
          entries,
          leaderboard,
          week: weekKey(),
        };

        // Cache in memory for 60 seconds (zero egress on repeat visits)
        if (entriesCursor === undefined) {
          dashboardMemoryCache.set(cacheKey, { dashboard: result, expiresAt: now + 60000 });
        }

        return result;
      }
    } catch (err) {
      console.warn('D1 dashboard query failed, falling back to Redis:', err);
    }
  }

  // 2. Fallback to Redis
  try {
    const raw = await evalRedis("return redis.call('HVALS',KEYS[1])", [
      `asu_learning:v1:entries:${id}`,
    ]);
    const ranks = await evalRedis(
      "local ids=redis.call('ZREVRANGE',KEYS[1],0,49,'WITHSCORES');local rows={};for i=1,#ids,2 do local p=redis.call('GET',ARGV[1]..ids[i]);if p then table.insert(rows,{ids[i],ids[i+1],p}) end end;return rows",
      [period === "all" ? lifetime(year) : weekly(year, weekKey())],
      ["asu_learning:v1:profile:"],
    );
    const leaderboard: LearningDashboard["leaderboard"] = [];
    if (Array.isArray(ranks))
      for (const row of ranks) {
        const uid = String(row[0]),
          p = JSON.parse(String(row[2])) as LearningProfile;
        if (p.optIn && p.year === year)
          leaderboard.push({
            alias: p.alias,
            xp: Number(row[1]),
            level: p.level,
            banner: p.banner,
            isYou: uid === id,
          });
      }
    return {
      profile,
      entries: Array.isArray(raw)
        ? raw.map((r) => JSON.parse(String(r)))
        : [],
      leaderboard,
      week: weekKey(),
    };
  } catch {
    return {
      profile,
      entries: [],
      leaderboard: [],
      week: weekKey(),
    };
  }
}
