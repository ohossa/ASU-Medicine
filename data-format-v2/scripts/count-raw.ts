import { readFileSync, readdirSync } from 'node:fs';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const rawFiles = readdirSync(dir).filter((f) => /^raw_chunk_\d{3}\.txt$/.test(f)).sort();
let totalRawQuestions = 0;
let totalRawBytes = 0;

console.log('=== RAW CHUNK ANALYSIS ===');
for (const file of rawFiles) {
  const text = readFileSync(`${dir}/${file}`, 'utf-8');
  totalRawBytes += text.length;
  const count = (text.match(/^[0-9]+\.\s+/gm) || []).length;
  totalRawQuestions += count;
  console.log(`${file.replace('.txt', '')}: ${count} questions (${text.length} bytes)`);
}
console.log(`\nTOTAL raw questions (numbered): ${totalRawQuestions}`);
console.log(`TOTAL raw bytes: ${totalRawBytes}`);
