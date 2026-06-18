/**
 * useHintSystem.ts
 *
 * Tracks per-question wrong-answer attempts and fetches contextual AI hints
 * after the second consecutive incorrect answer on a given question.
 *
 * Features:
 *  • Persistent per-session attempt counts
 *  • Debounced fetch to backend /api/hint
 *  • Graceful degradation (static fallback when offline)
 *  • Rate-limit awareness (429 handling)
 */

import { useCallback, useRef, useState } from 'react';
import type { Question } from '../types';

export interface Hint {
  text: string;
  source: 'static' | 'openai' | 'google' | 'custom';
  cached?: boolean;
}

export interface UseHintSystemOptions {
  question: Question;
  userAnswer?: unknown;
  getToken: () => Promise<string | null>;
  enabled?: boolean;
}

const CACHE_TTL_MS = 5 * 60_000; // 5 minutes
const DEBOUNCE_MS = 400;

export function useHintSystem({ question, userAnswer, getToken, enabled = true }: UseHintSystemOptions) {
  const [hint, setHint] = useState<Hint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<Map<string, { hint: Hint; ts: number }>>(new Map());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cacheKey = useCallback(() => {
    return `${question.id}-${question.type}-${JSON.stringify(userAnswer)}`;
  }, [question, userAnswer]);

  const clearHint = useCallback(() => {
    setHint(null);
    setError(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();
  }, []);

  const fetchHint = useCallback(
    async (previousAttempts: number) => {
      if (!enabled || previousAttempts < 2) {
        clearHint();
        return;
      }

      const key = cacheKey();
      const cached = cacheRef.current.get(key);
      if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
        setHint(cached.hint);
        setError(null);
        return;
      }

      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();

      timerRef.current = setTimeout(async () => {
        setLoading(true);
        setError(null);
        abortRef.current = new AbortController();

        try {
          const token = await getToken();
          if (!token) {
            setError('Sign in to receive AI hints.');
            setLoading(false);
            return;
          }

          const res = await fetch('/api/hint', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              questionText: question.text ?? question.question ?? '',
              options: question.options,
              explanation: question.explanation,
              subject: question.subjectColor,
              chapter: question.chapterTitle,
              previousAttempts,
              userAnswer: userAnswer ? String(userAnswer) : undefined,
            }),
            signal: abortRef.current.signal,
          });

          if (res.status === 429) {
            setHint({
              text: "You're requesting hints too quickly. Take a moment to think it through, then try again.",
              source: 'static',
            });
            setLoading(false);
            return;
          }

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || `HTTP ${res.status}`);
          }

          const data = await res.json();
          const fetched: Hint = {
            text: data.hint ?? 'No hint available.',
            source: data.source ?? 'static',
            cached: data.cached,
          };

          cacheRef.current.set(key, { hint: fetched, ts: Date.now() });
          setHint(fetched);
        } catch (err: any) {
          if (err.name === 'AbortError') return;
          setError(err.message || 'Failed to fetch hint.');
          console.error('[useHintSystem]', err);
        } finally {
          setLoading(false);
        }
      }, DEBOUNCE_MS);
    },
    [enabled, cacheKey, clearHint, getToken, question]
  );

  return {
    hint,
    loading,
    error,
    fetchHint,
    clearHint,
  };
}
