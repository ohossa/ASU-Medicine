import type {ChapterData,Question,SubjectData,QuizAnswer} from '../types';
import type {QuizResult} from '../utils/storage';
import {checkAnswerCorrect} from '../utils/quiz';
export interface PracticeTopic {key:string;title:string;subjectName:string;questions:Question[]}
export interface TopicScore {key:string;title:string;subjectName:string;correct:number;total:number;pct:number}
export function practiceTopics(chapter:ChapterData,moduleCode=''):PracticeTopic[]{
 return chapter.subjects.flatMap((subject,index)=>{
 const group=(title:string,questions:Question[],suffix:string)=>({key:JSON.stringify([moduleCode,chapter.id,index,suffix]),title,subjectName:subject.name,questions});
 if(subject.lectureNum!==undefined || !subject.lectureNames?.length)return [group(subject.name,subject.questions,'subject')];
 const topics=subject.lectureNames.map((title,i)=>group(title,subject.questions.filter(q=>q.lecture===i+1),String(i+1)));
 const extra=subject.questions.filter(q=>!Number.isInteger(q.lecture)||q.lecture<1||q.lecture>subject.lectureNames!.length);
 if(extra.length)topics.push(group(subject.name+' · Other questions',extra,'other'));
 return topics;
 });
}
export function selectedPractice(chapter:ChapterData,topics:PracticeTopic[],ids:Set<string>){
 const seen=new Set<string>();
 const questions=topics.flatMap(topic=>topic.questions.flatMap(q=>{
 const id=String(q.id);if(!ids.has(id)||seen.has(id))return [];seen.add(id);
 return [{...q,practiceTopic:{key:topic.key,title:topic.title,subjectName:topic.subjectName}}];
 }));
 const count=new Set(questions.map(q=>q.practiceTopic!.key)).size;
 // Compact, deterministic fingerprint; resume also verifies the complete saved ID set.
 const signature=JSON.stringify(questions.map(q=>String(q.id)).sort());
 let hash=0xcbf29ce484222325n;for(const char of signature){hash=BigInt.asUintN(64,(hash^BigInt(char.codePointAt(0)!))*0x100000001b3n);}
 const sessionKey='custom:'+questions.length+':'+hash.toString(16);
 const subject:SubjectData={id:chapter.accentColor,name:`Custom practice · ${count} ${count===1?'topic':'topics'}`,sessionKey,iconName:'ListChecks',lectures:'Selected topics',lectureCount:count,questions};
 return {subject,questions};
}
export function questionScore(q:Question,answer:unknown){
 if((q.type==='case'||q.type==='casestudy')&&q.subQuestions?.length){
 const values=answer && typeof answer==='object'?answer as Record<string,unknown>:{};
 return {correct:q.subQuestions.filter(s=>checkAnswerCorrect(s,values[s.id])).length,total:q.subQuestions.length};
 }
 return {correct:checkAnswerCorrect(q,answer)?1:0,total:1};
}
export function topicScores(questions:Question[],answers:Record<number,QuizAnswer>):TopicScore[]{
 const groups=new Map<string,TopicScore>();
 questions.forEach((q,i)=>{if(!q.practiceTopic)return;const t=q.practiceTopic;
 const score=groups.get(t.key)??{...t,correct:0,total:0,pct:0};const part=questionScore(q,answers[i]);score.correct+=part.correct;score.total+=part.total;score.pct=Math.round(score.correct/score.total*100);groups.set(t.key,score);
 });return [...groups.values()];
}
export function resumeCustomPractice(chapter:ChapterData,saved:{subjectName:string;questionIds?:(string|number)[]},moduleCode=''){
 if(!saved.subjectName.startsWith('custom:')||!saved.questionIds?.length)return null;
 const run=selectedPractice(chapter,practiceTopics(chapter,moduleCode),new Set(saved.questionIds.map(String)));
 const byId=new Map(run.questions.map(q=>[String(q.id),q]));
 if(byId.size!==saved.questionIds.length||run.subject.sessionKey!==saved.subjectName)return null;
 return {...run,questions:saved.questionIds.map(id=>byId.get(String(id))!)};
}
export function latestTopicResult(history:QuizResult[],chapterId:number,title:string,moduleCode?:string){
 for(const result of history){
 if(result.chapterId!==chapterId||(moduleCode&&result.moduleCode!==moduleCode))continue;
 const direct=result.topicResults?.find(t=>t.title===title);
 if(direct)return {...direct,elapsedSeconds:result.elapsedSeconds,isCustom:true};
 const parts=result.topicResults?.filter(t=>t.subjectName===title);
 if(parts?.length){const correct=parts.reduce((n,t)=>n+t.correct,0),total=parts.reduce((n,t)=>n+t.total,0);return {correct,total,pct:Math.round(correct/total*100),elapsedSeconds:result.elapsedSeconds,isCustom:true};}
 if(result.subjectName===title)return result;
 }return null;
}
