import type {QuestionReport,QuestionSnapshot} from '../src/app/reports/contracts.js';
import type {TriageAssessment,TriageView,TriageLabel,EvidenceSource} from '../src/app/reports/triage-contracts.js';
import {TRIAGE_VERSION,groupForTriage,aiSource,assessStructure,targetQuestion,finalPriority,validateCitations,pilotMetrics,type TriageGroup} from './report-triage.js';
import {phaseSchemas,type Phase,triageModel} from './triage-provider.js';
import type {TriageStore} from './triage-store.js';
import {dailyLimit} from './triage-store.js';
import {ReportError} from './report-service.js';
interface ReviewDeps {model:(phase:Phase,input:unknown)=>Promise<unknown>;evidence:(queries:string[])=>Promise<EvidenceSource[]>;current:(r:QuestionReport)=>Promise<QuestionSnapshot>;now?:()=>Date}
export async function reviewGroup(group:TriageGroup,deps:ReviewDeps):Promise<TriageAssessment>{
 const now=deps.now?.()??new Date(),r=group.reports[0],q=targetQuestion(r),structural=assessStructure(q);
 const a:TriageAssessment={key:group.key,fingerprint:group.fingerprint,version:TRIAGE_VERSION,priority:'uncertain',issue:'uncertain',rationale:'Not yet independently reviewed.',action:'Review the original report.',state:'unreviewed',models:[],checkedAt:now.toISOString(),structural,evidence:[],citations:[],independentAnswer:null,unique:null,sourceVersion:r.snapshot.version,attempts:1};
 try{
  const current=await deps.current(r);if(current.version!==r.snapshot.version){a.state='stale';a.rationale='The question changed after this report. Review its original snapshot and current version.';return a;}
  if(JSON.stringify(aiSource(group,false)).length>26000){a.state='complete';a.rationale='This question exceeds the bounded automated-review context. Review it manually.';return a;}
  if(structural.length){a.state='complete';a.priority='decision';a.issue='missing_content';a.rationale=structural.join('. ');a.action='Correct the structural defect in Question studio.';return a;}
  const classification=phaseSchemas.classify.parse(await deps.model('classify',aiSource(group,false)));a.models.push(triageModel('classify'));a.issue=classification.issue;a.rationale=classification.rationale;a.action=classification.action;
  const medical=classification.medical||r.category==='wrong_answer'||r.category==='unclear_wording'||['wrong_key','multiple_answers','no_answer','wording','explanation','uncertain'].includes(classification.issue);
  let supported=!medical;
  if(medical){
   const blind=phaseSchemas.blind.parse(await deps.model('blind',aiSource(group,true)));a.models.push(triageModel('blind'));a.independentAnswer=blind.answerIndex;
   const objective=['mcq','truefalse'].includes(q.type);const applicable=objective&&blind.answerIndex!==null&&blind.answerIndex>=0&&blind.answerIndex<(q.options?.length??0)&&blind.optionReasons.length===(q.options?.length??0);
   a.unique=blind.unique&&(objective?applicable:false);
   if(objective&&!a.unique){a.issue=blind.answerIndex===null?'no_answer':'multiple_answers';}
   a.evidence=await deps.evidence(blind.queries);
   if(a.evidence.length){
    const judged=phaseSchemas.evidence.parse(await deps.model('evidence',{question:aiSource(group,false).question,concern:{issue:classification.issue,category:r.category,notes:aiSource(group,false).notes},independent:blind,sources:a.evidence}));a.models.push(triageModel('evidence'));a.citations=validateCitations(judged.citations,a.evidence);supported=judged.supported&&a.citations.length===judged.citations.length&&a.citations.length>0;
   }
   if(objective&&a.unique&&blind.answerIndex!==q.correctIndex){a.issue='wrong_key';classification.priority='decision';a.rationale=`Independent review selected option ${String.fromCharCode(65+blind.answerIndex!)}; the recorded key differs. ${blind.rationale}`;}
   if(!objective){a.unique=null;supported=false;}
  }
  a.priority=finalPriority({issue:a.issue,priority:classification.priority,medical,unique:a.unique,supported,stale:false,structural});
  // New independent contradictions never route low, regardless of a classifier's suggestion.
  if(medical&&a.issue==='wrong_key'&&a.independentAnswer!==q.correctIndex&&a.unique)a.priority=supported?'decision':'uncertain';
  if(group.reporters>=3&&a.priority==='low')a.priority='uncertain';
  if(medical&&!supported)a.rationale+=' Medical evidence is incomplete; owner review is required.';
  const latest=await deps.current(r);if(latest.version!==r.snapshot.version){a.state='stale';a.priority='uncertain';a.rationale='The question changed during review. This assessment is stale.';}else a.state='complete';
 }catch(error){
  a.state='unreviewed';a.priority='uncertain';a.rationale='AI/evidence review did not complete. The original report is preserved.';
  const retry=typeof(error as {retrySeconds?:number})?.retrySeconds==='number'?(error as {retrySeconds:number}).retrySeconds:300;
  a.retryAt=new Date(now.getTime()+Math.max(60,Math.min(86400,retry))*1000).toISOString();
 }
 return a;
}
interface ServiceDeps {owner:(token:string)=>Promise<{id:string}>;records:()=>Promise<QuestionReport[]>;store:TriageStore;review:(g:TriageGroup)=>Promise<TriageAssessment>;current?:(r:QuestionReport)=>Promise<QuestionSnapshot>}
export function createTriageService(deps:ServiceDeps){
 async function state(){
  const groups=groupForTriage(await deps.records());const assessments=await deps.store.read(groups.map(g=>g.fingerprint));
  if(deps.current){const cache=new Map<string,Promise<QuestionSnapshot>>();for(const g of groups){const a=assessments[g.fingerprint];if(!a)continue;const r=g.reports[0],key=r.snapshot.moduleCode+':'+r.snapshot.chapterId+':'+r.snapshot.question.id;try{let current=cache.get(key);if(!current){current=deps.current(r);cache.set(key,current);}if((await current).version!==a.sourceVersion)assessments[g.fingerprint]={...a,state:'stale',priority:'uncertain'};}catch{assessments[g.fingerprint]={...a,state:'stale',priority:'uncertain'};}}}
  for(const g of groups){const a=assessments[g.fingerprint];if(a&&a.priority==='low'&&g.reporters>=3)assessments[g.fingerprint]={...a,priority:'uncertain',rationale:a.rationale+' Multiple students reported this issue; owner review is required.'};}
  const labels=(await deps.store.labels()).filter(l=>groups.some(g=>g.key===l.key&&g.fingerprint===l.fingerprint)&&assessments[l.fingerprint]?.state==='complete'&&l.assessmentAt===assessments[l.fingerprint]?.checkedAt);
  const metrics=pilotMetrics(labels);const storedMode=await deps.store.mode(),mode=storedMode==='prioritized'&&metrics.ready?'prioritized':'shadow';
  const counts={decision:0,uncertain:0,low:0},lowReportIds:string[]=[];let pending=0;
  for(const g of groups){const a=assessments[g.fingerprint];counts[a?.priority??'uncertain']++;if(!a||a.state==='unreviewed')pending++;if(a?.state==='complete'&&a.priority==='low')lowReportIds.push(...g.reports.map(r=>r.id));}
  const view:TriageView={mode,metrics,assessments:Object.values(assessments),counts,pending,lowReportIds,reportAssessments:Object.fromEntries(groups.flatMap(g=>g.reports.map(r=>[r.id,g.fingerprint]))),labels,config:{provider:Boolean(process.env.GROQ_API_KEY),dailyLimit:dailyLimit()}};
  return {groups,assessments,view};
 }
 return {
  /** Internal use after the report-service owner gate. Never route this directly. */
  async viewInternal(){return (await state()).view;},
  async view(token:string){await deps.owner(token);return (await state()).view;},
  async run(token:string){await deps.owner(token);const lease=await deps.store.lease();if(!lease)return {processed:false,reason:'Another review is in progress.'};
   try{const {groups,assessments}=await state();const now=Date.now();const group=groups.filter(g=>g.reports.some(r=>r.status==='new'||r.status==='reviewing')).sort((a,b)=>b.reporters-a.reporters).find(g=>{const a=assessments[g.fingerprint];return !a||(a.state==='unreviewed'&&(!a.retryAt||Date.parse(a.retryAt)<=now)&&a.attempts<5);});
    if(!group)return {processed:false,reason:'No eligible queued groups. Retry delays or completed reviews are preserved.'};
    const a=await deps.review(group);a.attempts=(assessments[group.fingerprint]?.attempts??0)+1;
    if(!await deps.store.save(a,lease))return {processed:false,reason:'Review lease expired. The group remains recoverable.'};
    return {processed:true,assessment:a};
   }finally{await deps.store.release(lease);}
  },
  async reassess(token:string,key:string){await deps.owner(token);const {groups}=await state();const group=groups.find(g=>g.key===key);if(!group)throw new ReportError(404,'Report group not found.');const lease=await deps.store.lease();if(!lease)throw new ReportError(409,'Another review is running.');try{const a:TriageAssessment={key,fingerprint:group.fingerprint,version:TRIAGE_VERSION,sourceVersion:group.reports[0].snapshot.version,state:'unreviewed',priority:'uncertain',issue:'uncertain',rationale:'Owner requested reassessment.',action:'Await review.',checkedAt:new Date().toISOString(),models:[],structural:[],evidence:[],citations:[],independentAnswer:null,unique:null,attempts:0};await deps.store.save(a,lease);}finally{await deps.store.release(lease);}return {saved:true};},
  async label(token:string,input:{key:string;fingerprint:string;label:TriageLabel['label'];critical:boolean;notes:string}){const owner=await deps.owner(token);const {groups,assessments}=await state();const a=assessments[input.fingerprint];if(!groups.some(g=>g.key===input.key&&g.fingerprint===input.fingerprint)||!a||a.state!=='complete')throw new ReportError(409,'Review changed or is incomplete. Refresh before labelling.');await deps.store.label({...input,priority:a.priority,assessmentAt:a.checkedAt,at:new Date().toISOString(),by:owner.id});return {saved:true};},
  async mode(token:string,value:'shadow'|'prioritized'){await deps.owner(token);if(value==='prioritized'&&!(await state()).view.metrics.ready)throw new ReportError(409,'Complete a current owner-labelled pilot: at least 50 groups, 10 actionable cases and no false low-priority classifications.');await deps.store.mode(value);return {mode:value};},
 };
}
