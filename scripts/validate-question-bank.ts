import * as fs from 'fs';

const file = process.argv[2];
if (!file) { console.error('Usage: tsx validate-question-bank.ts <json>'); process.exit(1); }

const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const questions = Array.isArray(data) ? data : data.questions || [];
let errors = 0;

for (let i = 0; i < questions.length; i++) {
  const q = questions[i];
  const idx = `Q${i}`;
  const pushErr = (msg: string) => { console.error(`${idx}: ${msg}`); errors++; };

  if (!q.chapterTitle) pushErr('missing chapterTitle');
  if (!q.subject) pushErr('missing subject');
  if (typeof q.lecture !== 'number') pushErr('missing or non-numeric lecture');
  if (!q.type) pushErr('missing type');
  const validTypes = ['mcq','essay','case','matching','fillblank','truefalse'];
  if (!validTypes.includes(q.type)) pushErr(`invalid type "${q.type}"`);
  if (!q.text || q.text.trim() === '') pushErr('missing text');
  if (!q.explanation || q.explanation === 'N/A' || q.explanation.trim() === '') pushErr('missing/empty explanation');
  if (!q.keyConcept || q.keyConcept === 'N/A' || q.keyConcept.trim() === '') pushErr('missing/empty keyConcept');

  if (q.type === 'mcq' || q.type === 'truefalse') {
    if (!Array.isArray(q.options) || q.options.length < 2) pushErr(`needs >=2 options, got ${q.options?.length}`);
    if (!q.correctAnswer || q.correctAnswer === 'N/A') {
      pushErr('missing correctAnswer');
    } else {
      const ca = String(q.correctAnswer).toUpperCase();
      if (!['A','B','C','D','E'].includes(ca)) pushErr(`invalid correctAnswer "${q.correctAnswer}"`);
    }
  }

  if (q.type === 'essay') {
    if (!q.modelAnswer || q.modelAnswer === '' || q.modelAnswer === 'N/A') pushErr('missing/empty modelAnswer');
  }

  if (q.type === 'case') {
    if (!Array.isArray(q.subQuestions) || q.subQuestions.length === 0) {
      pushErr('missing subQuestions');
    } else {
      for (let j = 0; j < q.subQuestions.length; j++) {
        const sq = q.subQuestions[j];
        if (!sq.text || sq.text.trim()==='') pushErr(`subQuestion ${j} missing text`);
      }
    }
  }

  if (q.type === 'matching') {
    if (!Array.isArray(q.pairs) || q.pairs.length === 0) pushErr('missing pairs');
    else {
      for (let j = 0; j < q.pairs.length; j++) {
        const p = q.pairs[j];
        if (!p.premise || !p.target) pushErr(`pair ${j} missing premise/target`);
      }
    }
  }

  if (q.type === 'fillblank') {
    if (!Array.isArray(q.blanks) || q.blanks.length === 0) pushErr('missing blanks');
  }
}

console.log(`Questions validated: ${questions.length}`);
console.log(`Errors: ${errors}`);
