import {describe,it,expect} from 'vitest';
import {createQuestionEditService} from '../../../server/question-edit-service';
const q={id:'q1',type:'mcq',lecture:1,text:'Original prompt?',options:['One','Two'],correctIndex:0,explanation:''};
function setup(){let record:any=null;const audit:any[]=[];const store={list:async()=>record?[record]:[],save:async(entry:any,revision:number)=>{if((record?.revision??0)!==revision)throw Object.assign(new Error('Conflict'),{status:409});record={...entry,revision:revision+1};audit.push(record);return record;},history:async()=>audit};const deps={authenticate:async(token:string)=>({id:token,isAdmin:token==='owner'}),readBank:async()=>({chapters:[{id:1,title:'Chapter',subjects:[{name:'Anatomy',questions:[q]}]}]}),store};return{service:createQuestionEditService(deps),audit};}
describe('owner question editing',()=>{
 it('denies every student write and private read',async()=>{const {service}=setup();await expect(service.save('student',{})).rejects.toMatchObject({status:403});await expect(service.history('student','MGL-3')).rejects.toMatchObject({status:403});});
 it('validates answers and protects stable IDs and lecture routing',async()=>{const {service}=setup();for(const question of [{...q,correctIndex:4},{...q,id:'another'},{...q,lecture:2}])await expect(service.save('owner',{moduleCode:'MGL-3',chapterId:1,questionId:'q1',revision:0,question})).rejects.toMatchObject({status:400});});
 it('publishes a revision, rejects stale saves and preserves audit/source',async()=>{const {service,audit}=setup();await service.save('owner',{moduleCode:'MGL-3',chapterId:1,questionId:'q1',revision:0,question:{...q,correctIndex:1}});expect((await service.published('MGL-3'))[0].question.correctIndex).toBe(1);expect(audit).toHaveLength(1);expect(q.correctIndex).toBe(0);await expect(service.save('owner',{moduleCode:'MGL-3',chapterId:1,questionId:'q1',revision:0,question:q})).rejects.toMatchObject({status:409});expect(JSON.stringify(await service.published('MGL-3'))).not.toContain('updatedBy');});
 it('allows correcting existing questions with legacy lecture zero without rerouting them',async()=>{
  const legacy={...q,lecture:0};
  const service=createQuestionEditService({authenticate:async()=>({id:'owner',isAdmin:true}),readBank:async()=>({chapters:[{id:1,subjects:[{questions:[legacy]}]}]}),store:{list:async()=>[],history:async()=>[],save:async(edit,revision)=>({...edit,revision:revision+1})}});
  expect((await service.save('owner',{moduleCode:'MCNS-2',chapterId:1,questionId:'q1',revision:0,question:{...legacy,text:'Corrected?'}})).question.lecture).toBe(0);
 });

});
