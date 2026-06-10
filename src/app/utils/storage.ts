// src/app/utils/storage.ts
// Improvements:
//  - HISTORY_KEY moved to a named constant exported for reuse
//  - saveQuizResult returns the saved entry (useful for optimistic UI)
//  - getQuizHistory properly typed — no `as QuizResult[]` cast on untrusted JSON
//  - Added `getQuizHistoryForModule` helper to filter by module code

import { triggerCloudSync } from '../hooks/useCloudSync';

export interface QuizResult {
  id:                  string;
  date:                string;
  chapterId:           number;
  chapterTitle:        string;
  subjectName:         string;
  correct:             number;
  total:               number;
  pct:                 number;
  elapsedSeconds:      number;
  questionIds?:        number[];
  answers?:            Record<number, unknown>;
  flaggedQuestionIds?: number[];
  moduleCode?:         string;
  year?:               number;
  semester?:           number;
}

export const HISTORY_KEY = 'endocrine_essay_quiz_history';
const MAX_RESULTS        = 50;

function isQuizResult(v: unknown): v is QuizResult {
  return typeof v === 'object' && v !== null && 'id' in v && 'pct' in v;
}

export function getQuizHistory(): QuizResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isQuizResult);
  } catch {
    return [];
  }
}

export function getQuizHistoryForModule(moduleCode: string): QuizResult[] {
  return getQuizHistory().filter(r => r.moduleCode === moduleCode);
}

export function saveQuizResult(result: Omit<QuizResult, 'id' | 'date'>): QuizResult {
  const entry: QuizResult = {
    ...result,
    id:   `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
  };
  const history = getQuizHistory();
  localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...history].slice(0, MAX_RESULTS)));
  triggerCloudSync();
  return entry;
}

export function clearQuizHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
  triggerCloudSync();
}

const FLAGGED_KEY = 'asu_flagged_questions';

export function getFlaggedQuestions(): number[] {
  try {
    const raw = localStorage.getItem(FLAGGED_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

export function saveFlaggedQuestion(id: number): void {
  try {
    const current = getFlaggedQuestions();
    if (!current.includes(id)) {
      localStorage.setItem(FLAGGED_KEY, JSON.stringify([...current, id]));
      triggerCloudSync();
    }
  } catch (e) {
    console.error(e);
  }
}

export function removeFlaggedQuestion(id: number): void {
  try {
    const current = getFlaggedQuestions();
    const updated = current.filter(x => x !== id);
    localStorage.setItem(FLAGGED_KEY, JSON.stringify(updated));
    triggerCloudSync();
  } catch (e) {
    console.error(e);
  }
}

export function toggleFlaggedQuestion(id: number): boolean {
  try {
    const current = getFlaggedQuestions();
    let updated: number[];
    let isFlaggedNow = false;
    if (current.includes(id)) {
      updated = current.filter(x => x !== id);
    } else {
      updated = [...current, id];
      isFlaggedNow = true;
    }
    localStorage.setItem(FLAGGED_KEY, JSON.stringify(updated));
    triggerCloudSync();
    return isFlaggedNow;
  } catch (e) {
    console.error(e);
    return false;
  }
}

