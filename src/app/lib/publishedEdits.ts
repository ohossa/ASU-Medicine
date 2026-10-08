export async function sha256(value:unknown){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(value)));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');}
const baselines=new WeakMap<object,Array<{subject:any;questions:any[]}>>();
/** Rebuild from immutable source arrays on each refresh, then apply the current overlay. */
export async function applyPublishedEdits(databases:Record<string,any>,edits:any[],sourceVersions=new Map<string,string>()){
 for(const db of Object.values(databases)){const bank=db?.v2Raw;if(!bank)continue;if(!baselines.has(bank))baselines.set(bank,(bank.chapters??[]).flatMap((c:any)=>(c.subjects??[]).map((subject:any)=>({subject,questions:[...subject.questions]}))));for(const baseline of baselines.get(bank)!)baseline.subject.questions=[...baseline.questions];}
 let applied=0;
 for(const edit of edits){const bank=databases[edit.moduleCode]?.v2Raw;if(!bank)continue;
 const chapter=bank.chapters?.find((c:any)=>c.id===edit.chapterId);if(!chapter)continue;
 if(edit.baseVersion==='created'){
  const subject=chapter.subjects?.find((s:any)=>s.id===edit.subjectId);
  if(!subject||String(edit.question?.id)!==edit.questionId||bank.chapters.some((c:any)=>c.subjects.some((s:any)=>s.questions.some((q:any)=>String(q.id)===edit.questionId))))continue;
  if(!edit.deleted)subject.questions.push({...edit.question,contentVersion:await sha256(edit.question)});applied++;continue;
 }
 for(const subject of chapter.subjects??[]){const index=subject.questions.findIndex((q:any)=>String(q.id)===edit.questionId);if(index<0)continue;
 const key=`${edit.moduleCode}:${edit.chapterId}:${edit.questionId}`,source=subject.questions[index];
 const version=await sha256(source);sourceVersions.set(key,version);
 if(version!==edit.baseVersion||String(edit.question?.id)!==edit.questionId||edit.question.lecture!==source.lecture)continue;
 if(edit.deleted)subject.questions.splice(index,1);else subject.questions[index]={...edit.question,contentVersion:await sha256(edit.question)};applied++;}
 }return applied;
}
