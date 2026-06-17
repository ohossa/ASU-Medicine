import * as fs from 'fs';

const bank = JSON.parse(fs.readFileSync('data-format-v2/question-bank-mcns2/question-bank-mcns2.json', 'utf8'));
const questions: any[] = [];
for (const ch of bank.chapters) {
  for (const sub of ch.subjects) {
    for (const q of sub.questions) {
      questions.push(q);
    }
  }
}

let logicErrors = 0;
let dupes = 0;
let emptyText = 0;
let emptyExp = 0;
let emptyKC = 0;
let lowOptionCount = 0;
let caMismatch = 0;
const textMap: Record<string, number[]> = {};

for (let i = 0; i < questions.length; i++) {
  const q = questions[i];
  
  // Empty fields
  if (!q.text || q.text.trim().length < 5) { emptyText++; console.error(`Q${i} empty text`); }
  if (!q.explanation || q.explanation.trim().length < 10) { emptyExp++; }
  if (!q.keyConcept || q.keyConcept.trim().length < 5) { emptyKC++; }

  // Duplicate detection
  const norm = q.text.toLowerCase().replace(/\s+/g, ' ').trim();
  if (!textMap[norm]) textMap[norm] = [];
  textMap[norm].push(i);

  // MCQ logic
  if (q.type === 'mcq' && Array.isArray(q.options)) {
    if (q.options.length < 3) { lowOptionCount++; console.error(`Q${i} only ${q.options.length} options`); }
    if (typeof q.correctIndex === 'number') {
      if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
        caMismatch++;
        console.error(`Q${i} correctIndex ${q.correctIndex} out of range for ${q.options.length} options`);
      }
    }
  }
}

// Report duplicates
for (const [text, indices] of Object.entries(textMap)) {
  if (indices.length > 1) {
    dupes++;
    console.error(`DUPLICATE: ${indices.join(',')} - "${text.slice(0,80)}"`);
  }
}

console.log(`\n=== QUALITY AUDIT ===`);
console.log(`Total questions: ${questions.length}`);
console.log(`Logic errors: ${logicErrors}`);
console.log(`Duplicate texts: ${dupes}`);
console.log(`Empty text (<5 chars): ${emptyText}`);
console.log(`Empty explanation (<10 chars): ${emptyExp}`);
console.log(`Empty keyConcept (<5 chars): ${emptyKC}`);
console.log(`MCQs with <3 options: ${lowOptionCount}`);
console.log(`correctIndex out of range: ${caMismatch}`);
console.log(`=====================`);
