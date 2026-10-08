import type {
  QuestionReport,
  ReportStatus,
} from "../src/app/reports/contracts.js";
import { REPORT_STATUSES } from "../src/app/reports/contracts.js";
import type {
  PriorityQuestion,
  ReportOverview,
} from "../src/app/reports/dashboard-contracts.js";
export function summarizeReports(records: QuestionReport[]): ReportOverview {
  const reports = [...new Map(records.map((r) => [r.id, r])).values()].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt),
  );
  const counts = Object.fromEntries(
    REPORT_STATUSES.map((s) => [
      s,
      reports.filter((r) => r.status === s).length,
    ]),
  ) as Record<ReportStatus, number>;
  const pending = reports.filter(
    (r) => r.status === "new" || r.status === "reviewing",
  );
  const groups = new Map<
    string,
    { item: PriorityQuestion; reporters: Set<string> }
  >();
  for (const r of pending) {
    const s = r.snapshot,
      key = JSON.stringify([s.moduleCode, s.chapterId, String(s.question.id)]);
    const group = groups.get(key) ?? {
      item: {
        key,
        moduleCode: s.moduleCode,
        chapterId: s.chapterId,
        chapterTitle: s.chapterTitle,
        subjectName: s.subjectName,
        topicName: s.topicName,
        questionId: String(s.question.id),
        text: s.question.text || s.question.question || "",
        reportId: r.id,
        unresolvedCount: 0,
        reporterCount: 0,
        latestAt: r.createdAt,
      },
      reporters: new Set<string>(),
    };
    group.item.unresolvedCount++;
    group.reporters.add(r.reporterId);
    groups.set(key, group);
  }
  const priorityQuestions = [...groups.values()]
    .map((g) => ({ ...g.item, reporterCount: g.reporters.size }))
    .sort(
      (a, b) =>
        b.reporterCount - a.reporterCount ||
        b.unresolvedCount - a.unresolvedCount ||
        b.latestAt.localeCompare(a.latestAt) ||
        a.key.localeCompare(b.key),
    )
    .slice(0, 8);
  return {
    total: reports.length,
    counts,
    unresolved: pending.length,
    unresolvedQuestions: groups.size,
    priorityQuestions,
  };
}
