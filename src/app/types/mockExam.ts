import type { Question } from '../types';

export type AinShamsGrade = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';

export interface AinShamsGradeInfo {
  grade: AinShamsGrade;
  gpaPoints: number;
  status: 'Excellent' | 'Very Good' | 'Good' | 'Satisfactory' | 'Passing' | 'Fail';
  color: string;
  badgeBg: string;
  badgeBorder: string;
}

export type MockExamPreset = 'quick' | 'midterm' | 'final' | 'custom';
export type MockExamFeedbackMode = 'official' | 'tutor';

export interface MockExamConfig {
  moduleCode: string;
  preset: MockExamPreset;
  questionCount: number;
  durationMinutes: number; // 0 for untimed
  mode: MockExamFeedbackMode; // locked vs instant feedback
  selectedSubjects?: string[];
}

export interface MockExamQuestion extends Question {
  subjectName?: string;
  chapterTitle?: string;
  selectedOption?: number | boolean | string;
  isFlagged?: boolean;
  timeSpentSeconds?: number;
}

export interface MockExamResult {
  id: string;
  moduleCode: string;
  timestamp: string;
  preset: string;
  mode: MockExamFeedbackMode;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  scorePercentage: number;
  gradeInfo: AinShamsGradeInfo;
  isPassed: boolean;
  totalDurationSeconds: number;
  allottedDurationSeconds: number;
  averageSecondsPerQuestion: number;
  fastestQuestionSeconds: number;
  slowestQuestionSeconds: number;
  disciplineBreakdown: Record<string, { total: number; correct: number; accuracy: number }>;
  questions: MockExamQuestion[];
}
