import { readTutorUsage } from "../server/tutor-metrics.js";
import { createReportService, ReportError } from "../server/report-service.js";
import { authenticateReportUser } from "../server/report-auth.js";
import { resolveReportQuestion } from "../server/report-question.js";
import { reportStore } from "../server/report-store.js";
import { editStore } from "../server/question-edit-store.js";
import { sendReportEmail } from "../server/report-email.js";
import { createTriageService, reviewGroup } from "../server/triage-worker.js";
import { triageStore } from "../server/triage-store.js";
import { callTriageModel } from "../server/triage-provider.js";
import { fetchEvidence } from "../server/triage-evidence.js";
import { z } from "zod";
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
  triageFilter: async (records, bucket) => {
    if (bucket === 'all') return records;
    const view = await triage.viewInternal();
    if (view.mode === 'shadow') return bucket === 'low' ? records.filter(r => view.lowReportIds.includes(r.id)) : records;
    return records.filter(r => bucket === 'low' ? view.lowReportIds.includes(r.id) : !view.lowReportIds.includes(r.id));
  },
});
const current = (r: import("../src/app/reports/contracts.js").QuestionReport) => resolveReportQuestion({ requestId: "", moduleCode: r.snapshot.moduleCode, chapterId: r.snapshot.chapterId, questionId: String(r.snapshot.question.id), subQuestionId: r.subQuestionId, category: r.category, explanation: "" }, code => editStore.list(code));
const triage = createTriageService({
  owner: async token => { const identity = await authenticateReportUser(token); if (!identity.isAdmin) throw new ReportError(403, "Owner access required."); return identity; },
  records: async () => { const rows: import("../src/app/reports/contracts.js").QuestionReport[] = []; let offset = 0, total = 1; while (offset < total) { const page = await reportStore.list("all", offset, 500); total = page.total; if (total > 10000 || (!page.reports.length && offset < total)) throw new ReportError(503, "Inbox could not be read completely. Refresh and try again."); rows.push(...page.reports); offset += page.reports.length; } return rows; },
  store: triageStore, current,
  review: async group => { const signal = AbortSignal.timeout(55000); return reviewGroup(group, { current, model: (phase, input) => callTriageModel(phase, input, () => triageStore.reserve(), signal), evidence: queries => fetchEvidence(queries, fetch, signal) }); },
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
      if (action === "triage") return res.status(200).json(await triage.view(token));
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
    if (req.method === "POST" && typeof action === "string" && action.startsWith("triage-")) {
      await service.access(token);
      const key = z.string().regex(/^[a-f0-9]{64}$/);
      const schemas = {
        "triage-run": z.object({}).strict(),
        "triage-reassess": z.object({key}).strict(),
        "triage-mode": z.object({mode:z.enum(["shadow","prioritized"])}).strict(),
        "triage-label": z.object({key,fingerprint:key,label:z.enum(["actionable","uncertain","low"]),critical:z.boolean(),notes:z.string().trim().max(2000)}).strict(),
      };
      if (!(action in schemas)) throw new ReportError(400,"Unknown triage action.");
      const input = schemas[action as keyof typeof schemas].safeParse(body);
      if (!input.success) throw new ReportError(400,"Check the triage action details.");
      if (action === "triage-run") return res.status(200).json(await triage.run(token));
      if (action === "triage-reassess") return res.status(200).json(await triage.reassess(token,(input.data as {key:string}).key));
      if (action === "triage-mode") return res.status(200).json(await triage.mode(token,(input.data as {mode:"shadow"|"prioritized"}).mode));
      return res.status(200).json(await triage.label(token,input.data as {key:string;fingerprint:string;label:"actionable"|"uncertain"|"low";critical:boolean;notes:string}));
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
