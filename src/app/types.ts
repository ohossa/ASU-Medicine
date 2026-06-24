export type SubjectColor =
  | 'physiology'
  | 'biochem'
  | 'microbiology'
  | 'anatomy'
  | 'histology'
  | 'pathology'
  | 'pharma'
  | 'clinical'
  | 'parasitology'
  | 'psychiatry'
  | 'ophthalmology'
  | 'ent';

export type Screen =
  | 'yearSelect'
  | 'semesterSelect'
  | 'moduleSelect'
  | 'studyModeSelect'
  | 'chapters'
  | 'subjects'
  | 'quiz'
  | 'results'
  | 'history'
  | 'flaggedQuestions'
  | 'analytics'
  | 'caseSolver'
  | 'questionSearch'
  | 'marksCalculator';

export interface SubQuestion {
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

/** Union of all possible answer shapes stored in answers map */
export type QuizAnswer =
  | number                                          // MCQ / truefalse selection
  | boolean                                         // truefalse (legacy)
  | { text: string; selfGrade?: 'correct' | 'incorrect' }  // essay
  | { inputs: string[]; submitted: boolean }        // fillblank
  | { scrambled: string[]; matches: Record<string, string>; submitted: boolean } // matching
  | Record<string, number | { text?: string; inputs?: string[]; selfGrade?: string; submitted?: boolean }>; // case/casestudy sub-answers

export interface Question {
  id: string | number;
  type: 'mcq' | 'truefalse' | 'matching' | 'essay' | 'case' | 'casestudy' | 'fillblank';
  text: string;
  lecture: number;
  subjectColor: SubjectColor;
  options?: string[];
  correctIndex?: number;
  pairs?: { premise: string; target: string }[];
  modelAnswer?: string;
  explanation: string;
  keyConcept?: string;
  subQuestions?: SubQuestion[];
  blanks?: string[];         // correct answers for each ___ slot (in order)
  acceptedAnswers?: string[][];  // optional alternatives per blank slot
  repetitionCount?: number;    // 2-3=★  4-5=★★  6+=★★★  auto-managed by importer

  /* ── Difficulty & Bloom taxonomy ── */
  difficulty?: 1 | 2 | 3 | 4 | 5;
  bloomLevel?: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  tags?: string[];
  estimatedTimeSeconds?: number;
  media?: {
    imageUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
  };

  /* ── Analytics fields ── */
  avgCorrectRate?: number;      // 0.0–1.0, back-filled from usage logs
  totalAttempts?: number;       // cumulative answer attempts
  discriminationIndex?: number; // 0.0–1.0, item discrimination (how well it separates high/low performers)
}

export interface SubjectData {
  id: SubjectColor;
  name: string;
  iconName: string;
  lectures: string;
  lectureCount: number;
  lectureNames?: string[];
  questions: Question[];
  lectureNum?: number; // Added for virtual subjects in Infection Module
}

export interface ChapterData {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  page: number;
  lectureRange: string;
  accentColor: SubjectColor;
  subjects: SubjectData[];
  keywords?: string[]; // chapter topic keywords for auto-sorting incoming questions
}

export interface QuizSession {
  chapter: ChapterData;
  subject: SubjectData | null; // null = Quick Start All
  questions: Question[];
  answers: Record<number, string | number>; // questionIndex → user answer details (supporting essays/cases)
  elapsedSeconds: number;
}

export interface SubjectStyle {
  bg: string;
  bgOp5: string;
  bgOp8: string;
  bgOp10: string;
  bgOp15: string;
  text: string;
  textDark: string;
  border: string;
  borderOp10: string;
  borderOp15: string;
  borderOp40: string;
  hoverBorder: string;
  gradientFrom: string;
  gradientTo: string;
  hoverShadowRgba: string;
}

export const subjectStyles: Record<SubjectColor, SubjectStyle> = {
  physiology: {
    bg: 'bg-physiology',
    bgOp5: 'bg-physiology/5',
    bgOp8: 'bg-physiology/8',
    bgOp10: 'bg-physiology/10',
    bgOp15: 'bg-physiology/15',
    text: 'text-physiology',
    textDark: 'text-physiology-dark',
    border: 'border-physiology',
    borderOp10: 'border-physiology/10',
    borderOp15: 'border-physiology/15',
    borderOp40: 'border-physiology/40',
    hoverBorder: 'hover:border-physiology/40',
    gradientFrom: 'from-physiology/15',
    gradientTo: 'to-physiology/5',
    hoverShadowRgba: 'rgba(16,185,129,0.15)',
  },
  biochem: {
    bg: 'bg-biochem',
    bgOp5: 'bg-biochem/5',
    bgOp8: 'bg-biochem/8',
    bgOp10: 'bg-biochem/10',
    bgOp15: 'bg-biochem/15',
    text: 'text-biochem',
    textDark: 'text-biochem-dark',
    border: 'border-biochem',
    borderOp10: 'border-biochem/10',
    borderOp15: 'border-biochem/15',
    borderOp40: 'border-biochem/40',
    hoverBorder: 'hover:border-biochem/40',
    gradientFrom: 'from-biochem/15',
    gradientTo: 'to-biochem/5',
    hoverShadowRgba: 'rgba(245,158,11,0.15)',
  },
  microbiology: {
    bg: 'bg-microbiology',
    bgOp5: 'bg-microbiology/5',
    bgOp8: 'bg-microbiology/8',
    bgOp10: 'bg-microbiology/10',
    bgOp15: 'bg-microbiology/15',
    text: 'text-microbiology',
    textDark: 'text-microbiology-dark',
    border: 'border-microbiology',
    borderOp10: 'border-microbiology/10',
    borderOp15: 'border-microbiology/15',
    borderOp40: 'border-microbiology/40',
    hoverBorder: 'hover:border-microbiology/40',
    gradientFrom: 'from-microbiology/15',
    gradientTo: 'to-microbiology/5',
    hoverShadowRgba: 'rgba(236,72,153,0.15)',
  },
  anatomy: {
    bg: 'bg-anatomy',
    bgOp5: 'bg-anatomy/5',
    bgOp8: 'bg-anatomy/8',
    bgOp10: 'bg-anatomy/10',
    bgOp15: 'bg-anatomy/15',
    text: 'text-anatomy',
    textDark: 'text-anatomy-dark',
    border: 'border-anatomy',
    borderOp10: 'border-anatomy/10',
    borderOp15: 'border-anatomy/15',
    borderOp40: 'border-anatomy/40',
    hoverBorder: 'hover:border-anatomy/40',
    gradientFrom: 'from-anatomy/15',
    gradientTo: 'to-anatomy/5',
    hoverShadowRgba: 'rgba(59,130,246,0.15)',
  },
  histology: {
    bg: 'bg-histology',
    bgOp5: 'bg-histology/5',
    bgOp8: 'bg-histology/8',
    bgOp10: 'bg-histology/10',
    bgOp15: 'bg-histology/15',
    text: 'text-histology',
    textDark: 'text-histology-dark',
    border: 'border-histology',
    borderOp10: 'border-histology/10',
    borderOp15: 'border-histology/15',
    borderOp40: 'border-histology/40',
    hoverBorder: 'hover:border-histology/40',
    gradientFrom: 'from-histology/15',
    gradientTo: 'to-histology/5',
    hoverShadowRgba: 'rgba(139,92,246,0.15)',
  },
  pathology: {
    bg: 'bg-pathology',
    bgOp5: 'bg-pathology/5',
    bgOp8: 'bg-pathology/8',
    bgOp10: 'bg-pathology/10',
    bgOp15: 'bg-pathology/15',
    text: 'text-pathology',
    textDark: 'text-pathology-dark',
    border: 'border-pathology',
    borderOp10: 'border-pathology/10',
    borderOp15: 'border-pathology/15',
    borderOp40: 'border-pathology/40',
    hoverBorder: 'hover:border-pathology/40',
    gradientFrom: 'from-pathology/15',
    gradientTo: 'to-pathology/5',
    hoverShadowRgba: 'rgba(239,68,68,0.15)',
  },
  pharma: {
    bg: 'bg-pharma',
    bgOp5: 'bg-pharma/5',
    bgOp8: 'bg-pharma/8',
    bgOp10: 'bg-pharma/10',
    bgOp15: 'bg-pharma/15',
    text: 'text-pharma',
    textDark: 'text-pharma-dark',
    border: 'border-pharma',
    borderOp10: 'border-pharma/10',
    borderOp15: 'border-pharma/15',
    borderOp40: 'border-pharma/40',
    hoverBorder: 'hover:border-pharma/40',
    gradientFrom: 'from-pharma/15',
    gradientTo: 'to-pharma/5',
    hoverShadowRgba: 'rgba(249,115,22,0.15)',
  },
  clinical: {
    bg: 'bg-clinical',
    bgOp5: 'bg-clinical/5',
    bgOp8: 'bg-clinical/8',
    bgOp10: 'bg-clinical/10',
    bgOp15: 'bg-clinical/15',
    text: 'text-clinical',
    textDark: 'text-clinical-dark',
    border: 'border-clinical',
    borderOp10: 'border-clinical/10',
    borderOp15: 'border-clinical/15',
    borderOp40: 'border-clinical/40',
    hoverBorder: 'hover:border-clinical/40',
    gradientFrom: 'from-clinical/15',
    gradientTo: 'to-clinical/5',
    hoverShadowRgba: 'rgba(6,182,212,0.15)',
  },
  parasitology: {
    bg: 'bg-parasitology',
    bgOp5: 'bg-parasitology/5',
    bgOp8: 'bg-parasitology/8',
    bgOp10: 'bg-parasitology/10',
    bgOp15: 'bg-parasitology/15',
    text: 'text-parasitology',
    textDark: 'text-parasitology-dark',
    border: 'border-parasitology',
    borderOp10: 'border-parasitology/10',
    borderOp15: 'border-parasitology/15',
    borderOp40: 'border-parasitology/40',
    hoverBorder: 'hover:border-parasitology/40',
    gradientFrom: 'from-parasitology/15',
    gradientTo: 'to-parasitology/5',
    hoverShadowRgba: 'rgba(244,63,94,0.15)',
  },
  psychiatry: {
    bg: 'bg-psychiatry',
    bgOp5: 'bg-psychiatry/5',
    bgOp8: 'bg-psychiatry/8',
    bgOp10: 'bg-psychiatry/10',
    bgOp15: 'bg-psychiatry/15',
    text: 'text-psychiatry',
    textDark: 'text-psychiatry-dark',
    border: 'border-psychiatry',
    borderOp10: 'border-psychiatry/10',
    borderOp15: 'border-psychiatry/15',
    borderOp40: 'border-psychiatry/40',
    hoverBorder: 'hover:border-psychiatry/40',
    gradientFrom: 'from-psychiatry/15',
    gradientTo: 'to-psychiatry/5',
    hoverShadowRgba: 'rgba(99,102,241,0.15)',
  },
  ophthalmology: {
    bg: 'bg-ophthalmology',
    bgOp5: 'bg-ophthalmology/5',
    bgOp8: 'bg-ophthalmology/8',
    bgOp10: 'bg-ophthalmology/10',
    bgOp15: 'bg-ophthalmology/15',
    text: 'text-ophthalmology',
    textDark: 'text-ophthalmology-dark',
    border: 'border-ophthalmology',
    borderOp10: 'border-ophthalmology/10',
    borderOp15: 'border-ophthalmology/15',
    borderOp40: 'border-ophthalmology/40',
    hoverBorder: 'hover:border-ophthalmology/40',
    gradientFrom: 'from-ophthalmology/15',
    gradientTo: 'to-ophthalmology/5',
    hoverShadowRgba: 'rgba(13,148,136,0.15)',
  },
  ent: {
    bg: 'bg-ent',
    bgOp5: 'bg-ent/5',
    bgOp8: 'bg-ent/8',
    bgOp10: 'bg-ent/10',
    bgOp15: 'bg-ent/15',
    text: 'text-ent',
    textDark: 'text-ent-dark',
    border: 'border-ent',
    borderOp10: 'border-ent/10',
    borderOp15: 'border-ent/15',
    borderOp40: 'border-ent/40',
    hoverBorder: 'hover:border-ent/40',
    gradientFrom: 'from-ent/15',
    gradientTo: 'to-ent/5',
    hoverShadowRgba: 'rgba(14,165,233,0.15)',
  },
};

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
