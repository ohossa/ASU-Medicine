import { it, expect } from "vitest";
import { contentRevision } from "./contentRevision";
it("preserves a revision after chapter movement but changes it when the assessment key changes", async () => {
  const q = { id: "q", type: "mcq", text: "Stem", correctIndex: 0, lecture: 1 };
  expect(await contentRevision(q)).toBe(
    await contentRevision({
      ...q,
      lecture: 9,
      sourceOccurrences: [{ page: 9 }],
    }),
  );
  expect(await contentRevision(q)).not.toBe(
    await contentRevision({ ...q, correctIndex: 1 }),
  );
});
