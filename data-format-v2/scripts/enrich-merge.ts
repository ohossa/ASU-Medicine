import * as fs from 'fs';
const batchPath = process.argv[2];
const jsonlPath = process.argv[3];
if (!batchPath || !jsonlPath) { console.error('Usage: tsx enrich-merge.ts <batch.json> <enrich.jsonl>'); process.exit(1); }
const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
const lines = fs.readFileSync(jsonlPath, 'utf8').trim().split('\n').filter(Boolean);
let merged = 0;
for (const line of lines) {
  const obj = JSON.parse(line);
  const q = batch.questions[obj.index];
  if (!q) { console.error('Missing index', obj.index); continue; }
  if (obj.explanation) q.explanation = obj.explanation;
  if (obj.keyConcept) q.keyConcept = obj.keyConcept;
  if (obj.correctAnswer && (!q.correctAnswer || q.correctAnswer === 'N/A')) q.correctAnswer = obj.correctAnswer;
  if (obj.modelAnswer && q.type === 'essay') q.modelAnswer = obj.modelAnswer;
  if (obj.modelAnswer && q.type === 'case') q.modelAnswer = obj.modelAnswer;
  merged++;
}
fs.writeFileSync(batchPath, JSON.stringify(batch, null, 2));
console.log('Merged', merged, 'records into', batchPath);
