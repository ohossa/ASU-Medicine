import { it, expect } from "vitest";
import { moduleProgress } from "../../app/learning/progress";
import type { Question } from "../../app/types";
const q = { id: "q", type: "truefalse" } as Question;
it("counts unique answered questions, ignores deleted and other-year entries, and separates self-grades", () => {
  const base = {
    moduleCode: "MGL-3",
    chapterId: 1,
    questionId: "q",
    topic: "Oral",
    subject: "Histology",
    correct: true,
    everCorrect: true,
    at: "now",
    type: "truefalse",
  };
  expect(
    moduleProgress(
      "MGL-3",
      [q],
      [
        base,
        { ...base, moduleCode: "MEM-2" },
        { ...base, questionId: "deleted" },
        { ...base, questionId: "q/essay", type: "essay", correct: false },
      ],
    ),
  ).toMatchObject({ attempted: 1, total: 1, accuracy: 100 });
});
