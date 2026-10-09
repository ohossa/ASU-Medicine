import { evalRedis } from "./report-store.js";
import { cairoDay, weekKey } from "./learning-policy.js";
import type {
  LearningDashboard,
  LearningProfile,
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
  const raw = await evalRedis("return redis.call('GET',KEYS[1])", [
    profileKey(id),
  ]);
  return raw ? JSON.parse(String(raw)) : initialProfile(year);
}
export async function saveProfile(
  id: string,
  year: number,
  patch: Partial<LearningProfile>,
) {
  const old = await getProfile(id, year);
  const next = { ...old, ...patch, year };
  // Never accept counters through settings. The service supplies only cosmetic/consent fields.
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
}
export async function award(id: string, year: number, rewards: unknown[]) {
  const today = cairoDay(),
    d = new Date(today + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - 1);
  const yesterday = d.toISOString().slice(0, 10);
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
}
export async function dashboard(
  id: string,
  year: number,
  period = "weekly",
): Promise<LearningDashboard> {
  let profile = await getProfile(id, year);
  if (profile.year !== year) profile = await saveProfile(id, year, {});
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
      ? raw
          .map((r) => JSON.parse(String(r)))
          .filter((r) => r.moduleCode.endsWith("-" + year))
      : [],
    leaderboard,
    week: weekKey(),
  };
}
