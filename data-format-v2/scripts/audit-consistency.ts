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

const issues: any[] = [];
const stopWords = new Set(['a','an','the','and','or','of','in','to','from','by','is','are','was','were','be','been','on','at','for','with','as','this','that','which','following','these','those','one','two','three','above','below','except','true','false','incorrect','correct','except']);

for (let i = 0; i < questions.length; i++) {
  const q = questions[i];
  if (q.type !== 'mcq' && q.type !== 'truefalse') continue;
  
  if (typeof q.correctIndex !== 'number' || !Array.isArray(q.options) || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
    issues.push({ id: q.id, reason: 'Invalid correctIndex', text: q.text.slice(0, 60), correctIndex: q.correctIndex, optionCount: q.options?.length });
    continue;
  }
  
  const correctOption = String(q.options[q.correctIndex]);
  // Extract meaningful keywords from correct option (words > 3 chars, not stop words)
  const words = correctOption.toLowerCase().match(/[a-z]{4,}/g) || [];
  const keywords = [...new Set(words.filter(w => !stopWords.has(w)))];
  
  if (keywords.length === 0) continue;
  
  const expLower = String(q.explanation || '').toLowerCase();
  const matched = keywords.filter(k => expLower.includes(k));
  const matchRatio = matched.length / keywords.length;
  
  // Also check keyConcept
  const kcLower = String(q.keyConcept || '').toLowerCase();
  const kcMatched = keywords.filter(k => kcLower.includes(k));
  
  if (matchRatio < 0.25 && kcMatched.length === 0) {
    issues.push({
      id: q.id,
      reason: 'Explanation/keyConcept may not support correct answer',
      text: q.text.slice(0, 60),
      correctOption: correctOption.slice(0, 60),
      keywords: keywords.slice(0, 10),
      matched,
      matchRatio: Math.round(matchRatio * 100) + '%'
    });
  }
}

console.log(`MCQs checked: ${questions.filter(q => q.type === 'mcq' || q.type === 'truefalse').length}`);
console.log(`Potential issues: ${issues.length}`);

if (issues.length > 0) {
  fs.writeFileSync('data-format-v2/question-bank-mcns2/consistency-audit.json', JSON.stringify(issues, null, 2));
  console.log('First 10 issues:');
  issues.slice(0, 10).forEach((iss, i) => console.log(`${i + 1}. ${iss.id}: ${iss.reason} | Q: "${iss.text}" | Answer: "${iss.correctOption}"`));
} else {
  console.log('No consistency issues detected.');
}
