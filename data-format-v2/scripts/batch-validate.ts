import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const files = readdirSync(dir).filter(f => f.startsWith('chunk_') && f.endsWith('.txt') && !f.includes('_FAILED')).sort();

let totalBlocks = 0, totalErrors = 0, totalWarnings = 0;
const fails: string[] = [];

for (const file of files) {
  const path = join(dir, file);
  try {
    const out = execSync(`npx tsx data-format-v2/scripts/validate-cleaner-output.ts "${path}"`, { encoding: 'utf-8' });
    const mBlocks = out.match(/Blocks parsed:\s+(\d+)/);
    const mErrors = out.match(/Errors:\s+(\d+)/);
    const mWarnings = out.match(/Warnings:\s+(\d+)/);
    const blocks = parseInt(mBlocks?.[1] || '0');
    const errors = parseInt(mErrors?.[1] || '0');
    const warnings = parseInt(mWarnings?.[1] || '0');
    totalBlocks += blocks;
    totalErrors += errors;
    totalWarnings += warnings;
    if (errors > 0) fails.push(`${file}: blocks=${blocks} errors=${errors} warnings=${warnings}`);
  } catch (e: any) {
    // If validation returns non-zero (errors found), still extract counts from stderr/stdout
    const out = (e.stdout || '') + (e.stderr || '') + (e.message || '');
    const mBlocks = out.match(/Blocks parsed:\s+(\d+)/);
    const mErrors = out.match(/Errors:\s+(\d+)/);
    const mWarnings = out.match(/Warnings:\s+(\d+)/);
    const blocks = parseInt(mBlocks?.[1] || '0');
    const errors = parseInt(mErrors?.[1] || '0');
    const warnings = parseInt(mWarnings?.[1] || '0');
    totalBlocks += blocks;
    totalErrors += errors;
    totalWarnings += warnings;
    if (errors > 0) fails.push(`${file}: blocks=${blocks} errors=${errors} warnings=${warnings}`);
  }
}

console.log(`Total files: ${files.length}`);
console.log(`Total blocks: ${totalBlocks}`);
console.log(`Total errors: ${totalErrors}`);
console.log(`Total warnings: ${totalWarnings}`);
console.log(`Files with errors: ${fails.length}`);
if (fails.length) {
  console.log('---');
  for (const f of fails) console.log(f);
}
