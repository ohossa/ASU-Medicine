import { describe,it,expect } from 'vitest';
import { shuffledCopy, restoreQuestionOrder } from './shuffle';
describe('question shuffle and resume safety',()=>{
 it('shuffles a copy without losing or changing questions',()=>{const q=[{id:1},{id:2},{id:3}];expect(shuffledCopy(q,()=>0).map(x=>x.id)).toEqual([2,3,1]);expect(q.map(x=>x.id)).toEqual([1,2,3]);});
 it('restores saved order and rejects stale or duplicate IDs',()=>{const q=[{id:1},{id:2},{id:3}];expect(restoreQuestionOrder(q,[3,1,2])?.map(x=>x.id)).toEqual([3,1,2]);expect(restoreQuestionOrder(q,[3,1,1])).toBeNull();expect(restoreQuestionOrder(q,[3,1,99])).toBeNull();expect(restoreQuestionOrder(q,[3,1])).toBeNull();});
});
