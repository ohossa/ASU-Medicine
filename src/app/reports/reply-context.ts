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
 return ['About your report',c.location,`Reference: ${c.reportId}`,'Question as reported', 'This is the original snapshot. Any corrections are described in the reply above.',c.question,`Your report: ${c.category}`,c.message].join('\n\n');
}
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const paragraph=(s:string)=>escape(s).replace(/\n/g,'<br>');
/** Freeze these exact rendered payloads in the outbox before contacting the provider. */
export function renderReplyEmail(body:string, context:ReplyContext): {text:string;html:string} {
 return {text:`${body}\n\n---\n\n${replyContextText(context)}`,html:`<!doctype html><html><body style="margin:0;padding:24px;background:#f5f6f8;color:#20232a;font-family:Arial,sans-serif"><div style="max-width:600px;margin:0 auto;overflow-wrap:anywhere;word-break:break-word"><div style="padding:24px;background:#fff;border-radius:12px;font-size:16px;line-height:1.6">${paragraph(body)}</div><div style="margin-top:20px;padding:20px;border:1px solid #dce1e8;border-radius:12px;background:#fff;font-size:13px;line-height:1.6"><h2 style="margin:0 0 8px;font-size:16px">About your report</h2><p>${paragraph(context.location)}<br>Reference: ${escape(context.reportId)}</p><h3 style="font-size:14px">Question as reported</h3><p style="color:#626773">This is the original snapshot. Any corrections are described in the reply above.</p><p>${paragraph(context.question)}</p><h3 style="font-size:14px">Your report: ${escape(context.category)}</h3><p>${paragraph(context.message)}</p></div></div></body></html>`};
}
