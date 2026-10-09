import {expect,it} from 'vitest';
import {moduleProgress} from '../../app/learning/progress';
import {scopeHistory,calendarActivity} from '../../app/learning/facts';
import type {Question} from '../../app/types';
import type {LearningEntry} from '../../app/learning/contracts';
import type {QuizResult} from '../../app/utils/storage';
const entry={moduleCode:'MGL-3',chapterId:1,questionId:'q',topic:'Stomach',subject:'Anatomy',correct:false,everCorrect:true,at:'2026-10-08T10:00:00Z',type:'mcq'} satisfies LearningEntry;
it('uses latest unique parts, excludes retired IDs, and keeps essays out of accuracy',()=>{
 const questions=[{id:'q',type:'mcq'},{id:'e',type:'essay'}] as Question[];
 const p=moduleProgress('MGL-3',questions,[entry,{...entry,correct:true,at:'2026-10-07T10:00:00Z'},{...entry,questionId:'e',type:'essay',correct:true},{...entry,questionId:'retired'}]);
 expect(p).toMatchObject({attempted:2,total:2,accuracy:0});expect(p.missed).toHaveLength(1);
});
it('never guesses a legacy module and scopes historical sessions to the catalog year',()=>{
 const rows=[{id:'1',moduleCode:'MGL-3'},{id:'2',moduleCode:'MEM-2'},{id:'3'}] as QuizResult[];
 expect(scopeHistory(rows,3,{'MGL-3':{year:3,semester:1},'MEM-2':{year:2,semester:2}})).toMatchObject({sessions:[{id:'1'}],unclassified:[{id:'3'}]});
});
it('groups seven calendar dates in Cairo, deduplicates session IDs and excludes invalid dates',()=>{
 const rows=[{id:'1',date:'2026-10-08T23:30:00Z',elapsedSeconds:60},{id:'1',date:'2026-10-08T23:30:00Z',elapsedSeconds:60},{id:'2',date:'bad'}] as QuizResult[];
 const days=calendarActivity(rows,new Date('2026-10-09T12:00:00Z'));
 expect(days).toHaveLength(7);expect(days.at(-1)).toMatchObject({date:'2026-10-09',sessions:1,seconds:60});
});
