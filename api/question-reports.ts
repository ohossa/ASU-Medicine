import { readTutorUsage } from "../server/tutor-metrics.js";
import { createReportService, ReportError } from "../server/report-service.js";
import { authenticateReportUser } from "../server/report-auth.js";
import { resolveReportQuestion } from "../server/report-question.js";
import { reportStore } from "../server/report-store.js";
import { editStore } from "../server/question-edit-store.js";
import { sendReportEmail } from "../server/report-email.js";
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
const service = createReportService({
  authenticate: authenticateReportUser,
  resolveQuestion: input => resolveReportQuestion(input, code => editStore.list(code)),
  store: reportStore,
  sendEmail: sendReportEmail,
});
export default async function handler(req: Request, res: Response) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Content-Type-Options", "nosniff");
  try {
    const header = req.headers.authorization;
    const token =
      typeof header === "string" && header.startsWith("Bearer ")
        ? header.slice(7)
        : "";
    const action = req.query?.action || "";
    if (req.method === "GET") {
      if (action === "overview") {
        const reports = await service.overview(token); // Owner authorization precedes every data read.
        try { return res.status(200).json({ reports, tutor: await readTutorUsage() }); }
        catch { return res.status(200).json({ reports, tutor: null, tutorError: 'Tutor usage is temporarily unavailable. Report counts are available.' }); }
      }
      if (action === "access")
        return res.status(200).json(await service.access(token));
      if (action === "detail") {
        await service.access(token);
        const id = req.query?.id;
        if (typeof id !== "string" || !/^r_[a-f0-9]{40}$/.test(id))
          throw new ReportError(400, "Invalid report.");
        const report = await reportStore.get(id);
        if (!report) throw new ReportError(404, "Report not found.");
        return res.status(200).json({ report });
      }
      return res.status(200).json(await service.list(token, req.query || {}));
    }
    if (!["POST", "PATCH"].includes(req.method || "")) {
      res.setHeader("Allow", "GET, POST, PATCH");
      return res.status(405).json({ error: "Method not allowed." });
    }
    const serialized =
      typeof req.body === "string"
        ? req.body
        : JSON.stringify(req.body ?? null);
    if (Buffer.byteLength(serialized, "utf8") > 16000)
      throw new ReportError(413, "Report is too large.");
    let body: unknown;
    try {
      body = JSON.parse(serialized);
    } catch {
      throw new ReportError(400, "Invalid report.");
    }
    if (req.method === "PATCH")
      return res
        .status(200)
        .json({ report: await service.update(token, body) });
    if (action === "retry")
      return res
        .status(200)
        .json({ notification: await service.retry(token, body) });
    if (action) throw new ReportError(400, "Unknown action.");
    return res.status(201).json(await service.submit(token, body));
  } catch (error) {
    if (error instanceof ReportError)
      return res.status(error.status).json({ error: error.message });
    console.error("Question reporting request failed");
    return res
      .status(503)
      .json({
        error:
          "Reporting is temporarily unavailable. Your form has been kept; please try again.",
      });
  }
}
