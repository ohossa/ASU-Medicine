import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative } from 'node:path';

type SubjectColor = 'anatomy' | 'histology' | 'physiology' | 'biochem' | 'microbiology' | 'pathology' | 'pharma' | 'clinical';
type QuestionType = 'mcq' | 'truefalse' | 'matching' | 'essay' | 'case' | 'fillblank';

type OldQuestion = {
  id?: number | string;
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
  subQuestions?: OldSubQuestion[];
  blanks?: string[];
  acceptedAnswers?: string[][];
};

type OldSubQuestion = {
  id?: string;
  type?: 'mcq' | 'essay' | 'fillblank';
  question?: string;
  text?: string;
  options?: string[];
  correctAnswer?: string;
  correctIndex?: number;
  modelAnswer?: string;
  explanation?: string;
  keyConcept?: string;
};

type OldTopic = { topic?: string; questions?: OldQuestion[] };
type OldChapter = { chapterTitle?: string; title?: string; topics?: OldTopic[] };
type OldFile = { title?: string; totalQuestions?: number; chapters?: OldChapter[] };

type ModuleInfo = {
  moduleCode: string;
  moduleName: string;
  year: 1 | 2 | 3 | 4 | 5;
  semester: 1 | 2;
  creditPoints: number;
  totalMarks: number;
  keywords: string[];
};

type NewFile = { schemaVersion: 1; meta: ModuleInfo; chapters: NewChapter[] };
type NewChapter = { id: number; title: string; subtitle: string; emoji: string; page: number; lectureRange: string; subjects: NewSubject[] };
type NewSubject = { id: SubjectColor; name: string; iconName: string; lectures: string; lectureCount: number; questions: NewQuestion[] };

type NewQuestion = {
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
  subQuestions?: NewSubQuestion[];
  blanks?: string[];
  acceptedAnswers?: string[][];
};

type NewSubQuestion = {
  id: string;
  type: 'mcq' | 'essay';
  text: string;
  options?: string[];
  correctIndex?: number;
  modelAnswer?: string;
  explanation: string;
  keyConcept?: string;
};

const SOURCE_ROOT = 'src/imports';
const OUTPUT_ROOT = 'data-format-v2/generated-imports';

const MODULES: ModuleInfo[] = [
  { moduleCode: 'MINF-1', moduleName: 'Infection Module', year: 1, semester: 2, creditPoints: 4.5, totalMarks: 90, keywords: ['infection', 'infect', 'minf', 'microbiology', 'micro'] },
  { moduleCode: 'MEM-2', moduleName: 'Endocrine System & Metabolism', year: 2, semester: 2, creditPoints: 5.5, totalMarks: 110, keywords: ['endocrine', 'metabolism', 'mem', 'hormone', 'pituitary', 'thyroid', 'adrenal', 'pancreas', 'diabetes'] },
  { moduleCode: 'MCNS-2', moduleName: 'Central Nervous System Module', year: 2, semester: 2, creditPoints: 13, totalMarks: 260, keywords: ['cns', 'central nervous', 'mcns', 'neuro'] }
];

const SUBJECT_DISPLAY: Record<SubjectColor, { name: string; iconName: string; key: string }> = {
  anatomy: { name: 'Anatomy', iconName: 'Bone', key: 'ANAT' },
  histology: { name: 'Histology', iconName: 'Microscope', key: 'HIST' },
  physiology: { name: 'Physiology', iconName: 'Activity', key: 'PHYS' },
  biochem: { name: 'Biochemistry', iconName: 'FlaskConical', key: 'BIOC' },
  microbiology: { name: 'Microbiology', iconName: 'Biohazard', key: 'MICR' },
  pathology: { name: 'Pathology', iconName: 'ShieldAlert', key: 'PATH' },
  pharma: { name: 'Pharmacology', iconName: 'Pill', key: 'PHAR' },
  clinical: { name: 'Clinical', iconName: 'Stethoscope', key: 'CLIN' }
};

const SUBJECT_ORDER: SubjectColor[] = ['anatomy', 'histology', 'physiology', 'biochem', 'microbiology', 'pathology', 'pharma', 'clinical'];
const CHAPTER_EMOJIS = ['🧠', '🦋', '⚡', '🫀', '💉', '🫁', '🦴', '🔬', '💊', '🧬'];

async function main(): Promise<void> {
  const oldFiles = await findJsonFiles(SOURCE_ROOT);
  const grouped = new Map<string, OldFile[]>();

  for (const filePath of oldFiles) {
    const raw = JSON.parse(await readFile(filePath, 'utf8')) as OldFile;
    const moduleInfo = matchModule(filePath, raw);
    if (!moduleInfo) {
      console.warn(`Skipped unmatched file: ${filePath}`);
      continue;
    }
    grouped.set(moduleInfo.moduleCode, [...(grouped.get(moduleInfo.moduleCode) ?? []), raw]);
  }

  for (const [moduleCode, files] of grouped) {
    const moduleInfo = MODULES.find((moduleItem) => moduleItem.moduleCode === moduleCode);
    if (!moduleInfo) continue;

    const migrated = migrateModule(moduleInfo, files);
    validateUniqueQuestionIds(migrated);

    const outputPath = join(OUTPUT_ROOT, `year-${moduleInfo.year}`, `semester-${moduleInfo.semester}`, `${moduleInfo.moduleCode}.json`);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(migrated, null, 2)}\n`, 'utf8');
    console.log(`Wrote ${relative(process.cwd(), outputPath)}`);
  }
}

async function findJsonFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(root, entry.name);
    if (entry.isDirectory()) files.push(...await findJsonFiles(fullPath));
    if (entry.isFile() && entry.name.endsWith('.json')) files.push(fullPath);
  }

  return files;
}

function matchModule(filePath: string, raw: OldFile): ModuleInfo | undefined {
  const searchable = `${basename(filePath)} ${raw.title ?? ''}`.toLowerCase().replace(/[-_]/g, ' ');
  return MODULES.find((moduleItem) => {
    const code = moduleItem.moduleCode.toLowerCase().replace(/[-_]/g, ' ');
    return searchable.includes(code) || moduleItem.keywords.some((keyword) => searchable.includes(keyword.toLowerCase()));
  });
}

function migrateModule(meta: ModuleInfo, files: OldFile[]): NewFile {
  const maxChapters = Math.max(0, ...files.map((file) => file.chapters?.length ?? 0));
  const chapters: NewChapter[] = [];

  for (let chapterIndex = 0; chapterIndex < maxChapters; chapterIndex += 1) {
    const chapterId = chapterIndex + 1;
    const oldChapters = files.map((file) => file.chapters?.[chapterIndex]).filter(Boolean) as OldChapter[];
    const title = oldChapters.find((chapter) => chapter.chapterTitle || chapter.title)?.chapterTitle ?? oldChapters.find((chapter) => chapter.title)?.title ?? `Chapter ${chapterId}`;
    const subjectMap = new Map<SubjectColor, NewQuestion[]>();

    for (const oldChapter of oldChapters) {
      for (const topic of oldChapter.topics ?? []) {
        const subject = topicToSubject(topic.topic ?? '');
        const existing = subjectMap.get(subject) ?? [];
        for (const question of topic.questions ?? []) {
          existing.push(convertQuestion(question, meta.moduleCode, chapterId, subject, existing.length + 1));
        }
        subjectMap.set(subject, existing);
      }
    }

    chapters.push({
      id: chapterId,
      title,
      subtitle: title,
      emoji: CHAPTER_EMOJIS[chapterIndex % CHAPTER_EMOJIS.length],
      page: chapterIndex * 40 + 1,
      lectureRange: `Lectures ${chapterId}`,
      subjects: SUBJECT_ORDER.filter((subject) => subjectMap.has(subject)).map((subject) => ({
        id: subject,
        name: SUBJECT_DISPLAY[subject].name,
        iconName: SUBJECT_DISPLAY[subject].iconName,
        lectures: `Lecture ${chapterId}`,
        lectureCount: 1,
        questions: subjectMap.get(subject) ?? []
      }))
    });
  }

  return { schemaVersion: 1, meta, chapters };
}

function convertQuestion(question: OldQuestion, moduleCode: string, chapterId: number, subject: SubjectColor, sequence: number): NewQuestion {
  const type = inferQuestionType(question);
  const text = question.text ?? question.question ?? '';
  const base = {
    id: makeQuestionId(moduleCode, chapterId, subject, sequence),
    type,
    lecture: chapterId,
    text,
    explanation: question.explanation ?? 'Review the related lecture material for the rationale.',
    keyConcept: question.keyConcept
  };

  if (type === 'essay') return { ...base, type, modelAnswer: question.modelAnswer ?? 'Answer according to the relevant lecture objectives and marking rubric.' };
  if (type === 'matching') return { ...base, type, pairs: question.pairs ?? [] };
  if (type === 'case') return { ...base, type, subQuestions: (question.subQuestions ?? []).map((subQuestion, index) => convertSubQuestion(subQuestion, `${base.id}-SQ${index + 1}`)) };
  if (type === 'fillblank') return { ...base, type, blanks: question.blanks ?? [], acceptedAnswers: question.acceptedAnswers };

  const options = question.options ?? (type === 'truefalse' ? ['True', 'False'] : []);
  return { ...base, type, options, correctIndex: normalizeCorrectIndex(question, options), modelAnswer: question.modelAnswer ?? null };
}

function convertSubQuestion(subQuestion: OldSubQuestion, id: string): NewSubQuestion {
  const type = subQuestion.type === 'essay' ? 'essay' : 'mcq';
  const text = subQuestion.text ?? subQuestion.question ?? '';
  const explanation = subQuestion.explanation ?? 'Review the related lecture material for the rationale.';

  if (type === 'essay') {
    return { id, type, text, modelAnswer: subQuestion.modelAnswer ?? 'Answer according to the relevant lecture objectives and marking rubric.', explanation, keyConcept: subQuestion.keyConcept };
  }

  const options = subQuestion.options ?? [];
  return { id, type, text, options, correctIndex: normalizeCorrectIndex(subQuestion, options), explanation, keyConcept: subQuestion.keyConcept };
}

function inferQuestionType(question: OldQuestion): QuestionType {
  if (question.type) return question.type;
  if (question.subQuestions?.length) return 'case';
  if (question.pairs?.length) return 'matching';
  if (question.blanks?.length) return 'fillblank';
  if (question.options?.length) return question.options.length === 2 && question.options.every((option) => /^(true|false)$/i.test(option)) ? 'truefalse' : 'mcq';
  return 'essay';
}

function normalizeCorrectIndex(question: Pick<OldQuestion | OldSubQuestion, 'correctIndex' | 'correctAnswer'>, options: string[]): number {
  if (typeof question.correctIndex === 'number') return clampIndex(question.correctIndex, options.length);
  if (question.correctAnswer) return clampIndex(question.correctAnswer.trim().toUpperCase().charCodeAt(0) - 65, options.length);
  return 0;
}

function clampIndex(index: number, optionCount: number): number {
  if (optionCount <= 0) return 0;
  return Math.min(Math.max(index, 0), optionCount - 1);
}

function topicToSubject(topic: string): SubjectColor {
  const normalized = topic.toLowerCase();
  if (normalized.includes('anatomy')) return 'anatomy';
  if (normalized.includes('histology')) return 'histology';
  if (normalized.includes('physiology')) return 'physiology';
  if (normalized.includes('biochem')) return 'biochem';
  if (normalized.includes('micro') || normalized.includes('bacter') || normalized.includes('virus') || normalized.includes('parasit') || normalized.includes('fung')) return 'microbiology';
  if (normalized.includes('pathology')) return 'pathology';
  if (normalized.includes('pharma')) return 'pharma';
  if (normalized.includes('clinical') || normalized.includes('case')) return 'clinical';
  return 'physiology';
}

function makeQuestionId(moduleCode: string, chapterId: number, subject: SubjectColor, sequence: number): string {
  return `${moduleCode.replace(/-/g, '')}-CH${chapterId}-${SUBJECT_DISPLAY[subject].key}-${String(sequence).padStart(4, '0')}`;
}

function validateUniqueQuestionIds(file: NewFile): void {
  const ids = new Set<string>();
  for (const chapter of file.chapters) {
    for (const subject of chapter.subjects) {
      for (const question of subject.questions) {
        if (ids.has(question.id)) throw new Error(`Duplicate question id: ${question.id}`);
        ids.add(question.id);
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
