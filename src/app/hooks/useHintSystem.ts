/**
 * useHintSystem.ts
 *
 * Interactive chat-based AI tutor that appears after a wrong answer.
 * Tracks conversation history and provides contextual hints based on
 * the question, user's wrong answer, and chat context.
 *
 * Features:
 *  • Persistent chat message history per session
 *  • Context-aware AI responses via /api/hint
 *  • Rate-limit awareness (429 handling)
 *  • Bilingual UI labels via LanguageContext
 */

import { useCallback, useState } from 'react';
import type { Question } from '../types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface UseHintSystemOptions {
  question: Question;
  userAnswer?: unknown;
  correctAnswer?: string;
  studentWrongAnswer?: string;
  getToken: () => Promise<string | null>;
  enabled?: boolean;
}

export function useHintSystem({
  question,
  userAnswer,
  correctAnswer,
  studentWrongAnswer,
  getToken,
  enabled = true,
}: UseHintSystemOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!enabled) return;
      if (!text.trim() && messages.length > 0) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: text.trim(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        if (!token) {
          setError('Sign in to chat with AI tutor.');
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
            correctIndex: question.correctIndex,
            explanation: question.explanation,
            keyConcept: question.keyConcept,
            subject: question.subjectColor,
            chapter: question.chapterTitle,
            previousAttempts: 1, // always >=1 since triggered after wrong answer
            userAnswer: userAnswer != null ? String(userAnswer) : undefined,
            studentWrongAnswer:
              studentWrongAnswer ||
              (userAnswer != null ? String(userAnswer) : undefined),
            correctAnswer,
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (res.status === 429) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + '-ai',
              role: 'assistant',
              content:
                "You're too fast. Take a slow breath, then try again in a minute.",
            },
          ]);
          setLoading(false);
          return;
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
          throw new Error(errData.message || errData.error || `Server error (${res.status})`);
        }

        let data: any = {};
        try {
          data = await res.json();
        } catch (_parseErr) {
          // Server returned HTML or empty body (common in development)
          const bodyText = await res.text().catch(() => '');
          if (import.meta.env.DEV) {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString() + '-ai',
                role: 'assistant',
                content:
                  "🛠️ Dev mode: the AI tutor needs the backend running. Run `npx vercel dev` (port 3000) alongside `npm run dev` (port 5173), or check the API route is live.",
              },
            ]);
          } else if (bodyText.includes('<!DOCTYPE') || bodyText.includes('<html')) {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString() + '-ai',
                role: 'assistant',
                content:
                  "Something went wrong — the server returned a page instead of an answer. Please try again in a moment.",
              },
            ]);
          } else {
            throw new Error('Server response was not valid JSON.');
          }
          setLoading(false);
          return;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + '-ai',
            role: 'assistant',
            content: data.text ?? 'No response.',
          },
        ]);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to reach AI tutor.';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [
      enabled,
      getToken,
      question,
      userAnswer,
      correctAnswer,
      studentWrongAnswer,
      messages,
    ]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearChat };
}