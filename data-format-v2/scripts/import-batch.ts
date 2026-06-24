import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';

type SubjectColor = 'anatomy' | 'histology' | 'physiology' | 'biochem' | 'microbiology' | 'pathology' | 'pharma' | 'clinical' | 'parasitology' | 'psychiatry' | 'ophthalmology' | 'ent';
type QuestionType = 'mcq' | 'truefalse' | 'matching' | 'essay' | 'case' | 'fillblank';

type QuestionBankFile = {
  schemaVersion: 1;
  meta: { moduleCode: string; moduleName: string; year: number; semester: number; creditPoints: number; totalMarks: number; keywords: string[] };
  chapters: Chapter[];
};

type Chapter = { id: number; title: string; subtitle: string; emoji: string; page: number; lectureRange: string; subjects: Subject[]; keywords?: string[] };
type Subject = { id: SubjectColor; name: string; iconName: string; lectures: string; lectureCount: number; lectureNames?: string[]; questions: Question[] };

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
  repetitionCount?: number;

  /* ── Analytics fields (reserved for future usage) ── */
  avgCorrectRate?: number;
  totalAttempts?: number;
  discriminationIndex?: number;
};

type SubQuestion = {
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
  type?: 'mcq' | 'essay' | 'fillblank';
  question?: string;
  text?: string;
  options?: string[];
  correctAnswer?: string;
  correctIndex?: number;
  modelAnswer?: string;
  explanation?: string;
  keyConcept?: string;
  blanks?: string[];
  acceptedAnswers?: string[][];
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
  const args = process.argv.slice(2);
  const allowCrossChapter = args.includes('--allow-cross-chapter-duplicates');
  const positionalArgs = args.filter((arg) => !arg.startsWith('--'));
  const [inputPath, targetPath] = positionalArgs;

  if (!inputPath || !targetPath) {
    throw new Error('Usage: npx tsx data-format-v2/scripts/import-batch.ts [--allow-cross-chapter-duplicates] <incoming-batch.json> <target-module.json>');
  }

  const batch = JSON.parse(await readFile(inputPath, 'utf8')) as IncomingBatch;
  const bank = JSON.parse(await readFile(targetPath, 'utf8')) as QuestionBankFile;

  if (bank.schemaVersion !== 1) throw new Error(`Unsupported schemaVersion in ${targetPath}`);
  if (batch.moduleCode && batch.moduleCode !== bank.meta.moduleCode) {
    throw new Error(`Batch moduleCode ${batch.moduleCode} does not match target ${bank.meta.moduleCode}`);
  }

  const report: ImportReport = { inputPath, targetPath, moduleCode: bank.meta.moduleCode, added: [], skippedDuplicates: [], removedExistingDuplicates: [], needsReview: [] };
  removeExistingDuplicates(bank, report, allowCrossChapter);
  const duplicateIndex = buildDuplicateIndex(bank, allowCrossChapter);

  batch.questions.forEach((incoming, index) => {
    const text = incoming.text ?? incoming.question ?? '';

    let chapter: Chapter | undefined;
    let subjectId: SubjectColor | undefined;
    let resolvedLecture: number | undefined;

    const smartRoute = resolveSmartRouting(bank, incoming);
    if (smartRoute) {
      chapter = smartRoute.chapter;
      subjectId = smartRoute.subjectId;
      resolvedLecture = smartRoute.lecture;
    } else {
      // Try content-based routing: scan question text against lectureNames
      const contentRoute = resolveContentRouting(bank, incoming);
      if (contentRoute) {
        chapter = contentRoute.chapter;
        subjectId = contentRoute.subjectId;
        resolvedLecture = contentRoute.lecture;
      } else {
        chapter = resolveChapter(bank, incoming, batch);
        if (!chapter) {
          report.needsReview.push({ index, reason: 'No matching chapter. Add chapterId or exact chapterTitle.', text });
          return;
        }

        subjectId = inferSubject(incoming.subject ?? incoming.topic ?? '');
        if (!subjectId) {
          report.needsReview.push({ index, reason: 'No matching subject. Add one of the canonical subject names.', text });
          return;
        }
      }
    }

    const cleanedIncomingText = cleanStarText(text);
    const baseKey = makeDuplicateKey({ ...incoming, text: cleanedIncomingText });
    const duplicateKey = allowCrossChapter ? `${chapter.id}:${baseKey}` : baseKey;
    const matchedDuplicateId = duplicateIndex.get(duplicateKey);
    if (matchedDuplicateId) {
      // Increment repetitionCount on the existing question
      const existingQuestion = findQuestionById(bank, matchedDuplicateId);
      if (existingQuestion) {
        existingQuestion.repetitionCount = (existingQuestion.repetitionCount ?? 1) + 1;
      }
      report.skippedDuplicates.push({ matchedId: matchedDuplicateId, text: cleanedIncomingText });
      return;
    }

    const converted = convertQuestion(incoming, bank.meta.moduleCode, chapter, subjectId, resolvedLecture);
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

  removeExistingDuplicates(bank, report, allowCrossChapter);
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

const SUBJECT_KEYWORDS_AND_IDS = [
  'anatomy', 'histology', 'physiology', 'biochem', 'biochemistry',
  'microbiology', 'pathology', 'pharma', 'pharmacology', 'clinical',
  'parasitology', 'psychiatry', 'ophthalmology', 'ent'
];

export function resolveSmartRouting(bank: QuestionBankFile, incoming: IncomingQuestion): { chapter: Chapter; subjectId: SubjectColor; lecture: number } | null {
  const topic = incoming.topic?.trim();
  const subject = incoming.subject?.trim();
  const chapterTitle = incoming.chapterTitle?.trim();

  // Try matching against lectureNames
  const candidates = [topic, subject, chapterTitle].filter((c): c is string => typeof c === 'string' && c.length > 0);

  for (const candidate of candidates) {
    const normalizedCandidate = normalize(candidate);
    if (!normalizedCandidate) continue;

    for (const chapter of bank.chapters) {
      for (const subjectObj of chapter.subjects) {
        if (!subjectObj.lectureNames) continue;

        // 1. Exact match first
        const exactIndex = subjectObj.lectureNames.findIndex(name => normalize(name) === normalizedCandidate);
        if (exactIndex !== -1) {
          return {
            chapter,
            subjectId: subjectObj.id,
            lecture: exactIndex + 1
          };
        }

        // 2. Substring match, but only if it's not a generic subject header
        if (!SUBJECT_KEYWORDS_AND_IDS.includes(normalizedCandidate)) {
          const subIndex = subjectObj.lectureNames.findIndex(name => {
            const normalizedName = normalize(name);
            return normalizedName.includes(normalizedCandidate) || normalizedCandidate.includes(normalizedName);
          });
          if (subIndex !== -1) {
            return {
              chapter,
              subjectId: subjectObj.id,
              lecture: subIndex + 1
            };
          }
        }
      }
    }
  }

  return null;
}

/**
 * Content-based routing fallback: scans the question text itself against all
 * lectureNames in the bank. Used when topic/subject/chapterTitle metadata is
 * missing or did not match any lectureNames. Tokenizes the question text and
 * scores each lecture by counting how many of its significant words appear
 * in the question. Requires a minimum confidence threshold to avoid false positives.
 */
export function resolveContentRouting(bank: QuestionBankFile, incoming: IncomingQuestion): { chapter: Chapter; subjectId: SubjectColor; lecture: number } | null {
  const questionText = normalize(incoming.text ?? incoming.question ?? '');
  if (!questionText || questionText.length < 10) return null; // Too short to reliably match

  const questionWords = new Set(questionText.split(/\s+/).filter(w => w.length > 2));
  if (questionWords.size === 0) return null;

  let bestMatch: { chapter: Chapter; subjectId: SubjectColor; lecture: number } | null = null;
  let bestScore = 0;

  for (const chapter of bank.chapters) {
    for (const subjectObj of chapter.subjects) {
      if (!subjectObj.lectureNames) continue;

      for (let i = 0; i < subjectObj.lectureNames.length; i++) {
        const lectureName = subjectObj.lectureNames[i];
        const lectureWords = normalize(lectureName).split(/\s+/).filter(w => w.length > 2);
        if (lectureWords.length === 0) continue;

        // Count how many significant words from the lecture name appear in the question text
        let hits = 0;
        for (const lw of lectureWords) {
          // Skip generic words that would cause false positives
          if (['the', 'and', 'function', 'introduction', 'physiology', 'anatomy', 'histology', 'biochemistry', 'clinical', 'pathology', 'pharmacology', 'microbiology'].includes(lw)) continue;
          for (const qw of questionWords) {
            if (qw === lw || (lw.length >= 5 && (qw.includes(lw) || lw.includes(qw)))) {
              hits++;
              break;
            }
          }
        }

        // Score = proportion of lecture name words found in question text
        // Only count non-generic words for scoring
        const significantLectureWords = lectureWords.filter(w => !['the', 'and', 'function', 'introduction', 'physiology', 'anatomy', 'histology', 'biochemistry', 'clinical', 'pathology', 'pharmacology', 'microbiology'].includes(w));
        if (significantLectureWords.length === 0) continue;

        const score = hits / significantLectureWords.length;

        // Require at least 50% of significant lecture words to match AND at least 2 hits
        // (or 1 hit if the lecture name has only 1 significant word AND that word is 6+ chars)
        const minHits = significantLectureWords.length === 1 && significantLectureWords[0].length >= 6 ? 1 : 2;
        if (score >= 0.5 && hits >= minHits && score > bestScore) {
          bestScore = score;
          bestMatch = {
            chapter,
            subjectId: subjectObj.id,
            lecture: i + 1
          };
        }
      }
    }
  }

  return bestMatch;
}

function resolveChapter(bank: QuestionBankFile, question: IncomingQuestion, batch: IncomingBatch): Chapter | undefined {
  const chapterId = question.chapterId ?? batch.defaultChapterId;
  if (chapterId) return bank.chapters.find((chapter) => chapter.id === chapterId);

  const title = normalize(question.chapterTitle ?? batch.defaultChapterTitle ?? '');

  if (title) {
    const exact = bank.chapters.find((chapter) => normalize(chapter.title) === title || normalize(chapter.subtitle) === title);
    if (exact) return exact;
  }

  // Keyword-based matching fallback
  const textToAnalyze = title || normalize(question.text ?? question.question ?? '');
  if (!textToAnalyze) return undefined;

  const words = new Set(textToAnalyze.split(/\s+/));
  let bestChapter: Chapter | undefined;
  let bestScore = 0;

  for (const chapter of bank.chapters) {
    if (!chapter.keywords?.length) continue;
    const chapterKeywords = chapter.keywords.map(k => normalize(k));
    let hits = 0;
    for (const kw of chapterKeywords) {
      for (const word of words) {
        if (word.length > 2 && (kw === word || kw.includes(word) || word.includes(kw))) {
          hits++;
          break;
        }
      }
    }
    const score = hits > 0 ? hits / Math.min(chapter.keywords.length, words.size) : 0;
    if (score > bestScore) {
      bestScore = score;
      bestChapter = chapter;
    }
  }

  return bestScore >= 0.15 ? bestChapter : undefined;
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

function convertQuestion(incoming: IncomingQuestion, moduleCode: string, chapter: Chapter, subject: SubjectColor, resolvedLecture?: number): Question {
  const type = inferType(incoming);
  const id = nextQuestionId(moduleCode, chapter, subject);
  const base = {
    id,
    type,
    lecture: resolvedLecture ?? incoming.lecture ?? chapter.id,
    text: cleanStarText(incoming.text ?? incoming.question ?? ''),
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
  const type = (incoming.type === 'essay' || incoming.type === 'fillblank') ? incoming.type : 'mcq';
  const base = {
    id,
    type,
    text: incoming.text ?? incoming.question ?? '',
    explanation: incoming.explanation ?? 'Review the related lecture material for the rationale.',
    keyConcept: incoming.keyConcept
  };

  if (type === 'essay') return { ...base, type, modelAnswer: incoming.modelAnswer ?? '' };
  if (type === 'fillblank') return { ...base, type, blanks: incoming.blanks ?? [], acceptedAnswers: incoming.acceptedAnswers };

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

function cleanStarText(text: string): string {
  return text.replace(/(?:\s*\*+)?\s*★+\s*$/g, '').trim();
}

function buildDuplicateIndex(bank: QuestionBankFile, allowCrossChapter: boolean): Map<string, string> {
  const index = new Map<string, string>();
  for (const chapter of bank.chapters) {
    for (const subject of chapter.subjects) {
      for (const question of subject.questions) {
        const baseKey = makeDuplicateKey({ ...question, text: cleanStarText(question.text) });
        const key = allowCrossChapter ? `${chapter.id}:${baseKey}` : baseKey;
        index.set(key, question.id);
      }
    }
  }
  return index;
}

function findQuestionById(bank: QuestionBankFile, id: string): Question | undefined {
  for (const chapter of bank.chapters) {
    for (const subject of chapter.subjects) {
      const found = subject.questions.find((q) => q.id === id);
      if (found) return found;
    }
  }
  return undefined;
}

function removeExistingDuplicates(bank: QuestionBankFile, report: ImportReport, allowCrossChapter: boolean = false): void {
  const seen = new Map<string, string>();

  for (const chapter of bank.chapters) {
    for (const subject of chapter.subjects) {
      const uniqueQuestions: Question[] = [];

      for (const question of subject.questions) {
        const cleanText = cleanStarText(question.text);
        const baseKey = makeDuplicateKey({ ...question, text: cleanText });
        const key = allowCrossChapter ? `${chapter.id}:${baseKey}` : baseKey;
        const keptId = seen.get(key);

        if (keptId) {
          if (!report.removedExistingDuplicates.some((item) => item.removedId === question.id)) {
            report.removedExistingDuplicates.push({ keptId, removedId: question.id, text: cleanText });
          }
          // Increment repetitionCount on the KEPT question
          const keptQuestion = uniqueQuestions.find((q) => q.id === keptId);
          if (keptQuestion) {
            keptQuestion.repetitionCount = (keptQuestion.repetitionCount ?? 1) + 1;
          }
          continue;
        }

        question.text = cleanText;
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

export function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const isMain = typeof process !== 'undefined' && process.argv[1] && (
  process.argv[1].endsWith('import-batch.ts')
);

if (isMain) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
