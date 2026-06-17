import { readFile } from 'node:fs/promises';

/* ═══════════════════════════════════════════════════════════════
   Cleaner Output Validator — Two-Step Pipeline Quality Gate
   ═══════════════════════════════════════════════════════════════
   Run: npx tsx data-format-v2/scripts/validate-cleaner-output.ts <file>
   Or:  cat cleaner-output.txt | npx tsx data-format-v2/scripts/validate-cleaner-output.ts
   ═══════════════════════════════════════════════════════════════ */

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
const IMAGE_REF_PATTERN = /\b(fig(ure)?\.?\s*\d|table\s*\d|diagram|image|photograph|histological\s+slide|as\s+shown\s+in\s+(the\s+)?(fig|table|image)|identify\s+the\s+labeled\s+structure|the\s+arrow\s+in)\b/gi;
const SATA_PATTERN = /\b(select\s+all\s+that\s+apply|choose\s+all\s+(the\s+)?correct\s+(statements|answers|options)|select\s+all\s+that\s+are\s+true|mark\s+all\s+correct\s+options)\b/gi;

function parseBlocks(text: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];
  // Split by --- lines (with optional surrounding whitespace/blank lines)
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

function validateBlock(block: ParsedBlock): Issue[] {
  const issues: Issue[] = [];
  const f = (key: string) => block.fields.get(key);
  const has = (key: string) => block.fields.has(key);

  // ── Required fields ──────────────────────────────────────────
  const required = ['QUESTION_TYPE', 'SUBJECT', 'CHAPTER', 'LECTURE', 'TEXT', 'ANSWER', 'EXPLANATION', 'KEY_CONCEPT'];
  for (const key of required) {
    if (key === 'ANSWER' && (block.type === 'matching' || block.type === 'case' || block.type === 'essay')) continue;
    if (key === 'TEXT' && block.type === 'case' && (f('CASE_TEXT') ?? '').trim()) continue;
    if (!has(key) || !f(key)) {
      issues.push({ blockIndex: block.index, field: key, severity: 'error', message: `Missing or empty required field: ${key}` });
    }
  }

  // ── Type validation ──────────────────────────────────────────
  if (!VALID_TYPES.includes(block.type)) {
    issues.push({
      blockIndex: block.index, field: 'QUESTION_TYPE',
      severity: 'error',
      message: `Invalid QUESTION_TYPE "${block.type}". Must be one of: ${VALID_TYPES.join(', ')}`,
    });
  }

  // ── Subject validation ───────────────────────────────────────
  const subject = f('SUBJECT') ?? '';
  if (subject !== 'UNKNOWN' && !VALID_SUBJECTS.includes(subject)) {
    issues.push({
      blockIndex: block.index, field: 'SUBJECT',
      severity: 'error',
      message: `Invalid SUBJECT "${subject}". Must be one of the 12 canonical names or "UNKNOWN".`,
    });
  }

  // ── Lecture validation ───────────────────────────────────────
  const lecture = f('LECTURE');
  if (lecture && lecture.trim() !== 'N/A' && !/^\d+$/.test(lecture.trim())) {
    issues.push({
      blockIndex: block.index, field: 'LECTURE',
      severity: 'warning',
      message: `LECTURE "${lecture}" is not a pure integer.`,
    });
  }

  // ── Options validation ───────────────────────────────────────
  if (block.type === 'mcq' || block.type === 'truefalse') {
    const optionsText = f('OPTIONS') ?? '';
    const optionLines = optionsText.split('\n').map(l => l.trim()).filter(Boolean);
    const optionCount = optionLines.length;

    if (optionCount === 0) {
      issues.push({ blockIndex: block.index, field: 'OPTIONS', severity: 'error', message: 'OPTIONS is empty.' });
    } else {
      const badOptions = optionLines.filter(l => !/^[A-E]\)\s+/.test(l));
      if (badOptions.length > 0) {
        issues.push({
          blockIndex: block.index, field: 'OPTIONS',
          severity: 'error',
          message: `${badOptions.length} option(s) are not normalized to "A) text" format.`,
        });
      }

      if (block.type === 'mcq' && (optionCount < 3 || optionCount > 5)) {
        issues.push({
          blockIndex: block.index, field: 'OPTIONS',
          severity: 'error',
          message: `MCQ has ${optionCount} options. Expected 3–5.`,
        });
      }
      if (block.type === 'truefalse' && optionCount !== 2) {
        issues.push({
          blockIndex: block.index, field: 'OPTIONS',
          severity: 'error',
          message: `True/False has ${optionCount} options. Expected exactly 2.`,
        });
      }
    }
  }

  // ── Answer validation ────────────────────────────────────────
  const answer = (f('ANSWER') ?? '').trim();
  if (block.type === 'mcq') {
    if (!/^[A-E]$/i.test(answer) && answer !== 'N/A') {
      issues.push({
        blockIndex: block.index, field: 'ANSWER',
        severity: 'error',
        message: `ANSWER "${answer}" is not a single capital letter A–E.`,
      });
    } else {
      const optionLines = (f('OPTIONS') ?? '').split('\n').map(l => l.trim()).filter(Boolean);
      const maxLetter = String.fromCharCode(64 + optionLines.length); // A=1, B=2...
      if (answer !== 'N/A' && answer > maxLetter) {
        issues.push({
          blockIndex: block.index, field: 'ANSWER',
          severity: 'error',
          message: `ANSWER "${answer}" exceeds the number of options (${optionLines.length}).`,
        });
      }
    }
  } else if (block.type === 'truefalse') {
    if (!/^(True|False)$/i.test(answer)) {
      issues.push({
        blockIndex: block.index, field: 'ANSWER',
        severity: 'error',
        message: `ANSWER "${answer}" is not "True" or "False".`,
      });
    }
  }

  // ── Fillblank validation ─────────────────────────────────────
  if (block.type === 'fillblank') {
    const text = f('TEXT') ?? '';
    const blankCount = (text.match(/___/g) || []).length;
    const blanksText = f('BLANKS') ?? '';
    const blanksLines = blanksText.split('\n').map(l => l.trim()).filter(Boolean);
    const answerCount = blanksLines.length;

    if (blankCount === 0) {
      issues.push({ blockIndex: block.index, field: 'TEXT', severity: 'error', message: 'Fillblank TEXT has no "___" slots.' });
    }
    if (answerCount === 0) {
      issues.push({ blockIndex: block.index, field: 'BLANKS', severity: 'error', message: 'BLANKS is empty.' });
    }
    if (blankCount > 0 && answerCount > 0 && blankCount !== answerCount) {
      issues.push({
        blockIndex: block.index,
        severity: 'error',
        message: `Fillblank mismatch: ${blankCount} "___" slots but ${answerCount} BLANKS answers.`,
      });
    }
  }

  // ── Matching validation ──────────────────────────────────────
  if (block.type === 'matching') {
    const pairsText = f('PAIRS') ?? '';
    const pairLines = pairsText.split('\n').map(l => l.trim()).filter(Boolean);
    if (pairLines.length === 0) {
      issues.push({ blockIndex: block.index, field: 'PAIRS', severity: 'error', message: 'PAIRS is empty.' });
    } else {
      const badPairs = pairLines.filter(l => !l.includes('='));
      if (badPairs.length > 0) {
        issues.push({
          blockIndex: block.index, field: 'PAIRS',
          severity: 'error',
          message: `${badPairs.length} pair(s) missing "=" separator.`,
        });
      }
    }
  }

  // ── Case validation ──────────────────────────────────────────
  if (block.type === 'case') {
    const caseText = (f('CASE_TEXT') ?? '') || (f('TEXT') ?? '');
    if (!caseText.trim()) {
      issues.push({ blockIndex: block.index, field: 'TEXT', severity: 'error', message: 'Case TEXT is empty.' });
    }
    const subText = f('SUB_QUESTIONS') ?? '';
    if (!subText.trim()) {
      issues.push({ blockIndex: block.index, field: 'SUB_QUESTIONS', severity: 'error', message: 'Case has no SUB_QUESTIONS.' });
    }
  }

  // ── N/A validation ───────────────────────────────────────────
  if (f('EXPLANATION')?.trim() !== 'N/A') {
    const len = (f('EXPLANATION') ?? '').length;
    if (len < 20) {
      issues.push({ blockIndex: block.index, field: 'EXPLANATION', severity: 'warning', message: `Explanation is very short (${len} chars).` });
    }
  }
  if (f('KEY_CONCEPT')?.trim() !== 'N/A') {
    const len = (f('KEY_CONCEPT') ?? '').length;
    if (len < 10) {
      issues.push({ blockIndex: block.index, field: 'KEY_CONCEPT', severity: 'warning', message: `Key concept is very short (${len} chars).` });
    }
  }

  // ── Image reference leak detection ───────────────────────────
  const fullText = `${f('TEXT') ?? ''} ${f('CASE_TEXT') ?? ''}`;
  if (IMAGE_REF_PATTERN.test(fullText)) {
    issues.push({
      blockIndex: block.index,
      severity: 'error',
      message: 'Possible image-based question detected in clean output. Must be in REMOVED section only.',
    });
  }

  // ── SATA leak detection ──────────────────────────────────────
  if (block.type !== 'matching') {
    const allText = block.raw.replace(/\s+/g, ' ');
    if (SATA_PATTERN.test(allText)) {
      issues.push({
        blockIndex: block.index,
        severity: 'error',
        message: 'Possible SATA question detected in clean output. Must be in SATA section only.',
      });
    }
  }

  // ── Duplicate detection (within block) ───────────────────────
  const seenOptions = new Set<string>();
  const optionLines = (f('OPTIONS') ?? '').split('\n').map(l => l.trim()).filter(Boolean);
  for (const opt of optionLines) {
    const text = opt.replace(/^[A-E]\)\s*/, '').toLowerCase();
    if (seenOptions.has(text)) {
      issues.push({
        blockIndex: block.index, field: 'OPTIONS',
        severity: 'error',
        message: `Duplicate option text detected: "${text}".`,
      });
    }
    seenOptions.add(text);
  }

  return issues;
}

// ── Cross-block validation ─────────────────────────────────────
function validateCrossBlock(blocks: ParsedBlock[]): Issue[] {
  const issues: Issue[] = [];
  const seenTexts = new Map<string, number>();

  for (const block of blocks) {
    const text = (block.fields.get('TEXT') ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
    if (text) {
      if (seenTexts.has(text)) {
        const firstIdx = seenTexts.get(text)!;
        issues.push({
          blockIndex: block.index,
          severity: 'warning',
          message: `Duplicate question text (first seen in block ${firstIdx}).`,
        });
      } else {
        seenTexts.set(text, block.index);
      }
    }
  }

  return issues;
}

// ── Main ───────────────────────────────────────────────────────
async function main() {
  const input = process.argv[2]
    ? await readFile(process.argv[2], 'utf-8')
    : await readStdin();

  const blocks = parseBlocks(input);

  if (blocks.length === 0) {
    console.error('\n❌ No valid question blocks found in input.\n');
    console.error('Hint: Blocks should be separated by --- lines and start with QUESTION_TYPE:');
    process.exit(1);
  }

  const allIssues: Issue[] = [];
  for (const block of blocks) {
    allIssues.push(...validateBlock(block));
  }
  allIssues.push(...validateCrossBlock(blocks));

  const errors = allIssues.filter(i => i.severity === 'error');
  const warnings = allIssues.filter(i => i.severity === 'warning');

  console.log(`\n═══════════════════════════════════════════════════════════════`);
  console.log(`  Cleaner Output Validation Report`);
  console.log(`═══════════════════════════════════════════════════════════════`);
  console.log(`  Blocks parsed:     ${blocks.length}`);
  console.log(`  Errors:            ${errors.length}`);
  console.log(`  Warnings:          ${warnings.length}`);
  console.log(`═══════════════════════════════════════════════════════════════\n`);

  if (errors.length > 0) {
    console.log('ERRORS:');
    for (const issue of errors) {
      const field = issue.field ? ` [${issue.field}]` : '';
      console.log(`  Block ${issue.blockIndex}${field}: ${issue.message}`);
    }
    console.log();
  }

  if (warnings.length > 0) {
    console.log('WARNINGS:');
    for (const issue of warnings) {
      const field = issue.field ? ` [${issue.field}]` : '';
      console.log(`  Block ${issue.blockIndex}${field}: ${issue.message}`);
    }
    console.log();
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All blocks passed validation. Ready for Step 2 (Converter).\n');
    process.exit(0);
  } else if (errors.length === 0) {
    console.log('⚠️  Passed with warnings. Review warnings before conversion.\n');
    process.exit(0);
  } else {
    console.log('❌ Validation FAILED. Fix errors before running the converter.\n');
    process.exit(1);
  }
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', chunk => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(2);
});
