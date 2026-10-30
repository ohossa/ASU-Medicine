import LZString from "lz-string";
import { authenticateReportUser } from "../server/report-auth.js";
import { evalRedis } from "../server/report-store.js";
import { ReportError, isReportError } from "../server/report-service.js";
import { learningBank } from "../server/learning-bank.js";
import { createLearningService } from "../server/learning-service.js";
import { getSupabase } from "../server/supabase-client.js";
import {
  award,
  dashboard,
  getProfile,
  saveProfile,
} from "../server/learning-store.js";

const inMemoryRates = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(id: string, maxPerMinute = 2500): boolean {
  const now = Date.now();
  const entry = inMemoryRates.get(id);
  if (!entry || now > entry.resetAt) {
    inMemoryRates.set(id, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= maxPerMinute) {
    return false;
  }
  entry.count++;
  return true;
}

const service = createLearningService({
  authenticate: authenticateReportUser,
  bank: learningBank,
  award,
  dashboard,
  profile: getProfile,
  saveProfile,
  year: async (id) => {
    // 1. Primary: Supabase
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: userRow } = await supabase
          .from("user_progress")
          .select("academic_year, data")
          .eq("user_id", id)
          .maybeSingle();

        if (
          userRow?.academic_year &&
          Number.isInteger(userRow.academic_year) &&
          userRow.academic_year >= 1 &&
          userRow.academic_year <= 5
        ) {
          return userRow.academic_year;
        }

        const dataObj = userRow?.data as Record<string, any> | undefined;
        const prefYear = dataObj?.[`asu_preferences:${id}:academic-year`]?.year;
        if (
          prefYear &&
          Number.isInteger(prefYear) &&
          prefYear >= 1 &&
          prefYear <= 5
        ) {
          return prefYear;
        }

        const { data: profileRow } = await supabase
          .from("learning_profiles")
          .select("year")
          .eq("user_id", id)
          .maybeSingle();

        if (
          profileRow?.year &&
          Number.isInteger(profileRow.year) &&
          profileRow.year >= 1 &&
          profileRow.year <= 5
        ) {
          return profileRow.year;
        }
      } catch (err) {
        console.warn("Supabase year check error:", err);
      }
    }

    // 2. Resilient fallback: Redis (safely wrapped in try/catch)
    try {
      const raw = await evalRedis("return redis.call('GET',KEYS[1])", [
        `asu_data:${id}:asu_preferences:${id}:academic-year`,
      ]);
      return JSON.parse(LZString.decompress(String(raw)) ?? "null")?.year ?? 0;
    } catch {
      return 0;
    }
  },
  rate: async (id) => {
    if (!checkRateLimit(id, 2500)) return false;
    try {
      const n = Number(
        await evalRedis(
          "local n=redis.call('INCR',KEYS[1]);if n==1 then redis.call('EXPIRE',KEYS[1],60) end;return n",
          [`asu_learning:v1:rate:${id}`],
        ),
      );
      return n <= 2500;
    } catch {
      return true;
    }
  },
});
interface Req {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
}
interface Res {
  setHeader: (n: string, v: string) => void;
  status: (n: number) => Res;
  json: (v: unknown) => unknown;
}
export default async function handler(req: Req, res: Res) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Content-Type-Options", "nosniff");
  try {
    const h = req.headers.authorization,
      token =
        typeof h === "string" && h.startsWith("Bearer ") ? h.slice(7) : "";
    if (req.method === "GET")
      return res
        .status(200)
        .json(
          await service.overview(
            token,
            req.query?.period === "all" ? "all" : "weekly",
          ),
        );
    if (!["POST", "PATCH"].includes(req.method ?? "")) {
      res.setHeader("Allow", "GET, POST, PATCH");
      return res.status(405).json({ error: "Method not allowed." });
    }
    const serialized =
      typeof req.body === "string"
        ? req.body
        : JSON.stringify(req.body ?? null);
    if (Buffer.byteLength(serialized) > 150000)
      throw new ReportError(413, "Learning update too large.");
    let body;
    try {
      body = JSON.parse(serialized);
    } catch {
      throw new ReportError(400, "Invalid learning update.");
    }
    return res
      .status(200)
      .json(
        req.method === "PATCH"
          ? await service.settings(token, body)
          : await service.submit(token, body),
      );
  } catch (e) {
    return res
      .status(isReportError(e) ? e.status : 503)
      .json({
        error:
          isReportError(e)
            ? e.message
            : "Learning sync is unavailable. Your pending attempts are saved on this device.",
      });
  }
}
