import type { LearningEntry } from "./contracts";
import type { Question } from "../types";
export function moduleProgress(
  moduleCode: string,
  questions: Question[],
  entries: LearningEntry[],
) {
  const ids = new Set(questions.map((q) => String(q.id)));
  const eligible = entries.filter(
    (e) =>
      e.moduleCode === moduleCode &&
      [...ids].some(
        (id) => e.questionId === id || e.questionId.startsWith(id + "/"),
      ),
  );
  const latest = new Map<string, LearningEntry>();
  for (const e of eligible) {
    const old = latest.get(e.questionId);
    if (!old || (Date.parse(e.at) || 0) > (Date.parse(old.at) || 0))
      latest.set(e.questionId, e);
  }
  const valid = [...latest.values()];
  const parentId = (id: string) =>
    [...ids]
      .filter((p) => id === p || id.startsWith(p + "/"))
      .sort((a, b) => b.length - a.length)[0]!;
  const attempted = new Set(valid.map((e) => parentId(e.questionId))).size;
  const objective = valid.filter((e) => e.type !== "essay");
  const correct = objective.filter((e) => e.correct).length;
  const topics = new Map<
    string,
    { name: string; subject: string; attempted: number; correct: number }
  >();
  for (const e of objective) {
    const k = e.subject + "|" + e.topic,
      t = topics.get(k) ?? {
        name: e.topic,
        subject: e.subject,
        attempted: 0,
        correct: 0,
      };
    t.attempted++;
    if (e.correct) t.correct++;
    topics.set(k, t);
  }
  return {
    attempted,
    total: ids.size,
    everCorrect: new Set(
      objective.filter((e) => e.everCorrect).map((e) => parentId(e.questionId)),
    ).size,
    firstCount: objective.filter((e) => typeof e.firstCorrect === "boolean")
      .length,
    firstAccuracy: objective.some((e) => typeof e.firstCorrect === "boolean")
      ? Math.round(
          (100 * objective.filter((e) => e.firstCorrect === true).length) /
            objective.filter((e) => typeof e.firstCorrect === "boolean").length,
        )
      : null,
    accuracy: objective.length
      ? Math.round((correct / objective.length) * 100)
      : null,
    weak: [...topics.values()]
      .filter((t) => t.attempted >= 5 && t.correct / t.attempted < 0.7)
      .sort((a, b) => a.correct / a.attempted - b.correct / b.attempted),
    missed: objective.filter((e) => !e.correct),
  };
}
