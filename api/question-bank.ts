import {createQuestionEditService} from '../server/question-edit-service.js';
import {authenticateReportUser} from '../server/report-auth.js';
import {readQuestionBank,listEditableModules} from '../server/question-bank.js';
import {editStore,editedModules} from '../server/question-edit-store.js';
import {ReportError} from '../server/report-service.js';
const service=createQuestionEditService({authenticate:authenticateReportUser,readBank:readQuestionBank,store:editStore});
export default async function handler(req:any,res:any){
 res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 const token=typeof req.headers.authorization==='string'?req.headers.authorization.replace(/^Bearer /,''):'';
 const query=req.query??{};
 try{
  if(req.method==='GET'){
   const moduleCode=String(query.moduleCode??'');
   if(query.action==='published'){
    const modules=moduleCode?[moduleCode]:await editedModules();
    const edits=(await Promise.all(modules.map(async code=>(await service.published(code)).map(edit=>({...edit,moduleCode:code}))))).flat();
    return res.status(200).json({edits});
   }
   if(query.action==='modules'){await service.access(token);return res.status(200).json({modules:await listEditableModules()});}
   if(query.action==='history')return res.status(200).json({history:await service.history(token,moduleCode)});
   const entries=await service.list(token,moduleCode),search=String(query.search??'').toLowerCase().slice(0,200);
   const offset=Number(query.offset??0);if(!Number.isSafeInteger(offset)||offset<0||offset>100000)throw new ReportError(400,'Invalid page.');
   const filtered=entries.filter((e:any)=>!search||[e.question.text,e.question.id,e.subjectName,e.chapterTitle].some(v=>String(v).toLowerCase().includes(search)));
   const bank=await readQuestionBank(moduleCode);
   const chapters=bank.chapters.map((c:any)=>({id:c.id,title:c.title,subjects:c.subjects.map((s:any)=>({id:s.id,name:s.name,lectureCount:s.lectureCount,lectureNames:s.lectureNames}))}));
   return res.status(200).json({questions:filtered.slice(offset,offset+25),total:filtered.length,chapters});
  }
  if(!['PATCH','POST','DELETE'].includes(req.method)){res.setHeader('Allow','GET, PATCH, POST, DELETE');return res.status(405).json({error:'Method not allowed.'});}
  const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body??null);if(Buffer.byteLength(raw)>200000)throw new ReportError(413,'Question is too large.');
  let body;try{body=JSON.parse(raw);}catch{throw new ReportError(400,'Invalid JSON.');}
  const edit=req.method==='POST'?await service.create(token,body):req.method==='DELETE'?await service.remove(token,body):await service.save(token,body);
  return res.status(req.method==='POST'?201:200).json({edit});
 }catch(e){if(e instanceof ReportError)return res.status(e.status).json({error:e.message});console.error('Question bank request failed');return res.status(503).json({error:'Question management is unavailable. Check server configuration and try again.'});}
}
