export const REPORT_CATEGORIES = {
  wrong_answer: { en: "Wrong answer", ar: "إجابة غير صحيحة" },
  unclear_wording: { en: "Unclear wording", ar: "صياغة غير واضحة" },
  missing_image: { en: "Missing image", ar: "صورة مفقودة" },
  duplicate: { en: "Duplicate question", ar: "سؤال مكرر" },
  formatting: { en: "Formatting issue", ar: "مشكلة في التنسيق" },
  other: { en: "Something else", ar: "سبب آخر" },
} as const;
export type ReportCategory = keyof typeof REPORT_CATEGORIES;
export const REPORT_STATUSES = [
  "new",
  "reviewing",
  "fixed",
  "dismissed",
] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];
export interface QuestionSnapshot {
  moduleCode: string;
  chapterId: number;
  chapterTitle: string;
  subjectName: string;
  version: string;
  question: {
    id: string | number;
    text?: string;
    question?: string;
    type: string;
    options?: string[];
    correctIndex?: number;
    explanation?: string;
    modelAnswer?: string;
    [key: string]: unknown;
  };
}
/** Identity captured from Clerk on the server at report submission time. */
export interface ReporterProfile {
  name: string | null;
  username: string | null;
  email: string | null;
  emailVerified: boolean;
}
export interface QuestionReport {
  id: string;
  requestHash: string;
  reporterId: string;
  reporter?: ReporterProfile; // Older stored reports may lack this snapshot.
  category: ReportCategory;
  explanation: string;
  subQuestionId?: string;
  snapshot: QuestionSnapshot;
  status: ReportStatus;
  notes: string;
  revision: number;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  notification: {
    state: "pending" | "sent" | "failed" | "unconfigured";
    providerId?: string;
  };
}
export interface ReportList {
  reports: QuestionReport[];
  total: number;
  counts: Record<ReportStatus, number>;
}
export interface ReportSubmission {
  requestId: string;
  moduleCode: string;
  chapterId: number;
  questionId: string;
  subQuestionId?: string;
  category: ReportCategory;
  explanation: string;
}
