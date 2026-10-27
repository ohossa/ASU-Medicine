import { REPORT_CATEGORIES, type QuestionReport } from './contracts.js';
export interface ReplyContext { reportId: string; location: string; question: string; category: string; message: string }
export type ContextReport = Pick<QuestionReport, 'id' | 'reporterId'> & Partial<Pick<QuestionReport, 'snapshot' | 'category' | 'explanation' | 'subQuestionId'>>;
const string = (v: unknown) => typeof v === 'string' ? v : '';
const strings = (v: unknown): string[] => Array.isArray(v) ? v.filter((s):s is string => typeof s === 'string') : [];
function questionText(q: Record<string, unknown>): string {
 const options = strings(q.options);
 if (!options.length && q.type === 'truefalse') options.push('True','False');
 const index = q.correctIndex;
 const key = typeof index === 'number' && Number.isInteger(index) && index >= 0 && options[index] !== undefined
   ? `${String.fromCharCode(65 + index)}. ${options[index]}` : '';
 const pairs = Array.isArray(q.pairs) ? q.pairs.flatMap(p => p && typeof p === 'object' && 'premise' in p && 'target' in p ? [`${string(p.premise)} → ${string(p.target)}`] : []) : [];
 const blanks = strings(q.blanks).map((answer,i)=>`${i+1}. ${answer}${Array.isArray(q.acceptedAnswers) && strings(q.acceptedAnswers[i]).length ? ` (also accepted: ${strings(q.acceptedAnswers[i]).join('; ')})` : ''}`);
 const answer = key || string(q.modelAnswer) || pairs.join('\n') || blanks.join('\n') || 'Not recorded in this report.';
 return [string(q.text) || string(q.question), options.map((o,i)=>`${String.fromCharCode(65+i)}. ${o}`).join('\n'), `Answer shown when reported:\n${answer}`, string(q.explanation) ? `Explanation when reported:\n${q.explanation}` : ''].filter(Boolean).join('\n\n');
}
/** Only the original report snapshot is included, never owner notes or account metadata. */
export function replyContext(report: ContextReport): ReplyContext | undefined {
 const s=report.snapshot;
 if (!s) return undefined; // Legacy outbox/test metadata without a question snapshot.
 const q=s.question;
 let question=questionText(q);
 if (Array.isArray(q.subQuestions)) {
   const parts=q.subQuestions.filter(p=>p && typeof p==='object' && (!report.subQuestionId || String(p.id)===report.subQuestionId));
   question=[string(q.text) || string(q.question), ...parts.map(p=>`Part ${String(p.id)}\n${questionText(p)}`), ...(report.subQuestionId && !parts.length ? ['Reported part was not recorded in this snapshot.'] : [])].filter(Boolean).join('\n\n');
 }
 return {reportId:report.id,location:[s.moduleCode,s.subjectName,s.chapterTitle,s.topicName,`Question ${q.id}`,report.subQuestionId ? `Part ${report.subQuestionId}`:''].filter(Boolean).join(' · '),question,category:report.category ? REPORT_CATEGORIES[report.category].en : 'Question report',message:report.explanation || 'No message added.'};
}
export function replyContextText(c: ReplyContext): string {
  return [
    'About your report',
    c.location,
    `Reference: ${c.reportId}`,
    'Question as reported',
    'This is the original snapshot. Any corrections are described in the reply above.',
    c.question,
    `Your report: ${c.category}`,
    c.message,
  ].join('\n\n');
}
const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const paragraph = (s: string) => escape(s).replace(/\n/g, '<br>');
/** Freeze these exact rendered payloads in the outbox before contacting the provider. */
export function renderReplyEmail(
  body: string,
  context: ReplyContext,
): { text: string; html: string } {
  return {
    text: `${body}\n\n---\n\n${replyContextText(context)}`,
    html: `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:24px 16px;background:#f4f4f5;color:#18181b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif;-webkit-font-smoothing:antialiased"><div style="max-width:620px;margin:0 auto;overflow-wrap:anywhere;word-break:break-word"><div style="margin-bottom:14px;padding:0 4px"><span style="font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#059669">ASUCodes · Faculty Review</span></div><div style="padding:26px 24px;background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,0.04);font-size:15px;line-height:1.65;color:#27272a">${paragraph(body)}</div><div style="margin-top:20px;padding:22px;border:1px solid #e4e4e7;border-radius:16px;background:#ffffff;font-size:13.5px;line-height:1.6"><div style="padding-bottom:12px;margin-bottom:14px;border-bottom:1px solid #f4f4f5"><h2 style="margin:0 0 6px;font-size:15px;font-weight:700;color:#18181b">About your report</h2><p style="margin:0;font-size:12.5px;color:#71717a">${paragraph(context.location)}<br><span style="font-family:monospace;font-size:11px;color:#a1a1aa">Reference: ${escape(context.reportId)}</span></p></div><div style="margin-bottom:16px"><h3 style="margin:0 0 4px;font-size:13px;font-weight:700;color:#27272a">Question as reported</h3><p style="margin:0 0 10px;font-size:12px;color:#71717a">This is the original snapshot. Any corrections are described in the reply above.</p><div style="padding:14px;background:#f9fafb;border:1px solid #f3f4f6;border-radius:10px;font-size:13px;color:#1f2937">${paragraph(context.question)}</div></div><div style="padding-top:12px;border-top:1px solid #f4f4f5"><h3 style="margin:0 0 4px;font-size:13px;font-weight:700;color:#27272a">Your report: ${escape(context.category)}</h3><p style="margin:0;padding:10px 12px;background:#fff1f2;border:1px solid #ffe4e6;border-radius:8px;font-size:13px;color:#9f1239">${paragraph(context.message)}</p></div></div><div style="margin-top:16px;padding:0 4px;text-align:center;font-size:11.5px;color:#a1a1aa">Ain Shams University Faculty of Medicine · ASUCodes</div></div></body></html>`,
  };
}
