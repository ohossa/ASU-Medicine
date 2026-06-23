import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Re-defining internal types to avoid build/import path resolution issues in TS execution
type SubjectColor = 'anatomy' | 'histology' | 'physiology' | 'biochem' | 'microbiology' | 'pathology' | 'pharma' | 'clinical' | 'parasitology' | 'psychiatry' | 'ophthalmology' | 'ent';
type QuestionType = 'mcq' | 'truefalse' | 'matching' | 'essay' | 'case' | 'fillblank';

interface ModuleMeta {
  moduleCode: string;
  moduleName: string;
  year: number;
  semester: number;
  creditPoints: number;
  totalMarks: number;
  keywords: string[];
}

interface Question {
  id: string;
  type: QuestionType;
  lecture: number;
  text: string;
  options?: string[];
  correctIndex?: number;
  pairs?: { premise: string; target: string }[];
  modelAnswer?: string | null;
  explanation: string;
  keyConcept?: string;
  subQuestions?: SubQuestion[];
  blanks?: string[];
}

interface SubQuestion {
  id: string;
  type: 'mcq' | 'essay' | 'fillblank';
  text: string;
  options?: string[];
  correctIndex?: number;
  modelAnswer?: string;
  explanation: string;
  keyConcept?: string;
  blanks?: string[];
  acceptedAnswers?: string[][];
}

interface Subject {
  id: SubjectColor;
  name: string;
  iconName: string;
  lectures: string;
  lectureCount: number;
  lectureNames?: string[];
  questions: Question[];
}

interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  page: number;
  lectureRange: string;
  subjects: Subject[];
  keywords?: string[];
}

interface QuestionBankFile {
  schemaVersion: number;
  meta: ModuleMeta;
  chapters: Chapter[];
}

const ALLOWED_SUBJECTS: Set<SubjectColor> = new Set([
  'anatomy',
  'histology',
  'physiology',
  'biochem',
  'microbiology',
  'pathology',
  'pharma',
  'clinical',
  'parasitology',
  'psychiatry',
  'ophthalmology',
  'ent'
]);

export function validateModuleFile(bank: QuestionBankFile): string[] {
  const errors: string[] = [];

  if (!bank) {
    return ['File content is empty or invalid JSON.'];
  }

  // 1. Schema check
  if (bank.schemaVersion !== 1) {
    errors.push(`Invalid schemaVersion: expected 1, got ${bank.schemaVersion}`);
  }

  // 2. Meta check
  const meta = bank.meta;
  if (!meta) {
    errors.push('Missing "meta" section.');
  } else {
    if (typeof meta.moduleCode !== 'string' || !meta.moduleCode.trim()) {
      errors.push('Meta "moduleCode" must be a non-empty string.');
    }
    if (typeof meta.moduleName !== 'string' || !meta.moduleName.trim()) {
      errors.push('Meta "moduleName" must be a non-empty string.');
    }
    if (![1, 2, 3, 4, 5].includes(meta.year)) {
      errors.push(`Meta "year" must be between 1 and 5, got ${meta.year}`);
    }
    if (![1, 2].includes(meta.semester)) {
      errors.push(`Meta "semester" must be 1 or 2, got ${meta.semester}`);
    }
    if (typeof meta.creditPoints !== 'number' || meta.creditPoints <= 0) {
      errors.push(`Meta "creditPoints" must be a positive number, got ${meta.creditPoints}`);
    }
    if (typeof meta.totalMarks !== 'number' || meta.totalMarks <= 0) {
      errors.push(`Meta "totalMarks" must be a positive number, got ${meta.totalMarks}`);
    }
    if (!Array.isArray(meta.keywords)) {
      errors.push('Meta "keywords" must be an array of strings.');
    }
  }

  // 3. Chapters, subjects, and questions check
  if (!Array.isArray(bank.chapters)) {
    errors.push('"chapters" must be an array.');
    return errors;
  }

  const ids = new Set<string>();

  bank.chapters.forEach((chapter, chIdx) => {
    const chPrefix = `Chapter ${chapter.id || chIdx + 1}`;
    if (typeof chapter.id !== 'number') {
      errors.push(`${chPrefix}: chapter "id" must be a number.`);
    }
    if (typeof chapter.title !== 'string' || !chapter.title.trim()) {
      errors.push(`${chPrefix}: chapter "title" must be a non-empty string.`);
    }

    if (!Array.isArray(chapter.subjects)) {
      errors.push(`${chPrefix}: "subjects" must be an array.`);
      return;
    }

    chapter.subjects.forEach((subject) => {
      const subPrefix = `${chPrefix} -> Subject "${subject.id}"`;
      if (!ALLOWED_SUBJECTS.has(subject.id)) {
        errors.push(`${subPrefix}: invalid subject ID. Must be one of: ${Array.from(ALLOWED_SUBJECTS).join(', ')}`);
      }
      if (typeof subject.name !== 'string' || !subject.name.trim()) {
        errors.push(`${subPrefix}: "name" must be a non-empty string.`);
      }

      // lectureNames validation
      if (subject.lectureNames) {
        if (!Array.isArray(subject.lectureNames)) {
          errors.push(`${subPrefix}: "lectureNames" must be an array of strings.`);
        } else {
          if (subject.lectureNames.length !== subject.lectureCount) {
            errors.push(`${subPrefix}: "lectureNames" length (${subject.lectureNames.length}) does not match "lectureCount" (${subject.lectureCount}).`);
          }
          subject.lectureNames.forEach((name, idx) => {
            if (typeof name !== 'string' || !name.trim()) {
              errors.push(`${subPrefix}: lectureNames[${idx}] must be a non-empty string.`);
            }
          });
        }
      }

      if (!Array.isArray(subject.questions)) {
        errors.push(`${subPrefix}: "questions" must be an array.`);
        return;
      }

      subject.questions.forEach((q, qIdx) => {
        const qLoc = `${subPrefix} -> Question index ${qIdx + 1} (${q.id || 'NO ID'})`;

        // ID check
        if (typeof q.id !== 'string' || !q.id.trim()) {
          errors.push(`${qLoc}: question "id" must be a non-empty string.`);
        } else {
          if (ids.has(q.id)) {
            errors.push(`${qLoc}: duplicate question ID "${q.id}" detected.`);
          }
          ids.add(q.id);
        }

        // Text check
        if (typeof q.text !== 'string' || !q.text.trim()) {
          errors.push(`${qLoc}: "text" must be a non-empty string.`);
        }

        // Lecture check
        if (typeof q.lecture !== 'number' || !Number.isInteger(q.lecture)) {
          errors.push(`${qLoc}: "lecture" must be an integer.`);
        }

        // Type checks
        const allowedTypes: QuestionType[] = ['mcq', 'truefalse', 'matching', 'essay', 'case', 'fillblank'];
        if (!allowedTypes.includes(q.type)) {
          errors.push(`${qLoc}: invalid "type" "${q.type}".`);
          return;
        }

        // Detailed checks per type
        if (q.type === 'mcq' || q.type === 'truefalse') {
          if (!Array.isArray(q.options) || q.options.length === 0) {
            errors.push(`${qLoc}: MCQ/TrueFalse question must have a non-empty "options" array.`);
          } else {
            if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
              errors.push(`${qLoc}: "correctIndex" (${q.correctIndex}) is out of bounds for ${q.options.length} options.`);
            }
          }
        } else if (q.type === 'essay') {
          if (typeof q.modelAnswer !== 'string' || !q.modelAnswer.trim()) {
            errors.push(`${qLoc}: essay question must have a non-empty "modelAnswer".`);
          }
        } else if (q.type === 'matching') {
          if (!Array.isArray(q.pairs) || q.pairs.length === 0) {
            errors.push(`${qLoc}: matching question must have a non-empty "pairs" array.`);
          } else {
            q.pairs.forEach((pair, pairIdx) => {
              if (typeof pair.premise !== 'string' || !pair.premise.trim()) {
                errors.push(`${qLoc} -> Pair ${pairIdx + 1}: "premise" must be a non-empty string.`);
              }
              if (typeof pair.target !== 'string' || !pair.target.trim()) {
                errors.push(`${qLoc} -> Pair ${pairIdx + 1}: "target" must be a non-empty string.`);
              }
            });
          }
        } else if (q.type === 'fillblank') {
          if (!Array.isArray(q.blanks) || q.blanks.length === 0) {
            errors.push(`${qLoc}: fill-in-the-blank question must have a non-empty "blanks" array.`);
          } else {
            const blankCount = (q.text.match(/___/g) ?? []).length;
            if (blankCount !== q.blanks.length) {
              errors.push(`${qLoc}: text contains ${blankCount} blanks (___), but "blanks" array has ${q.blanks.length} items.`);
            }
          }
        } else if (q.type === 'case') {
          if (!Array.isArray(q.subQuestions) || q.subQuestions.length === 0) {
            errors.push(`${qLoc}: case study must have a non-empty "subQuestions" array.`);
          } else {
            q.subQuestions.forEach((sq, sqIdx) => {
              const sqLoc = `${qLoc} -> SubQuestion index ${sqIdx + 1} (${sq.id || 'NO ID'})`;
              if (typeof sq.id !== 'string' || !sq.id.trim()) {
                errors.push(`${sqLoc}: sub-question "id" must be a non-empty string.`);
              } else {
                if (ids.has(sq.id)) {
                  errors.push(`${sqLoc}: duplicate sub-question ID "${sq.id}" detected.`);
                }
                ids.add(sq.id);
              }

              if (typeof sq.text !== 'string' || !sq.text.trim()) {
                errors.push(`${sqLoc}: "text" must be a non-empty string.`);
              }

              if (sq.type !== 'mcq' && sq.type !== 'essay' && sq.type !== 'fillblank') {
                errors.push(`${sqLoc}: sub-question type must be "mcq", "essay", or "fillblank", got "${sq.type}".`);
                return;
              }

              if (sq.type === 'mcq') {
                if (!Array.isArray(sq.options) || sq.options.length === 0) {
                  errors.push(`${sqLoc}: MCQ sub-question must have a non-empty "options" array.`);
                } else {
                  if (typeof sq.correctIndex !== 'number' || sq.correctIndex < 0 || sq.correctIndex >= sq.options.length) {
                    errors.push(`${sqLoc}: "correctIndex" (${sq.correctIndex}) is out of bounds for ${sq.options.length} options.`);
                  }
                }
              } else if (sq.type === 'essay') {
                if (typeof sq.modelAnswer !== 'string' || !sq.modelAnswer.trim()) {
                  errors.push(`${sqLoc}: essay sub-question must have a non-empty "modelAnswer".`);
                }
              } else if (sq.type === 'fillblank') {
                if (!Array.isArray(sq.blanks) || sq.blanks.length === 0) {
                  errors.push(`${sqLoc}: fillblank sub-question must have a non-empty "blanks" array.`);
                }
              }
            });
          }
        }
      });
    });
  });

  return errors;
}

async function findJsonFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function run() {
  const args = process.argv.slice(2);
  const target = args[0];

  let filesToValidate: string[] = [];
  if (target) {
    filesToValidate.push(target);
  } else {
    try {
      filesToValidate = await findJsonFiles('src/imports');
    } catch (err: any) {
      console.error('Error scanning src/imports:', err.message);
      process.exit(1);
    }
  }

  let totalErrors = 0;
  console.log(`Validating ${filesToValidate.length} file(s)...`);

  for (const file of filesToValidate) {
    try {
      const content = await readFile(file, 'utf-8');
      const parsed = JSON.parse(content) as QuestionBankFile;
      const errors = validateModuleFile(parsed);
      if (errors.length > 0) {
        console.error(`\n❌ Validation FAILED for ${file}:`);
        errors.forEach((err) => console.error(`  - ${err}`));
        totalErrors += errors.length;
      } else {
        console.log(`✅ ${file} passed validation.`);
      }
    } catch (err: any) {
      console.error(`\n❌ Error reading/parsing ${file}:`, err.message);
      totalErrors++;
    }
  }

  if (totalErrors > 0) {
    console.error(`\nValidation failed with ${totalErrors} total error(s).`);
    process.exit(1);
  } else {
    console.log('\nAll checked files are valid!');
    process.exit(0);
  }
}

import { fileURLToPath } from 'node:url';

// Only execute run() if this file is run directly
const isMain = typeof process !== 'undefined' && process.argv[1] && (
  process.argv[1].endsWith('validate-banks.ts') ||
  process.argv[1] === fileURLToPath(import.meta.url)
);
if (isMain) {
  run().catch((err) => {
    console.error('Unexpected error running validator:', err);
    process.exit(1);
  });
}
