/** Shared intake safeguards. Never infer medical answers or erase charge/decimal notation. */
export type QuestionContent = {
 type?: string; text?: string; question?: string; options?: string[];
 correctIndex?: number; correctAnswer?: string; modelAnswer?: string | null;
 explanation?: string; keyConcept?: string; pairs?: {premise:string;target:string}[];
 blanks?: string[]; acceptedAnswers?: string[][]; subQuestions?: QuestionContent[];
};
export function normalizeContent(text:string):string {
 return text.normalize('NFC').toLowerCase().replace(/[–−]/g,'-').replace(/’/g,"'")
  .replace(/[“”]/g,'"').replace(/\s+/g,' ').trim().replace(/[.?:;,]+$/,'').trim();
}
export function resolveAnswerIndex(q:Pick<QuestionContent,'correctIndex'|'correctAnswer'>,options:string[]):number {
 const letter=q.correctAnswer?.trim().toUpperCase();
 const fromLetter=letter && /^[A-Z]$/.test(letter)?letter.charCodeAt(0)-65:undefined;
 const index=q.correctIndex??fromLetter;
 if (!Number.isInteger(index)||index===undefined||index<0||index>=options.length)throw new Error('An explicit integer answer index within the option bounds is required.');
 if(letter && (fromLetter===undefined||fromLetter!==index))throw new Error('Answer letter and answer index conflict.');
 return index;
}
export function contentFingerprint(q:QuestionContent):string {
 const type=q.type??(q.options?.length?'mcq':'essay'),stem=normalizeContent(q.text??q.question??'');
 if(type==='mcq'||type==='truefalse'){
  const options=q.options??(type==='truefalse'?['True','False']:[]);
  const index=resolveAnswerIndex(q,options),values=options.map(normalizeContent);
  const dependent=options.some(v=>/\b(?:both|either|neither|only|options?|choices?|statements?)\s*(?:\(?[a-e]\)?|[1-5])\b|\b[a-e]\s*(?:and|&|\+)\s*[a-e]\b|\b(?:above|below|preceding)\b/i.test(v));
  return JSON.stringify([type,stem,dependent?values:[...values].sort(),values[index]]);
 }
 if(type==='essay')return JSON.stringify([type,stem,normalizeContent(q.modelAnswer??'')]);
 if(type==='case')return JSON.stringify([type,stem,(q.subQuestions??[]).map(contentFingerprint)]);
 if(type==='matching')return JSON.stringify([type,stem,(q.pairs??[]).map(p=>[normalizeContent(p.premise),normalizeContent(p.target)]).sort()]);
 return JSON.stringify([type,stem,q.blanks?.map(normalizeContent),q.acceptedAnswers]);
}
export function questionQualityIssues(q:QuestionContent):string[]{
 const errors:string[]=[];
 const fields=[q.text??q.question??'',q.explanation??'',q.modelAnswer??'',q.keyConcept??'',...(q.options??[]),...(q.blanks??[]),...(q.pairs??[]).flatMap(p=>[p.premise,p.target])];
 for(const text of fields){
  if(typeof text!=='string'){errors.push('Non-text display field.');continue;}
  if(
   /[\u0400-\u04ff\u0e00-\u0eff\u202a-\u202e\ufffd\x00-\x08\x0b\x0c\x0e-\x1f]|\t(?:ext(?:bf|it|rm|sf)?|heta|imes|au)|\r(?:ightarrow|ightleftharpoons|ho)|â€™|â€œ|ï»¿/.test(text) ||
   /\bPULSE\b(?=\s+[A-Z0-9])|Dr\s+Marw[ae]\s+Hamdy|Scanned (?:by|with)|\s[¢¥]\)\s|CamScann|sessss|Ssssuueu|sssusse|BIOCHEMIST[A-Z]{2,}|BIOCHEM(?:ISTRY)?\s+ACADEMY|\bbeh aa\b|IHoinguinal|Liohypogastrie|ner!|raat eee|dene ae|panies of duodenum|naalopens|en aoe|correc se|-—--—--|\b\d{1,2}\s+SM\s+UROGENITAL|\bAllofthe\b|substa"|je aaa\)|dig ng|8ccreta|Restore the original format/.test(text)
  ) errors.push('Corrupt OCR, LaTeX escape, source footer, or directional control in display text.');
  const unescapedDollars=(text.match(/(?<!\\)\$/g)??[]).length;
  if(unescapedDollars%2!==0 && (/\\(?:alpha|beta|gamma|delta|pi|sigma|approx|rightarrow|frac|text|cdot|leq|geq)\b|\$\$/.test(text) || !/\$\d/.test(text))) {
   errors.push('Unbalanced LaTeX/math delimiter ($).');
  }
 }
 if(q.type==='mcq'||q.type==='truefalse'){
  const options=q.options??[];
  const stem=q.text??q.question??'';
  if(options.length<2||options.some(o=>typeof o!=='string'||!o.trim()))errors.push('At least two nonempty options required.');
  if(new Set(options.map(normalizeContent)).size!==options.length)errors.push('Duplicated alternatives.');
  const asksNumeric=/\b(?:how many|number|percent|%|ph\b|specific gravity|osmolar|clearance|gfr|pressure|level|ratio|score|age|years?|weeks?|days?|hours?|minutes?|cm|mm|mg|ml|meq|mmol|grams?|liters?|count|value|how long|how much|weight|temp)\b/i.test(stem);
  for(const opt of options){
   const s=typeof opt==='string'?opt.trim():'';
   if(/^(?:<\.?\s+[A-Za-z]|s,\s)/.test(s))errors.push(`Corrupt option prefix leaked from source/OCR: "${s.slice(0,40)}".`);
   if(!asksNumeric && /^\d{2,4}$/.test(s) && options.length>=3){
    const siblings=options.filter(o=>o!==opt).map(o=>String(o).trim());
    if(siblings.every(sib=>!/\d/.test(sib) && (sib.match(/[a-zA-Z]/g)??[]).length>=6)){
     errors.push(`Suspected stray page-number option "${s}" among text options.`);
    }
   }
  }
  try{resolveAnswerIndex(q,options);}catch(e){errors.push((e as Error).message);}
  if(q.type==='truefalse'&&options.map(normalizeContent).join('|')!=='true|false')errors.push('True/false options must be True then False.');
 }
 for(const child of q.subQuestions??[])errors.push(...questionQualityIssues(child).map(e=>'Child: '+e));
 return errors;
}
