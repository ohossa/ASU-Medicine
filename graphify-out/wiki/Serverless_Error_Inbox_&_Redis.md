# Serverless Error Inbox & Redis

> 58 nodes

## Key Concepts

- **reports/contracts.ts** (40 connections) — `src/app/reports/contracts.ts`
- **report-service.ts** (37 connections) — `server/report-service.ts`
- **QuestionReport** (30 connections) — `src/app/reports/contracts.ts`
- **report-store.ts** (23 connections) — `server/report-store.ts`
- **report-inbox.ts** (11 connections) — `server/report-inbox.ts`
- **report-overview.ts** (10 connections) — `server/report-overview.ts`
- **dashboard-contracts.ts** (10 connections) — `src/app/reports/dashboard-contracts.ts`
- **createReportService()** (9 connections) — `server/report-service.ts`
- **review-context.ts** (8 connections) — `src/app/reports/review-context.ts`
- **ReportStore** (7 connections) — `server/report-service.ts`
- **ReportStatus** (7 connections) — `src/app/reports/contracts.ts`
- **review-context.test.ts** (7 connections) — `src/test/reports/review-context.test.ts`
- **REPORT_STATUSES** (6 connections) — `src/app/reports/contracts.ts`
- **inbox.test.ts** (6 connections) — `src/test/reports/inbox.test.ts`
- **overview.test.ts** (6 connections) — `src/test/reports/overview.test.ts`
- **store.test.ts** (6 connections) — `src/test/reports/store.test.ts`
- **Dependencies** (5 connections) — `server/report-service.ts`
- **ReportList** (5 connections) — `src/app/reports/contracts.ts`
- **queryReportInbox()** (5 connections) — `server/report-inbox.ts`
- **service.test.ts** (5 connections) — `src/test/reports/service.test.ts`
- **Identity** (4 connections) — `server/report-service.ts`
- **summarizeReports()** (4 connections) — `server/report-overview.ts`
- **replyTemplate()** (4 connections) — `src/app/reports/review-context.ts`
- **reviewContext()** (4 connections) — `src/app/reports/review-context.ts`
- **ioredis** (4 connections) — `package.json`
- *... and 33 more nodes in this community*

## Relationships

- [Report Question Email](Report_Question_Email.md) (21 shared connections)
- [Triage Report Lease](Triage_Report_Lease.md) (16 shared connections)
- [Bank Question Edit](Bank_Question_Edit.md) (14 shared connections)
- [Reply Report Replies](Reply_Report_Replies.md) (14 shared connections)
- [Client Adminoverviewpanel Adminportal](Client_Adminoverviewpanel_Adminportal.md) (12 shared connections)
- [Learning Service Policy](Learning_Service_Policy.md) (7 shared connections)
- [Chapter Selection & Flow Breadcrumbs](Chapter_Selection_&_Flow_Breadcrumbs.md) (5 shared connections)
- [Tutor Metrics Bounded](Tutor_Metrics_Bounded.md) (4 shared connections)
- [Flagged Questions & Results UI](Flagged_Questions_&_Results_UI.md) (2 shared connections)
- [React Eslint Plugin](React_Eslint_Plugin.md) (2 shared connections)
- [Generatehint Constructor Hint](Generatehint_Constructor_Hint.md) (2 shared connections)
- [Sync Dbclient Handler](Sync_Dbclient_Handler.md) (2 shared connections)

## Source Files

- `package.json`
- `server/report-inbox.ts`
- `server/report-overview.ts`
- `server/report-service.ts`
- `server/report-store.ts`
- `src/app/reports/contracts.ts`
- `src/app/reports/dashboard-contracts.ts`
- `src/app/reports/review-context.ts`
- `src/test/reports/inbox.test.ts`
- `src/test/reports/overview.test.ts`
- `src/test/reports/review-context.test.ts`
- `src/test/reports/service.test.ts`
- `src/test/reports/store.test.ts`

## Audit Trail

- EXTRACTED: 212 (100%)
- INFERRED: 0 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*