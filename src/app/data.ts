import type { ChapterData, Question, SubjectColor, SubjectData, SubQuestion } from './types';

// Glob all JSON files under src/imports recursively at build time
const globbedFiles = import.meta.glob('../imports/**/*.json', { eager: true });

// ── Raw JSON types ─────────────────────────────────────────────────────────────

type RawSubQuestion = {
  id: string;
  type: 'mcq' | 'essay';
  question?: string;
  text?: string;
  options?: string[];
  correctAnswer?: string;
  modelAnswer?: string;
  explanation?: string;
  keyConcept?: string;
};

type RawQuestion = {
  id: number;
  type?: 'mcq' | 'truefalse' | 'matching' | 'essay' | 'case' | 'fillblank';
  question?: string;
  text?: string;
  options?: string[];
  correctAnswer?: string;
  pairs?: { premise: string; target: string }[];
  modelAnswer?: string;
  explanation?: string;
  keyConcept?: string;
  subQuestions?: RawSubQuestion[];
  blanks?: string[];          // correct answers for ___ blanks
  acceptedAnswers?: string[][];  // optional extra accepted answers per blank
};

type RawTopic = {
  topic: string;
  questions: RawQuestion[];
};

type RawChapter = {
  chapterTitle: string;
  topics: RawTopic[];
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function letterToIndex(letter: string): number {
  return letter.toUpperCase().charCodeAt(0) - 65; // A→0, B→1, …
}

function topicToColor(topic: string): SubjectColor {
  const t = topic.toLowerCase();
  if (t.includes('anatomy')) return 'anatomy';
  if (t.includes('histology')) return 'histology';
  if (t.includes('physiology')) return 'physiology';
  if (t.includes('biochem')) return 'biochem';
  if (t.includes('pathology')) return 'pathology';
  if (t.includes('pharmacology') || t.includes('pharma')) return 'pharma';
  if (t.includes('clinical') || t.includes('case')) return 'clinical';
  return 'physiology'; // fallback
}

const colorToName: Record<SubjectColor, string> = {
  anatomy: 'Anatomy',
  histology: 'Histology',
  physiology: 'Physiology',
  biochem: 'Biochemistry',
  pathology: 'Pathology',
  pharma: 'Pharmacology',
  clinical: 'Clinical',
};

const colorToIcon: Record<SubjectColor, string> = {
  anatomy: 'Bone',
  histology: 'Microscope',
  physiology: 'Activity',
  biochem: 'FlaskConical',
  pathology: 'ShieldAlert',
  pharma: 'Pill',
  clinical: 'Stethoscope',
};

const SUBJECT_ORDER: SubjectColor[] = [
  'anatomy',
  'histology',
  'physiology',
  'biochem',
  'pathology',
  'pharma',
  'clinical',
];

function transformSubQuestion(sq: RawSubQuestion, parentId: number): SubQuestion {
  const textVal = sq.question || sq.text || '';
  const parts = sq.id.split('_');
  const suffix = parts.length > 1 ? parts[1] : sq.id;
  const newSubId = `${parentId}_${suffix}`;

  if (sq.type === 'essay') {
    return {
      id: newSubId,
      type: 'essay',
      text: textVal,
      modelAnswer: sq.modelAnswer || '',
      explanation: sq.explanation || '',
      keyConcept: sq.keyConcept,
    };
  }

  const options = sq.options || [];
  const idx = sq.correctAnswer ? letterToIndex(sq.correctAnswer) : 0;
  return {
    id: newSubId,
    type: 'mcq',
    text: textVal,
    options,
    correctIndex: idx >= 0 && idx < options.length ? idx : 0,
    explanation: sq.explanation || '',
    keyConcept: sq.keyConcept,
  };
}

function transformQuestion(q: RawQuestion, color: SubjectColor, idOffset: number): Question {
  const rawType = q.type || 'essay'; // default to essay if not specified
  const textVal = q.question || q.text || '';
  const uniqueId = q.id + idOffset;

  if (rawType === 'case') {
    return {
      id: uniqueId,
      type: 'case',
      text: textVal,
      lecture: 1,
      subjectColor: color,
      explanation: q.explanation || '',
      keyConcept: q.keyConcept,
      subQuestions: (q.subQuestions || []).map(sq => transformSubQuestion(sq, uniqueId)),
    };
  }

  if (rawType === 'matching') {
    return {
      id: uniqueId,
      type: 'matching',
      text: textVal,
      lecture: 1,
      subjectColor: color,
      pairs: q.pairs || [],
      explanation: q.explanation || '',
      keyConcept: q.keyConcept,
    };
  }

  if (rawType === 'essay') {
    return {
      id: uniqueId,
      type: 'essay',
      text: textVal,
      lecture: 1,
      subjectColor: color,
      modelAnswer: q.modelAnswer || '',
      explanation: q.explanation || '',
      keyConcept: q.keyConcept,
    };
  }

  if (rawType === 'fillblank') {
    return {
      id: uniqueId,
      type: 'fillblank',
      text: textVal,
      lecture: 1,
      subjectColor: color,
      blanks: q.blanks || [],
      acceptedAnswers: q.acceptedAnswers,
      explanation: q.explanation || '',
      keyConcept: q.keyConcept,
    };
  }

  const options = q.options || [];
  const idx = q.correctAnswer ? letterToIndex(q.correctAnswer) : 0;
  const isTrueFalse =
    rawType === 'truefalse' ||
    (options.length === 2 &&
      options[0]?.toLowerCase().startsWith('true') &&
      options[1]?.toLowerCase().startsWith('false'));

  return {
    id: uniqueId,
    type: isTrueFalse ? 'truefalse' : 'mcq',
    text: textVal,
    lecture: 1,
    subjectColor: color,
    options,
    correctIndex: idx >= 0 && idx < options.length ? idx : 0,
    explanation: q.explanation || '',
    keyConcept: q.keyConcept,
  };
}

// ── Chapter metadata (Endocrine Handcrafted) ───────────────────────────────────

const CHAPTER_META = [
  {
    id: 1,
    emoji: '🧠',
    page: 1,
    subtitle: 'Pituitary Gland',
    lectureRange: 'Section 1',
    accentColor: 'physiology' as SubjectColor,
  },
  {
    id: 2,
    emoji: '🦋',
    page: 70,
    subtitle: 'Thyroid & Parathyroid',
    lectureRange: 'Section 2',
    accentColor: 'anatomy' as SubjectColor,
  },
  {
    id: 3,
    emoji: '⚡',
    page: 132,
    subtitle: 'Adrenal Gland',
    lectureRange: 'Section 3',
    accentColor: 'pharma' as SubjectColor,
  },
  {
    id: 4,
    emoji: '🫀',
    page: 168,
    subtitle: 'Endocrine Pancreas',
    lectureRange: 'Section 4',
    accentColor: 'biochem' as SubjectColor,
  },
  {
    id: 5,
    emoji: '💉',
    page: 212,
    subtitle: 'Diabetes & Metabolic Disorders',
    lectureRange: 'Section 5',
    accentColor: 'pathology' as SubjectColor,
  },
];

// ── Module Metadata & Keywords ─────────────────────────────────────────────────

export interface ModuleInfo {
  code: string;
  name: string;
  cp: number;
  marks: number;
  keywords: string[];
}

export const SYLLABUS_MODULES: Record<number, Record<number, ModuleInfo[]>> = {
  1: {
    1: [
      { code: 'IAE-1', name: 'Introduction to Anatomy & Embryology', cp: 5, marks: 100, keywords: ['anatomy', 'embryology', 'iae', 'intro anatomy', 'intro-anatomy', 'embryo'] },
      { code: 'IPHY-1', name: 'Introduction to Physiology', cp: 4, marks: 80, keywords: ['physiology', 'iphy', 'physio', 'intro-physiology', 'intro physiology'] },
      { code: 'IBM-1', name: 'Introduction to Medical Biochemistry', cp: 3, marks: 60, keywords: ['biochem', 'biochemistry', 'ibm', 'biochemical', 'medical biochemistry', 'intro biochemistry'] },
      { code: 'IHC-1', name: 'Introduction to Histology & Cell Biology', cp: 3, marks: 60, keywords: ['histology', 'ihc', 'cell biology', 'cell', 'histo', 'intro histology'] },
      { code: 'MIM-1', name: 'Immunology Module', cp: 3, marks: 60, keywords: ['immunology', 'immuno', 'mim', 'immune'] },
      { code: 'MBMG-1', name: 'Molecular Biology and Medical Genetics Module', cp: 3, marks: 60, keywords: ['molecular', 'genetics', 'mbmg', 'genetics module', 'molecular biology'] },
      { code: 'P1-1', name: 'Introduction to Information & Communication Technology (ICT) and Medical Terminology', cp: 1.5, marks: 30, keywords: ['ict', 'terminology', 'medical terminology'] },
    ],
    2: [
      { code: 'IPAT-1', name: 'Introduction to Pathology', cp: 5, marks: 100, keywords: ['pathology', 'ipat', 'patho', 'intro pathology'] },
      { code: 'IPHA-1', name: 'Introduction to Clinical Pharmacology', cp: 4, marks: 80, keywords: ['pharmacology', 'pharma', 'ipha', 'pharmacology module', 'intro pharma'] },
      { code: 'MINF-1', name: 'Infection Module', cp: 4.5, marks: 90, keywords: ['infection', 'infect', 'minf', 'microbiology', 'parasitology', 'micro', 'parasite'] },
      { code: 'MLS-1', name: 'Locomotor Module', cp: 12, marks: 240, keywords: ['locomotor', 'mls', 'loco', 'musculoskeletal', 'ortho', 'orthopedics'] },
      { code: 'BLS-HE-1', name: 'Basic life support + History taking & clinical examination', cp: 1.5, marks: 30, keywords: ['bls', 'history', 'examination', 'clinical examination', 'life support', 'bls-he'] },
      { code: 'P2-1', name: 'Presentation skills - Learning skills - Time management', cp: 1.5, marks: 30, keywords: ['presentation', 'skills', 'time management'] },
    ],
  },
  2: {
    1: [
      { code: 'MBL-2', name: 'Blood & Lymphatic System Module', cp: 7.5, marks: 150, keywords: ['blood', 'lymphatic', 'mbl', 'lymph', 'hematology', 'heme'] },
      { code: 'MRS-2', name: 'Respiratory System Module', cp: 8.5, marks: 170, keywords: ['respiratory', 'respi', 'mrs', 'lung', 'lungs', 'respiration'] },
      { code: 'MCVS-2', name: 'Cardiovascular System Module', cp: 11, marks: 220, keywords: ['cardio', 'cvs', 'mcvs', 'cardiovascular', 'heart'] },
    ],
    2: [
      { code: 'MCNS-2', name: 'Central Nervous System Module', cp: 13, marks: 260, keywords: ['cns', 'central nervous', 'mcns', 'neuro', 'neurology', 'brain'] },
      { code: 'MSS-2', name: 'Special Senses Module', cp: 4, marks: 80, keywords: ['special senses', 'senses', 'mss', 'eye', 'ear', 'ophthalmology'] },
      { code: 'MEM-2', name: 'Endocrine System & Metabolism Module', cp: 5.5, marks: 110, keywords: ['endocrine', 'metabolism', 'mem', 'hormone', 'hormones'] },
      { code: 'P3-2', name: 'Behavioral science', cp: 1.5, marks: 30, keywords: ['behavioral', 'science', 'psychology'] },
      { code: 'R-2', name: 'Fundamentals of Research', cp: 3, marks: 60, keywords: ['research', 'fundamentals'] },
    ],
  },
  3: {
    1: [
      { code: 'MGL-3', name: 'GIT & Liver Module', cp: 13, marks: 260, keywords: ['git', 'liver', 'mgl', 'gastrointestinal', 'gastro', 'stomach'] },
      { code: 'MUG-3', name: 'Urogenital System Module', cp: 10, marks: 200, keywords: ['urogenital', 'renal', 'mug', 'urinary', 'kidney', 'kidneys'] },
      { code: 'P4-3', name: 'Medical Ethics', cp: 1.5, marks: 30, keywords: ['ethics', 'medical ethics'] },
      { code: 'P5-3', name: 'Doctor-Patient Communication', cp: 1.5, marks: 30, keywords: ['communication', 'doctor', 'patient'] },
    ],
    2: [
      { code: 'CEO-3', name: 'Community, Environmental and Occupational Medicine', cp: 6, marks: 120, keywords: ['community', 'environmental', 'occupational', 'ceo', 'public health', 'preventive'] },
      { code: 'FT-3', name: 'Forensic Medicine and Clinical Toxicology', cp: 7.5, marks: 150, keywords: ['forensic', 'toxicology', 'ft', 'toxic', 'tox'] },
      { code: 'ORL-3', name: 'Otorhinolaryngology', cp: 7, marks: 140, keywords: ['ent', 'orl', 'otorhinolaryngology', 'ear nose throat'] },
      { code: 'MED1-3', name: 'Foundation of Internal Medicine', cp: 3, marks: 60, keywords: ['internal medicine', 'med1', 'medicine', 'foundation medicine'] },
      { code: 'P6-3', name: 'Leadership skills & Management skills', cp: 1.5, marks: 30, keywords: ['leadership', 'management'] },
      { code: 'R-3', name: 'Scientific Research', cp: 1.5, marks: 30, keywords: ['research', 'scientific'] },
    ],
  },
  4: {
    1: [
      { code: 'MED2-4', name: 'General and Special Internal Medicine 1', cp: 19.5, marks: 390, keywords: ['internal medicine', 'med2', 'medicine'] },
      { code: 'FAM-4', name: 'Family Medicine', cp: 3, marks: 60, keywords: ['family medicine', 'fam'] },
      { code: 'P7-4', name: 'Communication within a Medical Team', cp: 1.5, marks: 30, keywords: ['communication', 'team'] },
    ],
    2: [
      { code: 'MED3-4', name: 'General and Special Internal Medicine 2', cp: 19.5, marks: 390, keywords: ['internal medicine', 'med3', 'medicine'] },
      { code: 'PED-4', name: 'Pediatrics', cp: 21, marks: 420, keywords: ['pediatrics', 'peds', 'ped'] },
    ]
  },
  5: {
    1: [
      { code: 'OO-5', name: 'Ophthalmology', cp: 7, marks: 140, keywords: ['ophthalmology', 'eye', 'oo'] },
      { code: 'SUR1-5', name: 'General and Special Surgery 1', cp: 18, marks: 360, keywords: ['surgery', 'sur1', 'general surgery'] },
      { code: 'EM1-5', name: 'Emergency Medicine and Trauma 1', cp: 3, marks: 60, keywords: ['emergency', 'em1', 'trauma'] },
    ],
    2: [
      { code: 'SUR2-5', name: 'General and Special Surgery 2', cp: 18, marks: 360, keywords: ['surgery', 'sur2', 'general surgery'] },
      { code: 'EM2-5', name: 'Emergency Medicine and Trauma 2', cp: 3, marks: 60, keywords: ['emergency', 'em2', 'trauma'] },
      { code: 'OG-5', name: 'Obstetrics and Gynecology', cp: 21, marks: 420, keywords: ['obstetrics', 'gynecology', 'obgyn', 'og'] },
    ]
  }
};

// ── Dynamic Loader ─────────────────────────────────────────────────────────────

interface LoadedDatabases {
  mcqRaw: any | null;
  essayRaw: any | null;
}

export const moduleDatabases: Record<string, LoadedDatabases> = {};

// Helper to inspect JSON content structure and auto-detect database type
function detectDbTypeOfJson(rawData: any): 'mcq' | 'essay' {
  let hasMcqFeatures = false;
  let hasEssayFeatures = false;

  const chaptersList = rawData?.chapters || [];
  for (const ch of chaptersList) {
    for (const tp of ch.topics || []) {
      for (const q of tp.questions || []) {
        if (q.options && q.options.length > 0) {
          hasMcqFeatures = true;
        }
        if (
          q.correctAnswer !== undefined ||
          q.type === 'mcq' ||
          q.type === 'truefalse' ||
          q.type === 'matching' ||
          q.type === 'fillblank'
        ) {
          hasMcqFeatures = true;
        }
        if (q.modelAnswer || q.type === 'essay') {
          hasEssayFeatures = true;
        }
      }
    }
  }

  if (hasMcqFeatures && !hasEssayFeatures) {
    return 'mcq';
  }
  if (hasEssayFeatures && !hasMcqFeatures) {
    return 'essay';
  }
  return 'mcq'; // fallback default
}

// Scan the files dynamically at build time
for (const path in globbedFiles) {
  const fileModule = globbedFiles[path];
  const rawData = (fileModule as any).default || fileModule;

  const pathParts = path.split('/');
  const filename = pathParts[pathParts.length - 1].toLowerCase();

  let matchedModule: ModuleInfo | null = null;

  // 1. Try exact module code match (case-insensitive, stripping hyphens/underscores)
  const filenameClean = filename.replace(/[-_]/g, '');
  for (const year of Object.keys(SYLLABUS_MODULES)) {
    const yNum = parseInt(year);
    for (const sem of Object.keys(SYLLABUS_MODULES[yNum])) {
      const sNum = parseInt(sem);
      for (const mod of SYLLABUS_MODULES[yNum][sNum]) {
        const codeLower = mod.code.toLowerCase();
        const codeClean = codeLower.replace(/[-_]/g, '');
        if (filename.includes(codeLower) || filenameClean.includes(codeClean)) {
          matchedModule = mod;
          break;
        }
      }
      if (matchedModule) break;
    }
    if (matchedModule) break;
  }

  // 2. If no code match, search by keywords
  if (!matchedModule) {
    for (const year of Object.keys(SYLLABUS_MODULES)) {
      const yNum = parseInt(year);
      for (const sem of Object.keys(SYLLABUS_MODULES[yNum])) {
        const sNum = parseInt(sem);
        for (const mod of SYLLABUS_MODULES[yNum][sNum]) {
          if (mod.keywords.some((kw) => filename.includes(kw.toLowerCase()))) {
            matchedModule = mod;
            break;
          }
        }
        if (matchedModule) break;
      }
      if (matchedModule) break;
    }
  }

  if (!matchedModule) {
    continue;
  }

  const code = matchedModule.code;
  if (!moduleDatabases[code]) {
    moduleDatabases[code] = { mcqRaw: null, essayRaw: null };
  }

  // Determine whether it's MCQ or Essay
  let isEssay =
    filename.includes('essay') ||
    filename.includes('written') ||
    filename.includes('short') ||
    filename.includes('paper');
  let isMcq =
    filename.includes('mcq') ||
    filename.includes('practice') ||
    filename.includes('exam');

  if (!isEssay && !isMcq) {
    const detectedType = detectDbTypeOfJson(rawData);
    isEssay = detectedType === 'essay';
    isMcq = detectedType === 'mcq';
  }

  if (isEssay) {
    moduleDatabases[code].essayRaw = rawData;
  } else {
    moduleDatabases[code].mcqRaw = rawData;
  }
}

// ── Builders ───────────────────────────────────────────────────────────────────

function buildChapter(
  raw: RawChapter,
  meta: (typeof CHAPTER_META)[number],
  idOffset: number
): ChapterData {
  const subjectMap = new Map<SubjectColor, Question[]>();

  for (const topicData of raw.topics) {
    const color = topicToColor(topicData.topic);
    if (!subjectMap.has(color)) subjectMap.set(color, []);
    subjectMap
      .get(color)!
      .push(...topicData.questions.map((q) => transformQuestion(q, color, idOffset)));
  }

  const subjects: SubjectData[] = SUBJECT_ORDER.filter((c) =>
    subjectMap.has(c)
  ).map((color) => ({
    id: color,
    name: colorToName[color],
    iconName: colorToIcon[color],
    lectures: '',
    lectureCount: 1,
    questions: subjectMap.get(color)!,
  }));

  return {
    id: meta.id,
    title: raw.chapterTitle,
    subtitle: meta.subtitle,
    emoji: meta.emoji,
    page: meta.page,
    lectureRange: meta.lectureRange,
    accentColor: meta.accentColor,
    subjects,
  };
}

function mergeChapters(
  chapterMcq: RawChapter,
  chapterEssay: RawChapter,
  meta: (typeof CHAPTER_META)[number]
): ChapterData {
  const subjectMap = new Map<SubjectColor, Question[]>();

  for (const topicData of chapterMcq.topics) {
    const color = topicToColor(topicData.topic);
    if (!subjectMap.has(color)) subjectMap.set(color, []);
    subjectMap
      .get(color)!
      .push(...topicData.questions.map((q) => transformQuestion(q, color, 0)));
  }

  for (const topicData of chapterEssay.topics) {
    const color = topicToColor(topicData.topic);
    if (!subjectMap.has(color)) subjectMap.set(color, []);
    subjectMap
      .get(color)!
      .push(...topicData.questions.map((q) => transformQuestion(q, color, 10000)));
  }

  const subjects: SubjectData[] = SUBJECT_ORDER.filter((c) =>
    subjectMap.has(c)
  ).map((color) => ({
    id: color,
    name: colorToName[color],
    iconName: colorToIcon[color],
    lectures: '',
    lectureCount: 1,
    questions: subjectMap.get(color)!,
  }));

  return {
    id: meta.id,
    title: chapterEssay.chapterTitle,
    subtitle: meta.subtitle,
    emoji: meta.emoji,
    page: meta.page,
    lectureRange: meta.lectureRange,
    accentColor: meta.accentColor,
    subjects,
  };
}

// ── Query Interfaces for the UI ────────────────────────────────────────────────

export function isModuleActive(moduleCode: string): boolean {
  const db = moduleDatabases[moduleCode];
  return !!(db && (db.mcqRaw || db.essayRaw));
}

export function getModuleQuestionCounts(moduleCode: string) {
  const db = moduleDatabases[moduleCode];
  let mcqCount = 0;
  let essayCount = 0;

  if (db?.mcqRaw) {
    mcqCount = db.mcqRaw.totalQuestions || 0;
    if (mcqCount === 0 && db.mcqRaw.chapters) {
      db.mcqRaw.chapters.forEach((ch: any) => {
        ch.topics?.forEach((tp: any) => {
          mcqCount += tp.questions?.length || 0;
        });
      });
    }
  }

  if (db?.essayRaw) {
    essayCount = db.essayRaw.totalQuestions || 0;
    if (essayCount === 0 && db.essayRaw.chapters) {
      db.essayRaw.chapters.forEach((ch: any) => {
        ch.topics?.forEach((tp: any) => {
          essayCount += tp.questions?.length || 0;
        });
      });
    }
  }

  return { mcqCount, essayCount, totalCount: mcqCount + essayCount };
}

export function getChaptersForModuleAndMode(
  moduleCode: string,
  mode: 'mcq' | 'essay' | 'mixed'
): ChapterData[] {
  const db = moduleDatabases[moduleCode];
  if (!db) return [];

  const mcqRaw = db.mcqRaw;
  const essayRaw = db.essayRaw;

  if (!mcqRaw && !essayRaw) return [];

  const mcqChaptersList = mcqRaw?.chapters || [];
  const essayChaptersList = essayRaw?.chapters || [];

  const maxChapters = Math.max(mcqChaptersList.length, essayChaptersList.length);
  const resultChapters: ChapterData[] = [];

  for (let i = 0; i < maxChapters; i++) {
    const rawMcq = mcqChaptersList[i];
    const rawEssay = essayChaptersList[i];

    let meta: any;
    if (moduleCode === 'MEM-2' && i < CHAPTER_META.length) {
      meta = CHAPTER_META[i];
    } else {
      const title = rawEssay?.chapterTitle || rawMcq?.chapterTitle || `Chapter ${i + 1}`;
      meta = {
        id: i + 1,
        emoji: ['🧠', '🦋', '⚡', '🫀', '💉', '🫁', '🦴', '🔬', '💊', '🧬'][i % 10],
        page: (i * 40) + 1,
        subtitle: title,
        lectureRange: `Section ${i + 1}`,
        accentColor: SUBJECT_ORDER[i % SUBJECT_ORDER.length],
      };
    }

    if (mode === 'mcq' && rawMcq) {
      resultChapters.push(buildChapter(rawMcq, meta, 0));
    } else if (mode === 'essay' && rawEssay) {
      resultChapters.push(buildChapter(rawEssay, meta, 10000));
    } else if (mode === 'mixed') {
      if (rawMcq && rawEssay) {
        resultChapters.push(mergeChapters(rawMcq, rawEssay, meta));
      } else if (rawMcq) {
        resultChapters.push(buildChapter(rawMcq, meta, 0));
      } else if (rawEssay) {
        resultChapters.push(buildChapter(rawEssay, meta, 10000));
      }
    }
  }

  return resultChapters;
}

// Default export/fallback for backward compatibility (matches Endocrine Mixed mode)
export const chapters = getChaptersForModuleAndMode('MEM-2', 'mixed');

// Helper to satisfy TypeScript imports while maintaining textbook order (no shuffling)
export function shuffleArray<T>(array: T[]): T[] {
  return [...array];
}

export function findQuestionById(id: number): { question: Question; chapter: ChapterData; moduleCode: string; subjectName: string } | null {
  for (const year of Object.keys(SYLLABUS_MODULES)) {
    const semesters = SYLLABUS_MODULES[Number(year)];
    if (!semesters) continue;
    for (const modules of Object.values(semesters)) {
      for (const mod of modules) {
        if (isModuleActive(mod.code)) {
          const chs = getChaptersForModuleAndMode(mod.code, 'mixed');
          for (const chapter of chs) {
            for (const subject of chapter.subjects) {
              const q = subject.questions.find((quest) => quest.id === id);
              if (q) {
                return { question: q, chapter, moduleCode: mod.code, subjectName: subject.name };
              }
            }
          }
        }
      }
    }
  }
  return null;
}
