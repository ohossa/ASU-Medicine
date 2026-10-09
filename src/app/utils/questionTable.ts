/** Only genuine Markdown tables are tables. A stray OCR pipe must not swallow prose. */
export function parseQuestionTable(text:string):{before:string;headers:string[];rows:string[][];after:string}|null{
 const lines=text.split('\n');
 const cells=(line:string)=>line.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(v=>v.trim());
 for(let i=1;i<lines.length;i++){
  if(!lines[i].includes('|'))continue;
  const separator=cells(lines[i]);
  if(separator.length<2||!separator.every(v=>/^:?-{3,}:?$/.test(v)))continue;
  const headers=cells(lines[i-1]);
  if(!lines[i-1].includes('|')||headers.length!==separator.length)continue;
  const rows:string[][]=[];let end=i+1;
  for(;end<lines.length && lines[end].includes('|');end++){
   const row=cells(lines[end]);if(row.length!==headers.length)return null;rows.push(row);
  }
  if(!rows.length)return null;
  return {before:lines.slice(0,i-1).join('\n').trim(),headers,rows,after:lines.slice(end).join('\n').trim()};
 }
 return null;
}
