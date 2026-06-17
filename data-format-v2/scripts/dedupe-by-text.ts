import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const files = readdirSync(dir).filter((f: string) => f.startsWith('chunk_') && f.endsWith('.txt') && !f.includes('_FAILED'));

for (const file of files.sort()) {
  const text = readFileSync(`${dir}/${file}`, 'utf-8');
  const rawBlocks = text.split(/\n?---\s*\n|(?:\n|^)---\s*(?=\n)/);
  const seenTexts = new Set<string>();
  const cleanedBlocks: string[] = [];
  let changed = false;

  for (const raw of rawBlocks) {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('FLAGGED_') || trimmed.startsWith('SATA_') || trimmed.startsWith('REMOVED_') || !trimmed.startsWith('QUESTION_TYPE')) {
      cleanedBlocks.push(raw);
      continue;
    }
    const textMatch = trimmed.match(/^TEXT:\n([\s\S]*?)(?=\nOPTIONS:|\nANSWER:|\n---)/m);
    const qText = textMatch ? textMatch[1].trim() : '';
    if (!qText) {
      cleanedBlocks.push(raw);
      continue;
    }
    if (seenTexts.has(qText)) {
      changed = true;
      continue;
    }
    seenTexts.add(qText);
    cleanedBlocks.push(raw);
  }

  if (changed) {
    const output = cleanedBlocks.join('---\n\n');
    writeFileSync(`${dir}/${file}`, output, 'utf-8');
    console.log(`Text-deduped ${file}`);
  }
}
