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
 it('relocates question to another chapter, subject and lecture topic while preserving stable question ID',async()=>{
  let record:any=null;
  const service=createQuestionEditService({
   authenticate:async()=>({id:'owner',isAdmin:true}),
   readBank:async()=>({
    chapters:[
     {id:5,title:'Pathology',subjects:[{id:'pathology',name:'Pathology',lectureCount:22,questions:[q]}]},
     {id:8,title:'Parasitology',subjects:[{id:'parasitology',name:'Parasitology',lectureCount:21,lectureNames:['Liver Flukes','Cestodes'],questions:[]}]}
    ]
   }),
   store:{
    list:async()=>record?[record]:[],
    save:async(edit:any,revision:number)=>{
     record={...edit,revision:revision+1};
     return record;
    },
    history:async()=>[]
   }
  });

  // Cannot relocate to non-existent subject
  await expect(service.save('owner',{
   moduleCode:'MGL-3',
   chapterId:5,
   questionId:'q1',
   targetChapterId:8,
   targetSubjectId:'non-existent',
   revision:0,
   question:{...q,lecture:2}
  })).rejects.toMatchObject({status:400});

  // Cannot exceed lecture count of target subject
  await expect(service.save('owner',{
   moduleCode:'MGL-3',
   chapterId:5,
   questionId:'q1',
   targetChapterId:8,
   targetSubjectId:'parasitology',
   revision:0,
   question:{...q,lecture:25}
  })).rejects.toMatchObject({status:400});

  // Successful relocation
  const saved=await service.save('owner',{
   moduleCode:'MGL-3',
   chapterId:5,
   questionId:'q1',
   targetChapterId:8,
   targetSubjectId:'parasitology',
   revision:0,
   question:{...q,lecture:2,text:'Cestodes liver cyst'}
  });

  expect(saved.questionId).toBe('q1');
  expect(saved.targetChapterId).toBe(8);
  expect(saved.targetSubjectId).toBe('parasitology');
  expect(saved.question.lecture).toBe(2);

  // Check published output
  const published=await service.published('MGL-3');
  expect(published).toHaveLength(1);
  expect(published[0].targetChapterId).toBe(8);
  expect(published[0].targetSubjectId).toBe('parasitology');
  expect(published[0].question.id).toBe('q1');

  // Check list output reflects target location
  const listed=await service.list('owner','MGL-3');
  const found=listed.find((r:any)=>r.question.id==='q1');
  expect(found.chapterId).toBe(8);
  expect(found.chapterTitle).toBe('Parasitology');
  expect(found.subjectId).toBe('parasitology');
  expect(found.subjectName).toBe('Parasitology');
  expect(found.originalChapterId).toBe(5);
 });
});
