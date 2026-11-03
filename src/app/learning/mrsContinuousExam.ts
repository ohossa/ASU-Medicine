/**
 * Ain Shams University — Year 2 Respiratory Module (MRS-2)
 * Continuous II Assessment (CA-2) Official Blueprint Engine
 *
 * Exam Blueprint: Saturday, 7th November 2026
 * 30 Lectures · 38 Multiple Choice Questions · 49 Minutes Duration
 * Module Coordinator: Prof. Amany Helmy Hasanin
 */

import type { ChapterData, Question, SubjectData } from '../types';
import type { PracticeTopic } from './customPractice';
import { practiceTopics } from './customPractice';

export interface AssessmentUnitConfig {
  id: string;
  name: string;
  nameAr: string;
  marks: number;
  durationMinutes: number;
  description: string;
  descriptionAr: string;
  topicMatchers: Array<{
    chapterId: number;
    subjectId: string;
    lectureNum: number;
  }>;
}

export interface MrsContinuousConfig {
  moduleCode: string;
  examTitle: string;
  examTitleAr: string;
  dateStr: string;
  totalLectures: number;
  totalMarks: number;
  durationMinutes: number;
  units: AssessmentUnitConfig[];
}

export const MRS_CONTINUOUS_II_CONFIG: MrsContinuousConfig = {
  moduleCode: 'MRS-2',
  examTitle: 'Continuous II Assessment (CA-2)',
  examTitleAr: 'اختبار التقييم المستمر الثاني (CA-2)',
  dateStr: 'Saturday, 7th November 2026',
  totalLectures: 30,
  totalMarks: 38,
  durationMinutes: 49,
  units: [
    {
      id: 'unit-1',
      name: 'Unit I — Upper Respiratory Tract',
      nameAr: 'الوحدة الأولى — الجهاز التنفسي العلوي',
      marks: 10,
      durationMinutes: 13,
      description: 'Anatomy, Histology, Microbiology & Pathology of the Upper Airway',
      descriptionAr: 'تشريح وهستولوجيا وميكروبيولوجيا وباثولوجيا المجرى الهوائي العلوي',
      topicMatchers: [
        { chapterId: 1, subjectId: 'anatomy', lectureNum: 1 }, // Nose & Paranasal Sinuses
        { chapterId: 1, subjectId: 'anatomy', lectureNum: 2 }, // Pharynx, Larynx & Trachea (upper)
        { chapterId: 1, subjectId: 'histology', lectureNum: 1 }, // Upper Resp & Olfactory Mucosa
        { chapterId: 1, subjectId: 'histology', lectureNum: 2 }, // Larynx, Epiglottis & Trachea (upper)
        { chapterId: 3, subjectId: 'microbiology', lectureNum: 1 }, // Upper Resp Bacterial Infections
        { chapterId: 3, subjectId: 'pathology', lectureNum: 3 }, // Upper Respiratory & Pleural Diseases
      ],
    },
    {
      id: 'unit-2',
      name: 'Unit II — Lower Respiratory Tract',
      nameAr: 'الوحدة الثانية — المجرى التنفسي السفلي وجدار الصدر',
      marks: 8,
      durationMinutes: 10,
      description: 'Thoracic Cage, Intercostal Wall, Diaphragm & Asthma Bronchodilators',
      descriptionAr: 'القفص الصدري وجدار الصدر والحجاب الحاجز وموسعات الشعب الهوائية',
      topicMatchers: [
        { chapterId: 1, subjectId: 'anatomy', lectureNum: 4 }, // Thoracic Cage, Wall & Diaphragm
        { chapterId: 3, subjectId: 'pharma', lectureNum: 1 }, // Bronchodilators & Antiasthmatic Drugs
      ],
    },
    {
      id: 'unit-4',
      name: 'Unit IV — Physiology of Respiration',
      nameAr: 'الوحدة الرابعة — فسيولوجيا التنفس',
      marks: 9,
      durationMinutes: 12,
      description: 'Breathing Mechanics, Surfactant, Compliance & Lung Volumes/Spirometry',
      descriptionAr: 'ميكانيكا التنفس والمطاوعة والسورفاكتانت وأحجام وسعات الرئة',
      topicMatchers: [
        { chapterId: 2, subjectId: 'physiology', lectureNum: 1 }, // Mechanics, Compliance, Surfactant
        { chapterId: 2, subjectId: 'physiology', lectureNum: 2 }, // Lung Volumes, Capacities & Spirometry
      ],
    },
    {
      id: 'unit-5',
      name: 'Unit V — Lung Diseases-1',
      nameAr: 'الوحدة الخامسة — أمراض الرئة 1',
      marks: 7,
      durationMinutes: 9,
      description: 'Obstructive Lung Diseases (COPD, Asthma, Bronchiectasis) & ARDS / Collapse',
      descriptionAr: 'أمراض الرئة الانسدادية الأولى ومتلازمة الضائقة التنفسية الحادة والانخماص',
      topicMatchers: [
        { chapterId: 3, subjectId: 'pathology', lectureNum: 1 }, // Obstructive Diseases, ARDS
      ],
    },
    {
      id: 'unit-6',
      name: 'Unit VI — Glucose Oxidation and Shuttles',
      nameAr: 'الوحدة السادسة — أكسدة الجلوكوز والمكوكات الأيضية',
      marks: 4,
      durationMinutes: 5,
      description: 'Oxidative Phosphorylation, ETC, Krebs Cycle & Pyruvate Shuttles',
      descriptionAr: 'الفسفرة التأكسدية وسلسلة نقل الإلكترون ودورة كريبس ومكوكات البيروفات',
      topicMatchers: [
        { chapterId: 2, subjectId: 'biochem', lectureNum: 1 }, // Oxidative Phosphorylation & ETC
        { chapterId: 2, subjectId: 'biochem', lectureNum: 2 }, // Krebs Cycle, Pyruvate & Shuttles
      ],
    },
  ],
};

/**
 * Quick lookup set of whitelisted topic coordinates: `${chapterId}:${subjectId}:${lectureNum}`
 */
const WHITELIST_COORDS = new Set<string>(
  MRS_CONTINUOUS_II_CONFIG.units.flatMap(u =>
    u.topicMatchers.map(m => `${m.chapterId}:${m.subjectId}:${m.lectureNum}`)
  )
);

/**
 * Checks whether a given topic belongs to the Continuous II assessment for MRS-2.
 */
export function isMrsContinuousTopic(topic: PracticeTopic, moduleCode = 'MRS-2'): boolean {
  if (moduleCode !== 'MRS-2') return true;
  try {
    const parsed = JSON.parse(topic.key);
    if (!Array.isArray(parsed) || parsed.length < 4) return false;
    const [, chId, subjIndex, suffix] = parsed;
    const lectureNum = Number(suffix);
    if (!Number.isInteger(lectureNum) || lectureNum < 1) return false;

    // Resolve subject ID by looking up standard MRS-2 structure:
    // Ch 1: 0 -> anatomy, 1 -> histology
    // Ch 2: 0 -> physiology, 1 -> biochem
    // Ch 3: 0 -> pathology, 1 -> pharma, 2 -> microbiology, 3 -> parasitology
    let subjectId = '';
    if (chId === 1) {
      subjectId = subjIndex === 0 ? 'anatomy' : 'histology';
    } else if (chId === 2) {
      subjectId = subjIndex === 0 ? 'physiology' : 'biochem';
    } else if (chId === 3) {
      if (subjIndex === 0) subjectId = 'pathology';
      else if (subjIndex === 1) subjectId = 'pharma';
      else if (subjIndex === 2) subjectId = 'microbiology';
      else if (subjIndex === 3) subjectId = 'parasitology';
    }

    return WHITELIST_COORDS.has(`${chId}:${subjectId}:${lectureNum}`);
  } catch {
    return false;
  }
}

/**
 * Filter an array of PracticeTopic down to only Continuous II topics.
 */
export function filterMrsContinuousTopics(
  topics: PracticeTopic[],
  moduleCode = 'MRS-2'
): PracticeTopic[] {
  if (moduleCode !== 'MRS-2') return topics;
  return topics.filter(t => isMrsContinuousTopic(t, moduleCode));
}

/**
 * Filters the module's ChapterData list to produce a scoped chapter hierarchy
 * where subjects and lectureNames contain ONLY Continuous II assessment material.
 */
export function filterMrsContinuousChapters(
  chapters: ChapterData[],
  moduleCode = 'MRS-2'
): ChapterData[] {
  if (moduleCode !== 'MRS-2') return chapters;

  return chapters
    .map(chapter => {
      const filteredSubjects: SubjectData[] = [];

      chapter.subjects.forEach(subject => {
        const names = subject.lectureNames ?? [];
        const keptLectures: number[] = [];

        names.forEach((_, idx) => {
          const lNum = idx + 1;
          if (WHITELIST_COORDS.has(`${chapter.id}:${subject.id}:${lNum}`)) {
            keptLectures.push(lNum);
          }
        });

        if (keptLectures.length === 0) return;

        // Map kept lecture numbers to their new contiguous 1-based indices in lectureNames
        const lectureMapping = new Map<number, number>();
        keptLectures.forEach((orig, idx) => lectureMapping.set(orig, idx + 1));

        // Filter and remap questions belonging to kept lectures
        const keptQuestions = subject.questions
          .filter(q => typeof q.lecture === 'number' && keptLectures.includes(q.lecture))
          .map(q => ({
            ...q,
            lecture: lectureMapping.get(q.lecture as number) ?? q.lecture,
          }));

        if (keptQuestions.length === 0) return;

        filteredSubjects.push({
          ...subject,
          lectureCount: keptLectures.length,
          lectureNames: keptLectures.map(l => names[l - 1]),
          questions: keptQuestions,
        });
      });

      if (filteredSubjects.length === 0) return null;

      const totalQ = filteredSubjects.reduce((sum, s) => sum + s.questions.length, 0);

      return {
        ...chapter,
        subjects: filteredSubjects,
        subtitle: `Continuous II Assessment · ${totalQ} Questions`,
      };
    })
    .filter((c): c is ChapterData => c !== null);
}

/**
 * Deterministic pseudo-random shuffle (seeded by a string signature)
 */
function seededShuffle<T>(array: T[], seedStr: string): T[] {
  const result = [...array];
  let h = 0x811c9dc5;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 0x01000193);
  }
  const random = () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = (h ^ (h >>> 16)) >>> 0;
    return h / 0xffffffff;
  };

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates an authentic 38-question Continuous II Mock Exam matching the exact faculty blueprint weights:
 * - Unit I: 10 MCQs
 * - Unit II: 8 MCQs
 * - Unit IV: 9 MCQs
 * - Unit V: 7 MCQs
 * - Unit VI: 4 MCQs
 * Total: 38 MCQs (49 minutes)
 */
export function generateMrsContinuousMockExam(
  chapters: ChapterData[],
  language = 'en',
  seed = Date.now().toString()
): { virtualChapter: ChapterData; subject: SubjectData; questions: Question[] } {
  const isAr = language === 'ar';
  const allTopics = chapters.flatMap(ch => practiceTopics(ch, 'MRS-2'));

  const selectedQuestions: Question[] = [];
  const seenIds = new Set<string>();

  // Map topics to their Unit
  const unitQuestionPools = new Map<string, Question[]>();
  MRS_CONTINUOUS_II_CONFIG.units.forEach(u => unitQuestionPools.set(u.id, []));

  allTopics.forEach(topic => {
    try {
      const parsed = JSON.parse(topic.key);
      const [, chId, subjIndex, suffix] = parsed;
      const lectureNum = Number(suffix);

      let subjectId = '';
      if (chId === 1) subjectId = subjIndex === 0 ? 'anatomy' : 'histology';
      else if (chId === 2) subjectId = subjIndex === 0 ? 'physiology' : 'biochem';
      else if (chId === 3) {
        if (subjIndex === 0) subjectId = 'pathology';
        else if (subjIndex === 1) subjectId = 'pharma';
        else if (subjIndex === 2) subjectId = 'microbiology';
        else if (subjIndex === 3) subjectId = 'parasitology';
      }

      for (const unit of MRS_CONTINUOUS_II_CONFIG.units) {
        const matches = unit.topicMatchers.some(
          m => m.chapterId === chId && m.subjectId === subjectId && m.lectureNum === lectureNum
        );
        if (matches) {
          const pool = unitQuestionPools.get(unit.id)!;
          topic.questions.forEach(q => {
            const id = String(q.id);
            if (!seenIds.has(id)) {
              seenIds.add(id);
              pool.push({
                ...q,
                practiceTopic: {
                  key: topic.key,
                  title: topic.title,
                  subjectName: topic.subjectName,
                },
              });
            }
          });
        }
      }
    } catch {
      // Ignore unparseable topic keys
    }
  });

  // Sample exact quotas for each unit
  const finalChosenIds = new Set<string>();

  MRS_CONTINUOUS_II_CONFIG.units.forEach(unit => {
    const pool = unitQuestionPools.get(unit.id) ?? [];
    const shuffled = seededShuffle(pool, `${seed}:${unit.id}`);
    const quota = Math.min(unit.marks, shuffled.length);
    for (let i = 0; i < quota; i++) {
      const q = shuffled[i];
      selectedQuestions.push(q);
      finalChosenIds.add(String(q.id));
    }
  });

  // Interleave and randomize the final 38 questions
  const finalExamQuestions = seededShuffle(selectedQuestions, `${seed}:final`);

  // Build virtual chapter and subject container
  const virtualChapter: ChapterData = {
    id: 992,
    title: isAr
      ? 'اختبار التقييم المستمر الثاني (CA-2) الرسمي'
      : 'Official Continuous II Assessment (CA-2)',
    subtitle: isAr
      ? '38 سؤالاً · 49 دقيقة · مخطط الكلية الرسمي 2026/2027'
      : '38 MCQs · 49 Minutes · Official 2026/2027 Faculty Blueprint',
    emoji: '🎯',
    page: 1,
    lectureRange: isAr ? '30 محاضرة' : '30 Lectures',
    accentColor: 'clinical',
    subjects: chapters.flatMap(c => c.subjects),
  };

  const subject: SubjectData = {
    id: 'clinical',
    name: isAr ? 'محاكاة التقييم المستمر الثاني (38 سؤالاً)' : 'Continuous II Mock Exam (38 MCQs)',
    sessionKey: `mrs-ca2-mock:${finalExamQuestions.length}:${Date.now()}`,
    iconName: 'Award',
    lectures: isAr ? '30 محاضرة منتقاة' : '30 Curriculum Lectures',
    lectureCount: 30,
    questions: finalExamQuestions,
  };

  return { virtualChapter, subject, questions: finalExamQuestions };
}
