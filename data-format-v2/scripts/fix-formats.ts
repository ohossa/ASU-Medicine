import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const files = readdirSync(dir).filter(f => f.startsWith('chunk_') && f.endsWith('.txt') && !f.includes('_FAILED'));
let totalFilesChanged = 0, totalLinesChanged = 0;

for (const file of files) {
  const path = join(dir, file);
  const text = readFileSync(path, 'utf-8');
  if (!/^OPTIONS:/m.test(text)) continue;

  const lines = text.split('\n');
  const fixed: string[] = [];
  let blockChanges = 0;

  for (const line of lines) {
    // Fix options: a. text, a) text, a)text -> A) text
    const optMatch = line.match(/^([a-e])([.)])(\s*)(.*)$/);
    if (optMatch) {
      fixed.push(`${optMatch[1].toUpperCase()}) ${optMatch[4]}`);
      blockChanges++;
      continue;
    }
    // Fix ANSWER: lowercase letter -> uppercase
    const ansMatch = line.match(/^(ANSWER:\s*)([a-e])\s*$/i);
    if (ansMatch) {
      fixed.push(`${ansMatch[1]}${ansMatch[2].toUpperCase()}`);
      blockChanges++;
      continue;
    }
    fixed.push(line);
  }

  if (blockChanges) {
    writeFileSync(path, fixed.join('\n'), 'utf-8');
    console.log(file, 'fixed', blockChanges, 'lines');
    totalFilesChanged++;
    totalLinesChanged += blockChanges;
  }
}

console.log(`Done. Changed ${totalLinesChanged} lines across ${totalFilesChanged} files.`);
