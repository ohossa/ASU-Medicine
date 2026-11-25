import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { validateModuleFile } from '../data-format-v2/scripts/validate-banks';

export interface DeepAuditFinding {
  file: string;
  questionId: string;
  severity: 'error' | 'warning';
  code: string;
  message: string;
}

const GENERIC_EXPL_RE = /review the related lecture material|no explanation available|correct answer is [a-e]\.?$/i;
const LEADING_NUM_RE = /^\s*(?:Q\.?\s*)?\d{1,3}\s*[\)\.\-:]\s+[A-Za-z]/;
const CLINICAL_NUM_START_RE = /^\s*\d+(?:\.\d+)?\s*(?:st|nd|rd|th|year|yr|mo|wk|day|hr|min|mg|g|ml|l|cm|mm|kg|%|-?\s*year)/i;
const FILE_EXT_RE = /^\.(?:pptx?|pps|xls[xm]?|xlsx|docx?|pdf|csv|txt|html?|json|xml|zip|jpg|png|svg)$/i;
const SHUFFLE_HAZARD_RE = /\b(?:both|either|neither|only|all|none)\s+(?:of\s+the\s+(?:above|following)|[a-e]\s*(?:and|&|,)\s*[a-e])\b/i;

export function auditBankDeep(file: string, bank: any): DeepAuditFinding[] {
  const findings: DeepAuditFinding[] = [];

  // 1. Canonical structural & OCR validator errors
  for (const err of validateModuleFile(bank)) {
    findings.push({
      file,
      questionId: err.match(/\(([^)]+)\)/)?.[1] ?? 'BANK',
      severity: 'error',
      code: 'VALIDATOR_ERROR',
      message: err,
    });
  }

  for (const ch of bank?.chapters ?? []) {
    const isPastExam = ch?.bankSection === 'past-exams' || Number(ch?.id) >= 100;
    for (const subj of ch?.subjects ?? []) {
      const lectureCount = typeof subj?.lectureCount === 'number' ? subj.lectureCount : 0;
      for (const q of subj?.questions ?? []) {
        const qid = String(q?.id ?? 'NO_ID');
        const stem = String(q?.text ?? '').trim();
        const expl = String(q?.explanation ?? '').trim();
        const opts: string[] = Array.isArray(q?.options) ? q.options.map(String) : [];

        if (!isPastExam && lectureCount > 0 && (typeof q?.lecture !== 'number' || q.lecture < 1 || q.lecture > lectureCount)) {
          findings.push({
            file,
            questionId: qid,
            severity: 'warning',
            code: 'LECTURE_OUT_OF_RANGE',
            message: `lecture=${q?.lecture} outside 1..${lectureCount} for "${subj?.name}".`,
          });
        }

        if (LEADING_NUM_RE.test(stem) && !CLINICAL_NUM_START_RE.test(stem)) {
          findings.push({
            file,
            questionId: qid,
            severity: 'warning',
            code: 'LEADING_SOURCE_NUMBER',
            message: `Stem appears to retain leading source numbering: "${stem.slice(0, 50)}"`,
          });
        }

        if (stem.endsWith('"') && !/["“][^"]+"$/.test(stem)) {
          findings.push({
            file,
            questionId: qid,
            severity: 'error',
            code: 'DANGLING_QUOTE_STEM',
            message: `Stem ends with unmatched quote: "${stem.slice(-40)}"`,
          });
        }

        if (/\((?:answer|ans|key)\s*[:=]/i.test(stem)) {
          findings.push({
            file,
            questionId: qid,
            severity: 'error',
            code: 'ANSWER_LEAK_STEM',
            message: `Possible inline answer key leak in stem: "${stem.slice(0, 60)}"`,
          });
        }

        if (GENERIC_EXPL_RE.test(expl)) {
          findings.push({
            file,
            questionId: qid,
            severity: 'error',
            code: 'GENERIC_EXPLANATION',
            message: `Generic fallback explanation detected: "${expl.slice(0, 60)}"`,
          });
        } else if ((q?.type === 'mcq' || q?.type === 'truefalse') && expl.length < 25) {
          findings.push({
            file,
            questionId: qid,
            severity: 'warning',
            code: 'SHORT_EXPLANATION',
            message: `Explanation is under 25 characters: "${expl}"`,
          });
        }

        if (q?.type === 'mcq') {
          if (opts.length < 4) {
            findings.push({
              file,
              questionId: qid,
              severity: 'warning',
              code: 'FEWER_THAN_4_OPTIONS',
              message: `MCQ has only ${opts.length} options.`,
            });
          }
          for (let i = 0; i < opts.length; i++) {
            const o = opts[i].trim();
            if (/^\./.test(o) && !/^\.{3}/.test(o) && !FILE_EXT_RE.test(o)) {
              findings.push({
                file,
                questionId: qid,
                severity: 'warning',
                code: 'LEADING_DOT_OPTION',
                message: `Option ${i} begins with stray period: "${o.slice(0, 40)}"`,
              });
            }
            if (SHUFFLE_HAZARD_RE.test(o)) {
              findings.push({
                file,
                questionId: qid,
                severity: 'warning',
                code: 'SHUFFLE_POSITIONAL_OPTION',
                message: `Option ${i} uses positional phrasing ("${o.slice(0, 50)}")—verify shuffle safety.`,
              });
            }
          }
        }
      }
    }
  }

  return findings;
}

async function collectJsonFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await collectJsonFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.json')) out.push(full);
  }
  return out.sort();
}

async function main() {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');
  const targets = args.filter((a) => !a.startsWith('--'));
  const files = targets.length > 0 ? targets : await collectJsonFiles('src/imports');

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const file of files) {
    const parsed = JSON.parse(await readFile(file, 'utf8'));
    const findings = auditBankDeep(file, parsed);
    const errors = findings.filter((f) => f.severity === 'error');
    const warnings = findings.filter((f) => f.severity === 'warning');
    totalErrors += errors.length;
    totalWarnings += warnings.length;

    if (errors.length === 0 && warnings.length === 0) {
      console.log(`✅ ${file}: 0 errors, 0 warnings`);
    } else {
      console.log(`\n📋 ${file}: ${errors.length} error(s), ${warnings.length} warning(s)`);
      for (const e of errors.slice(0, 15)) {
        console.log(`  ❌ [${e.code}] (${e.questionId}): ${e.message}`);
      }
      for (const w of warnings.slice(0, 10)) {
        console.log(`  ⚠️ [${w.code}] (${w.questionId}): ${w.message}`);
      }
    }
  }

  console.log(`\nSummary across ${files.length} file(s): ${totalErrors} error(s), ${totalWarnings} warning(s).`);
  if (totalErrors > 0 || (strict && totalWarnings > 0)) {
    process.exit(1);
  }
}

import { fileURLToPath } from 'node:url';

const isMain = typeof process !== 'undefined' && process.argv[1] && (
  process.argv[1].endsWith('audit-question-quality.ts') ||
  process.argv[1] === fileURLToPath(import.meta.url)
);

if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
