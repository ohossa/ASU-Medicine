import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';

// Map file -> array of duplicate TEXTs to restore
const toRestore: Record<string, string[]> = {};

for (const file of readdirSync(dir).filter(f => f.startsWith('chunk_') && f.endsWith('.txt') && !f.includes('_FAILED'))) {
  const full = readFileSync(`${dir}/${file}`, 'utf-8');
  const blocks = full.split(/\n?---\s*\n|(?:\n|^)---\s*(?=\n)/);
  const texts = new Map<string, string>();
  const seen = new Set<string>();
  const dups: string[] = [];

  for (const raw of blocks) {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('FLAGGED_') || trimmed.startsWith('SATA_') || trimmed.startsWith('REMOVED_') || !trimmed.startsWith('QUESTION_TYPE')) continue;
    const textMatch = trimmed.match(/^TEXT:\n([\s\S]*?)(?=\nOPTIONS:|\nANSWER:|\n---)/m);
    const qText = textMatch ? textMatch[1].trim() : '';
    if (!qText) continue;
    if (seen.has(qText)) {
      dups.push(qText);
    } else {
      seen.add(qText);
      texts.set(qText, trimmed);
    }
  }

  if (dups.length > 0) {
    toRestore[file] = dups;
  }
}

for (const [file, texts] of Object.entries(toRestore)) {
  const full = readFileSync(`${dir}/${file}`, 'utf-8');
  const blocks = full.split(/\n?---\s*\n|(?:\n|^)---\s*(?=\n)/);
  const seen = new Set<string>();
  const restored: string[] = [];
  let added = 0;

  for (const raw of blocks) {
    restored.push(raw);
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('FLAGGED_') || trimmed.startsWith('SATA_') || trimmed.startsWith('REMOVED_') || !trimmed.startsWith('QUESTION_TYPE')) continue;
    const textMatch = trimmed.match(/^TEXT:\n([\s\S]*?)(?=\nOPTIONS:|\nANSWER:|\n---)/m);
    const qText = textMatch ? textMatch[1].trim() : '';
    if (!qText) continue;
    if (seen.has(qText)) continue;
    seen.add(qText);
    if (texts.includes(qText)) {
      // Append missing duplicate right after this block
      restored.push('---\n' + trimmed);
      added++;
    }
  }

  // If duplicates were at the end and got cut off, append them as needed
  const output = restored.join('');
  writeFileSync(`${dir}/${file}`, output, 'utf-8');
  console.log(`Restored ${added} duplicates in ${file}`);
}
