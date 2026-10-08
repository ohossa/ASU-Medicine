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
