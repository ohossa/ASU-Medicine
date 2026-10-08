import { createHash } from "node:crypto";
import { z } from "zod";
import {
  REPORT_STATUSES,
  type QuestionReport,
  type QuestionSnapshot,
  type ReportList,
  type ReportSubmission,
  type ReporterProfile,
} from "../src/app/reports/contracts.js";
export class ReportError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
const submission = z
  .object({
    requestId: z.string().uuid(),
    moduleCode: z.string().regex(/^[A-Z0-9]+(?:-[A-Z0-9]+)*-[1-5]$/),
    chapterId: z.number().int().nonnegative(),
    questionId: z.string().min(1).max(180),
    subQuestionId: z.string().min(1).max(180).optional(),
    category: z.enum([
      "wrong_answer",
      "unclear_wording",
      "missing_image",
      "duplicate",
      "formatting",
      "other",
    ]),
    explanation: z.string().trim().max(2000),
  })
  .strict()
  .refine((v) => v.category !== "other" || v.explanation.length > 0);
const updateInput = z
  .object({
    id: z.string().regex(/^r_[a-f0-9]{40}$/),
    revision: z.number().int().positive(),
    status: z.enum(REPORT_STATUSES),
    notes: z.string().trim().max(5000),
  })
  .strict();
export interface Identity {
  reporter?: ReporterProfile;
  id: string;
  isAdmin: boolean;
}
export interface ReportStore {
  create(
    report: QuestionReport,
  ): Promise<{ report: QuestionReport; created: boolean }>;
  get(id: string): Promise<QuestionReport | null>;
  list(status: string, offset: number): Promise<ReportList>;
  update(
    id: string,
    revision: number,
    patch: Partial<QuestionReport>,
  ): Promise<QuestionReport>;
  notification(
    id: string,
    value: QuestionReport["notification"],
  ): Promise<void>;
}
interface Dependencies {
  authenticate(token: string): Promise<Identity>;
  resolveQuestion(input: ReportSubmission): Promise<QuestionSnapshot>;
  store: ReportStore;
  sendEmail(report: QuestionReport): Promise<QuestionReport["notification"]>;
}
function parse<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success)
    throw new ReportError(
      400,
      "Please check the report details and try again.",
    );
  return result.data;
}
export function createReportService(deps: Dependencies) {
  async function owner(token: string) {
    const identity = await deps.authenticate(token);
    if (!identity.isAdmin)
      throw new ReportError(403, "This portal is restricted to the owner.");
    return identity;
  }
  async function notify(report: QuestionReport) {
    let state: QuestionReport["notification"];
    try {
      state = await deps.sendEmail(report);
    } catch {
      state = { state: "failed" };
    }
    await deps.store.notification(report.id, state);
    return state;
  }
  return {
    async access(token: string) {
      const identity = await owner(token);
      return { isAdmin: true, userId: identity.id };
    },
    async submit(token: string, body: unknown) {
      const identity = await deps.authenticate(token);
      const input = parse(submission, body);
      const id =
        "r_" +
        createHash("sha256")
          .update(identity.id + ":" + input.requestId)
          .digest("hex")
          .slice(0, 40);
      const requestHash = createHash("sha256")
        .update(JSON.stringify(input))
        .digest("hex");
      const existing = await deps.store.get(id);
      if (existing) {
        if (existing.requestHash !== requestHash)
          throw new ReportError(
            409,
            "This submission has already been used. Reopen the report form.",
          );
        return { id: existing.id, saved: true };
      }
      const snapshot = await deps.resolveQuestion(input);
      const now = new Date().toISOString();
      const report: QuestionReport = {
        id,
        requestHash,
        reporterId: identity.id,
        reporter: identity.reporter ? { ...identity.reporter } : undefined,
        category: input.category,
        explanation: input.explanation,
        subQuestionId: input.subQuestionId,
        snapshot,
        status: "new",
        notes: "",
        revision: 1,
        createdAt: now,
        updatedAt: now,
        notification: { state: "pending" },
      };
      const result = await deps.store.create(report);
      if (result.report.requestHash !== requestHash)
        throw new ReportError(409, "This submission has already been used.");
      if (result.created) {
        try {
          await notify(result.report);
        } catch {
          /* Stored report remains pending and recoverable in the owner inbox. */
        }
      }
      return { id: result.report.id, saved: true };
    },
    async list(token: string, query: { status?: unknown; offset?: unknown }) {
      await owner(token);
      const status = String(query.status || "all");
      const offset = Number(query.offset || 0);
      if (
        !["all", ...REPORT_STATUSES].includes(status) ||
        !Number.isSafeInteger(offset) ||
        offset < 0 ||
        offset > 100000
      )
        throw new ReportError(400, "Invalid inbox filter.");
      return deps.store.list(status, offset);
    },
    async update(token: string, body: unknown) {
      const identity = await owner(token);
      const input = parse(updateInput, body);
      return deps.store.update(input.id, input.revision, {
        status: input.status,
        notes: input.notes,
        updatedAt: new Date().toISOString(),
        updatedBy: identity.id,
      });
    },
    async retry(token: string, body: unknown) {
      await owner(token);
      const { id } = parse(
        z.object({ id: z.string().regex(/^r_[a-f0-9]{40}$/) }).strict(),
        body,
      );
      const report = await deps.store.get(id);
      if (!report) throw new ReportError(404, "Report not found.");
      if (report.notification.state === "sent") return report.notification;
      return notify(report);
    },
  };
}
