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
 it('relocates an existing question across subjects and chapters with stable ID intact',async()=>{
  const q={id:'MGL3-CH5-PATH-0976',lecture:19,text:'Echinococcus question',type:'mcq',options:['A','B'],correctIndex:1};
  const bank:any={
   'MGL-3':{
    v2Raw:{
     chapters:[
      {id:5,title:'Pathology',subjects:[{id:'pathology',name:'Pathology',questions:[q]}]},
      {id:8,title:'Parasitology',subjects:[{id:'parasitology',name:'Parasitology',questions:[]}]}
     ]
    }
   }
  };
  const baseVersion=await sha256(q);
  const relocateEdit={
   moduleCode:'MGL-3',
   chapterId:5,
   questionId:'MGL3-CH5-PATH-0976',
   targetChapterId:8,
   targetSubjectId:'parasitology',
   baseVersion,
   question:{...q,lecture:2,text:'Relocated Echinococcus question'}
  };
  expect(await applyPublishedEdits(bank,[relocateEdit])).toBe(1);
  // Removed from source chapter 5 pathology
  expect(bank['MGL-3'].v2Raw.chapters[0].subjects[0].questions).toHaveLength(0);
  // Added to destination chapter 8 parasitology
  const destQuestions=bank['MGL-3'].v2Raw.chapters[1].subjects[0].questions;
  expect(destQuestions).toHaveLength(1);
  expect(destQuestions[0].id).toBe('MGL3-CH5-PATH-0976');
  expect(destQuestions[0].lecture).toBe(2);
  expect(destQuestions[0].text).toBe('Relocated Echinococcus question');
  // Revert back on empty edits overlay
  await applyPublishedEdits(bank,[]);
  expect(bank['MGL-3'].v2Raw.chapters[0].subjects[0].questions).toHaveLength(1);
  expect(bank['MGL-3'].v2Raw.chapters[0].subjects[0].questions[0].id).toBe('MGL3-CH5-PATH-0976');
  expect(bank['MGL-3'].v2Raw.chapters[1].subjects[0].questions).toHaveLength(0);
 });
});
