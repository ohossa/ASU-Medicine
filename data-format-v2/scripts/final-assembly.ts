import * as fs from 'fs';
import * as path from 'path';

const bank = JSON.parse(fs.readFileSync('data-format-v2/question-bank-mcns2/question-bank-mcns2-deduped.json', 'utf8'));

// Write clean consolidated
const outDir = 'data-format-v2/question-bank-mcns2';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'question-bank-mcns2-deduped.json'), JSON.stringify(bank, null, 2));

// Write per-chapter chunks
const chapterDir = path.join(outDir, 'chapters');
if (!fs.existsSync(chapterDir)) fs.mkdirSync(chapterDir, { recursive: true });

for (const ch of bank.chapters) {
  const safe = ch.title.replace(/[^a-zA-Z0-9]/g, '_');
  const chunk = { schemaVersion: 1, meta: bank.meta, chapters: [ch] };
  fs.writeFileSync(path.join(chapterDir, `${safe}.json`), JSON.stringify(chunk, null, 2));
}

// Stats
let total = 0, mcq = 0, essay = 0, caseQ = 0, matching = 0, fillblank = 0, tf = 0;
for (const ch of bank.chapters) {
  for (const sub of ch.subjects) {
    for (const q of sub.questions) {
      total++;
      if (q.type === 'mcq') mcq++;
      else if (q.type === 'essay') essay++;
      else if (q.type === 'case') caseQ++;
      else if (q.type === 'matching') matching++;
      else if (q.type === 'fillblank') fillblank++;
      else if (q.type === 'truefalse') tf++;
    }
  }
}

console.log('=== FINAL ASSEMBLY ===');
console.log('Total questions:', total);
console.log('MCQ:', mcq);
console.log('Essay:', essay);
console.log('Case:', caseQ);
console.log('Matching:', matching);
console.log('Fillblank:', fillblank);
console.log('True/False:', tf);
console.log('Chapters:', bank.chapters.length);
console.log('======================');
