import { readFileSync, readdirSync } from 'node:fs';

type Severity = 'error' | 'warning';
interface Issue {
  blockIndex: number;
  field?: string;
  severity: Severity;
  message: string;
}
interface ParsedBlock {
  raw: string;
  fields: Map<string, string>;
  type: string;
  index: number;
}

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

function parseBlocks(text: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];
  const rawBlocks = text.split(/\n?---\s*\n|(?:\n|^)---\s*(?=\n)/);
  for (let i = 0; i < rawBlocks.length; i++) {
    const raw = rawBlocks[i].trim();
    if (!raw || raw.startsWith('FLAGGED_') || raw.startsWith('SATA_') || raw.startsWith('REMOVED_')) continue;
    const fields = new Map<string, string>();
    const lines = raw.split('\n');
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
    const type = (fields.get('QUESTION_TYPE') ?? '').toLowerCase();
    blocks.push({ raw, fields, type, index: blocks.length + 1 });
  }
  return blocks;
}

function validateBlock(block: ParsedBlock, allTexts: Set<string>): Issue[] {
  const issues: Issue[] = [];
  const f = (key: string) => block.fields.get(key);
  const has = (key: string) => block.fields.has(key);
  const text = (f('TEXT') ?? '').trim();

  const required = ['QUESTION_TYPE', 'SUBJECT', 'CHAPTER', 'LECTURE', 'TEXT', 'ANSWER', 'EXPLANATION', 'KEY_CONCEPT'];
  for (const key of required) {
    if (key === 'ANSWER' && (block.type === 'matching' || block.type === 'case' || block.type === 'essay')) continue;
    if (key === 'TEXT' && block.type === 'case' && (f('CASE_TEXT') ?? '').trim()) continue;
    if (!has(key) || !f(key)) {
      issues.push({ blockIndex: block.index, field: key, severity: 'error', message: `Missing or empty: ${key}` });
    }
  }

  if (!VALID_TYPES.includes(block.type)) {
    issues.push({ blockIndex: block.index, field: 'QUESTION_TYPE', severity: 'error', message: `Invalid QUESTION_TYPE "${block.type}"` });
  }
  const subject = f('SUBJECT') ?? '';
  if (subject !== 'UNKNOWN' && !VALID_SUBJECTS.includes(subject)) {
    issues.push({ blockIndex: block.index, field: 'SUBJECT', severity: 'error', message: `Bad SUBJECT "${subject}"` });
  }

  const answer = (f('ANSWER') ?? '').trim();
  if (block.type === 'mcq') {
    if (answer !== 'N/A' && !/^[A-E]$/i.test(answer)) {
      issues.push({ blockIndex: block.index, field: 'ANSWER', severity: 'error', message: `Bad ANSWER "${answer}"` });
    } else if (answer !== 'N/A' && /^[A-E]$/i.test(answer)) {
      const optionLines = (f('OPTIONS') ?? '').split('\n').map(l => l.trim()).filter(Boolean);
      const maxLetter = String.fromCharCode(64 + optionLines.length);
      if (answer.toUpperCase() > maxLetter) {
        issues.push({ blockIndex: block.index, field: 'ANSWER', severity: 'error', message: `ANSWER "${answer}" > options ${optionLines.length}` });
      }
    }
    const opts = (f('OPTIONS') ?? '').split('\n').map(l => l.trim()).filter(Boolean);
    if (opts.length > 0 && (opts.length < 3 || opts.length > 5)) {
      issues.push({ blockIndex: block.index, field: 'OPTIONS', severity: 'error', message: `MCQ has ${opts.length} options` });
    }
  }

  if (text && allTexts.has(text)) {
    issues.push({ blockIndex: block.index, severity: 'warning', message: 'Duplicate TEXT' });
  }
  if (text) allTexts.add(text);

  return issues;
}

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const files = readdirSync(dir).filter((f: string) => f.startsWith('chunk_') && f.endsWith('.txt') && !f.includes('_FAILED'));
let pass = 0, warn = 0, fail = 0, noBlocks = 0;
const fails: string[] = [];
for (const file of files.sort()) {
  const text = readFileSync(`${dir}/${file}`, 'utf-8');
  const blocks = parseBlocks(text);
  if (blocks.length === 0) { noBlocks++; continue; }
  const allTexts = new Set<string>();
  const allIssues: Issue[] = [];
  for (const b of blocks) allIssues.push(...validateBlock(b, allTexts));
  const errors = allIssues.filter(i => i.severity === 'error');
  const warnings = allIssues.filter(i => i.severity === 'warning');
  if (errors.length > 0) {
    fail++;
    fails.push(`${file}: ${errors.map(e => `block${e.blockIndex} ${e.field ?? ''} ${e.message}`).slice(0,3).join(' | ')}`);
  } else if (warnings.length > 0) {
    warn++;
  } else {
    pass++;
  }
}
console.log(`Total: ${files.length}, Pass: ${pass}, Warn: ${warn}, Fail: ${fail}, NoBlocks: ${noBlocks}`);
for (const f of fails.slice(0, 20)) console.log(f);
