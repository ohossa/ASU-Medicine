import { readFile,readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { ReportError } from './report-service.js';
export const questionVersion=(q:unknown)=>createHash('sha256').update(JSON.stringify(q)).digest('hex');
const cache=new Map<string,any>();
export async function readQuestionBank(moduleCode:string){
 if(!/^[A-Z0-9]+(?:-[A-Z0-9]+)*-[1-5]$/.test(moduleCode))throw new ReportError(400,'Invalid module.');
 if(cache.has(moduleCode))return cache.get(moduleCode);
 for(const semester of [1,2]){try{const bank=JSON.parse(await readFile(join(process.cwd(),'src/imports',`year-${moduleCode.slice(-1)}`,`semester-${semester}`,`${moduleCode}.json`),'utf8'));if(bank.meta?.moduleCode===moduleCode){cache.set(moduleCode,bank);return bank;}}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}}
 throw new ReportError(404,'Module not found.');
}
export function bankEntries(bank:any){return (bank.chapters??[]).flatMap((chapter:any)=>(chapter.subjects??[]).flatMap((subject:any)=>(subject.questions??[]).map((question:any)=>({chapterId:chapter.id,chapterTitle:chapter.title,subjectId:subject.id,subjectName:subject.name,question}))));}
export async function listEditableModules(){const results:any[]=[];for(let year=1;year<=5;year++)for(let sem=1;sem<=2;sem++){const dir=join(process.cwd(),'src/imports',`year-${year}`,`semester-${sem}`);let files:string[];try{files=await readdir(dir);}catch{continue;}for(const f of files.filter(f=>f.endsWith('.json'))){const bank=JSON.parse(await readFile(join(dir,f),'utf8'));if(bank.meta?.moduleCode&&bankEntries(bank).length)results.push({code:bank.meta.moduleCode,name:bank.meta.moduleName,year,semester:sem,count:bankEntries(bank).length});}}return results;}
