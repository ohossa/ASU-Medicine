import { it, expect } from "vitest";
import { learningXpHints } from "../../app/learning/learningAnswerGrade";
import { prepareReward, weekKey } from "../../../server/learning-policy";
const snapshot = (type = "truefalse", index = 0) => ({
  moduleCode: "MGL-3",
  chapterId: 1,
  chapterTitle: "Histology",
  subjectName: "Histology",
  topicName: "Oral cavity",
  version: "v",
  question: {
    id: "q",
    text: "42. Statement",
    type,
    correctIndex: index,
    options: ["True", "False"],
  },
});
it("grades boolean answers and gives true/false competitive points", () => {
  expect(prepareReward(snapshot(), true)).toMatchObject({
    personal: 5,
    competitive: 5,
    correct: true,
  });
  expect(prepareReward(snapshot(), false)).toMatchObject({
    personal: 0,
    competitive: 0,
    correct: false,
  });
});
it("gives self-graded essays personal XP only", () => {
  expect(
    prepareReward(snapshot("essay"), {
      text: "This is a sufficiently detailed essay response.",
      selfGrade: "correct",
    }),
  ).toMatchObject({ personal: 15, competitive: 0 });
});
it("uses the same reward identity for duplicate content despite source numbering or IDs", () => {
  const a = snapshot(),
    b = snapshot();
  b.question.id = "other";
  b.question.text = "9. Statement";
  expect(prepareReward(a, true)?.identity).toBe(
    prepareReward(b, true)?.identity,
  );
});
it("fails closed on absent keys and malformed/unanswered selections", () => {
  expect(
    prepareReward(
      {
        ...snapshot(),
        question: { ...snapshot().question, correctIndex: undefined },
      },
      true,
    ),
  ).toBeNull();
  expect(prepareReward(snapshot(), "true")).toBeNull();
  expect(prepareReward(snapshot(), undefined)).toBeNull();
});
it("sets Cairo Monday week boundaries", () => {
  expect(weekKey(new Date("2026-10-11T22:30:00Z"))).toBe("2026-10-12");
});

it("previews XP for committed case parts independently with the same reward rules as the server", () => {
  const question = {
    id: "case-1",
    type: "case" as const,
    subQuestions: [
      { id: "mcq", text: "Choose one", explanation: "", type: "mcq" as const, options: ["A", "B"], correctIndex: 1 },
      { id: "essay", text: "Explain", explanation: "", type: "essay" as const },
      { id: "blank", text: "Complete", explanation: "", type: "fillblank" as const, blanks: ["correct"] },
    ],
  };
  const answer = {
    mcq: 1,
    essay: { text: "This is long enough to be graded.", selfGrade: "correct" },
    blank: { inputs: ["correct"], submitted: false },
  };
  expect(learningXpHints(question, answer)).toEqual([
    { questionId: "case-1/mcq", points: 10 },
    { questionId: "case-1/essay", points: 15 },
  ]);
  expect(learningXpHints(question, { mcq: 0, essay: { text: "short", selfGrade: "correct" } })).toEqual([]);
});
