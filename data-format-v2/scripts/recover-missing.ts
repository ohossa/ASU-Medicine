import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';

// ── RECOVER CHUNK 024 ──────────────────────────────────────────
const raw024 = readFileSync(`${dir}/raw_chunk_024.txt`, 'utf-8').replace(/\r\n/g, '\n');
const blocks024: string[] = [];

// Extract the "Part 7" MCQs (questions 1-8 about neurodegenerative diseases)
const part7Match = raw024.match(/Part\s+7.*?Drug therapy of\s+Neurodegenerative Diseases([\s\S]*?)(?=Below are all questions|---\n|$)/i);
if (part7Match) {
  const part7 = part7Match[1];
  const qMatches = part7.match(/^\d+\.\s+.*?(?=\n\d+\.\s+|Answer\s*key|\nBelow|$)/gims);
  for (const q of qMatches || []) {
    const lines = q.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 3) continue;
    const textLine = lines[0];
    const textMatch = textLine.match(/^\d+\.\s+(.*)$/);
    const text = textMatch ? textMatch[1].trim() : textLine;
    const options = [];
    for (let i = 1; i < lines.length; i++) {
      if (/^[A-E]\./.test(lines[i])) {
        const opt = lines[i].replace(/^([A-E])\.\s*/, '');
        options.push(`${lines[i][0].toUpperCase()}) ${opt}`);
      }
    }
    if (options.length >= 3) {
      blocks024.push(`QUESTION_TYPE: mcq\nSUBJECT: Pharmacology\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${text}\n\nOPTIONS:\n${options.join('\n')}\n\nANSWER: N/A\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A`);
    }
  }
}

// Extract the clean markdown blocks "Below are all questions..."
const markdownMatch = raw024.match(/Below are all questions.*?\n([\s\S]*)/i);
if (markdownMatch) {
  const md = markdownMatch[1];
  const mdBlocks = md.split(/\n\n---\s*\n/).map(b => b.trim()).filter(Boolean);
  for (const block of mdBlocks) {
    const text = block.match(/\*\*\d+\*\*\s+(.+)/); // **1)** text
    const optsMatch = block.match(/^[A-E]\..*/gm);
    const answerMatch = block.match(/Correct Answer:\s*([A-E][.)])?/i) || block.match(/\*\*Correct Answer:\s*([A-E])\.?/i);
    const explMatch = block.match(/\*Explanation:\s*(.+?)\*/);
    const textLine = block.match(/.*?\n([\s\S]*?)(?=\nA\.|\n\*\*Correct)/);
    
    // Actually use simpler split
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    let qText = '';
    const options = [];
    let answer = 'N/A';
    let explanation = 'N/A';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.match(/^\*\*\d+\*\*/)) {
        qText = line.replace(/^\*\*\d+\*\*\s*/, '').trim();
        continue;
      }
      if (line.match(/Correct Answer:/i)) {
        const a = line.match(/Correct Answer:\s*([A-E])/i);
        if (a) answer = a[1];
        continue;
      }
      if (line.startsWith('*Explanation:')) {
        explanation = line.replace('*Explanation:', '').trim();
        continue;
      }
      if (line.match(/^[A-E]\.\s+/)) {
        const opt = line.replace(/^([A-E])\.\s*/, '');
        options.push(`${line[0].toUpperCase()}) ${opt}`);
      }
    }
    
    if (qText && options.length >= 2) {
      blocks024.push(`QUESTION_TYPE: mcq\nSUBJECT: Pharmacology\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${qText}\n\nOPTIONS:\n${options.join('\n')}\n\nANSWER: ${answer}\n\nEXPLANATION:\n${explanation}\n\nKEY_CONCEPT:\nN/A`);
    }
  }
}

console.log(`chunk_024: extracted ${blocks024.length} blocks`);
if (blocks024.length) {
  const existing = readFileSync(`${dir}/chunk_024.txt`, 'utf-8');
  const newContent = existing.trim() + '\n\n---\n' + blocks024.join('\n\n---\n') + '\n';
  writeFileSync(`${dir}/chunk_024.txt`, newContent, 'utf-8');
}

// ── RECOVER CHUNK 032 ──────────────────────────────────────────
const raw032 = readFileSync(`${dir}/raw_chunk_032.txt`, 'utf-8').replace(/\r\n/g, '\n');
const blocks032: string[] = [];

// Split by "Question N:" pattern
const parts032 = raw032.split(/(?=Question\s*\d+\s*[:]\s*)/g);

for (let i = 0; i < parts032.length; i++) {
  const part = parts032[i].trim();
  if (!part.startsWith('Question')) continue;
  
  // Extract question number and text
  const qMatch = part.match(/^Question\s*(\d+)\s*:\s*(.+)/i);
  if (!qMatch) continue;
  
  const qNum = qMatch[1];
  let rest = part.substring(qMatch[0].length);
  
  // The first line might be the rest of the question text
  let text = qMatch[2].trim();
  const lines = rest.split('\n').map(l => l.trim()).filter(Boolean);
  
  // If the first line is still part of the question stem (not a bullet/point), include it
  if (lines.length > 0 && !lines[0].match(/^[•\-\d]/)) {
    text += ' ' + lines[0];
    lines.shift();
  }
  
  // Everything else is the model answer
  const answer = lines.join('\n').trim();
  
  if (text.length > 10) {
    blocks032.push(`QUESTION_TYPE: essay\nSUBJECT: Physiology\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${text}\n\nMODEL_ANSWER:\n${answer}\n\nANSWER: N/A\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A`);
  }
}

console.log(`chunk_032: extracted ${blocks032.length} blocks`);
if (blocks032.length) {
  const existing032 = readFileSync(`${dir}/chunk_032.txt`, 'utf-8');
  const new032 = existing032.trim() + '\n\n---\n' + blocks032.join('\n\n---\n') + '\n';
  writeFileSync(`${dir}/chunk_032.txt`, new032, 'utf-8');
}
