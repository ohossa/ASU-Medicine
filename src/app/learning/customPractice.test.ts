import {describe,it,expect} from 'vitest';
import {practiceTopics,selectedPractice,topicScores,resumeCustomPractice,latestTopicResult} from './customPractice';
import type {ChapterData,Question} from '../types';
const q=(id:string,lecture:number,type:Question['type']='mcq'):Question=>({id,lecture,type,text:id,explanation:'',subjectColor:'anatomy',correctIndex:0});
const chapter:ChapterData={id:1,title:'Anatomy',subtitle:'',emoji:'',page:0,lectureRange:'',accentColor:'anatomy',subjects:[{id:'anatomy',name:'Anatomy',iconName:'Bone',lectures:'',lectureCount:3,lectureNames:['Oral cavity','Palate','Empty'],questions:[q('a',1),q('b',1),q('c',2)]}]};
describe('custom practice',()=>{
 it('uses chapter order, not selection order, keeps IDs and never mutates the bank',()=>{
 const topics=practiceTopics(chapter,'MGL-3');expect(topics.map(t=>t.title)).toEqual(['Oral cavity','Palate','Empty']);
 const run=selectedPractice(chapter,topics,new Set(['c','a']));expect(run.questions.map(q=>q.id)).toEqual(['a','c']);expect(run.questions[0].practiceTopic?.title).toBe('Oral cavity');expect(chapter.subjects[0].questions[0].practiceTopic).toBeUndefined();
 expect(selectedPractice(chapter,topics,new Set(['a','c'])).subject.sessionKey).toBe(run.subject.sessionKey);
 });
 it('scores each original topic after shuffling including false and unanswered choices',()=>{
 const topics=practiceTopics(chapter,'MGL-3');const run=selectedPractice(chapter,topics,new Set(['a','b','c']));
 const shuffled=[run.questions[2],run.questions[0],{...run.questions[1],type:'truefalse' as const,correctIndex:1}];
 expect(topicScores(shuffled,{0:1,1:0,2:false}).map(t=>[t.title,t.correct,t.total])).toEqual([['Palate',0,1],['Oral cavity',2,2]]);
 });
 it('restores a custom subset without adding unselected questions',()=>{
 const topics=practiceTopics(chapter,'MGL-3');const run=selectedPractice(chapter,topics,new Set(['b','c']));
 const saved={subjectName:run.subject.sessionKey!,questionIds:['c','b']};const restored=resumeCustomPractice(chapter,saved,'MGL-3');expect(restored?.questions.map(q=>q.id)).toEqual(['c','b']);expect(restored?.questions[0].practiceTopic?.title).toBe('Palate');expect(restored?.subject.name).toBe('Custom practice · 2 topics');
 expect(resumeCustomPractice(chapter,{...saved,questionIds:['withdrawn']},'MGL-3')).toBeNull();
 });
 it('does not confuse chapter IDs across modules and reads a partial topic score',()=>{
 const scores=topicScores(selectedPractice(chapter,practiceTopics(chapter,'MGL-3'),new Set(['a','c'])).questions,{0:0,1:1});
 const history=[{moduleCode:'OTHER',chapterId:1,subjectName:'Oral cavity',correct:99,total:99},{moduleCode:'MGL-3',chapterId:1,subjectName:'Custom practice',topicResults:scores}];
 expect(latestTopicResult(history as never,1,'Oral cavity','MGL-3')?.correct).toBe(1);
 });
 it('counts case subquestions individually without requiring an all-correct parent',()=>{
 const parent={...q('case',1,'case'),practiceTopic:{key:'oral',title:'Oral cavity',subjectName:'Anatomy'},subQuestions:[{id:'x',type:'mcq' as const,text:'x',options:['yes','no'],correctIndex:0,explanation:''},{id:'y',type:'essay' as const,text:'y',explanation:''}]};
 expect(topicScores([parent],{0:{x:0,y:{selfGrade:'incorrect'}}})[0]).toMatchObject({correct:1,total:2,pct:50});
 });
});
it('retakes refresh keys but retain topic attribution; snapshots and history preserve it',async()=>{
 const {currentPractice}=await import('./currentPractice');const {freezeAttempt,restoreAttempt}=await import('./attemptSnapshot');const {saveQuizResult,getQuizHistory}=await import('../utils/storage');
 const old=selectedPractice(chapter,practiceTopics(chapter,'MGL-3'),new Set(['a','c'])).questions;
 const current=currentPractice(old,[{...q('a',1),correctIndex:1},q('c',2)]);expect(current[0].correctIndex).toBe(1);expect(current[0].practiceTopic?.title).toBe('Oral cavity');
 const snapshot=freezeAttempt(current);expect(restoreAttempt(snapshot)).toEqual(current);
 const before=getQuizHistory().length;const scores=topicScores(current,{0:1,1:0});saveQuizResult({chapterId:1,chapterTitle:'Anatomy',subjectName:'Custom practice · 2 topics',correct:2,total:2,pct:100,elapsedSeconds:5,moduleCode:'MGL-3',topicResults:scores,questionSnapshot:snapshot});
 expect(getQuizHistory()).toHaveLength(before+1);expect(getQuizHistory()[0].topicResults).toEqual(scores);
});
