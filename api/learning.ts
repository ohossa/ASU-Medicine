import LZString from "lz-string";
import { authenticateReportUser } from "../server/report-auth.js";
import { evalRedis } from "../server/report-store.js";
import { ReportError, isReportError } from "../server/report-service.js";
import { learningBank } from "../server/learning-bank.js";
import { createLearningService } from "../server/learning-service.js";
import { d1Query, d1QueryFirst, isD1Configured } from "../server/d1-client.js";
import { getR2Json } from "../server/r2-client.js";
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
    // 1. Primary: Cloudflare D1
    if (isD1Configured()) {
      try {
        const profileRow = await d1QueryFirst<any>(
          'SELECT year FROM learning_profiles WHERE user_id = ?',
          [id]
        );

        if (
          profileRow?.year &&
          Number.isInteger(profileRow.year) &&
          profileRow.year >= 1 &&
          profileRow.year <= 5
        ) {
          return profileRow.year;
        }

        // Check recent question attempts from learning_entries (e.g. MGL-3 -> Year 3)
        const recentEntries = await d1Query<any>(
          'SELECT module_code FROM learning_entries WHERE user_id = ? ORDER BY updated_at DESC LIMIT 10',
          [id]
        );

        if (Array.isArray(recentEntries) && recentEntries.length > 0) {
          for (const ent of recentEntries) {
            const match = ent.module_code?.match(/-([1-5])$/);
            if (match) {
              const detectedYear = parseInt(match[1], 10);
              if (detectedYear >= 1 && detectedYear <= 5) {
                return detectedYear;
              }
            }
          }
        }
      } catch (err) {
        console.warn("D1 year check error:", err);
      }
    }

    // 2. Resilient check: Cloudflare R2 user progress blob
    try {
      const userR2Key = `users/${id}/progress.json`;
      const r2Res = await getR2Json<Record<string, any>>(userR2Key);
      if (r2Res?.data) {
        const yearKey = `asu_preferences:${id}:academic-year`;
        const explicitPref = r2Res.data[yearKey]?.year;
        const portalYear = Number(r2Res.data['asu_portal_year']);
        if (Number.isInteger(explicitPref) && explicitPref >= 1 && explicitPref <= 5) {
          return explicitPref;
        }
        if (Number.isInteger(portalYear) && portalYear >= 1 && portalYear <= 5) {
          return portalYear;
        }
      }
    } catch {}

    // 3. Fallback: Redis (safely wrapped in try/catch)
    try {
      const raw = await evalRedis("return redis.call('GET',KEYS[1])", [
        `asu_data:${id}:asu_preferences:${id}:academic-year`,
      ]);
      const redisYear = JSON.parse(LZString.decompress(String(raw)) ?? "null")?.year;
      if (Number.isInteger(redisYear) && redisYear >= 1 && redisYear <= 5) {
        return redisYear;
      }
    } catch {}

    // 4. Default to Year 1 so student is NEVER blocked by a 409 rejection
    return 1;
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
  const start = Date.now();
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  try {
    const h = req.headers.authorization,
      token =
        typeof h === "string" && h.startsWith("Bearer ") ? h.slice(7) : "";
    if (req.method === "GET") {
      const data = await service.overview(
        token,
        req.query?.period === "all" ? "all" : "weekly",
      );
      res.setHeader("Server-Timing", `total;dur=${Date.now() - start}`);
      return res.status(200).json(data);
    }
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
    const result = req.method === "PATCH"
      ? await service.settings(token, body)
      : await service.submit(token, body);
    res.setHeader("Server-Timing", `total;dur=${Date.now() - start}`);
    return res.status(200).json(result);
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
