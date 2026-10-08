import { it, expect } from "vitest";
import { summarizeReports } from "../../../server/report-overview";
import type { QuestionReport } from "../../app/reports/contracts";
const report = (
  id: string,
  q: string,
  user: string,
  status: QuestionReport["status"] = "new",
): QuestionReport => ({
  id,
  requestHash: id,
  reporterId: user,
  category: "wrong_answer",
  explanation: "",
  status,
  notes: "",
  revision: 1,
  createdAt: "2026-10-08T10:00:00Z",
  updatedAt: "2026-10-08T10:00:00Z",
  notification: { state: "unconfigured" },
  snapshot: {
    moduleCode: "MGL-3",
    chapterId: 1,
    chapterTitle: "Anatomy",
    subjectName: "Tongue",
    version: "v",
    question: { id: q, type: "mcq", text: "42. Which nerve?" },
  },
});
it("counts the full deduplicated backlog and prioritizes distinct students over repeated reports", () => {
  const a = report("a", "Q1", "student1");
  const rows = [
    a,
    a,
    report("b", "Q1", "student1"),
    report("c", "Q1", "student1"),
    report("d", "Q2", "student2"),
    report("e", "Q2", "student3", "reviewing"),
    report("f", "Q3", "student4", "fixed"),
  ];
  const before = JSON.stringify(rows),
    out = summarizeReports(rows);
  expect(out.total).toBe(6);
  expect(out.unresolved).toBe(5);
  expect(out.unresolvedQuestions).toBe(2);
  expect(out.priorityQuestions[0].questionId).toBe("Q2");
  expect(out.priorityQuestions[0].reporterCount).toBe(2);
  expect(out.priorityQuestions[1].unresolvedCount).toBe(3);
  expect(JSON.stringify(rows)).toBe(before);
});
it("keeps identical IDs from different modules or chapters separate and bounds the priority list", () => {
  const rows = Array.from({ length: 40 }, (_, i) => ({
    ...report(String(i), "Q1", String(i)),
    snapshot: { ...report("x", "Q1", "x").snapshot, chapterId: i },
  }));
  const out = summarizeReports(rows);
  expect(out.unresolvedQuestions).toBe(40);
  expect(out.priorityQuestions).toHaveLength(8);
});
it("returns real zero counts for an empty inbox", () => {
  expect(summarizeReports([])).toMatchObject({
    total: 0,
    unresolved: 0,
    unresolvedQuestions: 0,
    priorityQuestions: [],
  });
});
