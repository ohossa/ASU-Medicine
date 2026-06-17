import * as fs from 'fs';

const bank = JSON.parse(fs.readFileSync('data-format-v2/question-bank-mcns2/question-bank-mcns2-deduped.json', 'utf8'));
const questions: any[] = [];
for (const ch of bank.chapters) {
  for (const sub of ch.subjects) {
    for (const q of sub.questions) {
      questions.push({ ...q, chapterTitle: ch.title, subjectName: sub.name });
    }
  }
}

const contradictions: any[] = [];

for (const q of questions) {
  if (q.type !== 'mcq' && q.type !== 'truefalse') continue;
  if (typeof q.correctIndex !== 'number' || !Array.isArray(q.options)) continue;
  
  const correctOpt = String(q.options[q.correctIndex] || '');
  const exp = String(q.explanation || '').toLowerCase();
  
  // Check for direct contradictions in other options
  for (let i = 0; i < q.options.length; i++) {
    if (i === q.correctIndex) continue;
    const wrongOpt = String(q.options[i]).toLowerCase();
    // If explanation explicitly names a wrong option as correct
    const wrongName = wrongOpt.replace(/^[a-d][.)]\s*/i, '').split(/[,;]/)[0].trim();
    if (wrongName.length > 3 && exp.includes(wrongName) && !exp.includes('not ' + wrongName) && !exp.includes('except ' + wrongName)) {
      // Check if explanation explicitly says the wrong option IS correct
      const context = exp.substring(Math.max(0, exp.indexOf(wrongName) - 30), exp.indexOf(wrongName) + wrongName.length + 30);
      if (!context.includes('incorrect') && !context.includes('except') && !context.includes('false')) {
        contradictions.push({
          id: q.id,
          text: q.text.slice(0, 60),
          correctOpt: correctOpt.slice(0, 60),
          wrongOpt: q.options[i].slice(0, 60),
          context,
          reason: 'Explanation may support wrong option'
        });
        break; // one contradiction per question is enough
      }
    }
  }
}

console.log(`Contradictions found: ${contradictions.length}`);
if (contradictions.length > 0) {
  fs.writeFileSync('data-format-v2/question-bank-mcns2/contradiction-audit.json', JSON.stringify(contradictions, null, 2));
  contradictions.slice(0, 20).forEach((c, i) => console.log(`${i + 1}. ${c.id}: "${c.text}" -> correct: "${c.correctOpt}" but explanation supports: "${c.wrongOpt}"`));
}
