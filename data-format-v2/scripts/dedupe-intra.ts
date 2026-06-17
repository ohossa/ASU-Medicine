import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const files = readdirSync(dir).filter((f: string) => f.startsWith('chunk_') && f.endsWith('.txt') && !f.includes('_FAILED'));

for (const file of files.sort()) {
  const text = readFileSync(`${dir}/${file}`, 'utf-8');
  const rawBlocks = text.split(/\n?---\s*\n|(?:\n|^)---\s*(?=\n)/);
  const seenBlocks = new Set<string>();
  const dedupedRaw: string[] = [];
  let changed = false;

  for (const raw of rawBlocks) {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('FLAGGED_') || trimmed.startsWith('SATA_') || trimmed.startsWith('REMOVED_')) {
      dedupedRaw.push(raw);
      continue;
    }
    if (!trimmed.startsWith('QUESTION_TYPE')) {
      dedupedRaw.push(raw);
      continue;
    }
    // extract text
    const textMatch = trimmed.match(/^TEXT:\n([\s\S]*?)(?=\nOPTIONS:|\nANSWER:|\n---)/m);
    const qText = textMatch ? textMatch[1].trim() : '';
    if (!qText) {
      dedupedRaw.push(raw);
      continue;
    }
    // if exact duplicate by text -> check if full trimmed block is also identical to any previously kept
    let isDup = false;
    for (const seenRaw of seenBlocks) {
      const seenTrim = seenRaw.trim();
      if (seenTrim === trimmed) {
        isDup = true;
        break;
      }
    }
    if (isDup) {
      changed = true;
      continue;
    }
    // content differs but text same -> keep both (don't drop variant)
    seenBlocks.add(trimmed);
    dedupedRaw.push(raw);
  }

  if (changed) {
    // Reconstruct file
    const output = dedupedRaw.join('---\n\n');
    writeFileSync(`${dir}/${file}`, output, 'utf-8');
    console.log(`Deduped ${file}`);
  }
}
