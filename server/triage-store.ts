import { randomUUID } from "node:crypto";
import { evalRedis } from "./report-store.js";
import { cairoDay } from "./tutor-metrics.js";
import { getSupabase } from "./supabase-client.js";
import type {
  TriageAssessment,
  TriageLabel,
} from "../src/app/reports/triage-contracts.js";

const prefix = "asu_triage:v1:";
export const dailyLimit = () =>
  Math.max(1, Math.min(200, Number(process.env.TRIAGE_DAILY_CALL_LIMIT) || 50));

export interface TriageStore {
  read(keys: string[]): Promise<Record<string, TriageAssessment>>;
  save(a: TriageAssessment, lease: string): Promise<boolean>;
  lease(): Promise<string | null>;
  release(token: string): Promise<void>;
  reserve(): Promise<boolean>;
  labels(): Promise<TriageLabel[]>;
  label(value: TriageLabel): Promise<void>;
  mode(value?: "shadow" | "prioritized"): Promise<"shadow" | "prioritized">;
}

export const TRIAGE_LEASE_LUA = `if redis.call('SET',KEYS[1],ARGV[1],'NX','EX',90) then return 1 end return 0`;
export const TRIAGE_SAVE_LUA = `if redis.call('GET',KEYS[1])~=ARGV[1] then return 0 end redis.call('SET',KEYS[2],ARGV[2]);return 1`;
export const TRIAGE_BUDGET_LUA = `local n=tonumber(redis.call('GET',KEYS[1]) or '0');if n>=tonumber(ARGV[1]) then return 0 end;redis.call('INCR',KEYS[1]);redis.call('EXPIRE',KEYS[1],172800);return 1`;

export const triageStore: TriageStore = {
  async read(keys) {
    const out: Record<string, TriageAssessment> = {};
    if (!keys.length) return out;

    // 1. Try Supabase first
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("triage_assessments")
          .select("fingerprint, assessment")
          .in("fingerprint", keys);

        if (!error && Array.isArray(data) && data.length > 0) {
          data.forEach((r: any) => {
            if (r.fingerprint && r.assessment) {
              out[r.fingerprint] = r.assessment;
            }
          });
          // If all keys found, return immediately
          if (Object.keys(out).length === keys.length) {
            return out;
          }
        }
      } catch {
        // Fallback to Redis
      }
    }

    // 2. Fetch missing keys from Redis
    const missing = keys.filter((k) => !out[k]);
    for (let i = 0; i < missing.length; i += 400) {
      const batch = missing.slice(i, i + 400);
      if (!batch.length) continue;
      try {
        const rows = (await evalRedis(
          `local rows={};for i,k in ipairs(KEYS) do table.insert(rows,redis.call('GET',k) or '') end;return rows`,
          batch.map((k) => prefix + "assessment:" + k),
        )) as string[];
        rows.forEach((r, j) => {
          if (r) out[batch[j]] = JSON.parse(r);
        });
      } catch {
        // Redis unavailable
      }
    }

    return out;
  },

  async save(a, lease) {
    // 1. Save to Supabase if available
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from("triage_assessments").upsert(
          {
            fingerprint: a.fingerprint,
            assessment: a,
            priority: a.priority || "medium",
            confidence: (a as any).confidence || 0,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "fingerprint" },
        );
      } catch {
        // Fallback to Redis
      }
    }

    // 2. Save with lease via Redis
    try {
      return (
        Number(
          await evalRedis(
            TRIAGE_SAVE_LUA,
            [prefix + "lease", prefix + "assessment:" + a.fingerprint],
            [lease, JSON.stringify(a)],
          ),
        ) === 1
      );
    } catch {
      return true;
    }
  },

  async lease() {
    const token = randomUUID();
    try {
      return Number(
        await evalRedis(
          TRIAGE_LEASE_LUA,
          [prefix + "lease"],
          [token],
        ),
      ) === 1
        ? token
        : null;
    } catch {
      return token;
    }
  },

  async release(token) {
    try {
      await evalRedis(
        `if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) end;return 0`,
        [prefix + "lease"],
        [token],
      );
    } catch {
      // Ignored
    }
  },

  async reserve() {
    try {
      const quota = await evalRedis(`return redis.call('GET',KEYS[1])`, [
        "asu_tutor:v1:quota:groq",
      ]);
      if (quota) {
        const q = JSON.parse(String(quota));
        if (
          Date.now() - Date.parse(q.observedAt) < 120000 &&
          ((q.remainingRequests !== null && q.remainingRequests < 10) ||
            (q.remainingTokens !== null && q.remainingTokens < 6000))
        )
          return false;
      }
      return (
        Number(
          await evalRedis(
            TRIAGE_BUDGET_LUA,
            [prefix + "calls:" + cairoDay()],
            [String(dailyLimit())],
          ),
        ) === 1
      );
    } catch {
      return true;
    }
  },

  async labels() {
    try {
      const rows = (await evalRedis(
        `return redis.call('HVALS',KEYS[1])`,
        [prefix + "labels"],
      )) as string[];
      return rows.map((r) => JSON.parse(r));
    } catch {
      return [];
    }
  },

  async label(value) {
    try {
      await evalRedis(
        `redis.call('HSET',KEYS[1],ARGV[1],ARGV[2]);redis.call('RPUSH',KEYS[2],ARGV[2]);return 1`,
        [prefix + "labels", prefix + "label-audit"],
        [value.key, JSON.stringify(value)],
      );
    } catch {
      // Ignored
    }
  },

  async mode(value) {
    try {
      if (value)
        await evalRedis(
          `redis.call('SET',KEYS[1],ARGV[1]);return 1`,
          [prefix + "mode"],
          [value],
        );
      return String(
        await evalRedis(`return redis.call('GET',KEYS[1])`, [prefix + "mode"]),
      ) === "prioritized"
        ? "prioritized"
        : "shadow";
    } catch {
      return value || "shadow";
    }
  },
};
