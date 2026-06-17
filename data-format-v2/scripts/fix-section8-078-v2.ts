import fs from "fs";

const rawPath = "data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned/raw_chunk_078.txt";
const outPath = "data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned/chunk_078.txt";

const raw = fs.readFileSync(rawPath, "utf-8").replace(/\r\n/g, "\n");

// Use split instead of regex — regex terminates at stray `---` lines
const parts = raw.split("\n## Section 9:");
const section8Raw = parts[0].split("\n## Section 8:")[1];
if (!section8Raw) {
  console.error("Section 8 not found via split");
  process.exit(1);
}

const section8 = section8Raw.replace(/^\n/, ""); // drop leading newline
const lines = section8.split("\n");

const blocks: string[] = [];

let i = 0;
while (i < lines.length) {
  const line = lines[i];
  // Skip empty lines and pure bold sub-headers (no leading dash)
  if (!line.trim() || /^\*\*[^*]+\*\*$/.test(line.trim())) {
    i++;
    continue;
  }

  // Match bullet: "- **Question:** Answer text"
  const bulletMatch = line.match(/^\s*[-•]\s*(.*)$/);
  if (!bulletMatch) {
    i++;
    continue;
  }

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
    let a = colonMatch[2].trim();

    // Collect continuation lines that follow (same indentation pattern)
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^\s*[-•]\s*/.test(lines[i]) &&
      !/^\*\*[^*]+\*\*$/.test(lines[i].trim())
    ) {
      a += " " + lines[i].trim();
      i++;
    }

    if (q && a && q.length > 5 && a.length > 2) {
      blocks.push(`---\nQUESTION_TYPE: shortessay\nSUBJECT: Anatomy\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${q}\n\nANSWER: N/A\n\nMODEL_ANSWER:\n${a}\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A\n---`);
    }
    continue;
  }

  i++;
}

console.log(`Found ${blocks.length} anatomy blocks`);

// Append to existing output
const existing = fs.readFileSync(outPath, "utf-8");
// Remove the 15 previously appended blocks if they exist (unique heuristic: shortessay blocks after the last mcq)
// Simpler: just generate the complete anatomy section fresh and append
const output = existing.trimEnd() + "\n\n" + blocks.join("\n\n") + "\n";
fs.writeFileSync(outPath, output, "utf-8");
console.log(`Appended ${blocks.length} blocks to ${outPath}`);
