import fs from "fs";

const rawPath = "data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned/raw_chunk_066.txt";
const outPath = "data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned/chunk_066.txt";

let raw = fs.readFileSync(rawPath, "utf-8").replace(/\r\n/g, "\n");
let allLines = raw.split("\n");

// Find the first clean question (line starting with "1. ")
const firstQIndex = allLines.findIndex(l => /^\s*1\.\s+/.test(l));
if (firstQIndex < 0) {
  console.error("No clean question found");
  process.exit(1);
}
const cleanLines = allLines.slice(firstQIndex);

const blocks: string[] = [];

function flushBlock(questionLines: string[], optionLines: string[]) {
  if (questionLines.length === 0) return;
  const qText = questionLines.join(" ").trim();
  if (!qText || qText.length < 5) return;
  const normalized = optionLines.map((ol) => {
    const m = ol.match(/^\s*([a-eA-E])[).:]\s*(.*)$/);
    if (!m) return null;
    const letter = m[1].toUpperCase();
    return `${letter}) ${m[2].trim()}`;
  }).filter(Boolean) as string[];
  if (normalized.length < 2 && !/^(?:essay|shortessay|fillblank)$/i.test(questionLines[0])) return;
  blocks.push(
    `---\nQUESTION_TYPE: mcq\nSUBJECT: Anatomy\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${qText}\n\nOPTIONS:\n${normalized.join("\n")}\n\nANSWER: N/A\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A\n---`
  );
}

let questionLines: string[] = [];
let optionLines: string[] = [];

for (let i = 0; i < cleanLines.length; i++) {
  let line = cleanLines[i];
  // Pre-process special characters: ¢ -> c
  if (/^\s*¢\s*[).:]/.test(line)) {
    line = line.replace(/^\s*¢/, "c");
  }
  // Remove trailing noise like "7." after a question stem (only if preceded by `:` or `?`)
  line = line.replace(/[:?](?:\s+\d+\.?)?$/, m => m[0]);
  const trimmed = line.trim();
  if (trimmed === "" || /^@@@/.test(trimmed) || /^Test Your CNS/i.test(trimmed) || /^NERD/i.test(trimmed) || /^\*+/.test(trimmed) || /^-+/.test(trimmed)) {
    continue;
  }
  const startMatch = trimmed.match(/^(\d+)\.\s*(.+)/);
  const optMatch = trimmed.match(/^[a-eA-E]\s*[).:]\s*(.*)/);
  if (startMatch) {
    flushBlock(questionLines, optionLines);
    questionLines = [startMatch[2]];
    optionLines = [];
  } else if (optMatch) {
    optionLines.push(trimmed);
  } else {
    // Continuation of previous block
    if (optionLines.length === 0) {
      questionLines.push(trimmed);
    } else {
      optionLines[optionLines.length - 1] += " " + trimmed;
    }
  }
}
flushBlock(questionLines, optionLines);

const output = blocks.join("\n\n") + "\n";
fs.writeFileSync(outPath, output, "utf-8");
console.log(`Wrote ${blocks.length} blocks to ${outPath}`);
