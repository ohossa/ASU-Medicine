import type { Question } from "../types.js";
import { checkAnswerCorrect } from "../utils/quiz.js";

type LearningQuestion = Pick<Question, "type" | "correctIndex" | "options" | "pairs" | "blanks" | "acceptedAnswers" | "subQuestions">;

export function gradeLearningAnswer(q: LearningQuestion, answer: unknown) {
  if (answer === undefined || answer === null) return null;
  const a = answer as Record<string, unknown>;
  let points = 0;
  if (q.type === "mcq" || q.type === "truefalse") {
    if (
      !Number.isInteger(q.correctIndex) ||
      q.correctIndex! < 0 ||
      q.correctIndex! >= (q.options?.length ?? (q.type === "truefalse" ? 2 : 0))
    )
      return null;
    if (
      q.type === "truefalse"
        ? !(typeof answer === "boolean" || answer === 0 || answer === 1)
        : !(
            typeof answer === "number" &&
            Number.isInteger(answer) &&
            answer >= 0 &&
            answer < (q.options?.length ?? 0)
          )
    )
      return null;
    points = q.type === "truefalse" ? 5 : 10;
  } else if (q.type === "essay") {
    if (
      typeof a.text !== "string" ||
      a.text.trim().length < 20 ||
      !["correct", "incorrect"].includes(String(a.selfGrade))
    )
      return null;
    points = 15;
  } else if (q.type === "matching" || q.type === "fillblank") {
    if (typeof answer !== "object" || a.submitted !== true) return null;
    if (
      q.type === "fillblank" &&
      (!Array.isArray(a.inputs) ||
        a.inputs.some((v) => typeof v !== "string" || v.length > 2000))
    )
      return null;
    if (
      q.type === "matching" &&
      (!Array.isArray(a.scrambled) ||
        a.scrambled.some((v) => typeof v !== "string") ||
        !a.matches ||
        typeof a.matches !== "object")
    )
      return null;
    points = 10;
  } else return null;
  return { correct: checkAnswerCorrect(q, answer), points };
}

export interface LearningXpHint {
  questionId: string;
  points: number;
}

/** Build local feedback for each committed and correct case part or standalone answer. */
export function learningXpHints(question: LearningQuestion & { id: string | number }, answer: unknown): LearningXpHint[] {
  const id = String(question.id);
  if (question.type === "case" || question.type === "casestudy") {
    if (!answer || typeof answer !== "object") return [];
    const parts = answer as Record<string, unknown>;
    return (question.subQuestions ?? []).flatMap((part) => {
      const grade = gradeLearningAnswer(part, parts[part.id]);
      return grade?.correct ? [{ questionId: id + "/" + part.id, points: grade.points }] : [];
    });
  }
  const grade = gradeLearningAnswer(question, answer);
  return grade?.correct ? [{ questionId: id, points: grade.points }] : [];
}
