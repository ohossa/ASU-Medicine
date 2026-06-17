import * as fs from 'fs';

const bank = JSON.parse(fs.readFileSync('data-format-v2/question-bank-mcns2/question-bank-mcns2.json', 'utf8'));
const textIndex = new Map<string, { chapterId: number; subjectId: string; qIdx: number; count: number }>();
const removed: any[] = [];

for (const ch of bank.chapters) {
  for (const sub of ch.subjects) {
    const keep: any[] = [];
    for (let i = 0; i < sub.questions.length; i++) {
      const q = sub.questions[i];
      const norm = q.text.toLowerCase().replace(/\s+/g, ' ').trim();
      if (textIndex.has(norm)) {
        const existing = textIndex.get(norm)!;
        existing.count++;
        removed.push({
          id: q.id,
          duplicates: existing.id,
          text: q.text.slice(0, 80),
          chapterTitle: ch.title,
          subject: sub.name
        });
      } else {
        textIndex.set(norm, { chapterId: ch.id, subjectId: sub.id, qIdx: keep.length, count: 1 });
        keep.push(q);
      }
    }
    sub.questions = keep;
  }
}

// Recalculate indices
for (const ch of bank.chapters) {
  for (const sub of ch.subjects) {
    for (let i = 0; i < sub.questions.length; i++) {
      sub.questions[i].id = `mcns2-ch${ch.id}-${sub.id}-q${i + 1}`;
      if (sub.questions[i].subQuestions) {
        for (let j = 0; j < sub.questions[i].subQuestions.length; j++) {
          sub.questions[i].subQuestions[j].id = `${sub.questions[i].id}-sq${j + 1}`;
        }
      }
    }
  }
}

const totalBefore = 3537;
let totalAfter = 0;
for (const ch of bank.chapters) {
  for (const sub of ch.subjects) {
    totalAfter += sub.questions.length;
  }
}

fs.writeFileSync('data-format-v2/question-bank-mcns2/question-bank-mcns2-deduped.json', JSON.stringify(bank, null, 2));
fs.writeFileSync('data-format-v2/question-bank-mcns2/duplicate-report.json', JSON.stringify({
  totalBefore,
  totalAfter,
  duplicatesRemoved: removed.length,
  duplicates: removed
}, null, 2));

console.log(`Before dedup: ${totalBefore}`);
console.log(`After dedup:  ${totalAfter}`);
console.log(`Removed:      ${removed.length} exact duplicates`);
