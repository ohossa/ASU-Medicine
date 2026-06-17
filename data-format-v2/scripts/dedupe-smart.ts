import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const files = readdirSync(dir).filter((f: string) => f.startsWith('chunk_') && f.endsWith('.txt') && !f.includes('_FAILED'));

for (const file of files.sort()) {
  const text = readFileSync(`${dir}/${file}`, 'utf-8');
  const rawBlocks = text.split(/\n?---\s*\n|(?:\n|^)---\s*(?=\n)/);
  const byText = new Map<string, { index: number; raw: string; optCount: number }[]>();

  for (let i = 0; i < rawBlocks.length; i++) {
    const raw = rawBlocks[i];
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('FLAGGED_') || trimmed.startsWith('SATA_') || trimmed.startsWith('REMOVED_')) continue;
    if (!trimmed.startsWith('QUESTION_TYPE')) continue;
    const textMatch = trimmed.match(/^TEXT:\n([\s\S]*?)(?=\nOPTIONS:|\nANSWER:|\n---)/m);
    const qText = textMatch ? textMatch[1].trim() : '';
    if (!qText) continue;
    const opts = trimmed.match(/OPTIONS:\n([\s\S]*?)(?=\nANSWER:|\n---)/m);
    const optCount = opts ? opts[1].split('\n').map(l => l.trim()).filter(l => /^[A-E]\)/.test(l)).length : 0;
    const list = byText.get(qText) ?? [];
    list.push({ index: i, raw, optCount });
    byText.set(qText, list);
  }

  const toDrop = new Set<number>();
  for (const [qText, list] of byText) {
    if (list.length < 2) continue;
    // If exact identical blocks, drop extras (first pass already did this, but double-check)
    const distinct = list.filter((item, pos, arr) => arr.findIndex(t => t.raw.trim() === item.raw.trim()) === pos);
    if (distinct.length < list.length) {
      for (let k = 1; k < distinct.length; k++) toDrop.add(distinct[k].index);
      continue;
    }
    // Content differs but text same: compare option counts
    const goodOnes = list.filter(it => it.optCount >= 3 && it.optCount <= 5);
    const badOnes = list.filter(it => it.optCount < 3 || it.optCount > 5);
    if (goodOnes.length >= 1) {
      // Multiple good ones: keep first, drop rest
      for (let k = 1; k < goodOnes.length; k++) toDrop.add(goodOnes[k].index);
    } else if (badOnes.length > 1) {
      // All are bad: keep first, drop rest
      for (let k = 1; k < badOnes.length; k++) toDrop.add(badOnes[k].index);
    }
  }

  if (toDrop.size > 0) {
    const cleaned = rawBlocks.filter((_, i) => !toDrop.has(i));
    const output = cleaned.join('---\n\n');
    writeFileSync(`${dir}/${file}`, output, 'utf-8');
    console.log(`Smart-deduped ${file}: dropped ${toDrop.size} bad duplicate blocks`);
  }
}
