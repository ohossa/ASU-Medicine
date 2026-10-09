import { it, expect, vi } from "vitest";
vi.mock("../../../server/question-edit-store", () => ({
  editStore: { list: async () => [] },
}));
import { learningBank } from "../../../server/learning-bank";
it("resolves actual GIT canonical IDs, chapters and all true/false keys without client metadata", async () => {
  const bank = await learningBank("MGL-3");
  expect(bank.size).toBeGreaterThan(6000);
  const tf = [...bank.values()].filter((s) => s.question.type === "truefalse");
  expect(tf).toHaveLength(325);
  expect(tf.every((s) => [0, 1].includes(s.question.correctIndex!))).toBe(true);
});
