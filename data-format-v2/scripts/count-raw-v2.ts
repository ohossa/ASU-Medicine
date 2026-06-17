import { readFileSync, readdirSync } from 'node:fs';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const rawFiles = readdirSync(dir).filter((f) => /^raw_chunk_\d{3}\.txt$/.test(f)).sort();
let totalRaw = 0;
console.log('=== ACCURATE RAW QUESTION COUNT ===');
for (const file of rawFiles) {
  const text = readFileSync(`${dir}/${file}`, 'utf-8');
  // Count question-stem lines: lines starting with NUMBER. followed by uppercase letter (question text)
  const mcqCount = (text.match(/^[0-9]+\.\s+[A-Z]/gm) || []).length;
  // Count essay headers: Question N: or Question N.
  const essayCount = (text.match(/^Question\s*[0-9]+\s*[:.]/gim) || []).length;
  const count = mcqCount + essayCount;
  totalRaw += count;
  console.log(`${file.replace('.txt', '')}: ${count} questions (${mcqCount} MCQ + ${essayCount} essay headers)`);
}
console.log(`\nTOTAL accurate raw questions: ${totalRaw}`);
