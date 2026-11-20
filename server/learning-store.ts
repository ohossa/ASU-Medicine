import { evalRedis } from "./report-store.js";
import { cairoDay, weekKey } from "./learning-policy.js";
import { d1Query, d1QueryFirst, d1Execute, d1Batch, isD1Configured } from "./d1-client.js";
import { createHash } from "node:crypto";
import type {
  LearningDashboard,
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

export async function getProfile(
  id: string,
  year: number,
): Promise<LearningProfile> {
  if (isD1Configured()) {
    try {
      const data = await d1QueryFirst<any>(
        'SELECT * FROM learning_profiles WHERE user_id = ?',
        [id]
      );

      if (data) {
        const profile: LearningProfile = {
          xp: Number(data.xp ?? 0),
          competitiveXp: Number(data.competitive_xp ?? 0),
          level: Number(data.level ?? 1),
          streak: Number(data.streak ?? 0),
          bestStreak: Number(data.best_streak ?? 0),
          lastDay: String(data.last_day ?? ''),
          year: Number(data.year ?? year),
          alias: String(data.alias ?? 'Student'),
          optIn: Boolean(data.opt_in),
          banner: String(data.banner ?? 'default'),
          title: String(data.title ?? 'student'),
        };

        // Automated Continuous Monotonic Self-Healing:
        // Guarantees student progress (XP, level, solved questions) is strictly non-decreasing
        // and automatically reconciles any desynchronized accounts from verified learning_entries.
        try {
          const verifiedRows = await d1Query<any>(
            'SELECT count(distinct question_id) as unique_correct FROM learning_entries WHERE user_id = ? AND (ever_correct = 1 OR correct = 1)',
            [id]
          );
          const uniqueCorrect = Number(verifiedRows?.[0]?.unique_correct || 0);
          const minEarnedXp = uniqueCorrect * 10;

          if (minEarnedXp > profile.xp) {
            profile.xp = minEarnedXp;
            profile.competitiveXp = Math.max(profile.competitiveXp, minEarnedXp);
            profile.level = Math.floor(minEarnedXp / 500) + 1;
            // Persist healed progress to Cloudflare D1
            await d1Execute(
              'UPDATE learning_profiles SET xp = ?, competitive_xp = ?, level = ?, updated_at = ? WHERE user_id = ?',
              [profile.xp, profile.competitiveXp, profile.level, new Date().toISOString(), id]
            );
          }
        } catch (healErr) {
          console.warn('Continuous self-healing check error:', healErr);
        }

        return profile;
      }

      if (!data) {
        // Create initial profile in D1 to guarantee integrity
        const initial = initialProfile(year);
        let maxEarnedXp = 0;

        const entryRows = await d1Query<any>(
          'SELECT question_id, ever_correct, correct FROM learning_entries WHERE user_id = ?',
          [id]
        );

        if (Array.isArray(entryRows) && entryRows.length > 0) {
          const uniqueCorrect = new Set(
            entryRows.filter((e) => e.ever_correct || e.correct).map((e) => e.question_id)
          ).size;
          maxEarnedXp = Math.max(maxEarnedXp, uniqueCorrect * 10);
        }

        if (maxEarnedXp > 0) {
          initial.xp = maxEarnedXp;
          initial.competitiveXp = maxEarnedXp;
          initial.level = Math.floor(maxEarnedXp / 500) + 1;
        }

        const nowIso = new Date().toISOString();
        await d1Execute(
          `INSERT INTO learning_profiles (user_id, year, xp, competitive_xp, level, streak, best_streak, last_day, alias, opt_in, banner, title, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(user_id) DO UPDATE SET updated_at = excluded.updated_at`,
          [
            id,
            initial.year,
            initial.xp,
            initial.competitiveXp,
            initial.level,
            initial.streak,
            initial.bestStreak,
            initial.lastDay,
            initial.alias,
            initial.optIn ? 1 : 0,
            initial.banner,
            initial.title,
            nowIso,
          ]
        );

        return initial;
      }
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
  const old = await getProfile(id, year);
  const next: LearningProfile = { ...old, ...patch, year };

  if (isD1Configured()) {
    try {
      const nowIso = new Date().toISOString();
      await d1Execute(
        `INSERT INTO learning_profiles (user_id, year, xp, competitive_xp, level, streak, best_streak, last_day, alias, opt_in, banner, title, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET
           year = excluded.year,
           xp = excluded.xp,
           competitive_xp = excluded.competitive_xp,
           level = excluded.level,
           streak = excluded.streak,
           best_streak = excluded.best_streak,
           last_day = excluded.last_day,
           alias = excluded.alias,
           opt_in = excluded.opt_in,
           banner = excluded.banner,
           title = excluded.title,
           updated_at = excluded.updated_at`,
        [
          id,
          next.year,
          next.xp,
          next.competitiveXp,
          next.level,
          next.streak,
          next.bestStreak,
          next.lastDay,
          next.alias,
          next.optIn ? 1 : 0,
          next.banner,
          next.title,
          nowIso,
        ]
      );
      clearDashboardCache(id);
      return next;
    } catch (err) {
      console.warn('D1 saveProfile error, falling back:', err);
    }
  }

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

  // 1. Process and compute awards via Cloudflare D1 (Primary serverless store)
  if (isD1Configured() && Array.isArray(rewards)) {
    try {
      const nowIso = new Date().toISOString();
      const current = await getProfile(id, year);

      // Check existing entries to deduplicate XP awards for already-solved questions
      const qIds = (rewards as any[])
        .filter((r) => r && r.questionId)
        .map((r) => String(r.questionId));

      const existingMap = new Map<string, boolean>();
      if (qIds.length > 0) {
        const placeholders = qIds.map(() => '?').join(',');
        const existingRows = await d1Query<any>(
          `SELECT question_id, ever_correct FROM learning_entries WHERE user_id = ? AND question_id IN (${placeholders})`,
          [id, ...qIds]
        );

        if (Array.isArray(existingRows)) {
          for (const row of existingRows) {
            existingMap.set(String(row.question_id), Boolean(row.ever_correct));
          }
        }
      }

      let personalAdd = 0;
      let competitiveAdd = 0;

      const entryRows: any[] = [];
      for (const r of rewards as any[]) {
        if (!r || !r.questionId) continue;
        const qId = String(r.questionId);
        const wasEverCorrect = existingMap.get(qId) ?? false;
        const isNowCorrect = Boolean(r.correct);

        // Award XP only for new correct answers
        if (r.personal > 0 && !wasEverCorrect && isNowCorrect) {
          personalAdd += Number(r.personal || 0);
          competitiveAdd += Number(r.competitive || 0);
        }

        const entryId = createHash('sha256')
          .update(`${id}:${r.moduleCode}:${qId}`)
          .digest('hex');

        entryRows.push({
          id: entryId,
          user_id: id,
          module_code: r.moduleCode,
          chapter_id: r.chapterId || 1,
          question_id: qId,
          subject: r.subject || '',
          topic: r.topic || '',
          type: r.type || 'mcq',
          correct: isNowCorrect ? 1 : 0,
          ever_correct: (wasEverCorrect || isNowCorrect) ? 1 : 0,
          first_correct: (existingMap.has(qId) ? wasEverCorrect : isNowCorrect) ? 1 : 0,
          content_version: r.contentVersion || '',
          updated_at: nowIso,
        });
      }

      // Guarantee learning_profiles row exists
      await d1Execute(
        `INSERT INTO learning_profiles (user_id, year, xp, competitive_xp, level, streak, best_streak, last_day, alias, opt_in, banner, title, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET updated_at = excluded.updated_at`,
        [
          id,
          current.year || year,
          current.xp,
          current.competitiveXp,
          current.level,
          current.streak,
          current.bestStreak,
          current.lastDay || today,
          current.alias || 'Student',
          current.optIn ? 1 : 0,
          current.banner || 'default',
          current.title || 'student',
          nowIso,
        ]
      );

      if (entryRows.length > 0) {
        const uniqueEntryMap = new Map<string, any>();
        for (const row of entryRows) {
          uniqueEntryMap.set(row.id, row);
        }
        const stmts = Array.from(uniqueEntryMap.values()).map((row) => ({
          sql: `INSERT INTO learning_entries (id, user_id, module_code, chapter_id, question_id, subject, topic, type, correct, ever_correct, first_correct, content_version, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                  correct = excluded.correct,
                  ever_correct = excluded.ever_correct,
                  updated_at = excluded.updated_at`,
          params: [
            row.id,
            row.user_id,
            row.module_code,
            row.chapter_id,
            row.question_id,
            row.subject,
            row.topic,
            row.type,
            row.correct,
            row.ever_correct,
            row.first_correct,
            row.content_version,
            row.updated_at,
          ],
        }));
        await d1Batch(stmts);
      }

      const profRow = await d1QueryFirst<any>(
        'SELECT weekly_xp, current_week FROM learning_profiles WHERE user_id = ?',
        [id]
      );

      const nextXp = current.xp + personalAdd;
      const nextCompXp = current.competitiveXp + competitiveAdd;
      const nextLevel = Math.floor(nextXp / 500) + 1;
      let streak = current.streak;
      if (rewards.length > 0 && current.lastDay !== today) {
        streak = current.lastDay === yesterday ? current.streak + 1 : 1;
      }
      const bestStreak = Math.max(current.bestStreak, streak);

      const baseWeekly = profRow?.current_week === currentWeek ? Number(profRow?.weekly_xp ?? 0) : 0;
      const nextWeeklyXp = baseWeekly + competitiveAdd;

      await d1Execute(
        `UPDATE learning_profiles SET
           year = ?,
           xp = ?,
           competitive_xp = ?,
           level = ?,
           streak = ?,
           best_streak = ?,
           last_day = ?,
           weekly_xp = ?,
           current_week = ?,
           updated_at = ?
         WHERE user_id = ?`,
        [
          year,
          nextXp,
          nextCompXp,
          nextLevel,
          streak,
          bestStreak,
          today,
          nextWeeklyXp,
          currentWeek,
          nowIso,
          id,
        ]
      );

      // Return calculated XP awards directly from Cloudflare D1!
      clearDashboardCache(id);
      return { personal: personalAdd, competitive: competitiveAdd };
    } catch (err) {
      console.warn('D1 award failed, falling back to Redis:', err);
    }
  }

  // 2. Also run Redis Lua script if available
  try {
    return JSON.parse(
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
  } catch {
    // If Redis fails, return calculated values or defaults
    return { personal: 0, competitive: 0 };
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

export async function dashboard(
  id: string,
  year: number,
  period = "weekly",
): Promise<LearningDashboard> {
  const cacheKey = `${id}:${year}:${period}`;
  const now = Date.now();
  const cached = dashboardMemoryCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.dashboard;
  }

  let profile = await getProfile(id, year);
  if (!profile.year || profile.year < 1 || profile.year > 5) {
    profile = await saveProfile(id, year, { year });
  }

  // 1. Try Cloudflare D1 first
  if (isD1Configured()) {
    try {
      const entriesRows = await d1Query<any>(
        `SELECT module_code, chapter_id, question_id, topic, subject, type, correct, ever_correct, first_correct, created_at, content_version
         FROM learning_entries
         WHERE user_id = ?`,
        [id]
      );

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

        const result: LearningDashboard = {
          profile,
          entries,
          leaderboard,
          week: weekKey(),
        };

        // Cache in memory for 60 seconds (zero egress on repeat visits)
        dashboardMemoryCache.set(cacheKey, { dashboard: result, expiresAt: now + 60000 });

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
