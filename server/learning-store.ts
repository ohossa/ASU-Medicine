import { evalRedis } from "./report-store.js";
import { cairoDay, weekKey } from "./learning-policy.js";
import { getSupabase } from "./supabase-client.js";
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
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('learning_profiles')
        .select('*')
        .eq('user_id', id)
        .maybeSingle();

      if (!error && data) {
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

        // Automated Self-Healing Reconciliation:
        // If profile.xp is 0 (or lower than what user earned in learning_entries),
        // recalculate from learning_entries and restore it immediately!
        const { data: entryRows } = await supabase
          .from('learning_entries')
          .select('question_id, ever_correct, correct')
          .eq('user_id', id);

        if (Array.isArray(entryRows) && entryRows.length > 0) {
          const uniqueCorrect = new Set(
            entryRows.filter((e) => e.ever_correct || e.correct).map((e) => e.question_id)
          ).size;
          const minEarnedXp = uniqueCorrect * 10;
          if (minEarnedXp > profile.xp) {
            profile.xp = minEarnedXp;
            profile.competitiveXp = Math.max(profile.competitiveXp, minEarnedXp);
            profile.level = Math.floor(minEarnedXp / 500) + 1;
            // Persist healed progress to Supabase
            await supabase.from('learning_profiles').update({
              xp: profile.xp,
              competitive_xp: profile.competitiveXp,
              level: profile.level,
              updated_at: new Date().toISOString(),
            }).eq('user_id', id);
          }
        }

        return profile;
      }

      if (!error && !data) {
        // Create initial profile in Supabase to guarantee foreign key integrity
        const initial = initialProfile(year);

        // Check if there are already entries in learning_entries
        const { data: entryRows } = await supabase
          .from('learning_entries')
          .select('question_id, ever_correct, correct')
          .eq('user_id', id);

        if (Array.isArray(entryRows) && entryRows.length > 0) {
          const uniqueCorrect = new Set(
            entryRows.filter((e) => e.ever_correct || e.correct).map((e) => e.question_id)
          ).size;
          const minEarnedXp = uniqueCorrect * 10;
          initial.xp = minEarnedXp;
          initial.competitiveXp = minEarnedXp;
          initial.level = Math.floor(minEarnedXp / 500) + 1;
        }

        await supabase.from('learning_profiles').upsert({
          user_id: id,
          year: initial.year,
          xp: initial.xp,
          competitive_xp: initial.competitiveXp,
          level: initial.level,
          streak: initial.streak,
          best_streak: initial.bestStreak,
          last_day: initial.lastDay,
          alias: initial.alias,
          opt_in: initial.optIn,
          banner: initial.banner,
          title: initial.title,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

        return initial;
      }
    } catch (err) {
      // Supabase table may not exist yet; fall back silently
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

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('learning_profiles').upsert({
        user_id: id,
        year,
        xp: next.xp,
        competitive_xp: next.competitiveXp,
        level: next.level,
        streak: next.streak,
        best_streak: next.bestStreak,
        last_day: next.lastDay,
        alias: next.alias,
        opt_in: next.optIn,
        banner: next.banner,
        title: next.title,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      return next;
    } catch {
      // Supabase table may not exist yet; fall back silently
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

  // 1. Process and compute awards via Supabase (Primary serverless store)
  const supabase = getSupabase();
  if (supabase && Array.isArray(rewards)) {
    try {
      const nowIso = new Date().toISOString();
      const current = await getProfile(id, year);

      // Check existing entries to deduplicate XP awards for already-solved questions
      const qIds = (rewards as any[])
        .filter((r) => r && r.questionId)
        .map((r) => String(r.questionId));

      const existingMap = new Map<string, boolean>();
      if (qIds.length > 0) {
        const { data: existingRows } = await supabase
          .from('learning_entries')
          .select('question_id, ever_correct')
          .eq('user_id', id)
          .in('question_id', qIds);

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
          correct: isNowCorrect,
          ever_correct: wasEverCorrect || isNowCorrect,
          first_correct: existingMap.has(qId) ? wasEverCorrect : isNowCorrect,
          content_version: r.contentVersion || '',
          updated_at: nowIso,
        });
      }

      // Guarantee learning_profiles row exists BEFORE inserting into learning_entries
      // (Satisfies the foreign key constraint: learning_entries.user_id -> learning_profiles.user_id)
      await supabase.from('learning_profiles').upsert({
        user_id: id,
        year: current.year || year,
        xp: current.xp,
        competitive_xp: current.competitiveXp,
        level: current.level,
        streak: current.streak,
        best_streak: current.bestStreak,
        last_day: current.lastDay || today,
        alias: current.alias || 'Student',
        opt_in: current.optIn ?? false,
        banner: current.banner || 'default',
        title: current.title || 'student',
        updated_at: nowIso,
      }, { onConflict: 'user_id' });

      if (entryRows.length > 0) {
        await supabase.from('learning_entries').upsert(entryRows, { onConflict: 'id' });
      }

      const { data: profRow } = await supabase
        .from('learning_profiles')
        .select('weekly_xp, current_week')
        .eq('user_id', id)
        .maybeSingle();

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

      await supabase.from('learning_profiles').upsert({
        user_id: id,
        year,
        xp: nextXp,
        competitive_xp: nextCompXp,
        level: nextLevel,
        streak,
        best_streak: bestStreak,
        last_day: today,
        weekly_xp: nextWeeklyXp,
        current_week: currentWeek,
        updated_at: nowIso,
      }, { onConflict: 'user_id' });

      // Return calculated XP awards directly from Supabase!
      return { personal: personalAdd, competitive: competitiveAdd };
    } catch (err) {
      console.warn('Supabase award failed, falling back to Redis:', err);
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

export async function dashboard(
  id: string,
  year: number,
  period = "weekly",
): Promise<LearningDashboard> {
  let profile = await getProfile(id, year);
  if (!profile.year || profile.year < 1 || profile.year > 5) {
    profile = await saveProfile(id, year, { year });
  }

  // 1. Try Supabase first
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: entriesRows, error: entErr } = await supabase
        .from('learning_entries')
        .select('*')
        .eq('user_id', id);

      const scoreCol = period === 'all' ? 'competitive_xp' : 'weekly_xp';
      const { data: rankRows, error: rankErr } = await supabase
        .from('learning_profiles')
        .select('user_id, alias, competitive_xp, weekly_xp, level, banner')
        .eq('year', year)
        .eq('opt_in', true)
        .order(scoreCol, { ascending: false })
        .limit(50);

      if (!entErr && !rankErr && Array.isArray(entriesRows) && Array.isArray(rankRows)) {
        const entries: LearningEntry[] = entriesRows
          .map((r: any) => ({
            moduleCode: r.module_code,
            chapterId: r.chapter_id,
            questionId: r.question_id,
            topic: r.topic,
            subject: r.subject,
            type: r.type,
            correct: r.correct,
            everCorrect: r.ever_correct,
            firstCorrect: r.first_correct,
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

        return {
          profile,
          entries,
          leaderboard,
          week: weekKey(),
        };
      }
    } catch {
      // Supabase not ready or query failed, fallback to Redis
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
