import * as fs from 'fs';

// Load the deduped bank
const bank = JSON.parse(fs.readFileSync('data-format-v2/question-bank-mcns2/question-bank-mcns2-deduped.json', 'utf8'));
const errors: string[] = [];

// 1. Schema version
if (bank.schemaVersion !== 1) errors.push('schemaVersion must be 1');

// 2. Meta fields
const meta = bank.meta;
if (!meta || meta.moduleCode !== 'MCNS-2') errors.push('meta.moduleCode must be MCNS-2');
if (!meta.moduleName) errors.push('meta.moduleName missing');

// 3. Chapters exist
if (!Array.isArray(bank.chapters) || bank.chapters.length === 0) errors.push('chapters missing');

// 4. Validate every question
const seenIds = new Set<string>();
let total = 0;
for (const ch of bank.chapters) {
  if (typeof ch.id !== 'number') errors.push(`Chapter ${ch.title} missing id`);
  if (!ch.title) errors.push('Chapter missing title');
  if (!Array.isArray(ch.subjects)) { errors.push(`${ch.title}: subjects missing`); continue; }
  
  for (const sub of ch.subjects) {
    if (!sub.id || !sub.name) errors.push(`${ch.title}: subject missing id/name`);
    if (!Array.isArray(sub.questions)) { errors.push(`${ch.title}/${sub.id}: questions missing`); continue; }
    
    for (const q of sub.questions) {
      total++;
      if (seenIds.has(q.id)) errors.push(`Duplicate ID: ${q.id}`);
      seenIds.add(q.id);
      
      if (!q.text || q.text.length < 3) errors.push(`${q.id}: text too short/missing`);
      if (!q.explanation || q.explanation.length < 10) errors.push(`${q.id}: explanation too short`);
      if (q.lecture == null) errors.push(`${q.id}: lecture missing`);
      if (!q.type) errors.push(`${q.id}: type missing`);
      
      if (q.type === 'mcq' || q.type === 'truefalse') {
        if (!Array.isArray(q.options) || q.options.length < 2) errors.push(`${q.id}: <2 options`);
        if (q.correctIndex == null) errors.push(`${q.id}: correctIndex missing`);
        else if (q.correctIndex < 0 || q.correctIndex >= (q.options?.length || 0)) {
          errors.push(`${q.id}: correctIndex out of bounds (${q.correctIndex} vs ${q.options?.length})`);
        }
      }
      
      if (q.type === 'essay' && (!q.modelAnswer || q.modelAnswer.length < 5)) {
        errors.push(`${q.id}: essay missing modelAnswer`);
      }
      
      if (q.type === 'case') {
        if (!Array.isArray(q.subQuestions) || q.subQuestions.length === 0) {
          errors.push(`${q.id}: case missing subQuestions`);
        } else {
          for (const sq of q.subQuestions) {
            if (!sq.text || sq.text.length < 3) errors.push(`${q.id}/${sq.id}: subQ text missing`);
            if (sq.type === 'mcq') {
              if (!Array.isArray(sq.options) || sq.options.length < 2) errors.push(`${q.id}/${sq.id}: subQ <2 options`);
              if (sq.correctIndex == null) errors.push(`${q.id}/${sq.id}: subQ correctIndex missing`);
              else if (sq.correctIndex < 0 || sq.correctIndex >= (sq.options?.length || 0)) {
                errors.push(`${q.id}/${sq.id}: subQ correctIndex out of bounds`);
              }
            }
            if (sq.type === 'essay' && (!sq.modelAnswer || sq.modelAnswer.length < 5)) {
              errors.push(`${q.id}/${sq.id}: subQ essay missing modelAnswer`);
            }
          }
        }
      }
      
      if (q.type === 'matching') {
        if (!Array.isArray(q.pairs) || q.pairs.length === 0) errors.push(`${q.id}: matching missing pairs`);
      }
      
      if (q.type === 'fillblank') {
        if (!Array.isArray(q.blanks) || q.blanks.length === 0) errors.push(`${q.id}: fillblank missing blanks`);
        const slotCount = (q.text.match(/___/g) || []).length;
        if (slotCount !== q.blanks.length) errors.push(`${q.id}: fillblank mismatch (${slotCount} slots vs ${q.blanks.length} blanks)`);
      }
    }
  }
}

console.log(`=== INTEGRATION TEST ===`);
console.log(`Total questions checked: ${total}`);
console.log(`Unique IDs: ${seenIds.size}`);
console.log(`Errors: ${errors.length}`);
if (errors.length > 0) {
  console.log('\nErrors:');
  errors.forEach((e, i) => console.log(`${i + 1}. ${e}`));
  process.exit(1);
} else {
  console.log('✅ All integration tests passed');
  process.exit(0);
}
