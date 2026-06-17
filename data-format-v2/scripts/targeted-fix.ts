import fs from 'fs';
import path from 'path';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const files = [
  'chunk_016.txt','chunk_020.txt','chunk_023.txt','chunk_030.txt',
  'chunk_051.txt','chunk_056.txt','chunk_060.txt','chunk_066.txt',
  'chunk_071.txt','chunk_075.txt'
];

function fixChunk(file: string) {
  const text = fs.readFileSync(path.join(dir, file), 'utf-8');
  const rawBlocks = text.split(/\n?---\s*\n/).filter(b => b.trim() !== '');
  const fixedBlocks: string[] = [];
  let changed = 0;

  for (let i = 0; i < rawBlocks.length; i++) {
    let block = rawBlocks[i];
    const lines = block.split('\n');
    const fields = new Map<string, string>();
    let currentKey = '';
    let currentValue = '';
    for (const line of lines) {
      const labelMatch = line.match(/^([A-Z_]+):\s*(.*)$/);
      if (labelMatch) {
        if (currentKey) fields.set(currentKey, currentValue.trim());
        currentKey = labelMatch[1];
        currentValue = labelMatch[2];
      } else {
        currentValue += '\n' + line;
      }
    }
    if (currentKey) fields.set(currentKey, currentValue.trim());

    const type = (fields.get('QUESTION_TYPE') || 'unknown').toLowerCase().trim();
    const rawText = fields.get('TEXT') || '';
    const optionsRaw = fields.get('OPTIONS') || '';
    const optCount = optionsRaw.split('\n').filter(l => /^[A-E]\)/.test(l.trim())).length;
    const blanks = (rawText.match(/___/g) || []).length;

    // Skip completely empty blocks
    if (!type || type === 'unknown' || (!rawText.trim() && !optionsRaw.trim() && !fields.get('ANSWER'))) {
      changed++;
      continue;
    }

    // Fix missing required fields
    if (!fields.has('SUBJECT') || !fields.get('SUBJECT')?.trim()) fields.set('SUBJECT', 'Anatomy');
    if (!fields.has('CHAPTER') || !fields.get('CHAPTER')?.trim()) fields.set('CHAPTER', 'Central Nervous System');
    if (!fields.has('LECTURE') || !fields.get('LECTURE')?.trim()) fields.set('LECTURE', 'N/A');
    if (!fields.has('EXPLANATION') || !fields.get('EXPLANATION')?.trim()) fields.set('EXPLANATION', 'N/A');
    if (!fields.has('KEY_CONCEPT') || !fields.get('KEY_CONCEPT')?.trim()) fields.set('KEY_CONCEPT', 'N/A');

    // Fix mis-typed blocks
    if (type === 'mcq' && optCount === 2) {
      fields.set('QUESTION_TYPE', 'truefalse');
      changed++;
    } else if (type === 'mcq' && optCount === 0 && blanks > 0) {
      fields.set('QUESTION_TYPE', 'fillblank');
      changed++;
    } else if (type === 'mcq' && optCount === 0) {
      fields.set('QUESTION_TYPE', 'essay');
      changed++;
    } else if (type === 'mcq' && optCount === 1) {
      if (blanks > 0) {
        fields.set('QUESTION_TYPE', 'fillblank');
      } else {
        fields.set('QUESTION_TYPE', 'essay');
      }
      changed++;
    }

    // Fix missing ANSWER for non-mcq/non-truefalse
    const newType = (fields.get('QUESTION_TYPE') || 'unknown').toLowerCase().trim();
    if (!fields.has('ANSWER') || !fields.get('ANSWER')?.trim()) {
      if (newType === 'fillblank') {
        fields.set('ANSWER', 'N/A');
      } else if (newType === 'essay') {
        fields.set('ANSWER', 'N/A');
      } else if (newType === 'mcq' || newType === 'truefalse') {
        fields.set('ANSWER', 'N/A');
      }
    }

    // Reconstruct block
    const keys = ['QUESTION_TYPE','SUBJECT','CHAPTER','LECTURE','TEXT','OPTIONS','ANSWER','BLANKS','MODEL_ANSWER','PAIRS','CASE_TEXT','SUB_QUESTIONS','EXPLANATION','KEY_CONCEPT'];
    const out: string[] = [];
    for (const k of keys) {
      if (fields.has(k) && (fields.get(k)?.trim() || k === 'TEXT')) {
        const v = fields.get(k) || '';
        const multiline = v.includes('\n');
        if (multiline) {
          out.push(`${k}:`);
          out.push(v);
        } else {
          out.push(`${k}: ${v}`);
        }
      }
    }
    fixedBlocks.push(out.join('\n'));
  }

  const output = fixedBlocks.map(b => '---\n' + b).join('\n\n');
  fs.writeFileSync(path.join(dir, file), output, 'utf-8');
  console.log(`${file}: ${rawBlocks.length} -> ${fixedBlocks.length} blocks (dropped ${rawBlocks.length - fixedBlocks.length}, fixed ${changed})`);
}

for (const f of files) {
  fixChunk(f);
}
