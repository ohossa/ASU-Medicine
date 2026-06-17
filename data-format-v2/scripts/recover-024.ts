import { readFileSync, writeFileSync } from 'node:fs';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const raw = readFileSync(`${dir}/raw_chunk_024.txt`, 'utf-8').replace(/\r\n/g, '\n');
const idx = raw.indexOf('Below are all questions');
const rest = raw.substring(idx);
const pieces = rest.split(/\n---\s*\n/).slice(1);
const blocks: string[] = [];

for (const piece of pieces) {
  const trimmed = piece.trim();
  if (!trimmed.startsWith('**')) continue;

  const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
  let text = '';
  const options: string[] = [];
  let answer = 'N/A';
  let explanation = 'N/A';

  for (const line of lines) {
    if (line.match(/^\*\*\d+/)) {
      text = line.replace(/\*\*\d+\)\*\*\s*/, '').trim();
      continue;
    }
    if (line.match(/Correct Answer:/i)) {
      const m = line.match(/Correct Answer:\s*([A-E])/i);
      if (m) answer = m[1];
      continue;
    }
    if (line.startsWith('*Explanation:')) {
      explanation = line.replace('*Explanation:', '').trim();
      if (explanation.endsWith('*')) explanation = explanation.slice(0, -1).trim();
      continue;
    }
    if (line.match(/^[A-E]\.\s+/)) {
      const opt = line.replace(/^[A-E]\.\s*/, '');
      options.push(`${line[0].toUpperCase()}) ${opt}`);
    }
  }

  if (text && options.length >= 2) {
    blocks.push(`QUESTION_TYPE: mcq\nSUBJECT: Pharmacology\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${text}\n\nOPTIONS:\n${options.join('\n')}\n\nANSWER: ${answer}\n\nEXPLANATION:\n${explanation}\n\nKEY_CONCEPT:\nN/A`);
  }
}

console.log('Extracted', blocks.length, 'blocks');
if (blocks.length > 0) {
  const existing = readFileSync(`${dir}/chunk_024.txt`, 'utf-8');
  const combined = existing.trim() + '\n\n---\n' + blocks.join('\n\n---\n') + '\n';
  writeFileSync(`${dir}/chunk_024.txt`, combined, 'utf-8');
  console.log('Wrote', blocks.length, 'blocks to chunk_024.txt');
}
