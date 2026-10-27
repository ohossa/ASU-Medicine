import { getAdminAnalytics } from "../server/admin-analytics-service.js";
import { isReportError } from "../server/report-service.js";

interface Request {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface Response {
  setHeader(name: string, value: string): void;
  status(code: number): Response;
  json(value: unknown): unknown;
}

export default async function handler(req: Request, res: Response) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const header = req.headers.authorization;
  const token =
    typeof header === "string" && header.startsWith("Bearer ")
      ? header.slice(7)
      : "";

  try {
    const data = await getAdminAnalytics(token);
    return res.status(200).json(data);
  } catch (err) {
    if (isReportError(err)) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("Admin analytics error:", err);
    return res.status(503).json({
      error: "Admin analytics is temporarily unavailable. Please try again.",
    });
  }
}
