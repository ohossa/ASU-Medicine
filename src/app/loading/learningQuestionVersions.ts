import {applyPublishedEdits,sha256} from '../lib/publishedEdits';

export interface LearningRawBank {
 meta?:{moduleCode?:string};
 chapters?:Array<{id?:number;subjects?:Array<{id:string;questions:object[]}>}>;
 [key:string]:unknown;
}

/** Overlay application replaces arrays/objects; retain the untouched canonical objects. */
export function captureLearningSourceBank(bank:LearningRawBank):LearningRawBank {
 return {...bank,chapters:bank.chapters?.map(chapter=>({...chapter,subjects:chapter.subjects?.map(subject=>({...subject,questions:[...subject.questions]}))}))};
}

/** The learning API hashes full canonical JSON, not the runtime assessment revision. */
export async function resolveLearningQuestionVersions(source:LearningRawBank,moduleCode:string,chapterId:number,edits:unknown[]):Promise<Map<string,string>> {
 const result=new Map<string,string>();
 if(source.comingSoon||source.meta?.moduleCode!==moduleCode)return result;
 const bank=captureLearningSourceBank(source);
 const original=new WeakSet<object>(bank.chapters?.flatMap(chapter=>chapter.subjects?.flatMap(subject=>subject.questions)??[])??[]);
 // Reuse public-overlay guards, including baseline versions, routing and created-ID collisions.
 await applyPublishedEdits({[moduleCode]:{v2Raw:bank}},edits);
 const chapter=bank.chapters?.find(chapter=>chapter.id===chapterId);
 for(const subject of chapter?.subjects??[])for(const value of subject.questions){
  const question=value as Record<string,unknown>;
  let canonical:unknown=question;
  if(!original.has(question)){
   // applyPublishedEdits adds a runtime contentVersion. Server hashes the edit payload itself.
   const candidates=(edits as Array<{moduleCode:string;chapterId:number;questionId:string;question?:Record<string,unknown>;deleted?:boolean}>).filter(edit=>edit.moduleCode===moduleCode&&edit.chapterId===chapterId&&edit.questionId===String(question.id)&&!edit.deleted&&edit.question);
   let payload:Record<string,unknown>|undefined;
   for(const edit of candidates){
    const version=await sha256(edit.question);
    if(JSON.stringify({...edit.question,contentVersion:version})===JSON.stringify(question)){payload=edit.question;break;}
   }
   if(!payload)continue;
   canonical=payload;
  }
  result.set(String(question.id),await sha256(canonical));
 }
 return result;
}
