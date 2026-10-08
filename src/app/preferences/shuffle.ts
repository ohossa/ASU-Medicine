/** Fisher–Yates: preserve the canonical data and randomize only a new attempt. */
export function shuffledCopy<T>(questions: readonly T[], random: () => number = () => crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296): T[] {
  const result = [...questions];
  for (let i=result.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [result[i],result[j]]=[result[j],result[i]]; }
  return result;
}
export function restoreQuestionOrder<T extends {id:string|number}>(questions: readonly T[], ids?: readonly (string|number)[]): T[] | null {
  if (!ids || ids.length!==questions.length) return null;
  const map=new Map(questions.map(q=>[String(q.id),q]));
  if(map.size!==questions.length || new Set(ids.map(String)).size!==ids.length || ids.some(id=>!map.has(String(id)))) return null;
  return ids.map(id=>map.get(String(id))!);
}

export function sessionMatchesQuestions(questions: readonly {id:string|number;contentVersion?:string}[], session:{questionIds?: (string|number)[];questionVersions?:string[]}):boolean {
 const ordered=restoreQuestionOrder(questions,session.questionIds);if(!ordered)return false;
 return ordered.every((q,index)=>(q.contentVersion??'source')===(session.questionVersions?.[index]??'source'));
}
