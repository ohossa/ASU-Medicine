export interface ReplyDraft {
  reportId: string;
  subject: string;
  body: string;
  revision: number;
  updatedAt: string;
  updatedBy: string;
}
export interface ReportReply {
  id: string;
  requestId?: string;
  reportId: string;
  to: string;
  subject: string;
  body: string;
  createdAt: string;
  createdBy: string;
  from?: string;
  state: "pending" | "accepted" | "uncertain";
  providerId?: string;
}
export interface ReplyConversation {
  draft?: ReplyDraft | null;
  replies: ReportReply[];
  recipient: string | null;
  configured: boolean;
}
