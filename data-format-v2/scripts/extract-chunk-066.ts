import fs from "fs";

const rawPath = "data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned/raw_chunk_066.txt";
const outPath = "data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned/chunk_066.txt";

const raw = fs.readFileSync(rawPath, "utf-8").replace(/\r\n/g, "\n");

// Split into pages
const pages = raw.split(/\n*@@@\s*\d+\s*@@@\s*\n*/).filter(p => p.trim() !== '');

const chunks: string[] = [];
const flagged: string[] = [];

function extractQuestion(lines: string[]): { text: string; options: string[] } | null {
    if (lines.length < 2) return null;
    cons(questionLine) {
    let text = questionLine;
    const options: string[] = [];
    const state = { mode: 'text' } as { mode: 'text' | 'opts'; curOptIdx: number };
   
    for (const line of lines.slice(1)) {
        // Normalize option markers
        let l = line
            .replace(/^¢/i, 'c')
            .replace(/^@/i, 'd')
            .replace(/\btlA\b/, 'A)')
            .replace(/\btlB\b/, 'B)')
            .replace(/\btlC\b/, 'C)')
            .replace(/\btlD\b/, 'D)')
            .replace(/\btlE\b/, 'E)');
        
        // Check if this line contains options on same line
        const sameLineOpts = l.match(/(?:^|\s+)([A-E])[.)]\s*(.*)/gi);
        if (sameLineOpts && sameLineOpts.length > 1) {
            for (const so of sameLineOpts) {
                const sm = so.match(/([A-E])[.)]\s*(.*)/i);
                if (sm) {
                    options.push(`${sm[1].toUpperCase()}) ${sm[2].trim()}`);
                }
            }
            state.mode = 'opts';
            continue;
        }
        
        // Check if line starts with an option
        const opt = l.match(/^([A-Ea-e])[.)]\s*(.*)/);
        if (opt) {
            options.push(`${opt[1].toUpperCase()}) ${opt[2].trim()}`);
            state.mode = 'opts';
            continue;
        }
        
        // Otherwise append to previous option if in options mode
        if (state.mode === 'opts' && options.length > 0) {
            options[options.length - 1] += ' ' + l.trim();
        } else {
            text += ' ' + l.trim();
        }
    }
    
    if (options.length >= 3 && options.length <= 5) {
        return { text, options };
    }
    return null;
}

for (const page of pages) {
    const lines = page.split(/\n/).map(l => l.trim()).filter(l => l !== '' && !/^1-\s*[A-E]/.test(l) && !/Section\s*\\+\s*[a-zA-Z]\s*\\+\s*/i.test(l));
    
    // Detect if this is a two-column page
    let twoCol = false;
    for (const line of lines) {
        const optLetters = Array.from(line.matchAll(/\b([a-e])[.)]/gi));
        if (optLetters.length >= 2) {
            twoCol = true;
            break;
        }
    }
    
    if (twoCol) {
        flagged.push(`Two-column unmergeable page: ${lines.slice(0, 3).join(' | ')}`);
        continue;
    }
    
    // Find question starts
    const qStarts: number[] = [];
    for (let i = 0; i < lines.length; i++) {
        if (/^\d+[.)]\s*/.test(lines[i]) || /^\d+(a|b|c|d|e)[.)]\s*/i.test(lines[i])) {
            qStarts.push(i);
        }
    }
    
    for (let q = 0; q < qStarts.length; q++) {
        const start = qStarts[q];
        const end = q < qStarts.length - 1 ? qStarts[q + 1] : lines.length;
        const blockLines = lines.slice(start, end);
        const extracted = extractQuestion(blockLines);
        if (extracted) {
            chunks.push(`---\nQUESTION_TYPE: mcq\nSUBJECT: UNKNOWN\nCHAPTER: Central Nervous System\nLECTURE: N/A\n\nTEXT:\n${extracted.text}\n\nOPTIONS:\n${extracted.options.join("\n")}\n\nANSWER: N/A\n\nEXPLANATION:\nN/A\n\nKEY_CONCEPT:\nN/A`);
        }
    }
}

console.log(`Extracted ${chunks.length} clean blocks, flagged ${flagged.length} pages`);

let output = chunks.join("\n\n");
if (flagged.length > 0) {
    output += "\n\n---\nFLAGGED_REVIEW:\n- " + flagged.join("\n- ") + "\n";
}
output += "\n";

fs.writeFileSync(outPath, output, "utf-8");
