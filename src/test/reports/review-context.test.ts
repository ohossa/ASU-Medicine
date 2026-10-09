import { it, expect } from "vitest";
import { reviewContext, replyTemplate } from "../../app/reports/review-context";
import type { QuestionReport } from "../../app/reports/contracts";
const report = {
  id: "r_1",
  reporterId: "private-user",
  reporter: { name: "Private Student", email: "private@example.com" },
  category: "other",
  explanation: "The wording is confusing.\nCould you check option B?",
  notes: "Private owner notes",
  snapshot: {
    moduleCode: "IBM-1",
    chapterId: 1,
    chapterTitle: "Proteins",
    subjectName: "Biochemistry",
    version: "v1",
    question: {
      id: "q1",
      type: "mcq",
      text: "Which molecule?",
      options: ["First", "Second"],
      correctIndex: 1,
      explanation: "Second is the answer.",
    },
  },
} as QuestionReport;
it("copies the exact student text and question key but omits account metadata and private notes", () => {
  const text = reviewContext(report);
  expect(text).toContain(report.explanation);
  expect(text).toContain("B. Second");
  expect(text).toContain("Correct answer: B. Second");
  expect(text).not.toContain("private@example.com");
  expect(text).not.toContain("Private Student");
  expect(text).not.toContain("private-user");
  expect(text).not.toContain(report.notes);
});
it("templates do not invent medical reasoning or claim unsaved changes", () => {
  expect(replyTemplate("correct", report)).toContain("[Explain");
  expect(replyTemplate("fixed", report)).toContain("[Describe");
  expect(replyTemplate("clarify", report)).toContain("[Ask");
});
