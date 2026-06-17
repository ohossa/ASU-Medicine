import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'data-format-v2/question-intake/year-2/semester-2/MCNS-2 [Central Nervous System]/_cleaned';
const files = readdirSync(dir).filter(f => f.startsWith('chunk_') && f.endsWith('.txt') && !f.includes('_FAILED')).sort();
const out: string[] = [];

for (const file of files) {
  const path = join(dir, file);
  let output: string;
  try {
    output = execSync(`npx tsx data-format-v2/scripts/validate-cleaner-output.ts "${path}"`, { encoding: 'utf-8' });
  } catch (e: any) {
    output = (e.stdout || '') + (e.stderr || '');
  }
  const blockMatch = output.match(/Blocks parsed:\s+(\d+)/);
  const errMatch = output.match(/Errors:\s+(\d+)/);
  const warnMatch = output.match(/Warnings:\s+(\d+)/);
  const blocks = parseInt(blockMatch?.[1] || '0');
  const errors = parseInt(errMatch?.[1] || '0');
  const warnings = parseInt(warnMatch?.[1] || '0');
  if (errors > 0) {
    out.push(`\n===== ${file} (blocks=${blocks}) =====`);
    const lines = output.split('\n');
    let inErrors = false;
    for (const line of lines) {
      if (line.startsWith('ERRORS:')) inErrors = true;
      if (line.startsWith('WARNINGS:')) inErrors = false;
      if (inErrors && line.trim()) out.push(line.trim());
    }
  }
}

const report = out.join('\n');
console.log(report);

import { writeFileSync } from 'node:fs';
writeFileSync('data-format-v2/scripts/validation-errors-report.md', report, 'utf-8');
console.log('\nReport written to data-format-v2/scripts/validation-errors-report.md');
