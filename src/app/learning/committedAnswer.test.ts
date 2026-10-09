import { expect,it } from 'vitest';
import { committedAnswer, committedAnswerValue } from './committedAnswer';
it('submits objective answers including false, but not ungraded essay drafts',()=>{
 expect(committedAnswer({type:'truefalse'},false)).toBe(true);
 expect(committedAnswer({type:'mcq'},0)).toBe(true);
 expect(committedAnswer({type:'essay'},{text:'draft'})).toBe(false);
 expect(committedAnswer({type:'essay'},{text:'answer',selfGrade:'correct'})).toBe(true);
 expect(committedAnswer({type:'matching'},{submitted:false})).toBe(false);
 expect(committedAnswer({type:'matching'},{submitted:true})).toBe(true);
});
it('submits a committed case child without waiting for all siblings',()=>{
 const q={type:'case',subQuestions:[{id:'a',type:'truefalse'},{id:'b',type:'essay'}]};
 expect(committedAnswer(q,{a:false})).toBe(true);
 expect(committedAnswer(q,{b:{text:'draft'}})).toBe(false);
 expect(committedAnswer(q,undefined)).toBe(false);
 expect(committedAnswerValue(q,{a:false,b:{text:'typing'}})).toEqual({a:false});
});
