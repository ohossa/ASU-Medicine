/** History answers are indexed by the ORIGINAL order, even after bank withdrawals. */
export function restoreHistoryQuestions<Q extends {id:string|number},A>(
 ids: readonly (string|number)[], available: readonly Q[],
 answers: Record<string|number,A>, flagged: readonly (string|number)[],
): {questions:Q[];answers:Record<number,A>;flags:Set<number>;removedCount:number} {
 const byId=new Map(available.map(q=>[String(q.id),q]));
 const questions:Q[]=[];const restored:Record<number,A>={};const flags=new Set<number>();
 const originalFlags=new Set(flagged.map(Number));
 ids.forEach((id,oldIndex)=>{
  const question=byId.get(String(id));if(!question)return;
  const newIndex=questions.length;questions.push(question);
  if(Object.prototype.hasOwnProperty.call(answers,oldIndex))restored[newIndex]=answers[oldIndex];
  if(originalFlags.has(oldIndex))flags.add(newIndex);
 });
 return {questions,answers:restored,flags,removedCount:ids.length-questions.length};
}

/** Stable IDs keep historical attempts usable after chapter/topic reorganization. */
export function resolveHistoryChapter<
 Q extends {id:string|number},
 S extends {name:string;questions:Q[]},
 C extends {id:number;title:string;subjects:S[]},
>(chapters:readonly C[], chapterId:string|number, title:string|undefined, ids:readonly (string|number)[]|undefined): C|undefined {
 const stored=chapters.find(c=>String(c.id)===String(chapterId));
 if(!ids?.length)return stored;
 const wanted=new Set(ids.map(String));
 const storedIds=new Set(stored?.subjects.flatMap(s=>s.questions.map(q=>String(q.id)))??[]);
 if(stored&&ids.every(id=>storedIds.has(String(id))))return stored;
 const subjects=new Map<string,S>();
 for(const chapter of chapters)for(const subject of chapter.subjects){
  const selected=subject.questions.filter(q=>wanted.has(String(q.id)));
  if(!selected.length)continue;
  const existing=subjects.get(subject.name);
  if(existing)existing.questions.push(...selected);
  else subjects.set(subject.name,{...subject,questions:[...selected]});
 }
 const template=stored??chapters.find(c=>c.subjects.some(s=>s.questions.some(q=>wanted.has(String(q.id)))));
 if(!template||!subjects.size)return undefined;
 return {...template,id:Number(chapterId)||template.id,title:title||template.title,subjects:[...subjects.values()]};
}
