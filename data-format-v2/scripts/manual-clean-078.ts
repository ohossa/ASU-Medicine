import fs from "fs";
import path from "path";

const REPO_ROOT = path.resolve("/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal");
const RAW = path.join(REPO_ROOT, "data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned/raw_chunk_078.txt");
const OUT = path.join(REPO_ROOT, "data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned/chunk_078.txt");

const text = fs.readFileSync(RAW, "utf-8").replace(/\r\n/g, "\n");
const lines = text.split("\n");

// Helpers
const normalizeMCQBlock = (lines: string[]): string | null => {
  const headerMatch = lines[0]?.match(/^\*\*(\d+)\.\*\*|^\*\*QUESTION (\d+):\*\*|^\*\*(\d+)\.\*\*/i);
  const questionNumber = headerMatch ? (headerMatch[1] || headerMatch[2] || headerMatch[3]) : "?";

  // Find correct answer line
  let answer: string | null = null;
  let answerIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\*\*Correct Answer:\s*([a-eA-E])\*\*$/i);
    if (m) { answer = m[1].toUpperCase(); answerIdx = i; break; }
  }

  // Extract options between header and correct answer
  const questionLines: string[] = [];
  const optionLines: string[] = [];
  let state: "q" | "opts" = "q";
  for (let i = 1; i < lines.length; i++) {
    if (i === answerIdx) break;
    const l = lines[i].trim();
    if (!l) continue;
    if (/^[-•]\s*[a-eA-E][).:]\s*/.test(l)) {
      state = "opts";
      optionLines.push(l);
    } else if (state === "q") {
      questionLines.push(l);
    }
  }

  if (questionLines.length === 0 && optionLines.length === 0) return null;

  // Normalize options
  const options = optionLines.map((ol) => {
    const m = ol.match(/^[-•]\s*([a-eA-E])[).:]\s*(.*)$/);
    if (!m) return null;
    const letter = m[1].toUpperCase();
    return `${letter}) ${m[2].trim()}`;
  }).filter(Boolean) as string[];

  if (options.length === 0 && answer) {
    // Try to extract options from text after question
    // Already handled above; if no options parsed, return null
    return null;
  }

  const questionText = questionLines.join(" ").replace(/\*\*/g, "").trim();
  if (!questionText) return null;

  const answerText = answer ?? "N/A";
  const optsText = options.length > 0 ? "\nOPTIONS:\n" + options.join("\n") + "\n" : "\n";

  return `---\nQUESTION_TYPE: mcq\nSUBJECT: Anatomy\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${questionText}\n${optsText}ANSWER: ${answerText}\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A\n---`;
};

const normalizeShortAnswerBlock = (questionText: string, answerText: string): string | null => {
  const q = questionText.replace(/\*\*/g, "").trim();
  const a = answerText.replace(/\*\*/g, "").trim();
  if (!q) return null;
  return `---\nQUESTION_TYPE: essay\nSUBJECT: Anatomy\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${q}\n\nANSWER: N/A\n\nMODEL_ANSWER:\n${a}\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A\n---`;
};

const blocks: string[] = [];

// State machine over lines
let i = 0;
while (i < lines.length) {
  let l = lines[i];

  // Skip headers / noise
  if (l.match(/^=+/) || l.match(/^---+/) || l.match(/^\*?Section\s*\d+:/i) || l.match(/^\*?\(Continue similarly/i)) {
    i++;
    continue;
  }

  // MCQ style (**12.** ... - a) ... **Correct Answer: x**)
  const mcqHeader = l.match(/^\*\*(\d+)\.\*\*\s*(.*)|^\*\*QUESTION\s*(\d+):\*\*\s*(.*)/i);
  if (mcqHeader && (l.includes("a)") || lines.slice(i+1, i+10).some(x => x.match(/^\s*[-•]\s*[a-eA-E][).:]/)))) {
    const blockLines: string[] = [l];
    i++;
    while (i < lines.length && !lines[i].match(/^\*\*(\d+)\.\*\*/) && !lines[i].match(/^\*\*QUESTION\s*\d+:/i) && !lines[i].match(/^\*?Section\s*\d+:/i) && !lines[i].match(/^=+/)) {
      blockLines.push(lines[i]);
      i++;
    }
    const formatted = normalizeMCQBlock(blockLines);
    if (formatted) blocks.push(formatted);
    continue;
  }

  // Final MCQ section style (starts with **1.** and options A. B. C. D. E. and Answer: X)
  const finalMcqHeader = l.match(/^\*\*(\d+)\.\*\*\s*(.*)/);
  if (finalMcqHeader) {
    const blockLines: string[] = [l];
    i++;
    while (i < lines.length && !lines[i].match(/^\*\*(\d+)\.\*\*/) && !lines[i].match(/^\*?Section\s*\d+:/i) && !lines[i].match(/^=+/)) {
      blockLines.push(lines[i]);
      i++;
    }
    // Try to parse options with A. B. etc
    const questionParts: string[] = [];
    const optParts: string[] = [];
    let sawAnswer = false;
    let answerVal = "N/A";
    for (const bl of blockLines) {
      const ansM = bl.match(/Answer:\s*([a-eA-E])\s*$/i);
      if (ansM) { answerVal = ansM[1].toUpperCase(); sawAnswer = true; continue; }
      const optM = bl.match(/^\s*([A-E])[).:]\s*(.*)$/i);
      if (optM && !sawAnswer) {
        optParts.push(`${optM[1].toUpperCase()}) ${optM[2].trim()}`);
      } else {
        if (!sawAnswer) questionParts.push(bl);
      }
    }
    const qText = questionParts.join(" ").replace(/^\*\*\d+\.\*\*\s*/, "").replace(/\*\*/g, "").trim();
    if (qText) {
      if (optParts.length > 0) {
        blocks.push(`---\nQUESTION_TYPE: mcq\nSUBJECT: Anatomy\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${qText}\n\nOPTIONS:\n${optParts.join("\n")}\n\nANSWER: ${answerVal}\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A\n---`);
      } else {
        blocks.push(`---\nQUESTION_TYPE: shortessay\nSUBJECT: Anatomy\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${qText}\n\nANSWER: N/A\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A\n---`);
      }
    }
    continue;
  }

  // Short answer style (starts with **1. Question text?** followed by "- Answer text")
  const saHeader = l.match(/^\*\*(\d+)\.\s*(.+?)\*\*\s*$/);
  if (saHeader) {
    const questionText = saHeader[2].trim();
    const answerLines: string[] = [];
    i++;
    while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim()==="")) {
      if (lines[i].trim().startsWith("- ")) answerLines.push(lines[i].trim().substring(2));
      i++;
    }
    const answerText = answerLines.join("\n").trim();
    const formatted = normalizeShortAnswerBlock(questionText, answerText || "N/A");
    if (formatted) blocks.push(formatted);
    continue;
  }

  // Anatomy bullet style: **Question text:** followed by plain answer on same line or next line
  const anatomyBullet = l.match(/^\*\*(.+?)\*\*\s*(.*)$/);
  if (anatomyBullet) {
    const q = anatomyBullet[1].trim();
    let a = anatomyBullet[2].trim();
    i++;
    // Collect continuation lines that are plain text (indented or not a header)
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].match(/^\*\*(.+?)\*\*/) && !lines[i].match(/^\*?Section\s*\d+:/i) && !lines[i].match(/^=+/)) {
      a += " " + lines[i].trim();
      i++;
    }
    a = a.trim().replace(/^[-•]\s*/, "");
    if (q.endsWith(":") || q.endsWith("?")) {
      if (a) {
        blocks.push(`---\nQUESTION_TYPE: shortessay\nSUBJECT: Anatomy\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${q}\n\nANSWER: N/A\n\nMODEL_ANSWER:\n${a}\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A\n---`);
      } else {
        blocks.push(`---\nQUESTION_TYPE: shortessay\nSUBJECT: Anatomy\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${q}\n\nANSWER: N/A\n\nMODEL_ANSWER:\nN/A\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A\n---`);
      }
    }
    continue;
  }

  // Plain bullet line (in anatomy section): "- Question: Answer" or "- Complete: ...
  const plainBullet = l.match(/^\s*[-•]\s*(.+)$/);
  if (plainBullet) {
    const content = plainBullet[1].trim();
    // Handle "Complete: ... **Answer**" style
    const completeMatch = content.match(/^(Complete[:.]?)\s*(.+?)\*\*\s*(.*?)\*\*(.*)$/i);
    if (completeMatch) {
      const question = `${completeMatch[1].trim()} ${completeMatch[2].trim()}`;
      const answer = `${completeMatch[3].trim()}${completeMatch[4].trim()}`.trim().replace(/^:\s*/, "");
      blocks.push(`---\nQUESTION_TYPE: fillblank\nSUBJECT: Anatomy\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${question}\n\nANSWER: ${answer}\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A\n---`);
      i++;
      continue;
    }

    const colonMatch = content.match(/^(.+?[:?])\s+(.+)$/);
    if (colonMatch) {
      const q = colonMatch[1].trim();
      const a = colonMatch[2].trim();
      blocks.push(`---\nQUESTION_TYPE: shortessay\nSUBJECT: Anatomy\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${q}\n\nANSWER: N/A\n\nMODEL_ANSWER:\n${a}\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A\n---`);
    }
    i++;
    continue;
  }

  // Catch-all: If line has nothing interesting, skip
  i++;
}

const output = blocks.join("\n\n");
fs.writeFileSync(OUT, output, "utf-8");
console.log(`Wrote ${blocks.length} blocks to ${OUT}`);
console.log(`Size: ${Buffer.byteLength(output)} bytes`);
