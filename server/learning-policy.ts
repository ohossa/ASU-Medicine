import { createHash } from "node:crypto";
import type { QuestionSnapshot } from "../src/app/reports/contracts.js";
import type { Question } from "../src/app/types.js";
import { gradeLearningAnswer } from "../src/app/learning/learningAnswerGrade.js";
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
  const grade = gradeLearningAnswer(q, answer);
  if (!grade) return null;
  const { correct, points } = grade;
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
