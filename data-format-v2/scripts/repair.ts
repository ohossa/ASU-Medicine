import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const VALID_SUBJECTS = [
  'Anatomy', 'Histology', 'Physiology', 'Biochemistry',
  'Microbiology', 'Parasitology', 'Pathology', 'Pharmacology',
  'Psychiatry', 'Ophthalmology', 'ENT', 'Clinical', 'UNKNOWN',
  'Neurology', 'Gastroenterology', 'Anesthesiology', 'Medicine',
  'Surgery', 'Orthopedics', 'Pediatrics', 'Dermatology',
  'Radiology', 'Forensic Medicine', 'Embryology', 'Neurosurgery',
  'General Surgery', 'Obstetrics', 'Gynecology',
];

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const files = readdirSync(dir)
  .filter(f => f.startsWith('chunk_') && f.endsWith('.txt') && !f.includes('_FAILED'));

let fixedCount = 0;
let severeCount = 0;

for (const file of files) {
  const text = readFileSync(join(dir, file), 'utf-8');
  const blocks = text.split(/\n?---\s*\n|(?:\n|^)---\s*(?=\n)/);
  const newBlocks: string[] = [];
  let changed = false;
  let severe = false;

  for (const raw of blocks) {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('FLAGGED_') || trimmed.startsWith('SATA_') || trimmed.startsWith('REMOVED_')) {
      newBlocks.push(raw);
      continue;
    }

    const fields = new Map<string, string>();
    const lines = trimmed.split('\n');
    let currentKey = '';
    let currentValue = '';
    for (const line of lines) {
      const labelMatch = line.match(/^([A-Z_]+):\s*(.*)$/);
      if (labelMatch) {
        if (currentKey) fields.set(currentKey, currentValue.trim());
        currentKey = labelMatch[1];
        currentValue = labelMatch[2];
      } else if (currentKey) {
        currentValue += '\n' + line;
      }
    }
    if (currentKey) fields.set(currentKey, currentValue.trim());

    const type = (fields.get('QUESTION_TYPE') ?? '').toLowerCase().trim();

    // Normalize question type
    if (type === 'true or false') { fields.set('QUESTION_TYPE', 'truefalse'); changed = true; }
    if (type === 'short essay') { fields.set('QUESTION_TYPE', 'essay'); changed = true; }
    if (type === 'short_essay') { fields.set('QUESTION_TYPE', 'essay'); changed = true; }

    // Severely truncated block check
    if (!type || !fields.get('TEXT')) {
      severe = true;
      newBlocks.push(raw);
      continue;
    }

    // Fix CHAPTER if missing
    if (!fields.get('CHAPTER')) {
      fields.set('CHAPTER', 'UNKNOWN');
      changed = true;
    }

    // Fix SUBJECT if it's not in valid list but we can map it
    const subject = fields.get('SUBJECT') ?? '';
    const knownSubjects = new Set([...VALID_SUBJECTS, 'Neurotransmitters', 'Nitrogen Metabolism', 'One Carbon Metabolism', 'Neuroanatomy', 'Psychiatry']);
    if (subject && !knownSubjects.has(subject)) {
      fields.set('SUBJECT', 'UNKNOWN');
      changed = true;
    }

    // Fix ANSWER containing newline
    if (fields.has('ANSWER')) {
      const ans = fields.get('ANSWER')!;
      const idx = ans.indexOf('\n');
      if (idx >= 0) {
        const first = ans.substring(0, idx).trim();
        if (/^[A-E]$/i.test(first) || first === 'N/A') {
          fields.set('ANSWER', first);
        } else {
          fields.set('ANSWER', 'N/A');
        }
        changed = true;
      }
    }

    // Add missing fields
    if (!fields.get('ANSWER') && type !== 'matching' && type !== 'case' && type !== 'essay') {
      fields.set('ANSWER', 'N/A');
      changed = true;
    }
    if (!fields.get('EXPLANATION')) {
      fields.set('EXPLANATION', 'N/A');
      changed = true;
    }
    if (!fields.get('KEY_CONCEPT')) {
      fields.set('KEY_CONCEPT', 'N/A');
      changed = true;
    }
    if (!fields.get('LECTURE')) {
      fields.set('LECTURE', 'N/A');
      changed = true;
    }

    // Reconstruct block preserving format
    const order = ['QUESTION_TYPE', 'SUBJECT', 'CHAPTER', 'LECTURE', 'TEXT', 'OPTIONS', 'ANSWER', 'BLANKS', 'PAIRS', 'CASE_TEXT', 'EXPLANATION', 'KEY_CONCEPT'];
    const newLines: string[] = [];
    for (const key of order) {
      if (fields.has(key)) {
        const value = fields.get(key)!;
        if (value === '' || value.includes('\n')) {
          newLines.push(`${key}:\n${value}`);
        } else {
          newLines.push(`${key}: ${value}`);
        }
      }
    }
    // Add any extra fields
    for (const [key, value] of fields) {
      if (!order.includes(key)) {
        if (value === '' || value.includes('\n')) {
          newLines.push(`${key}:\n${value}`);
        } else {
          newLines.push(`${key}: ${value}`);
        }
      }
    }
    newBlocks.push(newLines.join('\n'));
  }

  if (severe) { severeCount++; continue; }
  if (changed) {
    const cleaned = newBlocks.join('\n\n---\n\n');
    writeFileSync(join(dir, file), cleaned);
    fixedCount++;
  }
}

console.log(`Fixed: ${fixedCount}, Severe (need reprocess): ${severeCount}`);
