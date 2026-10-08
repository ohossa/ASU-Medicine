import { REPORT_STATUSES, type QuestionReport, type ReportGroup, type ReportList, type ReportStatus } from '../src/app/reports/contracts.js';
export interface InboxQuery {
  status?: string;
  search?: string;
  moduleCode?: string;
  subjectName?: string;
  chapterId?: number;
  topicName?: string;
  groupBy?: 'report' | 'question';
  offset?: number;
}
const normalize = (text: string) => text.normalize('NFKC').toLocaleLowerCase().trim();
/** Owner-only query projection. Never mutates or combines stored report records. */
export function queryReportInbox(records: QuestionReport[], query: InboxQuery): ReportList {
  const reports = [...new Map(records.map(r => [r.id, r])).values()]
    .sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  const counts = Object.fromEntries(REPORT_STATUSES.map(s => [s, reports.filter(r => r.status === s).length])) as Record<ReportStatus, number>;
  const moduleReports = reports.filter(r => !query.moduleCode || r.snapshot.moduleCode === query.moduleCode);
  const subjectReports = moduleReports.filter(r => !query.subjectName || r.snapshot.subjectName === query.subjectName);
  const chapters = new Map(subjectReports.map(r => [r.snapshot.chapterId, {id:r.snapshot.chapterId,title:r.snapshot.chapterTitle}]));
  const facets = {
    topics: [...new Set(subjectReports.filter(r=>query.chapterId===undefined || r.snapshot.chapterId===query.chapterId).map(r=>r.snapshot.topicName).filter((v):v is string=>Boolean(v)))].sort(),
    modules: [...new Set(reports.map(r => r.snapshot.moduleCode))].sort(),
    subjects: [...new Set(moduleReports.map(r => r.snapshot.subjectName))].sort(),
    chapters: [...chapters.values()].sort((a,b) => a.title.localeCompare(b.title)),
  };
  const search = normalize(query.search || '');
  const filtered = subjectReports.filter(r => {
    if (query.topicName && r.snapshot.topicName !== query.topicName) return false;
    if (query.chapterId !== undefined && r.snapshot.chapterId !== query.chapterId) return false;
    if (query.status === 'unresolved' && r.status !== 'new' && r.status !== 'reviewing') return false;
    if (query.status && query.status !== 'all' && query.status !== 'unresolved' && r.status !== query.status) return false;
    const question = r.snapshot.question;
    const haystack = [r.id, r.reporterId, r.reporter?.name, r.reporter?.username, r.reporter?.email,
      r.snapshot.moduleCode, r.snapshot.chapterTitle, r.snapshot.subjectName, r.snapshot.topicName, String(question.id),
      question.text, question.question, r.explanation, r.notes, r.category.replaceAll('_', ' '),
    ].filter(Boolean).join(' ');
    return !search || normalize(haystack).includes(search);
  });
  const offset = query.offset ?? 0;
  if (query.groupBy !== 'question') return { reports: filtered.slice(offset, offset+25), total: filtered.length, counts, facets, filteredReportCount: filtered.length };
  const groups = new Map<string, ReportGroup>();
  for (const report of filtered) {
    const key = JSON.stringify([report.snapshot.moduleCode, report.snapshot.chapterId, String(report.snapshot.question.id)]);
    const group = groups.get(key) ?? {key, reports:[], reportCount:0, reporterCount:0, unresolvedCount:0};
    group.reports.push(report); groups.set(key, group);
  }
  const all = [...groups.values()].map(g => ({...g, reportCount:g.reports.length,
    reporterCount:new Set(g.reports.map(r => r.reporterId)).size,
    unresolvedCount:g.reports.filter(r => r.status === 'new' || r.status === 'reviewing').length,
  }));
  const page = all.slice(offset, offset+25);
  return {reports: page.flatMap(g=>g.reports), groups:page, total:all.length, counts, facets, filteredReportCount:filtered.length};
}
