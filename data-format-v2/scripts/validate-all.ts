import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';

const VALID_TYPES = ['mcq', 'truefalse', 'essay', 'fillblank', 'matching', 'case', 'short essay', 'shortessay'];
const VALID_SUBJECTS = [
  'Anatomy', 'Histology', 'Physiology', 'Biochemistry',
  'Microbiology', 'Parasitology', 'Pathology', 'Pharmacology',
  'Psychiatry', 'Ophthalmology', 'ENT', 'Clinical', 'UNKNOWN',
  'Neurology', 'Gastroenterology', 'Anesthesiology', 'Medicine',
  'Surgery', 'Orthopedics', 'Pediatrics', 'Dermatology',
  'Radiology', 'Forensic Medicine', 'Embryology', 'Neurosurgery',
  'General Surgery', 'Obstetrics', 'Gynecology',
];

let totalFiles = 0, totalBlocks = 0, totalErrors = 0, totalWarnings = 0;
const details: string[] = [];

const files = readdirSync(dir)
  .filter(f => f.startsWith('chunk_') && f.endsWith('.txt') && !f.includes('_FAILED'))
  .sort();

for (const file of files) {
  const text = readFileSync(join(dir, file), 'utf-8');
  const rawBlocks = text.split(/\n?---\s*\n|(?:\n|^)---\s*(?=\n)/);
  let blockCount = 0, errors = 0, warnings = 0;
  const seenTexts = new Map<string, number>();

  for (let i = 0; i < rawBlocks.length; i++) {
    const raw = rawBlocks[i].trim();
    if (!raw || raw.startsWith('FLAGGED_') || raw.startsWith('SATA_') || raw.startsWith('REMOVED_')) continue;
    blockCount++;
    const lines = raw.split('\n');
    const fields = new Map<string, string>();
    let key = '';
    let val = '';
    for (const line of lines) {
      const m = line.match(/^([A-Z_]+):\s*(.*)$/);
      if (m) {
        if (key) fields.set(key, val.trim());
        key = m[1];
        val = m[2];
      } else if (key) {
        val += '\n' + line;
      }
    }
    if (key) fields.set(key, val.trim());

    const type = (fields.get('QUESTION_TYPE') ?? '').toLowerCase();
    if (!VALID_TYPES.includes(type)) errors++;
    const subject = fields.get('SUBJECT') ?? '';
    if (subject && subject !== 'UNKNOWN' && !VALID_SUBJECTS.includes(subject)) errors++;

    const required = ['QUESTION_TYPE', 'SUBJECT', 'CHAPTER', 'LECTURE', 'TEXT', 'ANSWER', 'EXPLANATION', 'KEY_CONCEPT'];
    for (const k of required) {
      if (!fields.has(k) || !fields.get(k)) errors++;
    }
    if (fields.get('CHAPTER') && (fields.get('CHAPTER') ?? '').trim().split('\n').length > 1) warnings++;

    if (type === 'mcq' || type === 'truefalse') {
      const opts = (fields.get('OPTIONS') ?? '').split('\n').map(l => l.trim()).filter(Boolean);
      if (opts.length === 0 || opts.some(l => !/^[A-E]\)\s+/.test(l))) errors++;
      if (type === 'mcq' && (opts.length < 3 || opts.length > 5)) errors++;
      const answer = (fields.get('ANSWER') ?? '').trim();
      if (answer !== 'N/A' && answer > String.fromCharCode(64 + opts.length)) errors++;
    }
    const ans = (fields.get('ANSWER') ?? '').trim();
    if (type === 'mcq' && !/^[A-E]$/.test(ans) && ans !== 'N/A') errors++;
    if (type === 'truefalse' && !/^(True|False)$/i.test(ans)) errors++;

    const t = (fields.get('TEXT') ?? '').trim();
    if (t) {
      if (seenTexts.has(t)) warnings++;
      else seenTexts.set(t, blockCount);
    }
  }
  totalFiles++;
  totalBlocks += blockCount;
  totalErrors += errors;
  totalWarnings += warnings;
  details.push(`${file}: blocks=${blockCount} errors=${errors} warnings=${warnings}`);
}

console.log(`Total files: ${totalFiles}`);
console.log(`Total blocks: ${totalBlocks}`);
console.log(`Total errors: ${totalErrors}`);
console.log(`Total warnings: ${totalWarnings}`);
console.log('---');
for (const d of details) console.log(d);
