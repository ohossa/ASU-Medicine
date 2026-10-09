import {it,expect} from 'vitest';
import {moduleProgress} from '../../app/learning/progress';
import {findContinuation} from '../../app/learning/continuation';
import type {Question,ChapterData} from '../../app/types';
const q={id:'parent/with/slash',type:'mcq',lectureName:'Moved topic',subjectName:'Histology'} as unknown as Question;
it('uses current presentation mapping, full stable IDs and explicit first/ever accuracy',()=>{
 const stats=moduleProgress('M',[q],[{moduleCode:'M',questionId:'parent/with/slash',type:'mcq',correct:false,everCorrect:true,firstCorrect:true,chapterId:1,topic:'Old topic',subject:'Old subject',at:'2026-10-09T00:00:00Z'}]);
 expect(stats).toMatchObject({attempted:1,total:1,accuracy:0,firstAccuracy:100,everCorrect:1});
});
it('resumes only the owning account’s newest unfinished draft in its actual module',()=>{
 localStorage.clear();const chapters=[{id:1,title:'Chapter',subjects:[{id:'s',name:'Subject',questions:[q]}]}] as unknown as ChapterData[];
 localStorage.setItem('asu_quiz_session:bob:1:Subject',JSON.stringify({questionIds:[q.id],timestamp:30,current:0,finished:false}));
 localStorage.setItem('asu_quiz_session:alice:1:Subject',JSON.stringify({questionIds:[q.id],timestamp:20,current:0,finished:false}));
 expect(findContinuation('alice',[{code:'M',chapters}],localStorage)?.moduleCode).toBe('M');
 expect(findContinuation('charlie',[{code:'M',chapters}],localStorage)).toBeNull();
});
import {continuationQuestions} from '../../app/learning/continuation';
import {freezeAttempt,restoreAttempt} from '../../app/learning/attemptSnapshot';
it('restores a subset subject draft in exact saved order and refuses changed keys',()=>{
 const chapter={subjects:[{questions:[{id:'a',text:'A',contentVersion:'1'},{id:'b',text:'B',contentVersion:'2'}]}]} as unknown as ChapterData;
 const draft={questionIds:['b'],questionVersions:['2']} as import('../../app/hooks/useQuizSession').QuizSessionSave;
 expect(continuationQuestions(chapter,draft)?.map(q=>q.id)).toEqual(['b']);expect(continuationQuestions(chapter,{...draft,questionVersions:['old']})).toBeNull();
});
it('preserves historical key and text after current bank edits',()=>{
 const old={id:'q',text:'Original',type:'mcq',options:['A','B'],correctIndex:0} as Question;const saved=freezeAttempt([old]);old.correctIndex=1;old.text='Updated';expect(restoreAttempt(saved)?.[0]).toMatchObject({text:'Original',correctIndex:0});expect(restoreAttempt('broken')).toBeNull();
});
import {currentPractice} from '../../app/learning/currentPractice';
it('new retries use current keys and omit retired questions, never replaying frozen keys',()=>{
 const old=[{id:'q',correctIndex:0},{id:'retired',correctIndex:0}] as Question[];const current=[{id:'q',correctIndex:1}] as Question[];
 expect(currentPractice(old,current)).toEqual(current);expect(old[0].correctIndex).toBe(0);
});
