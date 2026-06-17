import fs from "fs";
import path from "path";

const rawPath = "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned/raw_chunk_078.txt";
const outPath = "/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned/chunk_078.txt";

const raw = fs.readFileSync(rawPath, "utf-8").replace(/\r\n/g, "\n");

// Find Section 8
const section8Match = raw.match(/## Section 8: Anatomy Short Answer Questions \(Essay Style\)([\s\S]*?)(?=\n## Section 9:|\n---\n|\Z)/);
if (!section8Match) {
  console.log("Section 8 not found");
  process.exit(1);
}

const section8 = section8Match[1];
const lines = section8.split("\n");

const blocks: string[] = [];
let i = 0;

while (i < lines.length) {
  let line = lines[i];

  // Skip bold sub-headers (e.g., **Face**)
  if (/^\*\*[^*]+\*\*$/.test(line.trim())) {
    i++;
    continue;
  }

  // Match bullet: "- **Question:** Answer text" or "- **Question?** Answer text"
  const bulletMatch = line.match(/^\s*[-•]\s*(.*)$/);
  if (bulletMatch) {
    const content = bulletMatch[1].trim();
    // Strip ** markers
    const stripped = content.replace(/\*\*/g, "").trim();

    // Handle "Complete: ..." style
    const completeMatch = stripped.match(/^(Complete):\s*(.+?)(\s+\w.*)$/i);
    if (completeMatch) {
      const q = `${completeMatch[1]}: ${completeMatch[2].trim()}`;
      const a = completeMatch[3].trim();
      if (q && a) {
        blocks.push(`---\nQUESTION_TYPE: fillblank\nSUBJECT: Anatomy\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${q}\n\nANSWER: ${a}\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A\n---`);
      }
      i++;
      continue;
    }

    // Try splitting on first colon or question mark followed by space
    const colonMatch = stripped.match(/^(.+?[:?])\s+(.+)$/);
    if (colonMatch) {
      const q = colonMatch[1].trim();
      const a = colonMatch[2].trim();
      if (q && a && q.length > 5 && a.length > 2) {
        blocks.push(`---\nQUESTION_TYPE: shortessay\nSUBJECT: Anatomy\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${q}\n\nANSWER: N/A\n\nMODEL_ANSWER:\n${a}\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A\n---`);
      }
      i++;
      continue;
    }

    // If not matched, just skip
    i++;
    continue;
  }

  i++;
}

// Append to existing output
const existing = fs.readFileSync(outPath, "utf-8");
const output = existing.trimEnd() + "\n\n" + blocks.join("\n\n") + "\n";
fs.writeFileSync(outPath, output, "utf-8");
console.log(`Appended ${blocks.length} anatomy blocks to ${outPath}`);
