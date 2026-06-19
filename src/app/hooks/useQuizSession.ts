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
  timestamp: number;
}

function getKey(chapterId: number | string, subjectName: string, userId?: string | null) {
  const uid = userId || 'guest';
  return `asu_quiz_session:${uid}:${chapterId}:${subjectName || 'all'}`;
}

function getDraftsKey(chapterId: number | string, subjectName: string, userId?: string | null) {
  const uid = userId || 'guest';
  return `asu_local_drafts:${uid}:${chapterId}:${subjectName || 'all'}`;
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
    finally {
      isSaving.current = false;
    }
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
      // Also clear matching local drafts
      const draftsKey = getDraftsKey(chapterId, subjectName, userId);
      localStorage.removeItem(draftsKey);
      triggerCloudSync();
    } catch { /* no-op */ }
  }, []);

  return { save, load, hasSession, clear };
}

/** Persist essay drafts to a separate localStorage key (not synced to cloud) */
export function saveLocalDrafts(
  chapterId: number | string,
  subjectName: string,
  drafts: Record<number, string>,
  userId?: string | null
) {
  try {
    const key = getDraftsKey(chapterId, subjectName, userId);
    localStorage.setItem(key, JSON.stringify({ drafts, timestamp: Date.now() }));
  } catch { /* no-op */ }
}

/** Load essay drafts from the separate localStorage key */
export function loadLocalDrafts(
  chapterId: number | string,
  subjectName: string,
  userId?: string | null
): Record<number, string> {
  try {
    const key = getDraftsKey(chapterId, subjectName, userId);
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === 'object' && parsed.drafts) ? parsed.drafts : {};
  } catch {
    return {};
  }
}

/** Clear local drafts for a chapter/subject combo */
export function clearLocalDrafts(chapterId: number | string, subjectName: string, userId?: string | null) {
  try {
    const key = getDraftsKey(chapterId, subjectName, userId);
    localStorage.removeItem(key);
  } catch { /* no-op */ }
}