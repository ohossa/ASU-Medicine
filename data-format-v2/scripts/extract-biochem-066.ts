import fs from "fs";

const rawPath = "data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned/raw_chunk_066.txt";
const outPath = "data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned/chunk_066.txt";

const raw = fs.readFileSync(rawPath, "utf-8").replace(/\r\n/g, "\n");

// Split into pages
const pages = raw.split(/\n*@@@\s*\d+\s*@@@\s*\n*/).filter(p => p.trim() !== '');

const blocks: string[] = [];

for (const page of pages) {
  // Skip answer key pages and noise
  if (/Section\s*\\\s*a\s*\\\s*Biochemistry/i.test(page) || /1-\s*[A-E]\s*2-\s*[A-E]/g.test(page)) continue;
  // Clean up the page: standardise option markers
  let cleanedPage = page
    .replace(/¢/g, "c")
    .replace(/@/g, "d")
    .replace(/\n{2,}/g, "\n");
    
  const lines = cleanedPage.split("\n").map(l => l.trim()).filter(l => l !== '');
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const qMatch = line.match(/^(\d+)[.)]\s*(.+)/);
    if (qMatch) {
      const qNum = qMatch[1];
      let qText = qMatch[2];
      const options: string[] = [];
      i++;
      // collect options and multi-line question stem
      while (i < lines.length) {
        const optLine = lines[i];
        const optMatch = optLine.match(/^([a-e])[.)]\s*(.+)/i);
        if (optMatch) {
          options.push(`${optMatch[1].toUpperCase()}) ${optMatch[2].trim()}`);
          i++;
          continue;
        }
        // handle options on same line: e.g., "a. xxx b. yyy c. zzz"
        const sameLineOpts = optLine.match(/(?:^|\s+)([a-e])[.)]\s*([^a-e]+?)(?=\s+[a-e][.)]|$)/gi);
        if (sameLineOpts && sameLineOpts.length > 0) {
          for (const so of sameLineOpts) {
             const sm = so.match(/([a-e])[.)]\s*(.+)/i);
             if (sm) {
                // avoid overlap: if the raw sameLineOpts over-captures, trim trailing option letters
                let val = sm[2].trim().replace(/\s+[a-e]\s*$/i, '');
                options.push(`${sm[1].toUpperCase()}) ${val}`);
             }
          }
          i++;
          continue;
        }
        // If no option match and no next question, append to last option if options exist, else to question
        if (options.length > 0) {
          // check if next line is a new question?
          if (/^\d+[.)]/i.test(lines[i])) break;
          options[options.length - 1] += " " + optLine;
          i++;
          continue;
        } else {
          if (/^\d+[.)]/i.test(lines[i])) break;
          qText += " " + optLine;
          i++;
          continue;
        }
      }
      if (options.length >= 3 && options.length <= 5) {
        blocks.push(`---\nQUESTION_TYPE: mcq\nSUBJECT: Biochemistry\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${qText}\n\nOPTIONS:\n${options.join("\n")}\n\nANSWER: N/A\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A\n---`);
      }
    } else {
      i++;
    }
  }
}

console.log(`Extracted ${blocks.length} blocks`);
const output = blocks.join("\n\n") + "\n";
fs.writeFileSync(outPath, output, "utf-8");
