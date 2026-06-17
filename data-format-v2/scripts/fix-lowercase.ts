import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const chunks = [
  'chunk_008.txt', 'chunk_021.txt', 'chunk_034.txt', 'chunk_035.txt',
  'chunk_036.txt', 'chunk_045.txt', 'chunk_046.txt', 'chunk_052.txt',
  'chunk_054.txt', 'chunk_057.txt', 'chunk_060.txt',
];

for (const file of chunks) {
  const path = join(dir, file);
  const text = readFileSync(path, 'utf-8');
  const lines = text.split('\n');
  const fixed: string[] = [];
  let inOptions = false;
  let changed = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^OPTIONS:\s*$/)) {
      inOptions = true;
      fixed.push(line);
      continue;
    }
    if (inOptions) {
      if (line.match(/^[A-Z_]+:/)) {
        inOptions = false;
      } else if (line.match(/^[a-e]\)\s/)) {
        const fixedLine = line.replace(/^[a-e]\)/, m => m[0].toUpperCase());
        fixed.push(fixedLine);
        changed++;
        continue;
      }
    }
    if (line.match(/^ANSWER:\s*[a-e]\s*$/i)) {
      const fixedLine = line.replace(/^[a-e]\s*$/i, m => m.toUpperCase().trim());
      fixed.push(fixedLine);
      changed++;
      continue;
    }
    fixed.push(line);
  }

  if (changed) {
    writeFileSync(path, fixed.join('\n'), 'utf-8');
    console.log(file, 'fixed', changed, 'lines');
  } else {
    console.log(file, 'no changes');
  }
}
