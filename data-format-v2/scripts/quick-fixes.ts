import { readFileSync, writeFileSync } from 'node:fs';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';

// ── Fix chunk_052: remove empty E) option ─────────────────────
let text = readFileSync(`${dir}/chunk_052.txt`, 'utf-8');
text = text.replace(/\nE\)\s*\n/g, '\n');
writeFileSync(`${dir}/chunk_052.txt`, text, 'utf-8');
console.log('Fixed chunk_052 empty E) option');

// ── Fix chunk_038: truefalse ANSWER A -> True ─────────────────
text = readFileSync(`${dir}/chunk_038.txt`, 'utf-8');
text = text.replace(
  /OPTIONS:\nA\) True\nB\) False\nANSWER: A/g,
  'OPTIONS:\nA) True\nB) False\nANSWER: True'
);
writeFileSync(`${dir}/chunk_038.txt`, text, 'utf-8');
console.log('Fixed chunk_038 truefalse answers');

// ── Fix chunk_039: truefalse ANSWER A -> True ─────────────────
text = readFileSync(`${dir}/chunk_039.txt`, 'utf-8');
text = text.replace(
  /OPTIONS:\nA\) True\nB\) False\nANSWER: A/g,
  'OPTIONS:\nA) True\nB) False\nANSWER: True'
);
writeFileSync(`${dir}/chunk_039.txt`, text, 'utf-8');
console.log('Fixed chunk_039 truefalse answer');

// ── Fix chunk_075: truefalse block -> mcq (options are not True/False)
text = readFileSync(`${dir}/chunk_075.txt`, 'utf-8');
const blocks = text.split(/\n---\s*\n/);
let fixed075 = false;
for (let i = 0; i < blocks.length; i++) {
  const b = blocks[i];
  if (b.includes('Muscle paralysis in case of poliomyelitis is due to:')) {
    blocks[i] = b.replace(/QUESTION_TYPE:\s*truefalse/, 'QUESTION_TYPE: mcq');
    console.log('Fixed chunk_075 block', i + 1, '-> mcq');
    fixed075 = true;
  }
}
if (fixed075) writeFileSync(`${dir}/chunk_075.txt`, blocks.join('\n---\n'), 'utf-8');
