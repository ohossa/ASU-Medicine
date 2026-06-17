import { readFileSync, writeFileSync } from 'node:fs';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const raw = readFileSync(`${dir}/raw_chunk_032.txt`, 'utf-8').replace(/\r\n/g, '\n');

// Extract essays: split by "Question N:" headers
const blocks: string[] = [];
const parts = raw.split(/(?=Question\s*\d+\s*[:.]\s*)/g);

for (const part of parts) {
  const trimmed = part.trim();
  if (!/^Question\s*\d+/.test(trimmed)) continue;

  // Extract question number and text
  const qMatch = trimmed.match(/^Question\s*(\d+)\s*[:.]\s*(.+)/i);
  if (!qMatch) continue;

  let text = qMatch[2].trim();
  const rest = trimmed.substring(qMatch[0].length);
  const lines = rest.split('\n').map(l => l.trim());

  // Gather any lines that are still part of the question stem (before bullet points)
  const answerLines: string[] = [];
  let gatheringText = true;
  for (const line of lines) {
    if (!line) continue;
    // Heuristic: if line starts with common answer keywords or bullets, we've moved to model answer
    if (/^[•\-\d]|:$/.test(line) || line.match(/^(Site|Characters|Functions|Lesion|Answer|Steps|Mechanism|Effects|Description|Definition|Importance|Location|Structure|Properties|Types|Classification)/i)) {
      gatheringText = false;
    }
    if (gatheringText) {
      text += ' ' + line;
    } else {
      // Clean model answer lines: remove separator lines and trailing dashes
      if (/^---+$/.test(line)) continue;
      const cleanedLine = line.replace(/---+$/, '').trim();
      if (cleanedLine) answerLines.push(cleanedLine);
    }
  }

  const modelAnswer = answerLines.join('\n').trim();
  if (text.length > 15 && modelAnswer.length > 20) {
    blocks.push(`QUESTION_TYPE: essay\nSUBJECT: Physiology\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${text}\n\nMODEL_ANSWER:\n${modelAnswer}\n\nANSWER: N/A\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A`);
  }
}

console.log('Extracted', blocks.length, 'essay blocks');
if (blocks.length > 0) {
  const existing = readFileSync(`${dir}/chunk_032.txt`, 'utf-8');
  const combined = existing.trim() + '\n\n---\n' + blocks.join('\n\n---\n') + '\n';
  writeFileSync(`${dir}/chunk_032.txt`, combined, 'utf-8');
  console.log('Appended', blocks.length, 'essay blocks to chunk_032.txt');
}
