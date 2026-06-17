import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the question bank
const bankPath = path.join(__dirname, '../question-bank-mcns2/question-bank-mcns2-deduped.json');
const bankData = JSON.parse(fs.readFileSync(bankPath, 'utf-8'));

// Load the fixes
const fixesPath = path.join(__dirname, 'fix-chunk-3-X.jsonl');
const fixLines = fs.readFileSync(fixesPath, 'utf-8').trim().split('\n');
const fixes = fixLines.map(line => JSON.parse(line));

console.log(`Loaded ${fixes.length} fixes`);

// Create a map of question ID -> fix
const fixMap = new Map(fixes.map(f => [f.id, f]));

// Track changes
let changedCount = 0;
let skippedCount = 0;

// Process each chapter
for (const chapter of bankData.chapters) {
  for (const subject of chapter.subjects) {
    if (subject.questions) {
      for (const question of subject.questions) {
        const fix = fixMap.get(question.id);
        if (fix) {
          const oldIndex = question.correctIndex;
          if (oldIndex !== fix.newCorrectIndex) {
            console.log(`FIX: ${question.id}: ${oldIndex} -> ${fix.newCorrectIndex}`);
            console.log(`  Reason: ${fix.reason}`);
            question.correctIndex = fix.newCorrectIndex;
            changedCount++;
          } else {
            console.log(`SKIP (no change): ${question.id} (already ${oldIndex})`);
            skippedCount++;
          }
        }
      }
    }
  }
}

console.log(`\nSummary:`);
console.log(`  Changed: ${changedCount}`);
console.log(`  Skipped (no change needed): ${skippedCount}`);

// Write the updated bank
const outputPath = path.join(__dirname, '../question-bank-mcns2/question-bank-mcns2-deduped.json');
fs.writeFileSync(outputPath, JSON.stringify(bankData, null, 2));
console.log(`\nUpdated question bank written to: ${outputPath}`);
