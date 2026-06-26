import { useCallback, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
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
  essayDrafts?: Record<number, string>; // Kept for backwards compatibility / types
}

function getKey(chapterId: number | string, subjectName: string, userId?: string | null) {
  const uid = userId || 'guest';
  return `asu_quiz_session:${uid}:${chapterId}:${subjectName || 'all'}`;
}

function getDraftsKey(chapterId: number | string, subjectName: string, userId?: string | null) {
  const uid = userId || 'guest';
  return `asu_local_drafts:${uid}:${chapterId}:${subjectName || 'all'}`;
}

/** Helper to strip the actual typed text from essay responses to save cloud storage */
function cleanAnswers(answers: Record<number, QuizAnswer>): Record<number, QuizAnswer> {
  const cleaned: Record<number, QuizAnswer> = {};
  for (const [index, val] of Object.entries(answers)) {
    const idx = Number(index);
    if (val && typeof val === 'object') {
      if ('text' in val && 'selfGrade' in val) {
        cleaned[idx] = {
          ...val,
          text: '' // Strip actual essay content to optimize cloud sync storage
        } as QuizAnswer;
      } else {
        // Check if it's a case study answer record containing sub-answers
        const cleanedSub: Record<string, any> = {};
        let isCase = false;
        for (const [subKey, subVal] of Object.entries(val)) {
          if (subVal && typeof subVal === 'object' && 'text' in subVal && 'selfGrade' in subVal) {
            isCase = true;
            cleanedSub[subKey] = {
              ...subVal,
              text: '' // Strip actual essay content inside case studies
            };
          } else {
            cleanedSub[subKey] = subVal;
          }
        }
        cleaned[idx] = (isCase ? cleanedSub : val) as QuizAnswer;
      }
    } else {
      cleaned[idx] = val;
    }
  }
  return cleaned;
}

export function useQuizSession() {
  const { user } = useUser();
  const userId = user?.id || null;
  const isSaving = useRef(false);

  const save = useCallback((
    payload: Omit<QuizSessionSave, 'timestamp'> & { timestamp?: number }
  ) => {
    if (isSaving.current) return;
    isSaving.current = true;

    try {
      // Clean essay texts to prevent large payload sizes in cloud sync
      const cleanedAnswers = cleanAnswers(payload.answers);
      const session: QuizSessionSave = {
        ...payload,
        answers: cleanedAnswers,
        timestamp: Date.now(),
      };
      const key = getKey(payload.chapterId, payload.subjectName, userId);
      localStorage.setItem(key, JSON.stringify(session));
      triggerCloudSync();
    } catch { /* no-op */ }
    finally {
      isSaving.current = false;
    }
  }, [userId]);

  const load = useCallback((chapterId: number | string, subjectName: string): QuizSessionSave | null => {
    try {
      const key = getKey(chapterId, subjectName, userId);
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as QuizSessionSave;
    } catch {
      return null;
    }
  }, [userId]);

  const hasSession = useCallback((chapterId: number | string, subjectName: string): boolean => {
    try {
      const key = getKey(chapterId, subjectName, userId);
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }, [userId]);

  const clear = useCallback((chapterId: number | string, subjectName: string) => {
    try {
      const key = getKey(chapterId, subjectName, userId);
      localStorage.removeItem(key);
      // Also clear matching local drafts
      const draftsKey = getDraftsKey(chapterId, subjectName, userId);
      localStorage.removeItem(draftsKey);
      triggerCloudSync();
    } catch { /* no-op */ }
  }, [userId]);

  const loadAnyForChapter = useCallback((chapterId: number | string): QuizSessionSave | null => {
    try {
      const prefix = `asu_quiz_session:${userId || 'guest'}:${chapterId}:`;
      if (typeof window === 'undefined') return null;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw) as QuizSessionSave;
            if (parsed && !parsed.finished) {
              return parsed;
            }
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  }, [userId]);

  return { save, load, hasSession, clear, loadAnyForChapter };
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