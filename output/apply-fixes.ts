import * as fs from 'fs';

interface Question {
  id: string;
  type: string;
  lecture: number;
  text: string;
  explanation: string;
  keyConcept: string;
  options?: string[];
  correctIndex?: number;
}

// Load the question bank
const bankData = JSON.parse(fs.readFileSync('question-bank-mcns2.json', 'utf-8'));
const questions: Question[] = bankData.questions;

// Read the fixes
const fixLines = fs.readFileSync('fix-medium-1.jsonl', 'utf-8').trim().split('\n');
const fixes = fixLines.map(line => JSON.parse(line)).filter(f => f.correctIndex >= 0);

console.log(`Loaded ${fixes.length} valid fixes`);

// Create a map for quick lookup
const questionMap = new Map<string, Question>();
questions.forEach((q, idx) => questionMap.set(q.id, q));

// Apply each fix
let applied = 0;
for (const fix of fixes) {
  const q = questionMap.get(fix.id);
  if (q) {
    const oldIndex = q.correctIndex;
    q.correctIndex = fix.correctIndex;
    console.log(`Fixed: ${fix.id}: ${oldIndex} → ${fix.correctIndex} ("${q.options?.[fix.correctIndex]}")`);
    applied++;
  } else {
    console.log(`WARNING: Question ${fix.id} not found in bank`);
  }
}

// Write the updated bank
bankData.questions = questions;
fs.writeFileSync('question-bank-mcns2.json', JSON.stringify(bankData, null, 2));

console.log(`\nApplied ${applied} fixes to question bank`);
