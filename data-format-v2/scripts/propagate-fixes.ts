import * as fs from 'fs';

const fixReport = JSON.parse(fs.readFileSync('data-format-v2/question-bank-mcns2/auto-fix-report.json', 'utf8'));
const idToFix = new Map(fixReport.fixes.map((f: any) => [f.id, f]));

// Propagate to combined-enriched.json
const combined = JSON.parse(fs.readFileSync('interim/combined-enriched.json', 'utf8'));
let cFixed = 0;
for (const q of combined) {
  const fix = idToFix.get(q.id);
  if (fix && Array.isArray(q.options) && q.type === 'mcq') {
    // Map by option text
    const optTexts = q.options.map((o: string) => String(o).toLowerCase().replace(/^[a-e][.)]\s*/i, '').trim());
    const bankOpt = q.options.map((o: string) => String(o));
    // The deduped bank had re-indexed IDs, so we need a different matching strategy
  }
}
// Actually propagate by text matching
for (const q of combined) {
  if (q.type !== 'mcq' || !Array.isArray(q.options)) continue;
  const exp = String(q.explanation || '').toLowerCase();
  const kc = String(q.keyConcept || '').toLowerCase();
  const optTexts = q.options.map((o: string) => String(o).toLowerCase().replace(/^[a-e][.)]\s*/i, '').trim());
  
  const isExcept = /except|incorrect|not true|false/i.test(q.text);
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
    const currentNeg = exp.includes('not ' + optTexts[q.correctIndex]) || exp.includes(optTexts[q.correctIndex] + ' is not') || exp.includes(optTexts[q.correctIndex] + ' does not');
    const bestNeg = exp.includes('not ' + optTexts[bestIdx]) || exp.includes(optTexts[bestIdx] + ' is not') || exp.includes(optTexts[bestIdx] + ' does not');
    
    if (!exp.includes(optTexts[q.correctIndex])) {
      if (isExcept) {
        if (bestNeg && !currentNeg) {
          q.correctIndex = bestIdx; cFixed++;
        }
      } else {
        if (maxScore >= 3 && scores[q.correctIndex] <= 1) {
          q.correctIndex = bestIdx; cFixed++;
        }
      }
    }
  }
}
fs.writeFileSync('interim/combined-enriched.json', JSON.stringify(combined, null, 2));
console.log('Fixed',cFixed,'in combined-enriched.json');

// Propagate to batches
for(let i=1;i<=10;i++){
  const batch=JSON.parse(fs.readFileSync('data-format-v2/interim/batch-'+('0'+i).slice(-2)+'.json','utf8'));
  let bFixed=0;
  for(const q of batch.questions){
    if (q.type !== 'mcq' || !Array.isArray(q.options)) continue;
    const exp = String(q.explanation || '').toLowerCase();
    const kc = String(q.keyConcept || '').toLowerCase();
    const optTexts = q.options.map((o: string) => String(o).toLowerCase().replace(/^[a-e][.)]\s*/i, '').trim());
    const isExcept = /except|incorrect|not true|false/i.test(q.text);
    const scores = optTexts.map((opt: string) => {
      const words = opt.split(/\s+/).filter((w: string) => w.length > 3);
      let score = 0;
      for (const w of words) { if (exp.includes(w)) score++; if (kc.includes(w)) score += 2; }
      return score;
    });
    const maxScore = Math.max(...scores);
    const bestIdx = scores.indexOf(maxScore);
    if (bestIdx !== q.correctIndex && maxScore > 1) {
      const currentNeg = exp.includes('not ' + optTexts[q.correctIndex]) || exp.includes(optTexts[q.correctIndex] + ' is not');
      const bestNeg = exp.includes('not ' + optTexts[bestIdx]) || exp.includes(optTexts[bestIdx] + ' is not');
      if (!exp.includes(optTexts[q.correctIndex])) {
        if (isExcept) { if (bestNeg && !currentNeg) { q.correctIndex = bestIdx; bFixed++; } } 
        else { if (maxScore >= 3 && scores[q.correctIndex] <= 1) { q.correctIndex = bestIdx; bFixed++; } }
      }
    }
  }
  fs.writeFileSync('data-format-v2/interim/batch-'+('0'+i).slice(-2)+'.json',JSON.stringify(batch,null,2));
  console.log('Fixed',bFixed,'in batch-'+('0'+i).slice(-2));
}
console.log('Done propagating.');
