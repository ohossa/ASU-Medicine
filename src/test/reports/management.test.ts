import {describe,it,expect} from 'vitest';
import {createQuestionEditService} from '../../../server/question-edit-service';
import {ReportError} from '../../../server/report-service';
const q={id:'original',lecture:1,type:'mcq',text:'Original?',options:['One','Two'],correctIndex:0};
function setup(){const records=new Map<string,any>(),history:any[]=[];const bank={chapters:[{id:1,title:'Anatomy',subjects:[{id:'anatomy',name:'Anatomy',lectureCount:2,questions:[q]}]}]};const store={list:async()=>[...records.values()],history:async()=>history,save:async(e:any,revision:number)=>{if((records.get(e.questionId)?.revision??0)!==revision)throw new ReportError(409,'Conflict');const record={...e,revision:revision+1};records.set(e.questionId,record);history.push(record);return record;}};return{bank,service:createQuestionEditService({authenticate:async t=>({id:t,isAdmin:t==='owner'}),readBank:async()=>bank,store})};}
describe('owner question creation and reversible removal',()=>{
 it('adds a routed question, edits it, removes it and restores it without changing the source',async()=>{
 const {service,bank}=setup();const question={...q,id:'added',text:'New?'};
 await service.create('owner',{moduleCode:'MGL-3',chapterId:1,subjectId:'anatomy',question});
 expect(await service.list('owner','MGL-3')).toHaveLength(2);
 expect((await service.published('MGL-3')).find((e:any)=>e.questionId==='added')).toMatchObject({baseVersion:'created',subjectId:'anatomy'});
 await service.save('owner',{moduleCode:'MGL-3',chapterId:1,questionId:'added',revision:1,question:{...question,correctIndex:1}});
 await service.remove('owner',{moduleCode:'MGL-3',chapterId:1,questionId:'added',revision:2});
 expect((await service.list('owner','MGL-3')).find((e:any)=>e.question.id==='added')?.deleted).toBe(true);
 await service.save('owner',{moduleCode:'MGL-3',chapterId:1,questionId:'added',revision:3,question});
 expect((await service.list('owner','MGL-3')).find((e:any)=>e.question.id==='added')?.deleted).toBe(false);
 expect(bank.chapters[0].subjects[0].questions).toEqual([q]);
 });
 it('blocks students, duplicate IDs, invalid routing and stale removals',async()=>{
 const {service}=setup();const body={moduleCode:'MGL-3',chapterId:1,subjectId:'anatomy',question:{...q,id:'added'}};
 await expect(service.create('student',body)).rejects.toMatchObject({status:403});
 await expect(service.remove('student',{})).rejects.toMatchObject({status:403});
 await expect(service.create('owner',{...body,subjectId:'missing'})).rejects.toMatchObject({status:400});
 await expect(service.create('owner',{...body,question:q})).rejects.toMatchObject({status:409});
 await service.remove('owner',{moduleCode:'MGL-3',chapterId:1,questionId:'original',revision:0});
 await expect(service.remove('owner',{moduleCode:'MGL-3',chapterId:1,questionId:'original',revision:0})).rejects.toMatchObject({status:409});
 });
});
