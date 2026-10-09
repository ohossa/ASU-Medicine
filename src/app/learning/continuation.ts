import type { ChapterData } from "../types";
import type { QuizSessionSave } from "../hooks/useQuizSession";
export function findContinuation(
  account: string,
  modules: Array<{ code: string; chapters: ChapterData[] }>,
  storage: Storage,
) {
  const candidates: Array<{
    moduleCode: string;
    chapter: ChapterData;
    session: QuizSessionSave;
  }> = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (!key?.startsWith(`asu_quiz_session:${account}:`)) continue;
    try {
      const session = JSON.parse(storage.getItem(key)!) as QuizSessionSave;
      if (
        session.finished ||
        !Array.isArray(session.questionIds) ||
        !session.questionIds.length ||
        !Number.isFinite(session.timestamp)
      )
        continue;
      const matches = modules.flatMap((m) =>
        m.chapters
          .filter((c) =>
            session.questionIds!.every((id) =>
              c.subjects.some((s) =>
                s.questions.some((q) => String(q.id) === String(id)),
              ),
            ),
          )
          .map((chapter) => ({ moduleCode: m.code, chapter, session })),
      );
      if (matches.length === 1) candidates.push(matches[0]);
    } catch {
      /* Unreadable drafts are preserved, never guessed. */
    }
  }
  return (
    candidates.sort((a, b) => b.session.timestamp - a.session.timestamp)[0] ??
    null
  );
}
export function continuationQuestions(
  chapter: ChapterData,
  session: QuizSessionSave,
) {
  if (!session.questionIds?.length) return null;
  const all = chapter.subjects.flatMap((s) => s.questions);
  const ordered = session.questionIds.map((id) =>
    all.find((q) => String(q.id) === String(id)),
  );
  if (
    ordered.some((q) => !q) ||
    new Set(session.questionIds.map(String)).size !== ordered.length
  )
    return null;
  const questions = ordered as import("../types").Question[];
  if (
    questions.some(
      (q, i) =>
        (q.contentVersion ?? "source") !==
        (session.questionVersions?.[i] ?? "source"),
    )
  )
    return null;
  return questions;
}
