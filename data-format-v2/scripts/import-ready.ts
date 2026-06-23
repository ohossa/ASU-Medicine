import { mkdir, readdir, readFile, writeFile, rename, copyFile } from 'node:fs/promises';
import { basename, dirname, join, extname } from 'node:path';
import { validateModuleFile } from './validate-banks';

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
  repetitionCount?: number;

  /* ── Analytics fields (reserved for future usage) ── */
  avgCorrectRate?: number;
  totalAttempts?: number;
  discriminationIndex?: number;
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

interface IncomingBatch {
  moduleCode?: string;
  defaultChapterId?: number;
  defaultChapterTitle?: string;
  questions: IncomingQuestion[];
}

interface IncomingQuestion {
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
}

interface IncomingSubQuestion {
  type?: 'mcq' | 'essay';
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
}

interface ImportReport {
  inputPath: string;
  targetPath: string;
  moduleCode: string;
  added: { id: string; chapterId: number; subject: SubjectColor; text: string }[];
  skippedDuplicates: { matchedId: string; text: string }[];
  removedExistingDuplicates: { keptId: string; removedId: string; text: string }[];
  needsReview: { index: number; reason: string; text: string }[];
}

interface ManifestEntry {
  timestamp: string;
  moduleCode: string;
  sourceFile: string;
  status: 'SUCCESS' | 'SKIPPED' | 'FAILED';
  addedCount: number;
  skippedDuplicatesCount: number;
  removedExistingDuplicatesCount: number;
  needsReviewCount: number;
  errors?: string[];
  reportPath?: string;
}

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

const INTAKE_ROOT = 'data-format-v2/question-intake';
const MANIFEST_PATH = 'data-format-v2/import-manifest.json';

// Helper to format timestamps
function getTimestampString(): string {
  const d = new Date();
  return d.toISOString().replace(/[^0-9]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
}

async function findFilesInDir(dir: string, subfolder: string): Promise<string[]> {
  let files: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === subfolder) {
          const subEntries = await readdir(fullPath, { withFileTypes: true });
          for (const sub of subEntries) {
            if (sub.isFile() && sub.name.endsWith('.json')) {
              files.push(join(fullPath, sub.name));
            }
          }
        } else {
          files.push(...await findFilesInDir(fullPath, subfolder));
        }
      }
    }
  } catch (err: any) {
    // Directory might not exist yet
  }
  return files;
}

// Find canonical target file inside src/imports recursively
async function findTargetFile(moduleCode: string, searchDir = 'src/imports'): Promise<string | null> {
  const entries = await readdir(searchDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(searchDir, entry.name);
    if (entry.isDirectory()) {
      const found = await findTargetFile(moduleCode, fullPath);
      if (found) return found;
    } else if (entry.isFile() && entry.name === `${moduleCode}.json`) {
      return fullPath;
    }
  }
  return null;
}

// deduplication helpers
function cleanStarText(text: string): string {
  return text.replace(/(?:\s*\*+)?\s*★+\s*$/g, '').trim();
}

function makeDuplicateKey(question: Pick<Question | IncomingQuestion, 'text' | 'question' | 'options'>): string {
  return normalize(`${question.text ?? question.question ?? ''} ${(question.options ?? []).join(' ')}`);
}

export function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
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

function removeExistingDuplicates(bank: QuestionBankFile, report: ImportReport): void {
  const seen = new Map<string, string>();
  for (const chapter of bank.chapters) {
    for (const subject of chapter.subjects) {
      const uniqueQuestions: Question[] = [];
      for (const question of subject.questions) {
        const cleanText = cleanStarText(question.text);
        const key = makeDuplicateKey({ ...question, text: cleanText });
        const keptId = seen.get(key);
        if (keptId) {
          if (!report.removedExistingDuplicates.some((item) => item.removedId === question.id)) {
            report.removedExistingDuplicates.push({ keptId, removedId: question.id, text: cleanText });
          }
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

function buildDuplicateIndex(bank: QuestionBankFile): Map<string, string> {
  const index = new Map<string, string>();
  for (const chapter of bank.chapters) {
    for (const subject of chapter.subjects) {
      for (const question of subject.questions) {
        index.set(makeDuplicateKey({ ...question, text: cleanStarText(question.text) }), question.id);
      }
    }
  }
  return index;
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
function resolveContentRouting(bank: QuestionBankFile, incoming: IncomingQuestion): { chapter: Chapter; subjectId: SubjectColor; lecture: number } | null {
  const questionText = normalize(incoming.text ?? incoming.question ?? '');
  if (!questionText || questionText.length < 10) return null;

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

        let hits = 0;
        for (const lw of lectureWords) {
          if (['the', 'and', 'function', 'introduction', 'physiology', 'anatomy', 'histology', 'biochemistry', 'clinical', 'pathology', 'pharmacology', 'microbiology'].includes(lw)) continue;
          for (const qw of questionWords) {
            if (qw === lw || (lw.length >= 5 && (qw.includes(lw) || lw.includes(qw)))) {
              hits++;
              break;
            }
          }
        }

        const significantLectureWords = lectureWords.filter(w => !['the', 'and', 'function', 'introduction', 'physiology', 'anatomy', 'histology', 'biochemistry', 'clinical', 'pathology', 'pharmacology', 'microbiology'].includes(w));
        if (significantLectureWords.length === 0) continue;

        const score = hits / significantLectureWords.length;
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

function inferType(question: IncomingQuestion): QuestionType {
  if (question.type) return question.type;
  if (question.subQuestions?.length) return 'case';
  if (question.pairs?.length) return 'matching';
  if (question.blanks?.length) return 'fillblank';
  if (question.options?.length) return question.options.length === 2 && question.options.every((option) => /^(true|false)$/i.test(option)) ? 'truefalse' : 'mcq';
  return 'essay';
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
  if (type === 'fillblank') return { ...base, type, blanks: incoming.blanks ?? [] };
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
  if (question.type === 'fillblank' && question.acceptedAnswers && question.acceptedAnswers.length !== question.blanks!.length) return 'Fillblank acceptedAnswers length does not match blanks.';
  if (question.type === 'case' && !question.subQuestions?.length) return 'Case subQuestions are missing.';
  return null;
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

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const strict = args.includes('--strict');
  const moveRejected = args.includes('--move-rejected');

  console.log(`Starting ASU Portal v2 Bulk Import Pipeline... ${dryRun ? '[DRY RUN]' : ''}`);

  const pendingBatches = await findFilesInDir(INTAKE_ROOT, '_ready');
  if (pendingBatches.length === 0) {
    console.log('No pending batches found in any _ready folder.');
    return;
  }

  console.log(`Found ${pendingBatches.length} batch(es) to import.`);

  const resultsTable: { module: string; added: number; skippedDup: number; removedExistingDup: number; reviewNeeded: number; status: string }[] = [];
  const manifestUpdates: ManifestEntry[] = [];

  for (const batchPath of pendingBatches) {
    const batchFileName = basename(batchPath);
    console.log(`\nProcessing: ${batchFileName}`);

    let batch: IncomingBatch;
    try {
      batch = JSON.parse(await readFile(batchPath, 'utf8')) as IncomingBatch;
    } catch (err: any) {
      console.error(`  ❌ Failed to parse batch JSON: ${err.message}`);
      resultsTable.push({ module: 'Unknown', added: 0, skippedDup: 0, removedExistingDup: 0, reviewNeeded: 0, status: 'FAILED (Parse)' });
      continue;
    }

    // Determine module code
    const moduleCodeMatch = batchFileName.match(/^([A-Z]+-[0-9]+)/);
    const moduleCode = batch.moduleCode ?? (moduleCodeMatch ? moduleCodeMatch[1] : null);

    if (!moduleCode) {
      console.error('  ❌ Could not determine moduleCode from file name or JSON metadata.');
      resultsTable.push({ module: 'Unknown', added: 0, skippedDup: 0, removedExistingDup: 0, reviewNeeded: 0, status: 'FAILED (No Code)' });
      continue;
    }

    // Locate target canonical file
    const targetPath = await findTargetFile(moduleCode);
    if (!targetPath) {
      console.error(`  ❌ Canonical target file for module "${moduleCode}" was not found in src/imports.`);
      resultsTable.push({ module: moduleCode, added: 0, skippedDup: 0, removedExistingDup: 0, reviewNeeded: 0, status: 'FAILED (No Target)' });
      continue;
    }

    let bank: QuestionBankFile;
    try {
      bank = JSON.parse(await readFile(targetPath, 'utf8')) as QuestionBankFile;
    } catch (err: any) {
      console.error(`  ❌ Failed to parse target JSON: ${err.message}`);
      resultsTable.push({ module: moduleCode, added: 0, skippedDup: 0, removedExistingDup: 0, reviewNeeded: 0, status: 'FAILED (Target Parse)' });
      continue;
    }

    if (bank.schemaVersion !== 1) {
      console.error(`  ❌ Unsupported schemaVersion (${bank.schemaVersion}) in target.`);
      resultsTable.push({ module: moduleCode, added: 0, skippedDup: 0, removedExistingDup: 0, reviewNeeded: 0, status: 'FAILED (Schema)' });
      continue;
    }

    // Prepare backup path
    const backupDir = join('data-format-v2', 'backups', `year-${bank.meta.year}`, `semester-${bank.meta.semester}`, moduleCode);
    const backupPath = join(backupDir, `${moduleCode}_${getTimestampString()}.json`);

    // Backup the current canonical target file
    if (!dryRun) {
      await mkdir(backupDir, { recursive: true });
      await copyFile(targetPath, backupPath);
      console.log(`  Backed up target to ${backupPath}`);
    }

    // Set up report
    const report: ImportReport = { inputPath: batchPath, targetPath, moduleCode, added: [], skippedDuplicates: [], removedExistingDuplicates: [], needsReview: [] };

    // Deduplicate target first
    removeExistingDuplicates(bank, report);
    const duplicateIndex = buildDuplicateIndex(bank);

    // Process questions
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
      const duplicateKey = makeDuplicateKey({ ...incoming, text: cleanedIncomingText });
      const matchedDuplicateId = duplicateIndex.get(duplicateKey);
      if (matchedDuplicateId) {
        const existingQuestion = findQuestionById(bank, matchedDuplicateId);
        if (existingQuestion) {
          existingQuestion.repetitionCount = (existingQuestion.repetitionCount ?? 1) + 1;
        }
        report.skippedDuplicates.push({ matchedId: matchedDuplicateId, text: cleanedIncomingText });
        return;
      }

      const converted = convertQuestion(incoming, moduleCode, chapter, subjectId, resolvedLecture);
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

    // Run final deduplication and ID check on proposed merge
    let proposedValidationErrors: string[] = [];
    try {
      removeExistingDuplicates(bank, report);
      validateUniqueIds(bank);
      proposedValidationErrors = validateModuleFile(bank);
    } catch (err: any) {
      proposedValidationErrors.push(`ID check or merge error: ${err.message}`);
    }

    // Decide fate of import
    let finalStatus: 'SUCCESS' | 'FAILED' | 'SKIPPED' = 'SUCCESS';
    if (proposedValidationErrors.length > 0) {
      finalStatus = 'FAILED';
      console.error(`  ❌ Proposed merge failed validation:`);
      proposedValidationErrors.slice(0, 5).forEach((err) => console.error(`    - ${err}`));
      if (proposedValidationErrors.length > 5) console.error(`    ...and ${proposedValidationErrors.length - 5} more.`);
    }

    if (finalStatus === 'FAILED' && strict) {
      // Revert if strict
      if (!dryRun) {
        await copyFile(backupPath, targetPath);
        console.log('  [STRICT] Validation failed. Reverted target file changes using backup.');
      }
    } else if (finalStatus === 'FAILED' && !strict) {
      console.log('  [WARNING] Validation failed but continuing because --strict was not provided.');
    }

    // Write changes if validation passed or strict is disabled, and it's not a dry run
    if (!dryRun && (finalStatus === 'SUCCESS' || !strict)) {
      await writeFile(targetPath, `${JSON.stringify(bank, null, 2)}\n`, 'utf8');
      console.log(`  Successfully merged questions to target: ${targetPath}`);
    }

    // Generate and save report file
    const reportsDir = join(dirname(batchPath), '..', '_reports');
    const reportPath = join(reportsDir, `${moduleCode}_report_${getTimestampString()}.import-report.json`);
    if (!dryRun) {
      await mkdir(reportsDir, { recursive: true });
      await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
      console.log(`  Report written to ${reportPath}`);
    }

    // Archive batch files
    if (!dryRun) {
      if (finalStatus === 'SUCCESS') {
        const importedDir = join(dirname(batchPath), '..', '_imported');
        await mkdir(importedDir, { recursive: true });
        await rename(batchPath, join(importedDir, batchFileName));
        console.log(`  Moved batch file to _imported/`);
      } else if (finalStatus === 'FAILED') {
        if (moveRejected) {
          const rejectedDir = join(dirname(batchPath), '..', '_rejected');
          await mkdir(rejectedDir, { recursive: true });
          await rename(batchPath, join(rejectedDir, batchFileName));
          console.log(`  [STRICT] Moved failed batch file to _rejected/`);
        } else {
          console.log(`  [STRICT] Failed batch file left in _ready/ for review.`);
        }
      }
    }

    // Append manifest entry
    manifestUpdates.push({
      timestamp: new Date().toISOString(),
      moduleCode,
      sourceFile: batchPath,
      status: finalStatus,
      addedCount: report.added.length,
      skippedDuplicatesCount: report.skippedDuplicates.length,
      removedExistingDuplicatesCount: report.removedExistingDuplicates.length,
      needsReviewCount: report.needsReview.length,
      errors: proposedValidationErrors.length > 0 ? proposedValidationErrors : undefined,
      reportPath: dryRun ? undefined : reportPath
    });

    resultsTable.push({
      module: moduleCode,
      added: report.added.length,
      skippedDup: report.skippedDuplicates.length,
      removedExistingDup: report.removedExistingDuplicates.length,
      reviewNeeded: report.needsReview.length,
      status: finalStatus
    });
  }

  // Update manifest file
  if (!dryRun && manifestUpdates.length > 0) {
    let currentManifest: ManifestEntry[] = [];
    try {
      const existing = await readFile(MANIFEST_PATH, 'utf8');
      currentManifest = JSON.parse(existing) as ManifestEntry[];
    } catch (err) {
      // Manifest doesn't exist yet, start fresh
    }
    currentManifest.push(...manifestUpdates);
    await writeFile(MANIFEST_PATH, `${JSON.stringify(currentManifest, null, 2)}\n`, 'utf8');
    console.log(`\nUpdated ${MANIFEST_PATH}`);
  }

  // Print summary ASCII table
  console.log('\n======================================= IMPORT SUMMARY =======================================');
  console.table(resultsTable);
  console.log('==============================================================================================');
}

const isMain = typeof process !== 'undefined' && process.argv[1] && (
  process.argv[1].endsWith('import-ready.ts')
);

if (isMain) {
  main().catch((err) => {
    console.error('Pipeline error:', err);
    process.exit(1);
  });
}
