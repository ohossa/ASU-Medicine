import { sha256 } from "../lib/publishedEdits";
/** Assessment content only: chapter moves and source provenance do not reset an attempt. */
export function assessmentContent(
  q: Record<string, unknown>,
): Record<string, unknown> {
  const keys = [
    "type",
    "text",
    "question",
    "options",
    "correctIndex",
    "correctAnswer",
    "pairs",
    "blanks",
    "acceptedAnswers",
    "modelAnswer",
  ];
  return {
    ...Object.fromEntries(
      keys.filter((k) => q[k] !== undefined).map((k) => [k, q[k]]),
    ),
    ...(Array.isArray(q.subQuestions)
      ? {
          subQuestions: q.subQuestions.map((s) =>
            assessmentContent(s as Record<string, unknown>),
          ),
        }
      : {}),
  };
}
export const contentRevision = (q: Record<string, unknown>) =>
  sha256(assessmentContent(q));
