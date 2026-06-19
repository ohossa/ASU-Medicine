#!/usr/bin/env node
/**
 * patch-answers.js  (MCQ version)
 * ─────────────────────────────────
 * Reads all ch0X_CORRECTED.json files from this directory,
 * then patches the correctIndex, options, explanation, keyConcept,
 * and modelAnswer fields in the main question-bank-mcns2.json file.
 *
 * Usage:
 *   node patch-answers.js
 *
 * Creates a backup at question-bank-mcns2-pre-mcq-patch.json first.
 */

const fs = require('fs');
const path = require('path');

const BANK_PATH = path.resolve(__dirname, '../question-bank-mcns2/question-bank-mcns2.json');
const BACKUP_PATH = path.resolve(__dirname, '../question-bank-mcns2/question-bank-mcns2-pre-mcq-patch.json');
const CHAPTERS_DIR = __dirname;

// ── Load main question bank ──────────────────────────────────────────────────
console.log('Loading question bank...');
const bank = JSON.parse(fs.readFileSync(BANK_PATH, 'utf8'));

// ── Build lookup map: id -> question object ──────────────────────────────────
const lookup = new Map();

for (const ch of bank.chapters) {
  for (const subj of ch.subjects) {
    for (const q of subj.questions) {
      if (q.type === 'mcq') lookup.set(q.id, q);
      if (q.type === 'case' && q.subQuestions) {
        for (const sq of q.subQuestions) {
          if (sq.type === 'mcq') lookup.set(sq.id, sq);
        }
      }
    }
  }
}
console.log(`Indexed ${lookup.size} MCQ questions.`);

// ── Find all CORRECTED files ─────────────────────────────────────────────────
const correctedFiles = fs.readdirSync(CHAPTERS_DIR)
  .filter(f => f.endsWith('_CORRECTED.json'))
  .sort();

if (correctedFiles.length === 0) {
  console.error('No *_CORRECTED.json files found in mcq-chapters/. Nothing to do.');
  process.exit(1);
}

console.log(`Found ${correctedFiles.length} corrected file(s): ${correctedFiles.join(', ')}`);

// ── Validate and apply patches ───────────────────────────────────────────────
let patchedCount = 0;
let skippedCount = 0;
let warnings = [];

for (const file of correctedFiles) {
  const filepath = path.join(CHAPTERS_DIR, file);
  let corrected;
  try {
    corrected = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (e) {
    warnings.push(`❌ Could not parse ${file}: ${e.message}`);
    continue;
  }

  if (!Array.isArray(corrected)) {
    warnings.push(`❌ ${file} does not contain a JSON array at root level. Skipping.`);
    continue;
  }

  for (const item of corrected) {
    if (!item.id) {
      warnings.push(`⚠️  Entry in ${file} missing 'id'. Skipping.`);
      skippedCount++;
      continue;
    }

    const target = lookup.get(item.id);
    if (!target) {
      warnings.push(`⚠️  ID '${item.id}' from ${file} not found in question bank. Skipping.`);
      skippedCount++;
      continue;
    }

    // Validate correctIndex is in range
    const opts = item.options ?? target.options;
    if (item.correctIndex !== undefined) {
      if (item.correctIndex < 0 || item.correctIndex >= opts.length) {
        warnings.push(`⚠️  ID '${item.id}': correctIndex ${item.correctIndex} out of range (options length: ${opts.length}). Keeping original.`);
        skippedCount++;
        continue;
      }
    }

    // Apply patches
    if (item.options !== undefined)       target.options = item.options;
    if (item.correctIndex !== undefined)  target.correctIndex = item.correctIndex;
    if (item.explanation !== undefined)   target.explanation = item.explanation;
    if (item.keyConcept !== undefined)    target.keyConcept = item.keyConcept;
    if (item.modelAnswer !== undefined)   target.modelAnswer = item.modelAnswer;
    patchedCount++;
  }
}

// ── Report warnings ──────────────────────────────────────────────────────────
if (warnings.length > 0) {
  console.log('\n── Warnings / Errors ───────────────────────────────────');
  warnings.forEach(w => console.log(w));
  console.log('────────────────────────────────────────────────────────\n');
}

if (patchedCount === 0) {
  console.error('No questions were patched. Aborting — no file written.');
  process.exit(1);
}

// ── Backup then write ────────────────────────────────────────────────────────
console.log('Creating backup...');
fs.copyFileSync(BANK_PATH, BACKUP_PATH);
console.log(`Backup saved to: ${path.basename(BACKUP_PATH)}`);

console.log('Writing patched question bank...');
fs.writeFileSync(BANK_PATH, JSON.stringify(bank, null, 2));

console.log(`\n✅ Done!`);
console.log(`   Patched:  ${patchedCount} MCQs`);
console.log(`   Skipped:  ${skippedCount} (check warnings above)`);
console.log(`   Source:   ${BANK_PATH}`);
console.log(`   Backup:   ${BACKUP_PATH}`);
