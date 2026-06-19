import { useCallback, useRef } from 'react';
import { triggerCloudSync } from './useCloudSync';
import type { QuizAnswer } from '../types';
import type { TimerMode } from '../components/TimerSettingsPanel';

export interface QuizSessionSave {
  chapterId: number;
  subjectName: string;
  current: number;
  answers: Record<number, QuizAnswer>;
  elapsedSeconds: number;
  flagged: number[];
  finished: boolean;
  timerMode: TimerMode;
  showEssayAnswer: boolean;
  essayDrafts: Record<number, string>;
  timestamp: number;
}

function getKey(chapterId: number | string, subjectName: string, userId?: string | null) {
  const uid = userId || 'guest';
  return `asu_quiz_session:${uid}:${chapterId}:${subjectName || 'all'}`;
}

export function useQuizSession() {
  const isSaving = useRef(false);

  const save = useCallback((
    payload: Omit<QuizSessionSave, 'timestamp'> & { timestamp?: number },
    userId?: string | null
  ) => {
    if (isSaving.current) return;
    isSaving.current = true;

    try {
      const session: QuizSessionSave = {
        ...payload,
        timestamp: Date.now(),
      };
      const key = getKey(payload.chapterId, payload.subjectName, userId);
      localStorage.setItem(key, JSON.stringify(session));
      triggerCloudSync();
    } catch { /* no-op */ }

    requestAnimationFrame(() => {
      isSaving.current = false;
    });
  }, []);

  const load = useCallback((chapterId: number | string, subjectName: string, userId?: string | null): QuizSessionSave | null => {
    try {
      const key = getKey(chapterId, subjectName, userId);
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as QuizSessionSave;
    } catch {
      return null;
    }
  }, []);

  const hasSession = useCallback((chapterId: number | string, subjectName: string, userId?: string | null): boolean => {
    try {
      const key = getKey(chapterId, subjectName, userId);
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }, []);

  const clear = useCallback((chapterId: number | string, subjectName: string, userId?: string | null) => {
    try {
      const key = getKey(chapterId, subjectName, userId);
      localStorage.removeItem(key);
      triggerCloudSync();
    } catch { /* no-op */ }
  }, []);

  return { save, load, hasSession, clear };
}
