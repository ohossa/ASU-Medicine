import type { ChapterData } from "../types";
export function resolveStudyLink(
  chapters: ChapterData[],
  params: URLSearchParams,
) {
  const id = params.get("question");
  const chapter = id
    ? chapters.find((c) =>
        c.subjects.some((s) => s.questions.some((q) => String(q.id) === id)),
      )
    : chapters.find((c) => String(c.id) === params.get("chapter"));
  if (!chapter) return null;
  const subject = id
    ? chapter.subjects.find((s) => s.questions.some((q) => String(q.id) === id))
    : chapter.subjects.find((s) => s.id === params.get("subject"));
  const questions = (
    subject ? subject.questions : chapter.subjects.flatMap((s) => s.questions)
  ).filter(
    (q) =>
      (!id || String(q.id) === id) &&
      (id ||
        !params.has("lecture") ||
        (q.lecture ?? 1) === Number(params.get("lecture"))),
  );
  if (!questions.length) return null;
  const child = params.get("child");
  if (
    child &&
    !questions.some((q) => q.subQuestions?.some((s) => s.id === child))
  )
    return null;
  return {
    chapter,
    subject:
      subject && params.has("lecture")
        ? {
            ...subject,
            name:
              subject.lectureNames?.[Number(params.get("lecture")) - 1] ??
              subject.name,
            questions,
          }
        : (subject ?? null),
    questions,
  };
}
