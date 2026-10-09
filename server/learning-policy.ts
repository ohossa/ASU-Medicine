import { createHash } from "node:crypto";
import type { QuestionSnapshot } from "../src/app/reports/contracts.js";
import type { Question } from "../src/app/types.js";
import { checkAnswerCorrect } from "../src/app/utils/quiz.js";
export function cairoDay(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
export function weekKey(date = new Date()) {
  const day = cairoDay(date),
    d = new Date(day + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}
export function prepareReward(snapshot: QuestionSnapshot, answer: unknown) {
  const raw = snapshot.question;
  const q = {
    ...raw,
    text: raw.text ?? raw.question ?? "",
  } as unknown as Question;
  if (
    q.correctIndex === undefined &&
    typeof raw.correctAnswer === "string" &&
    /^[A-Z]$/i.test(raw.correctAnswer)
  )
    q.correctIndex = raw.correctAnswer.toUpperCase().charCodeAt(0) - 65;
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
  const correct = checkAnswerCorrect(q, answer);
  const text = q.text
    .replace(/^\s*(?:Q(?:uestion)?\s*)?\d+[.)\-:]\s*/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  const identity = createHash("sha256")
    .update(
      JSON.stringify([
        snapshot.moduleCode,
        q.type,
        text,
        [...(q.options ?? [])].map((s) => s.trim().toLowerCase()).sort(),
        q.pairs ?? q.blanks ?? [],
      ]),
    )
    .digest("hex");
  return {
    identity,
    contentVersion: snapshot.version,
    personal: correct ? points : 0,
    competitive: correct && q.type !== "essay" ? points : 0,
    correct,
    type: q.type,
    moduleCode: snapshot.moduleCode,
    chapterId: snapshot.chapterId,
    questionId: String(raw.id),
    topic: snapshot.topicName ?? snapshot.chapterTitle,
    subject: snapshot.subjectName,
  };
}
