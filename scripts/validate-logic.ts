import * as fs from 'fs';

const file = process.argv[2];
if (!file) { console.error('Usage: tsx validate-logic.ts <json>'); process.exit(1); }

const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const questions = Array.isArray(data) ? data : data.questions || [];
let logicErrors = 0;

for (let i = 0; i < questions.length; i++) {
  const q = questions[i];
  const idx = `Q${i}`;
  const pushErr = (msg: string) => { console.error(`${idx}: ${msg}`); logicErrors++; };

  if (q.type === 'mcq' || q.type === 'truefalse') {
    if (Array.isArray(q.options) && q.options.length > 0) {
      const ca = String(q.correctAnswer || '').toUpperCase();
      const maxLetter = String.fromCharCode(64 + q.options.length); // A=1, B=2...
      if (ca < 'A' || ca > maxLetter) {
        pushErr(`correctAnswer "${q.correctAnswer}" out of range for ${q.options.length} options`);
      }
      // Check for duplicate options
      const unique = new Set(q.options);
      if (unique.size !== q.options.length) pushErr('duplicate options detected');
    }
  }

  if (q.type === 'fillblank') {
    const blankSlots = (q.text.match(/___/g) || []).length;
    const blankCount = Array.isArray(q.blanks) ? q.blanks.length : 0;
    if (blankSlots !== blankCount) {
      pushErr(`fillblank mismatch: ${blankSlots} ___ slots but ${blankCount} blanks provided`);
    }
  }

  if (q.type === 'matching') {
    if (Array.isArray(q.pairs)) {
      for (let j = 0; j < q.pairs.length; j++) {
        const p = q.pairs[j];
        if (!p.premise || !p.premise.trim()) pushErr(`pair ${j} empty premise`);
        if (!p.target || !p.target.trim()) pushErr(`pair ${j} empty target`);
      }
      // Check duplicate premises/targets
      const premises = q.pairs.map((p: any) => p.premise.trim());
      const targets = q.pairs.map((p: any) => p.target.trim());
      if (new Set(premises).size !== premises.length) pushErr('duplicate premises in matching');
      // Duplicate targets are valid in matching questions (multiple premises may map to same target)
    }
  }

  if (q.type === 'case') {
    if (Array.isArray(q.subQuestions)) {
      for (let j = 0; j < q.subQuestions.length; j++) {
        const sq = q.subQuestions[j];
        if (sq.type === 'mcq') {
          const ca = String(sq.correctAnswer || '').toUpperCase();
          if (Array.isArray(sq.options) && sq.options.length > 0) {
            const maxL = String.fromCharCode(64 + sq.options.length);
            if (ca < 'A' || ca > maxL) {
              pushErr(`subQ ${j} correctAnswer "${sq.correctAnswer}" out of range`);
            }
          }
        }
      }
    }
  }
}

console.log(`Questions checked: ${questions.length}`);
console.log(`Logic errors: ${logicErrors}`);
