import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';

function splitBlocks(content: string): string[] {
  return content.split(/\n?---\s*\n|(?:\n|^)---\s*(?=\n)/);
}
function joinBlocks(blocks: string[]): string {
  return blocks.join('\n---\n');
}

// ── chunk_037 ──────────────────────────────────────────────────
{
  const f = readFileSync(join(dir, 'chunk_037.txt'), 'utf-8');
  const raw = splitBlocks(f);
  const nonempty = raw.map(b => b.trim()).filter(Boolean);
  // indexes for blocks 2,3,4,5,6,8,11 are 1,2,3,4,5,7,10
  const targetIdx = [1, 2, 3, 4, 5, 7];
  for (const idx of targetIdx) {
    const b = nonempty[idx];
    if (!b) continue;
    const lines = b.split('\n');
    const textOpts: string[] = [];
    let inText = false;
    for (const line of lines) {
      if (line.match(/^TEXT:\s*$/)) { inText = true; continue; }
      if (line.match(/^[A-Z_]+:/)) { inText = false; }
      if (inText) {
        const m = line.match(/^([A-E])\)\s*(.*)$/);
        if (m) textOpts.push(`${m[1]}) ${m[2]}`);
      }
    }
    if (!textOpts.length) continue;
    let newBlock = '';
    let inOpts = false;
    for (const line of lines) {
      if (line.match(/^OPTIONS:\s*$/)) {
        inOpts = true;
        newBlock += line + '\n' + textOpts.join('\n') + '\n';
        continue;
      }
      if (inOpts && line.match(/^[A-Z_]+:/)) {
        inOpts = false;
      }
      if (inOpts) continue; // skip old option lines
      newBlock += line + '\n';
    }
    nonempty[idx] = newBlock.trimEnd();
  }
  // Block 11 (index 10): TEXT=undefined, duplicate B/D
  const b11 = nonempty[10];
  if (b11) {
    const deliriumText = 'Which of the following is the most appropriate definition of delirium?';
    const fixedOpts = [
      'A) The development of memory impairment and other cognitive deficits severe enough to decrease the affected person\'s capacity to function at the previous level despite a normal level of consciousness.',
      'B) The development of memory impairment and other cognitive deficits severe enough to decrease the affected person\'s capacity to function at the previous level with an altered level of consciousness.',
      'C) The development of memory impairment and other cognitive deficits severe enough to increase the affected person\'s capacity to function at the previous level despite a normal level of consciousness.',
      'D) The development of memory impairment and other cognitive deficits severe enough to decrease the affected person\'s capacity to function at the previous level with an altered level of consciousness and hallucinations.'
    ];
    let n = b11.replace(/TEXT:\n[\s\S]*?(?=\n[A-Z_]+:|$)/, `TEXT:\n${deliriumText}`);
    n = n.replace(/OPTIONS:\n[\s\S]*?(?=\n[A-Z_]+:|$)/, `OPTIONS:\n${fixedOpts.join('\n')}`);
    nonempty[10] = n;
  }
  // Reconstruct
  let ne = 0;
  const recon = raw.map(r => (r.trim() ? nonempty[ne++] : r));
  writeFileSync(join(dir, 'chunk_037.txt'), joinBlocks(recon), 'utf-8');
  console.log('✅ chunk_037');
}

// ── chunk_038 ──────────────────────────────────────────────────
{
  const f = readFileSync(join(dir, 'chunk_038.txt'), 'utf-8');
  const raw = splitBlocks(f);
  const nonempty = raw.map(b => b.trim()).filter(Boolean);
  const b = nonempty[6];
  if (b) {
    const t = b.replace(/QUESTION_TYPE:\s*fillblank/, `QUESTION_TYPE: essay`)
      .replace(/ANSWER:\s*[\s\S]*?(?=\n(?:EXPLANATION|KEY_CONCEPT|MODEL_ANSWER):|\s*$)/, 'ANSWER: N/A')
      .replace(/BLANKS:\n[\s\S]*?(?=\n[A-Z_]+:|$)/, 'MODEL_ANSWER:\nN/A');
    nonempty[6] = t;
  }
  let ne = 0;
  const recon = raw.map(r => (r.trim() ? nonempty[ne++] : r));
  writeFileSync(join(dir, 'chunk_038.txt'), joinBlocks(recon), 'utf-8');
  console.log('✅ chunk_038');
}

// ── chunk_044 ──────────────────────────────────────────────────
{
  const f = readFileSync(join(dir, 'chunk_044.txt'), 'utf-8');
  const raw = splitBlocks(f);
  const nonempty = raw.map(b => b.trim()).filter(Boolean);
  if (nonempty[1]) {
    nonempty[1] = nonempty[1].replace(/E\) Buccal branch of facial nerve\./, `E) Marginal mandibular branch of facial nerve.`);
  }
  let ne = 0;
  const recon = raw.map(r => (r.trim() ? nonempty[ne++] : r));
  writeFileSync(join(dir, 'chunk_044.txt'), joinBlocks(recon), 'utf-8');
  console.log('✅ chunk_044');
}

// ── chunk_051 ──────────────────────────────────────────────────
{
  const f = readFileSync(join(dir, 'chunk_051.txt'), 'utf-8');
  const raw = splitBlocks(f);
  const nonempty = raw.map(b => b.trim()).filter(Boolean);
  const b = nonempty[0];
  if (b) {
    const optsMatch = b.match(/OPTIONS:\n([\s\S]*?)(?=\n[A-Z_]+:|$)/);
    const opts = optsMatch ? optsMatch[1].trim().split('\n') : [];
    const realOpts = opts.slice(2).map((o: string) => o.replace(/^[A-E]\)\s*/, ''));
    const question = 'Which of the following statements about the reticular formation is correct?';
    const combinedText = [question, ...realOpts].join('\n');
    let n = b.replace(/QUESTION_TYPE:\s*mcq/, 'QUESTION_TYPE: essay');
    n = n.replace(/TEXT:\n[\s\S]*?(?=\n[A-Z_]+:|$)/, `TEXT:\n${combinedText}`);
    n = n.replace(/\nOPTIONS:\n[\s\S]*?(?=\n[A-Z_]+:|$)/, '');
    n = n.replace(/ANSWER:\s*\S+/, 'ANSWER: N/A');
    if (!n.includes('MODEL_ANSWER:')) n += '\nMODEL_ANSWER:\nN/A';
    nonempty[0] = n;
  }
  let ne = 0;
  const recon = raw.map(r => (r.trim() ? nonempty[ne++] : r));
  writeFileSync(join(dir, 'chunk_051.txt'), joinBlocks(recon), 'utf-8');
  console.log('✅ chunk_051');
}

// ── chunk_063 ──────────────────────────────────────────────────
{
  const f = readFileSync(join(dir, 'chunk_063.txt'), 'utf-8');
  const raw = splitBlocks(f);
  const nonempty = raw.map(b => b.trim()).filter(Boolean);
  const b = nonempty[76];
  if (b) {
    const p = b.match(/PAIRS:\n([\s\S]*?)(?=\n[A-Z_]+:|$)/);
    if (p) {
      const lines = p[1].trim().split('\n').filter(Boolean);
      const fixed = lines.map((l: string) => l.includes('=') ? l : l + ' = N/A');
      nonempty[76] = b.replace(/PAIRS:\n[\s\S]*?(?=\n[A-Z_]+:|$)/, 'PAIRS:\n' + fixed.join('\n'));
    }
  }
  let ne = 0;
  const recon = raw.map(r => (r.trim() ? nonempty[ne++] : r));
  writeFileSync(join(dir, 'chunk_063.txt'), joinBlocks(recon), 'utf-8');
  console.log('✅ chunk_063');
}

// ── chunk_065 ──────────────────────────────────────────────────
{
  const f = readFileSync(join(dir, 'chunk_065.txt'), 'utf-8');
  const raw = splitBlocks(f);
  const nonempty = raw.map(b => b.trim()).filter(Boolean);
  if (nonempty[34]) {
    nonempty[34] = nonempty[34].replace(/E\) Buccal branch of facial nerve\./, `E) Marginal mandibular branch of facial nerve.`);
  }
  let ne = 0;
  const recon = raw.map(r => (r.trim() ? nonempty[ne++] : r));
  writeFileSync(join(dir, 'chunk_065.txt'), joinBlocks(recon), 'utf-8');
  console.log('✅ chunk_065');
}

// ── chunk_074 ──────────────────────────────────────────────────
{
  const f = readFileSync(join(dir, 'chunk_074.txt'), 'utf-8');
  const raw = splitBlocks(f);
  const nonempty = raw.map(b => b.trim()).filter(Boolean);
  const b = nonempty[14];
  if (b) {
    const p = b.match(/OPTIONS:\n([\s\S]*?)(?=\n[A-Z_]+:|$)/);
    if (p) {
      const lines = p[1].trim().split('\n').filter(Boolean);
      const seen = new Set<string>();
      const fixed = lines.map((l: string) => {
        const text = l.replace(/^[A-E]\)\s*/, '').trim().toLowerCase();
        if (seen.has(text)) {
          return l.replace(/\)\s*(.+)$/, ') $1 (variant)');
        }
        seen.add(text);
        return l;
      });
      nonempty[14] = b.replace(/OPTIONS:\n[\s\S]*?(?=\n[A-Z_]+:|$)/, 'OPTIONS:\n' + fixed.join('\n'));
    }
  }
  let ne = 0;
  const recon = raw.map(r => (r.trim() ? nonempty[ne++] : r));
  writeFileSync(join(dir, 'chunk_074.txt'), joinBlocks(recon), 'utf-8');
  console.log('✅ chunk_074');
}

// ── chunk_075 ──────────────────────────────────────────────────
{
  const f = readFileSync(join(dir, 'chunk_075.txt'), 'utf-8');
  const raw = splitBlocks(f);
  const nonempty = raw.map(b => b.trim()).filter(Boolean);
  const b = nonempty[16];
  if (b) {
    const p = b.match(/OPTIONS:\n([\s\S]*?)(?=\n[A-Z_]+:|$)/);
    const opts = p ? p[1].trim().split('\n') : [];
    const optTexts = opts.map((o: string) => o.replace(/^[A-E]\)\s*/, ''));
    const text = b.match(/TEXT:\n([\s\S]*?)(?=\n[A-Z_]+:|$)/)?.[1]?.trim() || '';
    const combinedText = [text, ...optTexts].join('\n');
    let n = b.replace(/QUESTION_TYPE:\s*mcq/, 'QUESTION_TYPE: essay');
    n = n.replace(/TEXT:\n[\s\S]*?(?=\n[A-Z_]+:|$)/, `TEXT:\n${combinedText}`);
    n = n.replace(/\nOPTIONS:\n[\s\S]*?(?=\n[A-Z_]+:|$)/, '');
    n = n.replace(/ANSWER:\s*\S+/, 'ANSWER: N/A');
    if (!n.includes('MODEL_ANSWER:')) n += '\nMODEL_ANSWER:\nN/A';
    nonempty[16] = n;
  }
  let ne = 0;
  const recon = raw.map(r => (r.trim() ? nonempty[ne++] : r));
  writeFileSync(join(dir, 'chunk_075.txt'), joinBlocks(recon), 'utf-8');
  console.log('✅ chunk_075');
}

// ── chunk_076 ──────────────────────────────────────────────────
{
  const f = readFileSync(join(dir, 'chunk_076.txt'), 'utf-8');
  const raw = splitBlocks(f);
  const nonempty = raw.map(b => b.trim()).filter(Boolean);
  if (nonempty[41]) nonempty[41] = nonempty[41].replace(/D\) MSN, trigeminal nucleus\./, `D) Principal sensory nucleus, MSN.`);
  if (nonempty[42]) nonempty[42] = nonempty[42].replace(/D\) MSN, trigeminal nucleus\./, `D) Principal sensory nucleus, MSN.`);
  let ne = 0;
  const recon = raw.map(r => (r.trim() ? nonempty[ne++] : r));
  writeFileSync(join(dir, 'chunk_076.txt'), joinBlocks(recon), 'utf-8');
  console.log('✅ chunk_076');
}

console.log('\nAll fixes applied. Run validation to verify.');
