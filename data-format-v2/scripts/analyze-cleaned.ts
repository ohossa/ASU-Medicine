import { readFileSync, readdirSync } from 'node:fs';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const files = readdirSync(dir).filter((f: string) => /^chunk_\d{3}\.txt$/.test(f));

interface Summary {
  totalBlocks: number;
  mcq: number;
  truefalse: number;
  essay: number;
  shortessay: number;
  fillblank: number;
  matching: number;
  case: number;
  unknownType: number;
  bySubject: Record<string, number>;
  missingAnswer: number;
  missingExplanation: number;
  missingKeyConcept: number;
  withImages: number;
  duplicates: Record<string, { count: number; files: string[] }>;
  emptyFiles: number;
  sataBlocks: number;
  flaggedBlocks: number;
  removedBlocks: number;
  chunkCounts: Record<string, number>;
}

const summary: Summary = {
  totalBlocks: 0,
  mcq: 0,
  truefalse: 0,
  essay: 0,
  shortessay: 0,
  fillblank: 0,
  matching: 0,
  case: 0,
  unknownType: 0,
  bySubject: {},
  missingAnswer: 0,
  missingExplanation: 0,
  missingKeyConcept: 0,
  withImages: 0,
  duplicates: {},
  emptyFiles: 0,
  sataBlocks: 0,
  flaggedBlocks: 0,
  removedBlocks: 0,
  chunkCounts: {},
};

const allTexts = new Map<string, string[]>();

for (const file of files.sort()) {
  const text = readFileSync(`${dir}/${file}`, 'utf-8');
  const rawBlocks = text.split(/\n?---\s*\n|(?:\n|^)---\s*(?=\n)/);
  let fileBlocks = 0;
  const seenTexts = new Set<string>();

  for (const raw of rawBlocks) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('FLAGGED_')) { summary.flaggedBlocks++; continue; }
    if (trimmed.startsWith('SATA_')) { summary.sataBlocks++; continue; }
    if (trimmed.startsWith('REMOVED_')) { summary.removedBlocks++; continue; }
    if (!trimmed.startsWith('QUESTION_TYPE')) continue;

    fileBlocks++;
    summary.totalBlocks++;

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
    if (type === 'mcq') summary.mcq++;
    else if (type === 'truefalse') summary.truefalse++;
    else if (type === 'essay') summary.essay++;
    else if (type === 'short essay' || type === 'shortessay') summary.shortessay++;
    else if (type === 'fillblank') summary.fillblank++;
    else if (type === 'matching') summary.matching++;
    else if (type === 'case') summary.case++;
    else summary.unknownType++;

    const subject = fields.get('SUBJECT') ?? 'UNKNOWN';
    summary.bySubject[subject] = (summary.bySubject[subject] ?? 0) + 1;

    const answer = (fields.get('ANSWER') ?? '').trim();
    if (!answer || answer === 'N/A') summary.missingAnswer++;

    const explanation = (fields.get('EXPLANATION') ?? '').trim();
    if (!explanation || explanation === 'N/A') summary.missingExplanation++;

    const keyConcept = (fields.get('KEY_CONCEPT') ?? '').trim();
    if (!keyConcept || keyConcept === 'N/A') summary.missingKeyConcept++;

    const qText = (fields.get('TEXT') ?? '').toLowerCase();
    if (/\b(fig|figure|table|diagram|image|photograph|as shown in)\b/.test(qText)) summary.withImages++;

    const textVal = (fields.get('TEXT') ?? '').trim();
    if (textVal) {
      const existing = allTexts.get(textVal) ?? [];
      existing.push(file);
      allTexts.set(textVal, existing);
      if (seenTexts.has(textVal)) {
        summary.duplicates[textVal] = { count: (summary.duplicates[textVal]?.count ?? 0) + 1, files: [] };
      }
      seenTexts.add(textVal);
    }
  }

  summary.chunkCounts[file] = fileBlocks;
  if (fileBlocks === 0) summary.emptyFiles++;
}

for (const [text, filesArr] of allTexts.entries()) {
  if (filesArr.length > 1) {
    summary.duplicates[text] = { count: filesArr.length, files: [...new Set(filesArr)] };
  }
}

// Top-level summary
console.log('='.repeat(70));
console.log('FULL CLEANED DATASET ANALYSIS');
console.log('='.repeat(70));
console.log();
console.log('=== CHUNK COUNTS ===');
for (const [file, count] of Object.entries(summary.chunkCounts).sort()) {
  console.log(`  ${file.replace('.txt', '')}: ${count} blocks`);
}
console.log();
console.log('=== HIGH-LEVEL TOTALS ===');
console.log(`  Total question blocks:              ${summary.totalBlocks}`);
console.log(`  Intentionally empty chunks:         ${summary.emptyFiles}`);
console.log(`  FLAGGED blocks (unrecoverable):     ${summary.flaggedBlocks}`);
console.log(`  SATA blocks:                        ${summary.sataBlocks}`);
console.log(`  REMOVED blocks:                     ${summary.removedBlocks}`);
console.log();
console.log('=== QUESTION TYPE BREAKDOWN ===');
console.log(`  MCQ:                 ${summary.mcq}`);
console.log(`  True/False:          ${summary.truefalse}`);
console.log(`  Essay:               ${summary.essay}`);
console.log(`  Short Essay:         ${summary.shortessay}`);
console.log(`  Fill in the Blank:   ${summary.fillblank}`);
console.log(`  Matching:            ${summary.matching}`);
console.log(`  Case-Based:          ${summary.case}`);
console.log(`  Unknown/Other:       ${summary.unknownType}`);
console.log();
console.log('=== SUBJECT BREAKDOWN ===');
for (const [subj, count] of Object.entries(summary.bySubject).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${subj.padEnd(20)} ${count}`);
}
console.log();
console.log('=== MISSING DATA (PLANES TO fills) ===');
console.log(`  Missing ANSWER (N/A):        ${summary.missingAnswer}`);
console.log(`  Missing EXPLANATION (N/A):   ${summary.missingExplanation}`);
console.log(`  Missing KEY_CONCEPT (N/A):   ${summary.missingKeyConcept}`);
console.log();
console.log('=== IMAGES ===');
console.log(`  Questions referencing figures/tables/images: ${summary.withImages}`);
console.log();
console.log('=== CROSS-CHUNK DUPLICATES ===');
const crossChunkDupes = Object.entries(summary.duplicates).filter(([ , info]) => info.files.length > 1);
console.log(`  Unique questions appearing in 2+ chunks: ${crossChunkDupes.length}`);
if (crossChunkDupes.length > 0) {
  console.log('  Examples (first 15):');
  for (let i = 0; i < Math.min(15, crossChunkDupes.length); i++) {
    const [text, info] = crossChunkDupes[i];
    console.log(`    - "${text.substring(0, 60)}..." appears in ${info.files.length} files, ${info.count} total occurrences`);
  }
}
console.log();
console.log('='.repeat(70));
