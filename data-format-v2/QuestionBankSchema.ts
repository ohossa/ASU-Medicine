export const SCHEMA_VERSION = 1 as const;

export type SubjectColor =
  | 'anatomy'
  | 'histology'
  | 'physiology'
  | 'biochem'
  | 'microbiology'
  | 'pathology'
  | 'pharma'
  | 'clinical';

export type QuestionType =
  | 'mcq'
  | 'truefalse'
  | 'matching'
  | 'essay'
  | 'case'
  | 'fillblank';

export type CaseSubQuestionType = 'mcq' | 'essay';

export type ProgramYear = 1 | 2 | 3 | 4 | 5;

export type Semester = 1 | 2;

export interface QuestionBankFile {
  schemaVersion: typeof SCHEMA_VERSION;
  meta: ModuleMeta;
  chapters: ChapterSchema[];
}

export interface ModuleMeta {
  moduleCode: string;
  moduleName: string;
  year: ProgramYear;
  semester: Semester;
  creditPoints: number;
  totalMarks: number;
  keywords: string[];
}

export interface ChapterSchema {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  page: number;
  lectureRange: string;
  subjects: SubjectSchema[];
}

export interface SubjectSchema {
  id: SubjectColor;
  name: string;
  iconName: string;
  lectures: string;
  lectureCount: number;
  questions: QuestionSchema[];
}

export type QuestionSchema =
  | McqQuestionSchema
  | TrueFalseQuestionSchema
  | MatchingQuestionSchema
  | EssayQuestionSchema
  | CaseQuestionSchema
  | FillBlankQuestionSchema;

export interface BaseQuestionSchema {
  id: string;
  type: QuestionType;
  lecture: number;
  text: string;
  explanation: string;
  keyConcept?: string;
}

export interface McqQuestionSchema extends BaseQuestionSchema {
  type: 'mcq';
  options: string[];
  correctIndex: number;
  modelAnswer?: string | null;
}

export interface TrueFalseQuestionSchema extends BaseQuestionSchema {
  type: 'truefalse';
  options: string[];
  correctIndex: number;
  modelAnswer?: string | null;
}

export interface MatchingQuestionSchema extends BaseQuestionSchema {
  type: 'matching';
  pairs: MatchingPair[];
}

export interface EssayQuestionSchema extends BaseQuestionSchema {
  type: 'essay';
  modelAnswer: string;
}

export interface CaseQuestionSchema extends BaseQuestionSchema {
  type: 'case';
  subQuestions: CaseSubQuestionSchema[];
}

export interface FillBlankQuestionSchema extends BaseQuestionSchema {
  type: 'fillblank';
  blanks: string[];
  acceptedAnswers?: string[][];
}

export interface MatchingPair {
  premise: string;
  target: string;
}

export type CaseSubQuestionSchema = McqCaseSubQuestionSchema | EssayCaseSubQuestionSchema;

export interface BaseCaseSubQuestionSchema {
  id: string;
  type: CaseSubQuestionType;
  text: string;
  explanation: string;
  keyConcept?: string;
}

export interface McqCaseSubQuestionSchema extends BaseCaseSubQuestionSchema {
  type: 'mcq';
  options: string[];
  correctIndex: number;
}

export interface EssayCaseSubQuestionSchema extends BaseCaseSubQuestionSchema {
  type: 'essay';
  modelAnswer: string;
}

export const SUBJECT_KEYS: Record<SubjectColor, string> = {
  anatomy: 'ANAT',
  histology: 'HIST',
  physiology: 'PHYS',
  biochem: 'BIOC',
  microbiology: 'MICR',
  pathology: 'PATH',
  pharma: 'PHAR',
  clinical: 'CLIN',
};

export const SUBJECT_DISPLAY: Record<SubjectColor, { name: string; iconName: string }> = {
  anatomy: { name: 'Anatomy', iconName: 'Bone' },
  histology: { name: 'Histology', iconName: 'Microscope' },
  physiology: { name: 'Physiology', iconName: 'Activity' },
  biochem: { name: 'Biochemistry', iconName: 'FlaskConical' },
  microbiology: { name: 'Microbiology', iconName: 'Biohazard' },
  pathology: { name: 'Pathology', iconName: 'ShieldAlert' },
  pharma: { name: 'Pharmacology', iconName: 'Pill' },
  clinical: { name: 'Clinical', iconName: 'Stethoscope' },
};

export function assertUniqueQuestionIds(file: QuestionBankFile): void {
  const ids = new Set<string>();

  for (const chapter of file.chapters) {
    for (const subject of chapter.subjects) {
      for (const question of subject.questions) {
        if (ids.has(question.id)) {
          throw new Error(`Duplicate question id: ${question.id}`);
        }
        ids.add(question.id);
      }
    }
  }
}
