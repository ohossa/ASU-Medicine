import {createHash} from 'node:crypto';
import type {QuestionReport,QuestionSnapshot} from '../src/app/reports/contracts.js';
import type {EvidenceSource,EvidenceCitation,TriagePriority,TriageMetrics} from '../src/app/reports/triage-contracts.js';
export const TRIAGE_VERSION='triage-2';
export const hash=(v:unknown)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
export interface TriageGroup {key:string;fingerprint:string;reports:QuestionReport[];reporters:number}
export function groupForTriage(records:QuestionReport[]):TriageGroup[]{
 const groups=new Map<string,QuestionReport[]>();
 for(const r of new Map(records.map(r=>[r.id,r])).values()){
  const key=hash([r.snapshot.moduleCode,String(r.snapshot.question.id),r.snapshot.version,r.subQuestionId??'',r.category]);
  groups.set(key,[...(groups.get(key)??[]),r]);
 }
 return [...groups].map(([key,reports])=>({key,reports,reporters:new Set(reports.map(r=>r.reporterId)).size,fingerprint:hash([TRIAGE_VERSION,key,[...new Set(reports.map(r=>r.explanation.trim()))].sort()])}));
}
export function targetQuestion(r:QuestionReport):QuestionSnapshot['question']{
 if(!r.subQuestionId)return r.snapshot.question;
 return (r.snapshot.question.subQuestions as QuestionSnapshot['question'][]|undefined)?.find(q=>String(q.id)===r.subQuestionId)??{id:r.subQuestionId,type:'missing',text:''};
}
export function redact(text:string,records:QuestionReport[]):string{
 let t=text;
 for(const r of records)for(const s of [r.reporterId,r.reporter?.name,r.reporter?.username,r.reporter?.email])if(s&&s.length>=3)t=t.replace(new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'),'[private]');
 return t.replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi,'[email]').replace(/\buser_[A-Za-z0-9]+\b/g,'[account]').replace(/(?:\+?\d[\d ()-]{8,}\d)/g,'[phone]').slice(0,1200);
}
/** Projection allowlist excludes reporter identities, historical key and hints in blind mode. */
export function aiSource(g:TriageGroup,blind:boolean){
 const q=targetQuestion(g.reports[0]);
 const question={...(g.reports[0].subQuestionId?{caseStem:g.reports[0].snapshot.question.text??g.reports[0].snapshot.question.question??''}:{}),type:q.type,text:q.text??q.question??'',options:q.options??[],...(blind?{}:{correctIndex:q.correctIndex,modelAnswer:q.modelAnswer,explanation:q.explanation})};
 return blind?{question}:{question,category:g.reports[0].category,notes:[...new Set(g.reports.map(r=>redact(r.explanation,g.reports)))].slice(0,8)};
}
export function assessStructure(q:QuestionSnapshot['question']):string[]{
 const issues:string[]=[];
 if(!(q.text??q.question??'').trim())issues.push('Missing question prompt');
 if(['mcq','truefalse'].includes(q.type)){
  const options=q.options??[];
  if(options.length<2||options.some(o=>typeof o!=='string'||!o.trim()))issues.push('Missing answer options');
  if(new Set(options.map(o=>String(o).trim().toLowerCase())).size!==options.length)issues.push('Duplicate answer options');
  if(!Number.isInteger(q.correctIndex)||q.correctIndex!<0||q.correctIndex!>=options.length)issues.push('Answer key outside option range');
 }
 if(q.type==='essay'&&!(q.modelAnswer??'').trim())issues.push('Missing model answer');
 if(q.type==='case'&&(!Array.isArray(q.subQuestions)||q.subQuestions.length===0))issues.push('Missing case parts');
 return issues;
}
export function finalPriority(i:{issue:string;priority:string;medical:boolean;unique:boolean|null;supported:boolean;stale:boolean;structural:string[]}):TriagePriority{
 if(i.stale)return 'uncertain';
 if(i.structural.length||['multiple_answers','no_answer'].includes(i.issue)||i.unique===false)return 'decision';
 if(i.medical&&!i.supported)return 'uncertain';
 if(i.issue==='wrong_key'&&i.priority!=='low')return 'decision';
 return i.priority==='low'?'low':i.priority==='decision'?'decision':'uncertain';
}
const normal=(s:string)=>s.replace(/\s+/g,' ').trim();
export function validateCitations(raw:EvidenceCitation[],sources:EvidenceSource[]):EvidenceCitation[]{
 return raw.filter(c=>typeof c.quote==='string'&&c.quote.length>=30&&c.quote.length<=600&&typeof c.claim==='string'&&Boolean(c.claim.trim())&&sources.some(s=>s.id===c.sourceId&&normal(s.text).includes(normal(c.quote))));
}
export function pilotMetrics(rows:Array<{key:string;label:string;priority:string;critical:boolean}>):TriageMetrics{
 const unique=[...new Map(rows.map(r=>[r.key,r])).values()],actionable=unique.filter(r=>r.label==='actionable'),falseLow=unique.filter(r=>r.priority==='low'&&r.label!=='low').length,criticalMisses=unique.filter(r=>r.critical&&r.priority==='low').length;
 const recall=actionable.length?(actionable.filter(r=>r.priority!=='low').length/actionable.length):null;
 return {labelled:unique.length,actionable:actionable.length,falseLow,criticalMisses,recall,ready:unique.length>=50&&actionable.length>=10&&criticalMisses===0&&falseLow===0&&recall!==null&&recall>=.95};
}
