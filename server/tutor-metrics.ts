import { evalRedis } from "./report-store.js";
import type {
  TutorUsage,
  TutorQuota,
} from "../src/app/reports/dashboard-contracts.js";
const TTL = 32 * 24 * 60 * 60;
export function cairoDay(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
const dayKey = (day: string) => `asu_tutor:v1:day:${day}:groq`;
const quotaKey = "asu_tutor:v1:quota:groq";
const number = (value: unknown): number | null =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0
    ? value
    : null;
function header(headers: Headers, key: string) {
  const value = headers.get(key);
  return value !== null && /^\d+$/.test(value) ? number(Number(value)) : null;
}
export const RECORD_TUTOR_LUA = `
redis.call('HINCRBY',KEYS[1],'requests',1)
redis.call('HINCRBY',KEYS[1],'successes',ARGV[1]);redis.call('HINCRBY',KEYS[1],'failures',ARGV[2])
redis.call('HINCRBY',KEYS[1],'inputTokens',ARGV[3]);redis.call('HINCRBY',KEYS[1],'outputTokens',ARGV[4]);redis.call('HINCRBY',KEYS[1],'totalTokens',ARGV[5])
redis.call('HSETNX',KEYS[1],'recordedSince',ARGV[7]);redis.call('EXPIRE',KEYS[1],ARGV[8])
if ARGV[6]~='' then redis.call('SET',KEYS[2],ARGV[6],'EX',ARGV[8]) end
return 1`;
async function bounded<T>(promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Metrics timeout")), 1500);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
/** Anonymous, best-effort counters; never retain prompts, identities, responses or secrets. */
export async function recordTutorUsage(
  status: number,
  usage: unknown,
  headers: Headers,
): Promise<void> {
  try {
    const u =
      usage && typeof usage === "object"
        ? (usage as Record<string, unknown>)
        : {};
    const input = number(u.prompt_tokens) ?? 0,
      output = number(u.completion_tokens) ?? 0,
      total = number(u.total_tokens) ?? number(input + output) ?? 0;
    const now = new Date();
    const sample: TutorQuota = {
      observedAt: now.toISOString(),
      requestLimit: header(headers, "x-ratelimit-limit-requests"),
      remainingRequests: header(headers, "x-ratelimit-remaining-requests"),
      tokenLimit: header(headers, "x-ratelimit-limit-tokens"),
      remainingTokens: header(headers, "x-ratelimit-remaining-tokens"),
    };
    const hasLimits = [
      sample.requestLimit,
      sample.remainingRequests,
      sample.tokenLimit,
      sample.remainingTokens,
    ].some((n) => n !== null);
    await bounded(
      evalRedis(
        RECORD_TUTOR_LUA,
        [dayKey(cairoDay(now)), quotaKey],
        [
          String(status >= 200 && status < 300 ? 1 : 0),
          String(status >= 200 && status < 300 ? 0 : 1),
          String(input),
          String(output),
          String(total),
          hasLimits ? JSON.stringify(sample) : "",
          now.toISOString(),
          String(TTL),
        ],
      ),
    );
  } catch {
    console.warn(
      "Tutor usage could not be recorded. The tutor response is unaffected.",
    );
  }
}
export async function readTutorUsage(): Promise<TutorUsage> {
  const day = cairoDay();
  const raw = await bounded(
    evalRedis(
      `local values=redis.call('HGETALL',KEYS[1]);local out={};for i=1,#values,2 do out[values[i]]=values[i+1] end;return {cjson.encode(out),redis.call('GET',KEYS[2]) or ''}`,
      [dayKey(day), quotaKey],
    ),
  );
  if (!Array.isArray(raw) || raw.length !== 2)
    throw new Error("Metrics unavailable");
  const counts = JSON.parse(String(raw[0]));
  const count = (key: string) => number(Number(counts[key] ?? 0)) ?? 0;
  let quota: TutorQuota | null = null;
  if (raw[1]) {
    const q = JSON.parse(String(raw[1]));
    if (
      typeof q.observedAt === "string" &&
      Number.isFinite(Date.parse(q.observedAt))
    )
      quota = {
        observedAt: q.observedAt,
        requestLimit: number(q.requestLimit),
        remainingRequests: number(q.remainingRequests),
        tokenLimit: number(q.tokenLimit),
        remainingTokens: number(q.remainingTokens),
      };
  }
  return {
    day,
    timezone: "Africa/Cairo",
    provider: "groq",
    requests: count("requests"),
    successes: count("successes"),
    failures: count("failures"),
    inputTokens: count("inputTokens"),
    outputTokens: count("outputTokens"),
    totalTokens: count("totalTokens"),
    recordedSince:
      typeof counts.recordedSince === "string" ? counts.recordedSince : null,
    quota,
  };
}
