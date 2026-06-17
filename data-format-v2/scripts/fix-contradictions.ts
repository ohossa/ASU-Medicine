import * as fs from 'fs';

const audit = JSON.parse(fs.readFileSync('data-format-v2/question-bank-mcns2/contradiction-audit.json', 'utf8'));
const bank = JSON.parse(fs.readFileSync('data-format-v2/question-bank-mcns2/question-bank-mcns2-deduped.json', 'utf8'));
const combined = JSON.parse(fs.readFileSync('interim/combined-enriched.json', 'utf8'));

// Build question lookup by ID
const qMap = new Map<string, any>();
for (const ch of bank.chapters) {
  for (const sub of ch.subjects) {
    for (const q of sub.questions) {
      qMap.set(q.id, { q, ch, sub });
    }
  }
}

let fixed = 0;
const fixes: any[] = [];

for (const issue of audit) {
  const entry = qMap.get(issue.id);
  if (!entry) continue;
  const { q } = entry;
  if (q.type !== 'mcq' || !Array.isArray(q.options)) continue;
  
  const exp = String(q.explanation || '').toLowerCase();
  const kc = String(q.keyConcept || '').toLowerCase();
  const optTexts = q.options.map((o: string) => String(o).toLowerCase().replace(/^[a-e][.)]\s*/i, '').trim());
  
  // Determine if the question asks for EXCEPT/INCORRECT
  const isExcept = /except|incorrect|not true|false/i.test(q.text);
  
  // Score each option
  const scores = optTexts.map((opt: string) => {
    const words = opt.split(/\s+/).filter((w: string) => w.length > 3);
    let score = 0;
    for (const w of words) {
      if (exp.includes(w)) score++;
      if (kc.includes(w)) score += 2;
    }
    return score;
  });
  
  const maxScore = Math.max(...scores);
  const bestIdx = scores.indexOf(maxScore);
  
  if (bestIdx !== q.correctIndex && maxScore > 1) {
    // Double check: if the current option is actually the exception in an EXCEPT question,
    // the explanation might mention it as "does NOT" or "incorrectly".
    const currentOpt = optTexts[q.correctIndex];
    const currentNeg = exp.includes('does not ' + currentOpt) || 
                       exp.includes('not ' + currentOpt) ||
                       exp.includes(currentOpt + ' is not') ||
                       exp.includes(currentOpt + ' does not');
    
    const bestOpt = optTexts[bestIdx];
    const bestNeg = exp.includes('does not ' + bestOpt) || 
                    exp.includes('not ' + bestOpt) ||
                    exp.includes(bestOpt + ' is not') ||
                    exp.includes(bestOpt + ' does not');
    
    // If current option is NOT negated and best option IS negated, skip
    if (!currentNeg && bestNeg && isExcept) continue;
    // If current option IS negated and best option is NOT negated, that's a strong signal
    if (currentNeg && !bestNeg) {
      fixes.push({ id: q.id, old: q.correctIndex, new: bestIdx, reason: 'explanation contradicts current' });
      q.correctIndex = bestIdx;
      fixed++;
      continue;
    }
    
    // For non-EXCEPT, if best is strongly supported
    if (!isExcept && maxScore >= 3 && scores[q.correctIndex] <= 1) {
      fixes.push({ id: q.id, old: q.correctIndex, new: bestIdx, reason: 'explanation supports different option' });
      q.correctIndex = bestIdx;
      fixed++;
    }
  }
}

// Write bank
fs.writeFileSync('data-format-v2/question-bank-mcns2/question-bank-mcns2-deduped.json', JSON.stringify(bank, null, 2));
// Write fix report
fs.writeFileSync('data-format-v2/question-bank-mcns2/auto-fix-report.json', JSON.stringify({ fixed, fixes }, null, 2));
console.log(`Auto-fixed ${fixed} questions.`);
