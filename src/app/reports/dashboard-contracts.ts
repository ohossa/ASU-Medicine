import type { ReportStatus } from "./contracts.js";
export interface PriorityQuestion {
  key: string;
  moduleCode: string;
  chapterId: number;
  chapterTitle: string;
  subjectName: string;
  topicName?: string;
  questionId: string;
  text: string;
  reportId: string;
  unresolvedCount: number;
  reporterCount: number;
  latestAt: string;
}
export interface ReportOverview {
  total: number;
  counts: Record<ReportStatus, number>;
  unresolved: number;
  unresolvedQuestions: number;
  priorityQuestions: PriorityQuestion[];
}
export interface TutorQuota {
  observedAt: string;
  requestLimit: number | null;
  remainingRequests: number | null;
  tokenLimit: number | null;
  remainingTokens: number | null;
}
export interface TutorUsage {
  day: string;
  timezone: "Africa/Cairo";
  provider: "groq";
  requests: number;
  successes: number;
  failures: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  quota: TutorQuota | null;
  recordedSince: string | null;
}
export interface AdminOverview {
  reports: ReportOverview;
  tutor: TutorUsage | null;
  tutorError?: string;
}
