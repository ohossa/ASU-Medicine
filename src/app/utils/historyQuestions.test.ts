import { describe,it,expect } from 'vitest';
import { restoreHistoryQuestions } from './historyQuestions';
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
