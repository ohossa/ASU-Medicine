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
  if (t.includes('parasit')) return 'parasitology';
  if (t.includes('psychiat')) return 'psychiatry';
  if (t.includes('ophthalm') || t.includes('eye')) return 'ophthalmology';
  if (t.includes('ent') || t.includes('ear') || t.includes('hearing') || t.includes('smell') || t.includes('taste') || t.includes('oto')) return 'ent';
  if (t.includes('micro') || t.includes('bacter') || t.includes('virus') || t.includes('fung')) return 'microbiology';
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
  microbiology: 'Microbiology',
  pathology: 'Pathology',
  pharma: 'Pharmacology',
  clinical: 'Clinical',
  parasitology: 'Parasitology',
  psychiatry: 'Psychiatry',
  ophthalmology: 'Ophthalmology',
  ent: 'E.N.T.',
};

const colorToIcon: Record<SubjectColor, string> = {
  anatomy: 'Bone',
  histology: 'Microscope',
  physiology: 'Activity',
  biochem: 'FlaskConical',
  microbiology: 'Biohazard',
  pathology: 'ShieldAlert',
  pharma: 'Pill',
  clinical: 'Stethoscope',
  parasitology: 'Bug',
  psychiatry: 'Brain',
  ophthalmology: 'Eye',
  ent: 'Ear',
};

const SUBJECT_ORDER: SubjectColor[] = [
  'anatomy',
  'histology',
  'physiology',
  'biochem',
  'microbiology',
  'parasitology',
  'pathology',
  'pharma',
  'psychiatry',
  'ophthalmology',
  'ent',
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
      { code: 'IAE-1', name: 'Introduction to Anatomy & Embryology', cp: 5, marks: 100, keywords: ['anatomy', 'embryology', 'iae', 'intro anatomy', 'intro-anatomy', 'embryo', 'developmental anatomy', 'general anatomy'] },
      { code: 'IPHY-1', name: 'Introduction to Physiology', cp: 4, marks: 80, keywords: ['physiology', 'iphy', 'physio', 'intro-physiology', 'intro physiology', 'general physiology', 'cellular physiology'] },
      { code: 'IBM-1', name: 'Introduction to Medical Biochemistry', cp: 3, marks: 60, keywords: ['biochem', 'biochemistry', 'ibm', 'biochemical', 'medical biochemistry', 'intro biochemistry', 'molecular biochemistry'] },
      { code: 'IHC-1', name: 'Introduction to Histology & Cell Biology', cp: 3, marks: 60, keywords: ['histology', 'ihc', 'cell biology', 'cell', 'histo', 'intro histology', 'general histology', 'cytology'] },
      { code: 'MIM-1', name: 'Immunology Module', cp: 3, marks: 60, keywords: ['immunology', 'immuno', 'mim', 'immune', 'lymphoid', 'antibodies', 'antigens'] },
      { code: 'MBMG-1', name: 'Molecular Biology and Medical Genetics Module', cp: 3, marks: 60, keywords: ['molecular', 'genetics', 'mbmg', 'genetics module', 'molecular biology', 'medical genetics', 'dna', 'rna', 'gene'] },
      { code: 'P1-1', name: 'Introduction to Information & Communication Technology (ICT) and Medical Terminology', cp: 1.5, marks: 30, keywords: ['ict', 'terminology', 'medical terminology', 'information technology', 'communication technology'] },
    ],
    2: [
      { code: 'IPAT-1', name: 'Introduction to Pathology', cp: 5, marks: 100, keywords: ['pathology', 'ipat', 'patho', 'intro pathology', 'general pathology', 'cell injury', 'inflammation'] },
      { code: 'IPHA-1', name: 'Introduction to Clinical Pharmacology', cp: 4, marks: 80, keywords: ['pharmacology', 'pharma', 'ipha', 'pharmacology module', 'intro pharma', 'clinical pharmacology', 'pharmacokinetics', 'pharmacodynamics'] },
      { code: 'MINF-1', name: 'Infection Module', cp: 4.5, marks: 90, keywords: ['infection', 'infect', 'minf', 'microbiology', 'parasitology', 'micro', 'parasite', 'bacteria', 'viruses', 'fungi', 'mycology', 'virology', 'bacteriology'] },
      { code: 'MLS-1', name: 'Locomotor Module', cp: 12, marks: 240, keywords: ['locomotor', 'mls', 'loco', 'musculoskeletal', 'ortho', 'orthopedics', 'bone', 'bones', 'joint', 'joints', 'muscle', 'muscles', 'skeletal'] },
      { code: 'BLS-HE-1', name: 'Basic life support + History taking & clinical examination', cp: 1.5, marks: 30, keywords: ['bls', 'history', 'examination', 'clinical examination', 'life support', 'bls-he', 'history taking', 'cardiopulmonary resuscitation', 'cpr'] },
      { code: 'P2-1', name: 'Presentation skills - Learning skills - Time management', cp: 1.5, marks: 30, keywords: ['presentation', 'skills', 'time management', 'learning skills', 'presentation skills'] },
    ],
  },
  2: {
    1: [
      { code: 'MBL-2', name: 'Blood & Lymphatic System Module', cp: 7.5, marks: 150, keywords: ['blood', 'lymphatic', 'mbl', 'lymph', 'hematology', 'heme', 'anemia', 'leukemia', 'coagulation', 'platelets', 'erythrocytes', 'spleen'] },
      { code: 'MRS-2', name: 'Respiratory System Module', cp: 8.5, marks: 170, keywords: ['respiratory', 'respi', 'mrs', 'lung', 'lungs', 'respiration', 'pulmonary', 'pleura', 'ventilation'] },
      { code: 'MCVS-2', name: 'Cardiovascular System Module', cp: 11, marks: 220, keywords: ['cardio', 'cvs', 'mcvs', 'cardiovascular', 'heart', 'cardiac', 'blood vessels', 'artery', 'vein', 'circulation'] },
    ],
    2: [
      { code: 'MCNS1-2', name: 'Central Nervous System 1 Module', cp: 6.5, marks: 130, keywords: ['cns1', 'cns 1', 'mcns1', 'neuro1', 'cns-1', 'brainstem', 'neck', 'sensory system', 'motor system'] },
      { code: 'MCNS2-2', name: 'Central Nervous System 2 Module', cp: 6.5, marks: 130, keywords: ['cns2', 'cns 2', 'mcns2', 'neuro2', 'cns-2', 'diencephalon', 'cerebrum', 'sleep', 'epilepsy', 'infections'] },
      { code: 'MSS-2', name: 'Special Senses Module', cp: 4, marks: 80, keywords: ['special senses', 'senses', 'mss', 'eye', 'ear', 'ophthalmology', 'vision', 'hearing', 'olfaction', 'taste'] },
      { code: 'MEM-2', name: 'Endocrine System & Metabolism Module', cp: 5.5, marks: 110, keywords: ['endocrine', 'metabolism', 'mem', 'hormone', 'hormones', 'pituitary', 'thyroid', 'adrenal', 'pancreas', 'diabetes'] },
      { code: 'P3-2', name: 'Behavioral science', cp: 1.5, marks: 30, keywords: ['behavioral', 'science', 'psychology', 'psychiatry', 'behavioral science'] },
      { code: 'R-2', name: 'Fundamentals of Research', cp: 3, marks: 60, keywords: ['research', 'fundamentals', 'research methodology', 'biostatistics', 'fundamentals of research'] },
    ],
  },
  3: {
    1: [
      { code: 'MGL-3', name: 'GIT & Liver Module', cp: 13, marks: 260, keywords: ['git', 'liver', 'mgl', 'gastrointestinal', 'gastro', 'stomach', 'intestine', 'colon', 'esophagus', 'digestion', 'gallbladder', 'hepatic'] },
      { code: 'MUG-3', name: 'Urogenital System Module', cp: 10, marks: 200, keywords: ['urogenital', 'renal', 'mug', 'urinary', 'kidney', 'kidneys', 'nephron', 'bladder', 'genital', 'reproductive', 'testis', 'ovary', 'uterus'] },
      { code: 'P4-3', name: 'Medical Ethics', cp: 1.5, marks: 30, keywords: ['ethics', 'medical ethics', 'bioethics', 'ethical'] },
      { code: 'P5-3', name: 'Doctor-Patient Communication', cp: 1.5, marks: 30, keywords: ['communication', 'doctor', 'patient', 'doctor-patient', 'interpersonal'] },
    ],
    2: [
      { code: 'CEO-3', name: 'Community, Environmental and Occupational Medicine', cp: 6, marks: 120, keywords: ['community', 'environmental', 'occupational', 'ceo', 'public health', 'preventive', 'epidemiology', 'hygiene', 'community medicine'] },
      { code: 'FT-3', name: 'Forensic Medicine and Clinical Toxicology', cp: 7.5, marks: 150, keywords: ['forensic', 'toxicology', 'ft', 'toxic', 'tox', 'poison', 'poisons', 'postmortem', 'autopsy', 'forensic medicine'] },
      { code: 'ORL-3', name: 'Otorhinolaryngology', cp: 7, marks: 140, keywords: ['ent', 'orl', 'otorhinolaryngology', 'ear nose throat', 'larynx', 'pharynx', 'otology', 'rhinology'] },
      { code: 'MED1-3', name: 'Foundation of Internal Medicine', cp: 3, marks: 60, keywords: ['internal medicine', 'med1', 'medicine', 'foundation medicine', 'clinical skills', 'semiology'] },
      { code: 'P6-3', name: 'Leadership skills & Management skills', cp: 1.5, marks: 30, keywords: ['leadership', 'management', 'leadership skills', 'management skills'] },
      { code: 'R-3', name: 'Scientific Research', cp: 1.5, marks: 30, keywords: ['research', 'scientific', 'scientific research', 'methodology'] },
    ],
  },
  4: {
    1: [
      { code: 'MED2-4', name: 'General and Special Internal Medicine 1', cp: 19.5, marks: 390, keywords: ['internal medicine', 'med2', 'medicine', 'cardiology med', 'chest med', 'gastroenterology med', 'nephrology med'] },
      { code: 'FAM-4', name: 'Family Medicine', cp: 3, marks: 60, keywords: ['family medicine', 'fam', 'primary care', 'gp'] },
      { code: 'P7-4', name: 'Communication within a Medical Team', cp: 1.5, marks: 30, keywords: ['communication', 'team', 'interprofessional', 'medical team'] },
    ],
    2: [
      { code: 'MED3-4', name: 'General and Special Internal Medicine 2', cp: 19.5, marks: 390, keywords: ['internal medicine', 'med3', 'medicine', 'neurology med', 'endocrinology med', 'hematology med', 'rheumatology med', 'geriatrics', 'psychiatry med'] },
      { code: 'PED-4', name: 'Pediatrics', cp: 21, marks: 420, keywords: ['pediatrics', 'peds', 'ped', 'child health', 'neonatology', 'pediatric'] },
    ]
  },
  5: {
    1: [
      { code: 'OO-5', name: 'Ophthalmology', cp: 7, marks: 140, keywords: ['ophthalmology', 'eye', 'oo', 'cornea', 'retina', 'cataract', 'glaucoma', 'refractive'] },
      { code: 'SUR1-5', name: 'General and Special Surgery 1', cp: 18, marks: 360, keywords: ['surgery', 'sur1', 'general surgery', 'abdominal surgery', 'breast surgery', 'endocrine surgery'] },
      { code: 'EM1-5', name: 'Emergency Medicine and Trauma 1', cp: 3, marks: 60, keywords: ['emergency', 'em1', 'trauma', 'emergency medicine', 'cpr', 'first aid', 'shock'] },
    ],
    2: [
      { code: 'SUR2-5', name: 'General and Special Surgery 2', cp: 18, marks: 360, keywords: ['surgery', 'sur2', 'general surgery', 'orthopedic surgery', 'neurosurgery', 'urology', 'cardiothoracic surgery', 'plastic surgery'] },
      { code: 'EM2-5', name: 'Emergency Medicine and Trauma 2', cp: 3, marks: 60, keywords: ['emergency', 'em2', 'trauma', 'emergency medicine', 'toxicology emergency', 'resuscitation'] },
      { code: 'OG-5', name: 'Obstetrics and Gynecology', cp: 21, marks: 420, keywords: ['obstetrics', 'gynecology', 'obgyn', 'og', 'pregnancy', 'labor', 'antenatal', 'contraception', 'menopause'] },
    ]
  }
};

// ── Dynamic Loader ─────────────────────────────────────────────────────────────

interface LoadedDatabases {
  mcqRaw: any | null;
  essayRaw: any | null;
  v2Raw?: any | null;
}

export const moduleDatabases: Record<string, LoadedDatabases> = {};

function assertUniqueQuestionIds(rawData: any, filename: string): void {
  const ids = new Set<string>();
  if (!rawData.chapters) return;
  for (const chapter of rawData.chapters) {
    if (!chapter.subjects) continue;
    for (const subject of chapter.subjects) {
      if (!subject.questions) continue;
      for (const question of subject.questions) {
        if (ids.has(question.id)) {
          throw new Error(`Duplicate question id: ${question.id} in ${filename}`);
        }
        ids.add(question.id);
      }
    }
  }
}

function transformV2Question(q: any, subjectColor: SubjectColor): Question {
  return {
    id: q.id,
    type: q.type,
    text: q.text,
    lecture: q.lecture,
    subjectColor,
    options: q.options,
    correctIndex: q.correctIndex,
    pairs: q.pairs,
    modelAnswer: q.modelAnswer || undefined,
    explanation: q.explanation || '',
    keyConcept: q.keyConcept,
    subQuestions: q.subQuestions ? q.subQuestions.map((sq: any) => ({
      id: sq.id,
      type: sq.type,
      text: sq.text,
      options: sq.options,
      correctIndex: sq.correctIndex,
      modelAnswer: sq.modelAnswer,
      explanation: sq.explanation || '',
      keyConcept: sq.keyConcept
    })) : undefined,
    blanks: q.blanks,
    acceptedAnswers: q.acceptedAnswers
  };
}

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

  if (rawData && typeof rawData === 'object' && 'schemaVersion' in rawData) {
    const sv = rawData.schemaVersion;
    if (sv !== 1) {
      console.warn(`Unexpected schema version ${sv} in ${path}`);
    }
    if (rawData.meta && rawData.meta.moduleCode) {
      const code = rawData.meta.moduleCode;
      if (!moduleDatabases[code]) {
        moduleDatabases[code] = { mcqRaw: null, essayRaw: null };
      }
      assertUniqueQuestionIds(rawData, path);
      moduleDatabases[code].v2Raw = rawData;
    } else {
      console.warn(`Missing meta or moduleCode in v2 JSON: ${path}`);
    }
  } else {
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
  return !!(db && (db.v2Raw || db.mcqRaw || db.essayRaw));
}

export function getModuleQuestionCounts(moduleCode: string) {
  const db = moduleDatabases[moduleCode];
  let mcqCount = 0;
  let essayCount = 0;

  if (db?.v2Raw) {
    db.v2Raw.chapters.forEach((ch: any) => {
      ch.subjects?.forEach((subj: any) => {
        subj.questions?.forEach((q: any) => {
          if (q.type === 'essay') {
            essayCount++;
          } else {
            mcqCount++;
          }
        });
      });
    });
    return { mcqCount, essayCount, totalCount: mcqCount + essayCount };
  }

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

  if (db.v2Raw) {
    const chaptersList = db.v2Raw.chapters || [];
    return chaptersList.map((ch: any) => {
      const subjects: SubjectData[] = (ch.subjects || [])
        .map((subj: any) => {
          const questions = (subj.questions || [])
            .filter((q: any) => {
              if (mode === 'mcq') return q.type !== 'essay';
              if (mode === 'essay') return q.type === 'essay';
              return true;
            })
            .map((q: any) => transformV2Question(q, subj.id));

          return {
            id: subj.id,
            name: subj.name,
            iconName: subj.iconName,
            lectures: subj.lectures || '',
            lectureCount: subj.lectureCount || 1,
            questions,
          };
        })
        .filter((subj: SubjectData) => subj.questions.length > 0);

      const accentColor: SubjectColor = subjects[0]?.id || 'physiology';

      return {
        id: ch.id,
        title: ch.title,
        subtitle: ch.subtitle || ch.title,
        emoji: ch.emoji || '🧠',
        page: ch.page || 1,
        lectureRange: ch.lectureRange || '',
        accentColor,
        subjects,
      };
    });
  }

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

export function findQuestionById(id: string | number): { question: Question; chapter: ChapterData; moduleCode: string; subjectName: string } | null {
  for (const year of Object.keys(SYLLABUS_MODULES)) {
    const semesters = SYLLABUS_MODULES[Number(year)];
    if (!semesters) continue;
    for (const modules of Object.values(semesters)) {
      for (const mod of modules) {
        if (isModuleActive(mod.code)) {
          const chs = getChaptersForModuleAndMode(mod.code, 'mixed');
          for (const chapter of chs) {
            for (const subject of chapter.subjects) {
              const q = subject.questions.find((quest) => String(quest.id) === String(id));
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
