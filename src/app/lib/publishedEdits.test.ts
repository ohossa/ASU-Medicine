import {describe,it,expect} from 'vitest';
import {applyPublishedEdits,sha256} from './publishedEdits';
import {sessionMatchesQuestions} from '../preferences/shuffle';
describe('published corrections',()=>{
 it('applies only matching source revisions, restores later edits, and leaves other chapters intact',async()=>{const q={id:'q1',lecture:1,text:'Original',type:'essay',modelAnswer:'A'};const bank={MGL:{v2Raw:{chapters:[{id:1,subjects:[{questions:[q]}]}]}}};const versions=new Map<string,string>(),baseVersion=await sha256(q);const edit={moduleCode:'MGL',chapterId:1,questionId:'q1',baseVersion,question:{...q,modelAnswer:'B'}};expect(await applyPublishedEdits(bank,[edit],versions)).toBe(1);expect(bank.MGL.v2Raw.chapters[0].subjects[0].questions[0].modelAnswer).toBe('B');expect(await applyPublishedEdits(bank,[{...edit,question:q}],versions)).toBe(1);expect(await applyPublishedEdits(bank,[{...edit,baseVersion:'stale'}],versions)).toBe(0);});
 it('never resumes index-based answers against a changed correction',()=>{const q=[{id:'q1',contentVersion:'v2'}];expect(sessionMatchesQuestions(q,{questionIds:['q1'],questionVersions:['v1']})).toBe(false);expect(sessionMatchesQuestions(q,{questionIds:['q1'],questionVersions:['v2']})).toBe(true);});
 it('publishes additions and removals, then restores deleted source questions without duplication',async()=>{
  const q={id:'source',lecture:1,text:'Source',type:'mcq',options:['A','B'],correctIndex:0};
  const bank:any={MGL:{v2Raw:{chapters:[{id:1,subjects:[{id:'anatomy',questions:[q]}]}]}}};
  const addition={moduleCode:'MGL',chapterId:1,questionId:'new',subjectId:'anatomy',baseVersion:'created',question:{...q,id:'new'}};
  const deletion={moduleCode:'MGL',chapterId:1,questionId:'source',baseVersion:await sha256(q),deleted:true,question:q};
  await applyPublishedEdits(bank,[addition,deletion]);
  expect(bank.MGL.v2Raw.chapters[0].subjects[0].questions.map((q:any)=>q.id)).toEqual(['new']);
  await applyPublishedEdits(bank,[addition,{...deletion,deleted:false}]);
  expect(bank.MGL.v2Raw.chapters[0].subjects[0].questions.map((q:any)=>q.id)).toEqual(['source','new']);
  await applyPublishedEdits(bank,[]);
  expect(bank.MGL.v2Raw.chapters[0].subjects[0].questions).toEqual([q]);
 });

});
