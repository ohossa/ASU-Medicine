import { describe,it,expect } from 'vitest';
import { restoreHistoryQuestions, resolveHistoryChapter } from './historyQuestions';
describe('history after question withdrawal',()=>{
 it('keeps answers and flags attached to original IDs when the middle question was removed',()=>{
 const a={id:'a'},c={id:'c'};const result=restoreHistoryQuestions(['a','b','c'],[a,c],{0:2,1:1,2:0},[1,2]);
 expect(result.questions).toEqual([a,c]);expect(result.answers).toEqual({0:2,1:0});expect([...result.flags]).toEqual([1]);expect(result.removedCount).toBe(1);
 });
 it('returns no replacement questions if every historical question was withdrawn',()=>{
 expect(restoreHistoryQuestions(['old'],[{id:'new'}],{0:1},[0])).toEqual({questions:[],answers:{},flags:new Set(),removedCount:1});
 });
 it('preserves shuffled historical order and string index flags',()=>{
 const a={id:'a'},b={id:'b'};const r=restoreHistoryQuestions(['b','a'],[a,b],{0:'B',1:'A'},['0']);expect(r.questions).toEqual([b,a]);expect(r.answers).toEqual({0:'B',1:'A'});expect([...r.flags]).toEqual([0]);
 });
});

describe('chapter reorganization',()=>{
 it('reconstructs an old chapter from stable question IDs across the module',()=>{
  const chapters=[{id:101,title:'Proteins',subjects:[{name:'Biochemistry',questions:[{id:'a'}]}]},{id:102,title:'Enzymes',subjects:[{name:'Biochemistry',questions:[{id:'b'}]}]}];
  const chapter=resolveHistoryChapter(chapters,1,'Old mixed chapter',['b','a']);
  expect(chapter?.title).toBe('Old mixed chapter');
  const restored=restoreHistoryQuestions(['b','a'],chapter!.subjects.flatMap(s=>s.questions),{0:1,1:0},[]);
  expect(restored.questions.map(q=>q.id)).toEqual(['b','a']);expect(restored.answers).toEqual({0:1,1:0});
 });
 it('uses the module pool when a retained chapter ID no longer contains its old questions',()=>{
  const chapters=[{id:1,title:'A',subjects:[{name:'Bio',questions:[{id:'a'}]}]},{id:2,title:'B',subjects:[{name:'Bio',questions:[{id:'b'}]}]}];
  expect(resolveHistoryChapter(chapters,1,'Old',['b'])?.subjects.flatMap(s=>s.questions).map(q=>q.id)).toEqual(['b']);
  expect(resolveHistoryChapter(chapters,9,'Gone',['deleted'])).toBeUndefined();
 });
});
