import LZString from "lz-string";
import { authenticateReportUser } from "../server/report-auth.js";
import { evalRedis } from "../server/report-store.js";
import { ReportError } from "../server/report-service.js";
import { learningBank } from "../server/learning-bank.js";
import { createLearningService } from "../server/learning-service.js";
import {
  award,
  dashboard,
  getProfile,
  saveProfile,
} from "../server/learning-store.js";
const service = createLearningService({
  authenticate: authenticateReportUser,
  bank: learningBank,
  award,
  dashboard,
  profile: getProfile,
  saveProfile,
  year: async (id) => {
    const raw = await evalRedis("return redis.call('GET',KEYS[1])", [
      `asu_data:${id}:asu_preferences:${id}:academic-year`,
    ]);
    try {
      return JSON.parse(LZString.decompress(String(raw)) ?? "null")?.year ?? 0;
    } catch {
      return 0;
    }
  },
  rate: async (id) =>
    Number(
      await evalRedis(
        "local n=redis.call('INCR',KEYS[1]);if n==1 then redis.call('EXPIRE',KEYS[1],60) end;return n",
        [`asu_learning:v1:rate:${id}`],
      ),
    ) <= 60,
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
      .status(e instanceof ReportError ? e.status : 503)
      .json({
        error:
          e instanceof ReportError
            ? e.message
            : "Learning sync is unavailable. Your pending attempts are saved on this device.",
      });
  }
}
