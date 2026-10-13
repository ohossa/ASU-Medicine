import {it,expect,beforeAll} from 'vitest';
import {attemptedPracticeIds,subjectBranches,topicPracticeBatch} from './practiceNavigation';
import {freezeAttempt} from './attemptSnapshot';
import {practiceTopics,selectedPractice} from './customPractice';
import type {ChapterData,Question} from '../types';
import type {QuizResult} from '../utils/storage';
import {ensureDataLoaded,getChaptersForModuleAndMode} from '../data';
const q=(id:string):Question=>({id,type:'mcq',text:id,options:['a','b'],correctIndex:0,explanation:'',lecture:1,subjectColor:'histology',contentVersion:'v1'});
const chapter=(questions:Question[]):ChapterData=>({id:1,title:'Cell',subtitle:'',emoji:'',page:0,accentColor:'histology',lectureRange:'',subjects:[{id:'histology',name:'Histology',iconName:'Microscope',lectures:'',lectureCount:1,lectureNames:['Membranes'],questions}]});
it('case typing drafts remain unpractised until a child answer is committed',()=>{
 const c={...q('case'),type:'case' as const,subQuestions:[{id:'essay',type:'essay' as const,text:'Essay',explanation:''},{id:'mcq',type:'mcq' as const,text:'MCQ',options:['a','b'],correctIndex:0,explanation:''}]};
 const result={id:'h',chapterId:1,moduleCode:'IHC-1',questionIds:['case'],questionSnapshot:freezeAttempt([c]),answers:{0:{essay:{text:'typing draft'}}},pct:0} as unknown as QuizResult;
 expect(attemptedPracticeIds('IHC-1',chapter([c]),[result],[]).size).toBe(0);
 result.answers={0:{mcq:0}};expect([...attemptedPracticeIds('IHC-1',chapter([c]),[result],[])]).toEqual(['case']);
});
it('0/false count, but stale versions and another module/chapter do not',()=>{
 const qs=[q('a'),{...q('b'),type:'truefalse' as const},q('c')];
 const result={id:'h',chapterId:1,moduleCode:'IHC-1',questionIds:['a','b','c'],questionSnapshot:freezeAttempt([qs[0],qs[1],{...qs[2],contentVersion:'old'}]),answers:{0:0,1:false,2:0},pct:0} as unknown as QuizResult;
 expect([...attemptedPracticeIds('IHC-1',chapter(qs),[result],[])]).toEqual(['a','b']);
 expect(attemptedPracticeIds('OTHER',chapter(qs),[result],[]).size).toBe(0);
 expect(attemptedPracticeIds('IHC-1',{...chapter(qs),id:2},[result],[]).size).toBe(0);
});
it('last batch is smaller, exhaustion permits review, and a changed draft cannot override the next batch',()=>{
 const qs=Array.from({length:45},(_,i)=>q(String(i)));const ch=chapter(qs);const topic=practiceTopics(ch,'IHC-1')[0];const attempted=new Set(qs.slice(0,40).map(q=>String(q.id)));
 expect(topicPracticeBatch(ch,topic,20,attempted,()=>null).questions.map(q=>q.id)).toEqual(qs.slice(40).map(q=>q.id));
 const first=selectedPractice(ch,[topic],new Set(qs.slice(0,20).map(q=>String(q.id))));
 const stale={questionIds:first.questions.map(q=>q.id),questionVersions:first.questions.map(()=> 'old'),finished:false,timestamp:9};
 expect(topicPracticeBatch(ch,topic,20,attempted,key=>key===first.subject.sessionKey?stale as never:null).questions).toHaveLength(5);
 expect(topicPracticeBatch(ch,topic,20,new Set(qs.map(q=>String(q.id))),()=>null).questions).toHaveLength(20);
 expect(topicPracticeBatch(ch,topic,'all',attempted,()=>null).questions).toHaveLength(45);
});
beforeAll(async()=>{await ensureDataLoaded();});
it('actual Blood and Endocrine chapters split branches; existing GIT/MINF/Histology and MSS subject cards remain direct',()=>{
 for(const code of ['MBL-2','MEM-2']){const cs=getChaptersForModuleAndMode(code,'mixed');expect(subjectBranches(cs[0],code).length).toBeGreaterThan(1);}
 for(const code of ['MGL-3','MINF-1','IHC-1'])for(const c of getChaptersForModuleAndMode(code,'mixed'))expect(subjectBranches(c,code)).toEqual([]);
 for(const c of getChaptersForModuleAndMode('MSS-2','mixed').filter(c=>c.id!==9))expect(subjectBranches(c,'MSS-2')).toEqual([]);
 const c=getChaptersForModuleAndMode('MBL-2','mixed')[0];const groups=subjectBranches(c,'MBL-2');
 expect(groups.flatMap(g=>g.topics).map(t=>t.key).sort()).toEqual(practiceTopics(c,'MBL-2').map(t=>t.key).sort());
});

it('cloud server hashes use canonical learning versions instead of browser attempt hashes',()=>{
 const ch=chapter([q('a')]);const entry={moduleCode:'IHC-1',chapterId:1,questionId:'a',contentVersion:'server-full-v1',topic:'Membranes',subject:'Histology',type:'mcq',correct:true,everCorrect:true,at:'2026-10-12'};
 expect([...attemptedPracticeIds('IHC-1',ch,[],[entry],new Map([['a','server-full-v1']]))]).toEqual(['a']);
 expect(attemptedPracticeIds('IHC-1',ch,[],[entry],new Map([['a','server-full-v2']])).size).toBe(0);
});
