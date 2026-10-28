import type { QuestionReport } from "../src/app/reports/contracts.js";
import { REPORT_CATEGORIES } from "../src/app/reports/contracts.js";
import { OWNER_EMAIL } from "./report-auth.js";
export async function sendReportEmail(
  report: QuestionReport,
): Promise<QuestionReport["notification"]> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.REPORT_EMAIL_FROM;
  if (!key || !from) return { state: "unconfigured" };
  const snapshot = report.snapshot;
  const origin = (process.env.REPORT_SITE_URL || "https://asu.codes").replace(
    /\/$/,
    "",
  );
  const text = [
    `A student reported a question on ASU Medical Portal.`,
    `Issue: ${REPORT_CATEGORIES[report.category].en}`,
    `Module: ${snapshot.moduleCode}`,
    `Chapter: ${snapshot.chapterTitle}`,
    `Subject: ${snapshot.subjectName}`,
    `Question ID: ${snapshot.question.id}`,
    report.subQuestionId ? `Question part: ${report.subQuestionId}` : "",
    `Reporter: ${report.reporter?.name || 'Student'}${report.reporter?.email ? ` <${report.reporter.email}>` : ''}${report.reporter?.emailVerified ? ' (Verified)' : ''}`,
    report.reporter?.username ? `Username: @${report.reporter.username}` : "",
    `Student note: ${report.explanation || "No explanation added."}`,
    `Question: ${snapshot.question.text || snapshot.question.question || ""}`,
    `Review securely: ${origin}/admin/reports?report=${report.id}`,
    `Report: ${report.id}`,
  ]
    .filter(Boolean)
    .join("\n\n");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `question-report/${report.id}`,
    },
    body: JSON.stringify({
      from,
      to: [OWNER_EMAIL],
      subject: `Question report · ${snapshot.moduleCode} · ${REPORT_CATEGORIES[report.category].en}`,
      text,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Email provider rejected notification");
  const data = await response.json();
  if (
    !data ||
    typeof data !== "object" ||
    !("id" in data) ||
    typeof data.id !== "string"
  )
    throw new Error("Missing email acknowledgment");
  return { state: "sent", providerId: data.id };
}

export function reportReplyConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.REPORT_EMAIL_FROM);
}
export async function sendReportReply(reply: import('../src/app/reports/reply-contracts.js').ReportReply): Promise<{providerId:string}> {
  if (!reportReplyConfigured()) throw new Error('Reply delivery is not configured');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {Authorization:`Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type':'application/json', 'Idempotency-Key':`report-reply/${reply.id}`},
    body: JSON.stringify({from:reply.from || process.env.REPORT_EMAIL_FROM, to:[reply.to], reply_to:OWNER_EMAIL, subject:reply.subject, text:reply.emailText ?? reply.body, ...(reply.emailHtml ? {html:reply.emailHtml} : {})}),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('Reply delivery was not acknowledged');
  const data = await response.json();
  if (!data || typeof data !== 'object' || !('id' in data) || typeof data.id !== 'string' || !data.id) throw new Error('Reply acknowledgment is missing');
  return {providerId:data.id};
}
