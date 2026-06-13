import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';

type SubjectColor = 'anatomy' | 'histology' | 'physiology' | 'biochem' | 'microbiology' | 'pathology' | 'pharma' | 'clinical' | 'parasitology' | 'psychiatry' | 'ophthalmology' | 'ent';
type QuestionType = 'mcq' | 'truefalse' | 'matching' | 'essay' | 'case' | 'fillblank';

type QuestionBankFile = {
  schemaVersion: 1;
  meta: { moduleCode: string; moduleName: string; year: number; semester: number; creditPoints: number; totalMarks: number; keywords: string[] };
  chapters: Chapter[];
};

type Chapter = { id: number; title: string; subtitle: string; emoji: string; page: number; lectureRange: string; subjects: Subject[] };
type Subject = { id: SubjectColor; name: string; iconName: string; lectures: string; lectureCount: number; questions: Question[] };

type Question = {
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
  acceptedAnswers?: string[][];
};

type SubQuestion = {
  id: string;
  type: 'mcq' | 'essay';
  text: string;
  options?: string[];
  correctIndex?: number;
  modelAnswer?: string;
  explanation: string;
  keyConcept?: string;
};

type IncomingBatch = {
  moduleCode?: string;
  defaultChapterId?: number;
  defaultChapterTitle?: string;
  questions: IncomingQuestion[];
};

type IncomingQuestion = {
  chapterId?: number;
  chapterTitle?: string;
  subject?: string;
  topic?: string;
  lecture?: number;
  type?: QuestionType;
  question?: string;
  text?: string;
  options?: string[];
  correctAnswer?: string;
  correctIndex?: number;
  pairs?: { premise: string; target: string }[];
  modelAnswer?: string;
  explanation?: string;
  keyConcept?: string;
  subQuestions?: IncomingSubQuestion[];
  blanks?: string[];
  acceptedAnswers?: string[][];
};

type IncomingSubQuestion = {
  type?: 'mcq' | 'essay';
  question?: string;
  text?: string;
  options?: string[];
  correctAnswer?: string;
  correctIndex?: number;
  modelAnswer?: string;
  explanation?: string;
  keyConcept?: string;
};

type ImportReport = {
  inputPath: string;
  targetPath: string;
  moduleCode: string;
  added: { id: string; chapterId: number; subject: SubjectColor; text: string }[];
  skippedDuplicates: { matchedId: string; text: string }[];
  removedExistingDuplicates: { keptId: string; removedId: string; text: string }[];
  needsReview: { index: number; reason: string; text: string }[];
};

const SUBJECT_DISPLAY: Record<SubjectColor, { name: string; iconName: string; key: string }> = {
  anatomy: { name: 'Anatomy', iconName: 'Bone', key: 'ANAT' },
  histology: { name: 'Histology', iconName: 'Microscope', key: 'HIST' },
  physiology: { name: 'Physiology', iconName: 'Activity', key: 'PHYS' },
  biochem: { name: 'Biochemistry', iconName: 'FlaskConical', key: 'BIOC' },
  microbiology: { name: 'Microbiology', iconName: 'Biohazard', key: 'MICR' },
  pathology: { name: 'Pathology', iconName: 'ShieldAlert', key: 'PATH' },
  pharma: { name: 'Pharmacology', iconName: 'Pill', key: 'PHAR' },
  clinical: { name: 'Clinical', iconName: 'Stethoscope', key: 'CLIN' },
  parasitology: { name: 'Parasitology', iconName: 'Bug', key: 'PARA' },
  psychiatry: { name: 'Psychiatry', iconName: 'Brain', key: 'PSYC' },
  ophthalmology: { name: 'Ophthalmology', iconName: 'Eye', key: 'OPHT' },
  ent: { name: 'E.N.T.', iconName: 'Ear', key: 'ENT' }
};

async function main(): Promise<void> {
  const [inputPath, targetPath] = process.argv.slice(2);
  if (!inputPath || !targetPath) {
    throw new Error('Usage: npx tsx data-format-v2/scripts/import-batch.ts <incoming-batch.json> <target-module.json>');
  }

  const batch = JSON.parse(await readFile(inputPath, 'utf8')) as IncomingBatch;
  const bank = JSON.parse(await readFile(targetPath, 'utf8')) as QuestionBankFile;

  if (bank.schemaVersion !== 1) throw new Error(`Unsupported schemaVersion in ${targetPath}`);
  if (batch.moduleCode && batch.moduleCode !== bank.meta.moduleCode) {
    throw new Error(`Batch moduleCode ${batch.moduleCode} does not match target ${bank.meta.moduleCode}`);
  }

  const report: ImportReport = { inputPath, targetPath, moduleCode: bank.meta.moduleCode, added: [], skippedDuplicates: [], removedExistingDuplicates: [], needsReview: [] };
  removeExistingDuplicates(bank, report);
  const duplicateIndex = buildDuplicateIndex(bank);

  batch.questions.forEach((incoming, index) => {
    const text = incoming.text ?? incoming.question ?? '';
    const chapter = resolveChapter(bank, incoming, batch);
    if (!chapter) {
      report.needsReview.push({ index, reason: 'No matching chapter. Add chapterId or exact chapterTitle.', text });
      return;
    }

    const subjectId = inferSubject(incoming.subject ?? incoming.topic ?? '');
    if (!subjectId) {
      report.needsReview.push({ index, reason: 'No matching subject. Add one of the canonical subject names.', text });
      return;
    }

    const duplicateKey = makeDuplicateKey(incoming);
    const matchedDuplicateId = duplicateIndex.get(duplicateKey);
    if (matchedDuplicateId) {
      report.skippedDuplicates.push({ matchedId: matchedDuplicateId, text });
      return;
    }

    const converted = convertQuestion(incoming, bank.meta.moduleCode, chapter, subjectId);
    const validationError = validateQuestion(converted);
    if (validationError) {
      report.needsReview.push({ index, reason: validationError, text });
      return;
    }

    const subject = getOrCreateSubject(chapter, subjectId);
    subject.questions.push(converted);
    duplicateIndex.set(duplicateKey, converted.id);
    report.added.push({ id: converted.id, chapterId: chapter.id, subject: subjectId, text: converted.text });
  });

  removeExistingDuplicates(bank, report);
  validateUniqueIds(bank);
  await writeFile(targetPath, `${JSON.stringify(bank, null, 2)}\n`, 'utf8');

  const reportPath = inputPath.replace(new RegExp(`${escapeRegExp(extname(inputPath))}$`), '.import-report.json');
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(`Added ${report.added.length} questions`);
  console.log(`Skipped ${report.skippedDuplicates.length} incoming duplicates`);
  console.log(`Removed ${report.removedExistingDuplicates.length} existing duplicates`);
  console.log(`Needs review ${report.needsReview.length}`);
  console.log(`Report written to ${reportPath}`);
}

function resolveChapter(bank: QuestionBankFile, question: IncomingQuestion, batch: IncomingBatch): Chapter | undefined {
  const chapterId = question.chapterId ?? batch.defaultChapterId;
  if (chapterId) return bank.chapters.find((chapter) => chapter.id === chapterId);

  const title = normalize(question.chapterTitle ?? batch.defaultChapterTitle ?? '');
  if (!title) return undefined;

  return bank.chapters.find((chapter) => normalize(chapter.title) === title || normalize(chapter.subtitle) === title);
}

function getOrCreateSubject(chapter: Chapter, subjectId: SubjectColor): Subject {
  const existing = chapter.subjects.find((subject) => subject.id === subjectId);
  if (existing) return existing;

  const display = SUBJECT_DISPLAY[subjectId];
  const created: Subject = {
    id: subjectId,
    name: display.name,
    iconName: display.iconName,
    lectures: chapter.lectureRange,
    lectureCount: 1,
    questions: []
  };
  chapter.subjects.push(created);
  return created;
}

function convertQuestion(incoming: IncomingQuestion, moduleCode: string, chapter: Chapter, subject: SubjectColor): Question {
  const type = inferType(incoming);
  const id = nextQuestionId(moduleCode, chapter, subject);
  const base = {
    id,
    type,
    lecture: incoming.lecture ?? chapter.id,
    text: incoming.text ?? incoming.question ?? '',
    explanation: incoming.explanation ?? 'Review the related lecture material for the rationale.',
    keyConcept: incoming.keyConcept
  };

  if (type === 'essay') return { ...base, type, modelAnswer: incoming.modelAnswer ?? '' };
  if (type === 'matching') return { ...base, type, pairs: incoming.pairs ?? [] };
  if (type === 'fillblank') return { ...base, type, blanks: incoming.blanks ?? [], acceptedAnswers: incoming.acceptedAnswers };
  if (type === 'case') return { ...base, type, subQuestions: (incoming.subQuestions ?? []).map((subQuestion, index) => convertSubQuestion(subQuestion, `${id}-SQ${index + 1}`)) };

  const options = incoming.options ?? (type === 'truefalse' ? ['True', 'False'] : []);
  return { ...base, type, options, correctIndex: normalizeCorrectIndex(incoming, options), modelAnswer: incoming.modelAnswer ?? null };
}

function convertSubQuestion(incoming: IncomingSubQuestion, id: string): SubQuestion {
  const type = incoming.type === 'essay' ? 'essay' : 'mcq';
  const base = {
    id,
    type,
    text: incoming.text ?? incoming.question ?? '',
    explanation: incoming.explanation ?? 'Review the related lecture material for the rationale.',
    keyConcept: incoming.keyConcept
  };

  if (type === 'essay') return { ...base, type, modelAnswer: incoming.modelAnswer ?? '' };

  const options = incoming.options ?? [];
  return { ...base, type, options, correctIndex: normalizeCorrectIndex(incoming, options) };
}

function validateQuestion(question: Question): string | null {
  if (!question.text.trim()) return 'Question text is missing.';
  if (!Number.isInteger(question.lecture)) return 'Lecture must be an integer.';
  if ((question.type === 'mcq' || question.type === 'truefalse') && (!question.options?.length || question.correctIndex === undefined)) return 'Options or correctIndex missing.';
  if (question.type === 'essay' && !question.modelAnswer) return 'Essay modelAnswer is missing.';
  if (question.type === 'matching' && !question.pairs?.length) return 'Matching pairs are missing.';
  if (question.type === 'fillblank' && !question.blanks?.length) return 'Fillblank blanks are missing.';
  if (question.type === 'case' && !question.subQuestions?.length) return 'Case subQuestions are missing.';
  return null;
}

function inferType(question: IncomingQuestion): QuestionType {
  if (question.type) return question.type;
  if (question.subQuestions?.length) return 'case';
  if (question.pairs?.length) return 'matching';
  if (question.blanks?.length) return 'fillblank';
  if (question.options?.length) return question.options.length === 2 && question.options.every((option) => /^(true|false)$/i.test(option)) ? 'truefalse' : 'mcq';
  return 'essay';
}

function inferSubject(value: string): SubjectColor | null {
  const normalized = normalize(value);
  if (normalized.includes('anatomy')) return 'anatomy';
  if (normalized.includes('histology') || normalized.includes('histo')) return 'histology';
  if (normalized.includes('physiology') || normalized.includes('physio')) return 'physiology';
  if (normalized.includes('biochem')) return 'biochem';
  if (normalized.includes('micro') || normalized.includes('bacter') || normalized.includes('virus') || normalized.includes('fung')) return 'microbiology';
  if (normalized.includes('parasit')) return 'parasitology';
  if (normalized.includes('pathology') || normalized.includes('patho')) return 'pathology';
  if (normalized.includes('pharma')) return 'pharma';
  if (normalized.includes('psychiatry') || normalized.includes('psychiat') || normalized.includes('behavioral') || normalized.includes('psychology')) return 'psychiatry';
  if (normalized.includes('ophthalmology') || normalized.includes('ophthalm') || normalized.includes('eye')) return 'ophthalmology';
  if (normalized.includes('ent') || normalized.includes('ear') || normalized.includes('nose') || normalized.includes('throat') || normalized.includes('otorhinolaryngology')) return 'ent';
  if (normalized.includes('clinical') || normalized.includes('case')) return 'clinical';
  return null;
}

function normalizeCorrectIndex(question: Pick<IncomingQuestion | IncomingSubQuestion, 'correctAnswer' | 'correctIndex'>, options: string[]): number {
  if (typeof question.correctIndex === 'number') return clamp(question.correctIndex, options.length);
  if (question.correctAnswer) return clamp(question.correctAnswer.trim().toUpperCase().charCodeAt(0) - 65, options.length);
  return 0;
}

function clamp(index: number, optionCount: number): number {
  if (optionCount <= 0) return 0;
  return Math.min(Math.max(index, 0), optionCount - 1);
}

function nextQuestionId(moduleCode: string, chapter: Chapter, subject: SubjectColor): string {
  const modulePrefix = moduleCode.replace(/-/g, '');
  const subjectKey = SUBJECT_DISPLAY[subject].key;
  const prefix = `${modulePrefix}-CH${chapter.id}-${subjectKey}-`;
  const maxSequence = chapter.subjects
    .flatMap((chapterSubject) => chapterSubject.questions)
    .map((question) => question.id.startsWith(prefix) ? Number(question.id.slice(prefix.length)) : 0)
    .filter(Number.isFinite)
    .reduce((max, sequence) => Math.max(max, sequence), 0);

  return `${prefix}${String(maxSequence + 1).padStart(4, '0')}`;
}

function buildDuplicateIndex(bank: QuestionBankFile): Map<string, string> {
  const index = new Map<string, string>();
  for (const chapter of bank.chapters) {
    for (const subject of chapter.subjects) {
      for (const question of subject.questions) {
        index.set(makeDuplicateKey(question), question.id);
      }
    }
  }
  return index;
}

function removeExistingDuplicates(bank: QuestionBankFile, report: ImportReport): void {
  const seen = new Map<string, string>();

  for (const chapter of bank.chapters) {
    for (const subject of chapter.subjects) {
      const uniqueQuestions: Question[] = [];

      for (const question of subject.questions) {
        const key = makeDuplicateKey(question);
        const keptId = seen.get(key);

        if (keptId) {
          if (!report.removedExistingDuplicates.some((item) => item.removedId === question.id)) {
            report.removedExistingDuplicates.push({ keptId, removedId: question.id, text: question.text });
          }
          continue;
        }

        seen.set(key, question.id);
        uniqueQuestions.push(question);
      }

      subject.questions = uniqueQuestions;
    }
  }
}

function makeDuplicateKey(question: Pick<Question | IncomingQuestion, 'text' | 'question' | 'options'>): string {
  return normalize(`${question.text ?? question.question ?? ''} ${(question.options ?? []).join(' ')}`);
}

function validateUniqueIds(bank: QuestionBankFile): void {
  const ids = new Set<string>();
  for (const chapter of bank.chapters) {
    for (const subject of chapter.subjects) {
      for (const question of subject.questions) {
        if (ids.has(question.id)) throw new Error(`Duplicate question id: ${question.id}`);
        ids.add(question.id);
      }
    }
  }
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
