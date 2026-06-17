import * as fs from 'fs';

const bank = JSON.parse(fs.readFileSync('output/question-bank-mcns2.json', 'utf8'));
const questions = bank.questions;

const issues: any[] = [];
let mcqTotal = 0, mcqGood = 0;
let essayTotal = 0, essayGood = 0;
let caseTotal = 0, caseGood = 0;
let matchTotal = 0, matchGood = 0;
let suspicious = 0;

for (let i = 0; i < questions.length; i++) {
  const q = questions[i];
  const id = q.id || `Q${i}`;
  const text = String(q.text || '').trim();
  const exp = String(q.explanation || '').trim();
  const kc = String(q.keyConcept || '').trim();

  // Check for suspicious short content
  if (text.length < 10) { issues.push({ id, level: 'CRITICAL', reason: 'Question text too short', text }); suspicious++; continue; }
  if (exp.length < 20) { issues.push({ id, level: 'HIGH', reason: 'Explanation too short', text: text.slice(0,60) }); suspicious++; }
  if (kc.length < 5) { issues.push({ id, level: 'HIGH', reason: 'KeyConcept too short', text: text.slice(0,60) }); suspicious++; }
  if (exp.includes('N/A') && exp.length < 50) { issues.push({ id, level: 'CRITICAL', reason: 'Explanation contains N/A', text: text.slice(0,60) }); suspicious++; }
  if (kc.includes('N/A')) { issues.push({ id, level: 'CRITICAL', reason: 'KeyConcept contains N/A', text: text.slice(0,60) }); suspicious++; }

  // Type-specific checks
  if (q.type === 'mcq') {
    mcqTotal++;
    if (!Array.isArray(q.options) || q.options.length < 2) { issues.push({ id, level: 'CRITICAL', reason: 'MCQ has <2 options', text: text.slice(0,60) }); continue; }
    if (q.correctIndex == null || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
      issues.push({ id, level: 'CRITICAL', reason: 'correctIndex out of bounds', text: text.slice(0,60), correctIndex: q.correctIndex, totalOptions: q.options.length });
      continue;
    }
    const correctOpt = String(q.options[q.correctIndex]).toLowerCase().replace(/^[a-e][.)]\s*/, '').trim();
    const expLower = exp.toLowerCase();
    const kcLower = kc.toLowerCase();

    // Check if explanation mentions the correct answer
    const hasCorrectInExp = expLower.includes(correctOpt) || correctOpt.split(/\s+/).some((w: string) => w.length > 4 && expLower.includes(w));
    const hasCorrectInKc = kcLower.includes(correctOpt) || correctOpt.split(/\s+/).some((w: string) => w.length > 4 && kcLower.includes(w));

    // For EXCEPT/INCORRECT, the explanation should mention which is wrong
    const isExcept = /except|incorrect|not true|false/i.test(text);
    const words = correctOpt.split(/\s+/).filter((w: string) => w.length > 3);
    const matchedWords = words.filter((w: string) => expLower.includes(w));
    const ratio = words.length > 0 ? matchedWords.length / words.length : 0;

    if (!hasCorrectInExp && !hasCorrectInKc && ratio < 0.25) {
      issues.push({ id, level: 'MEDIUM', reason: 'Explanation may not support correct answer', text: text.slice(0,60), correctOpt, ratio: Math.round(ratio*100)+'%' });
    } else {
      mcqGood++;
    }
  }

  if (q.type === 'essay') {
    essayTotal++;
    const ma = String(q.modelAnswer || '').trim();
    if (!ma || ma.length < 10) { issues.push({ id, level: 'CRITICAL', reason: 'Essay missing modelAnswer', text: text.slice(0,60) }); continue; }
    if (ma.length < 30) { issues.push({ id, level: 'HIGH', reason: 'Essay modelAnswer suspiciously short', text: text.slice(0,60) }); }
    essayGood++;
  }

  if (q.type === 'case') {
    caseTotal++;
    if (!Array.isArray(q.subQuestions) || q.subQuestions.length === 0) { issues.push({ id, level: 'CRITICAL', reason: 'Case missing subQuestions', text: text.slice(0,60) }); continue; }
    let sqOk = true;
    for (const sq of q.subQuestions) {
      const sqText = String(sq.text || '').trim();
      if (!sqText || sqText.length < 3) { sqOk = false; issues.push({ id, level: 'HIGH', reason: 'Case subQuestion text missing', text: text.slice(0,60) }); }
      if (sq.type === 'essay' && (!sq.modelAnswer || sq.modelAnswer.length < 5)) { sqOk = false; issues.push({ id, level: 'HIGH', reason: 'Case subQuestion essay missing modelAnswer', text: text.slice(0,60) }); }
      if (sq.type === 'mcq') {
        if (!Array.isArray(sq.options) || sq.options.length === 0) { sqOk = false; issues.push({ id, level: 'HIGH', reason: 'Case subQuestion MCQ missing options', text: text.slice(0,60) }); }
        else if (sq.correctIndex == null || sq.correctIndex < 0 || sq.correctIndex >= sq.options.length) { sqOk = false; issues.push({ id, level: 'HIGH', reason: 'Case subQuestion correctIndex out of bounds', text: text.slice(0,60) }); }
      }
    }
    if (sqOk) caseGood++;
  }

  if (q.type === 'matching') {
    matchTotal++;
    if (!Array.isArray(q.pairs) || q.pairs.length === 0) { issues.push({ id, level: 'CRITICAL', reason: 'Matching missing pairs', text: text.slice(0,60) }); continue; }
    let pOk = true;
    for (const p of q.pairs) {
      if (!p.premise || !p.premise.trim() || !p.target || !p.target.trim()) { pOk = false; }
    }
    if (pOk) matchGood++;
  }
}

console.log(`=== BIOLOGICAL QUALITY AUDIT ===`);
console.log(`Total questions scanned: ${questions.length}`);
console.log(`Suspicious/flagged: ${suspicious}`);
console.log(`Critical issues: ${issues.filter(i=>i.level==='CRITICAL').length}`);
console.log(`High issues: ${issues.filter(i=>i.level==='HIGH').length}`);
console.log(`Medium issues: ${issues.filter(i=>i.level==='MEDIUM').length}`);
console.log(`\nMCQ: ${mcqGood}/${mcqTotal} consistent`);
console.log(`Essay: ${essayGood}/${essayTotal} valid`);
console.log(`Case: ${caseGood}/${caseTotal} valid`);
console.log(`Matching: ${matchGood}/${matchTotal} valid`);

if (issues.length > 0) {
  fs.writeFileSync('output/biological-audit.json', JSON.stringify(issues, null, 2));
  console.log('\nTop 20 issues:');
  issues.slice(0, 20).forEach((iss, i) => console.log(`${i+1}. [${iss.level}] ${iss.id}: ${iss.reason} | "${iss.text}"`));
}
console.log('==================================');
