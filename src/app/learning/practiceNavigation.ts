import type {ChapterData,Question} from '../types';
import {asEssayAnswer,asFillBlankAnswer,asMatchingAnswer} from '../types';
import type {LearningEntry} from './contracts';
import type {QuizResult} from '../utils/storage';
import type {QuizSessionSave} from '../hooks/useQuizSession';
import {committedAnswer} from './committedAnswer';
import {restoreAttempt} from './attemptSnapshot';
import {practiceTopics,selectedPractice,type PracticeTopic} from './customPractice';
import {sessionMatchesQuestions} from '../preferences/shuffle';

const branchNames:Record<string,string>={physiology:'Physiology',biochem:'Biochemistry',biochemistry:'Biochemistry',pathology:'Pathology',pharma:'Pharmacology',pharmacology:'Pharmacology',microbiology:'Microbiology',parasitology:'Parasitology',histology:'Histology',anatomy:'Anatomy',clinical:'Clinical',psychiatry:'Psychiatry',ophthalmology:'Ophthalmology',ent:'ENT'};
export function subjectBranches(chapter:ChapterData,moduleCode?:string){
 if(!new Set(['MBL-2','MEM-2','MCVS-2','MCNS-2','MSS-2','MRS-2']).has(moduleCode??''))return [];
 if(moduleCode==='MSS-2'&&chapter.id!==9&&chapter.bankSection!=='past-exams')return [];
 const topics=practiceTopics(chapter,moduleCode);const ids=[...new Set(chapter.subjects.filter(s=>s.questions.length>0).map(s=>s.id))];
 if(ids.length<2||!ids.every(id=>branchNames[id]))return [];
 return ids.map(id=>({id,title:branchNames[id],topics:topics.filter(t=>chapter.subjects[t.subjectIndex!].id===id)}));
}
export function questionCountLabel(count:number,ar=false){return `${count} ${ar?(count===1?'سؤال':count===2?'سؤالان':count>=3&&count<=10?'أسئلة':'سؤالاً'):(count===1?'question':'questions')}`;}
export function topicCountLabel(count:number,ar=false){return `${count} ${ar?'موضوعات':count===1?'topic':'topics'}`;}
function answered(q:Question,value:unknown){
 if(value===undefined||value===null)return false;
 switch(q.type){
 case 'essay':return typeof value==='string'?value.trim().length>0:asEssayAnswer(value)?.selfGrade!==undefined;
 case 'fillblank':return asFillBlankAnswer(value)?.submitted===true;
 case 'matching':return asMatchingAnswer(value)?.submitted===true;
 case 'case':case 'casestudy':return committedAnswer(q,value);
 case 'truefalse':return typeof value==='boolean'||value===0||value===1;
 default:return typeof value==='number'&&Number.isInteger(value)&&value>=0&&value<(q.options?.length??0);
 }
}
/** Current-version parent IDs only; incorrect answers still count as practised. */
export function attemptedPracticeIds(moduleCode:string,chapter:ChapterData,history:QuizResult[],entries:LearningEntry[],learningVersions?:Map<string,string>){
 const current=new Map(chapter.subjects.flatMap(s=>s.questions).map(q=>[String(q.id),q]));const ids=new Set<string>();
 for(const e of entries){
  if(e.moduleCode!==moduleCode||e.chapterId!==chapter.id)continue;
  const id=current.has(e.questionId)?e.questionId:[...current.keys()].sort((a,b)=>b.length-a.length).find(id=>e.questionId.startsWith(id+'/')); const q=id?current.get(id):undefined;
  if(q&&(e.contentVersion??'source')===(learningVersions?.get(String(q.id))??q.contentVersion??'source'))ids.add(String(q.id));
 }
 for(const result of history){
  if(result.moduleCode!==moduleCode||result.chapterId!==chapter.id||!result.questionIds||!result.answers)continue;
  const versions=new Map((restoreAttempt(result.questionSnapshot)??[]).map(q=>[String(q.id),q.contentVersion??'source']));
  result.questionIds.forEach((id,index)=>{const q=current.get(String(id));if(q&&(versions.get(String(id))??'source')===(q.contentVersion??'source')&&answered(q,result.answers![index]))ids.add(String(id));});
 }
 return ids;
}
/** Stable chunks keep resume fingerprints valid as answers/progress arrive. */
export function topicPracticeBatch(chapter:ChapterData,topic:PracticeTopic,size:20|40|'all',attempted:Set<string>,load:(key:string)=>QuizSessionSave|null){
 const topics=[topic];
 if(size==='all')return selectedPractice(chapter,topics,new Set(topic.questions.map(q=>String(q.id))));
 const batches:Array<ReturnType<typeof selectedPractice>>=[];
 for(let i=0;i<topic.questions.length;i+=size)batches.push(selectedPractice(chapter,topics,new Set(topic.questions.slice(i,i+size).map(q=>String(q.id)))));
 const unfinished=batches.map(run=>({run,saved:load(run.subject.sessionKey!)})).filter(({run,saved})=>saved&&!saved.finished&&sessionMatchesQuestions(run.questions,saved)).sort((a,b)=>(b.saved!.timestamp??0)-(a.saved!.timestamp??0));
 return unfinished[0]?.run??batches.find(run=>run.questions.some(q=>!attempted.has(String(q.id))))??batches[0];
}
