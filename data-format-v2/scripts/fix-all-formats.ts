import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const files = readdirSync(dir).filter(f => f.startsWith('chunk_') && f.endsWith('.txt') && !f.includes('_FAILED'));

let totalChanges = 0;

for (const file of files) {
  const path = join(dir, file);
  let text = readFileSync(path, 'utf-8');
  const blocks = text.split(/\n---\s*\n/);
  const fixedBlocks: string[] = [];
  let fileChanges = 0;

  for (const rawBlock of blocks) {
    const b = rawBlock.trim();
    if (!b) { fixedBlocks.push(rawBlock); continue; }
    const lines = b.split('\n');
    const fixedLines: string[] = [];
    let inOptions = false;
    const optionTexts: string[] = [];
    let changed = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Detect OPTIONS start
      if (line.match(/^OPTIONS:\s*$/)) {
        inOptions = true;
        fixedLines.push(line);
        continue;
      }

      // Detect end of OPTIONS (next label or blank line if needed)
      if (inOptions && line.match(/^[A-Z_]+:/) && !line.match(/^OPTIONS:/)) {
        inOptions = false;
      }

      if (inOptions) {
        // Fix option formats:
        // A)text -> A) text
        // A.text -> A) text
        // A text -> A) text
        // A) text -> A) text (no change)
        const m = line.match(/^([A-E])[\s.)]*\s*(.*)$/);
        if (m) {
          const normalized = `${m[1]}) ${m[2]}`;
          if (normalized !== line) {
            fixedLines.push(normalized);
            changed = true;
          } else {
            fixedLines.push(line);
          }
          optionTexts.push(m[2].trim().toLowerCase());
          continue;
        }
      }

      // Fix ANSWER lowercase
      const ansMatch = line.match(/^(ANSWER:\s*)([a-e])\s*$/i);
      if (ansMatch) {
        fixedLines.push(`${ansMatch[1]}${ansMatch[2].toUpperCase()}`);
        changed = true;
        continue;
      }

      fixedLines.push(line);
    }

    if (changed) {
      fixedBlocks.push(fixedLines.join('\n'));
      fileChanges++;
      totalChanges++;
    } else {
      fixedBlocks.push(rawBlock);
    }
  }

  if (fileChanges) {
    writeFileSync(path, fixedBlocks.join('\n---\n'), 'utf-8');
    console.log(file, 'changed', fileChanges, 'blocks');
  }
}

console.log(`Done. Changed ${totalChanges} blocks across files.`);
