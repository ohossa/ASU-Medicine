import * as fs from 'fs';

const bank = JSON.parse(fs.readFileSync('data-format-v2/question-bank-mcns2/question-bank-mcns2-deduped.json', 'utf8'));
let fixed = 0;
const report: any[] = [];

for (const ch of bank.chapters) {
  for (const sub of ch.subjects) {
    for (const q of sub.questions) {
      if (q.type !== 'mcq' || !Array.isArray(q.options)) continue;
      const isExcept = /except|incorrect|not true|false/i.test(q.text);
      const exp = String(q.explanation || '').toLowerCase();
      const kc = String(q.keyConcept || '').toLowerCase();
      
      // Extract clean option texts
      const opts = q.options.map((o: string, i: number) => ({
        raw: o,
        text: String(o).toLowerCase().replace(/^[a-e][.)]\s*/i, '').replace(/\.$/, '').trim(),
        idx: i
      }));
      
      // Check for explicit "X is the answer/correct" in explanation
      for (const opt of opts) {
        const phrases = [
          `${opt.text} is the correct`,
          `${opt.text} is correct`,
          `correct answer is ${opt.text}`,
          `answer is ${opt.text}`,
        ];
        for (const phrase of phrases) {
          if (exp.includes(phrase)) {
            if (opt.idx !== q.correctIndex) {
              report.push({ id: q.id, text: q.text.slice(0, 50), old: q.options[q.correctIndex], new: opt.raw, reason: 'explicit correct' });
              q.correctIndex = opt.idx;
              fixed++;
            }
            break;
          }
        }
      }
      
      // For EXCEPT questions: find option explicitly negated
      if (isExcept && q.correctIndex === report[report.length - 1]?.oldIdx) {
        // already fixed above
      } else if (isExcept) {
        for (const opt of opts) {
          const negPhrases = [
            `${opt.text} is incorrect`,
            `${opt.text} is false`,
            `${opt.text} is not true`,
            `${opt.text} is not`,
            `not ${opt.text}`,
            `does not ${opt.text}`,
            `incorrect — ${opt.text}`,
            `false statement` + opt.text,
          ];
          let negCount = 0;
          for (const phrase of negPhrases) {
            if (exp.includes(phrase) || kc.includes(phrase)) negCount++;
          }
          if (negCount > 0 && opt.idx !== q.correctIndex) {
            report.push({ id: q.id, text: q.text.slice(0, 50), old: q.options[q.correctIndex], new: opt.raw, reason: 'negated in EXCEPT' });
            q.correctIndex = opt.idx;
            fixed++;
            break;
          }
        }
      }
      
      // For non-EXCEPT: check if keyConcept directly names one option
      if (!isExcept && !report.find(r => r.id === q.id)) {
        let bestScore = 0;
        let bestIdx = q.correctIndex;
        for (const opt of opts) {
          const words = opt.text.split(/\s+/).filter((w: string) => w.length > 3);
          let score = 0;
          for (const w of words) {
            if (kc.includes(w)) score += 3;
            if (exp.includes(w)) score += 1;
          }
          if (score > bestScore) { bestScore = score; bestIdx = opt.idx; }
        }
        if (bestIdx !== q.correctIndex && bestScore >= 5) {
          report.push({ id: q.id, text: q.text.slice(0, 50), old: q.options[q.correctIndex], new: opts[bestIdx].raw, reason: 'keyConcept match' });
          q.correctIndex = bestIdx;
          fixed++;
        }
      }
    }
  }
}

fs.writeFileSync('data-format-v2/question-bank-mcns2/question-bank-mcns2-deduped.json', JSON.stringify(bank, null, 2));
fs.writeFileSync('data-format-v2/question-bank-mcns2/targeted-fix-report.json', JSON.stringify({ fixed, report }, null, 2));
console.log(`Targeted fixes: ${fixed}`);
