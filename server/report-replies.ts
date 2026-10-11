import { replyContext, renderReplyEmail, type ContextReport } from "../src/app/reports/reply-context.js";
import { createHash } from "node:crypto";
import { z } from "zod";
import { ReportError } from "./report-service.js";
import type {
  ReportReply,
  ReplyConversation,
  ReplyDraft,
} from "../src/app/reports/reply-contracts.js";
export interface ReplyStore {
  draft(id: string): Promise<ReplyDraft | null>;
  saveDraft(draft: ReplyDraft): Promise<ReplyDraft>;
  list(id: string): Promise<ReportReply[]>;
  reserve(
    reply: ReportReply,
  ): Promise<{ reply: ReportReply; created: boolean }>;
  claim(id: string): Promise<boolean>;
  finish(reply: ReportReply): Promise<void>;
}
interface Dependencies {
  authenticate(token: string): Promise<{ id: string; isAdmin: boolean }>;
  getReport(id: string): Promise<ContextReport | null>;
  recipient(userId: string): Promise<string>;
  store: ReplyStore;
  configured(): boolean;
  sender?(): string;
  send(reply: ReportReply): Promise<{ providerId: string }>;
}
const reportId = z.string().regex(/^r_[a-f0-9]{40}$/);
const schema = z
  .object({
    id: reportId,
    requestId: z.uuid(),
    subject: z
      .string()
      .trim()
      .min(3)
      .max(160)
      .regex(/^[^\r\n]+$/),
    body: z.string().trim().min(20).max(6000),
  })
  .strict();
export function createReplyService(d: Dependencies) {
  async function owner(token: string) {
    const identity = await d.authenticate(token);
    if (!identity.isAdmin) throw new ReportError(403, "Owner access required.");
    return identity;
  }
  async function report(id: unknown) {
    if (!reportId.safeParse(id).success)
      throw new ReportError(400, "Invalid report.");
    const r = await d.getReport(id as string);
    if (!r) throw new ReportError(404, "Report not found.");
    return r;
  }
  return {
    async conversation(token: string, id: unknown): Promise<ReplyConversation> {
      await owner(token);
      const r = await report(id);
      const recipient = await d.recipient(r.reporterId);
      return {
        draft: await d.store.draft(r.id),
        replies: await d.store.list(r.id),
        recipient: recipient || null,
        configured: d.configured(),
        context: replyContext(r),
      };
    },
    async saveDraft(token: string, body: unknown) {
      const identity = await owner(token);
      const parsed = z
        .object({
          id: reportId,
          revision: z.number().int().min(0),
          subject: z
            .string()
            .max(160)
            .regex(/^[^\r\n]*$/),
          body: z.string().max(6000),
        })
        .strict()
        .safeParse(body);
      if (!parsed.success)
        throw new ReportError(400, "Check the draft details.");
      const input = parsed.data;
      await report(input.id);
      return d.store.saveDraft({
        reportId: input.id,
        subject: input.subject,
        body: input.body,
        revision: input.revision,
        updatedAt: new Date().toISOString(),
        updatedBy: identity.id,
      });
    },
    async send(token: string, body: unknown): Promise<ReportReply> {
      const identity = await owner(token);
      const parsed = schema.safeParse(body);
      if (!parsed.success)
        throw new ReportError(400, "Check the reply subject and message.");
      const input = parsed.data;
      if (/\[(?:Explain|Describe|Ask)[^\]\n]*\]/i.test(input.body))
        throw new ReportError(
          400,
          "Replace the template instructions with your review before sending.",
        );
      const r = await report(input.id);
      if (!d.configured())
        throw new ReportError(
          503,
          "Email replies need RESEND_API_KEY and a verified REPORT_EMAIL_FROM on the server.",
        );
      const replyId =
        "reply_" +
        createHash("sha256")
          .update(r.id + ":" + input.requestId)
          .digest("hex");
      // Recipient and content freeze at reservation. An ambiguous retry must reuse the identical provider payload.
      const existing = (await d.store.list(r.id)).find(
        (row) => row.id === replyId,
      );
      const to = existing?.to ?? (await d.recipient(r.reporterId));
      if (!z.email().safeParse(to).success)
        throw new ReportError(
          422,
          "This student has no verified email address available.",
        );
      const context = existing ? existing.context : replyContext(r);
      const rendered = !existing && context ? renderReplyEmail(input.body, context) : undefined;
      const reserved = await d.store.reserve({
        id: replyId,
        requestId: input.requestId,
        reportId: r.id,
        to,
        subject: input.subject,
        body: input.body,
        createdAt: new Date().toISOString(),
        createdBy: identity.id,
        from: d.sender?.(),
        state: "pending",
        context,
        emailText: existing ? existing.emailText : rendered?.text,
        emailHtml: existing ? existing.emailHtml : rendered?.html,
      });
      const reply = reserved.reply;
      if (reply.subject !== input.subject || reply.body !== input.body)
        throw new ReportError(
          409,
          "This send reference already belongs to a different reply. Refresh before composing a new reply.",
        );
      if (reply.state === "accepted") return reply;
      // Resend keeps idempotency keys for 24 hours. Never blindly resend beyond that window.
      if (
        !reserved.created &&
        Date.now() - Date.parse(reply.createdAt) > 23 * 3600000
      )
        throw new ReportError(
          409,
          "Delivery is uncertain and the safe retry window has ended. Check the email provider log before sending another reply.",
        );
      if (!(await d.store.claim(reply.id))) return reply;
      let result: ReportReply;
      try {
        const sent = await d.send(reply);
        result = { ...reply, state: "accepted", providerId: sent.providerId };
      } catch {
        result = { ...reply, state: "uncertain" };
      }
      // A failed write leaves the original pending record and lock. The same provider key is safe to retry.
      await d.store.finish(result);
      return result;
    },
  };
}
