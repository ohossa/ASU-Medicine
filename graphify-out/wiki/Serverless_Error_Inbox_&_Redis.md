# Serverless Error Inbox & Redis

> 50 nodes

## Key Concepts

- **reports/contracts.ts** (40 connections) — `src/app/reports/contracts.ts`
- **report-service.ts** (37 connections) — `server/report-service.ts`
- **QuestionReport** (30 connections) — `src/app/reports/contracts.ts`
- **report-question.ts** (12 connections) — `server/report-question.ts`
- **report-inbox.ts** (11 connections) — `server/report-inbox.ts`
- **report-overview.ts** (10 connections) — `server/report-overview.ts`
- **createReportService()** (9 connections) — `server/report-service.ts`
- **review-context.ts** (8 connections) — `src/app/reports/review-context.ts`
- **ReportStore** (7 connections) — `server/report-service.ts`
- **ReportStatus** (7 connections) — `src/app/reports/contracts.ts`
- **review-context.test.ts** (7 connections) — `src/test/reports/review-context.test.ts`
- **REPORT_CATEGORIES** (6 connections) — `src/app/reports/contracts.ts`
- **REPORT_STATUSES** (6 connections) — `src/app/reports/contracts.ts`
- **inbox.test.ts** (6 connections) — `src/test/reports/inbox.test.ts`
- **overview.test.ts** (6 connections) — `src/test/reports/overview.test.ts`
- **question.test.ts** (6 connections) — `src/test/reports/question.test.ts`
- **Dependencies** (5 connections) — `server/report-service.ts`
- **ReportList** (5 connections) — `src/app/reports/contracts.ts`
- **ReportSubmission** (5 connections) — `src/app/reports/contracts.ts`
- **queryReportInbox()** (5 connections) — `server/report-inbox.ts`
- **service.test.ts** (5 connections) — `src/test/reports/service.test.ts`
- **Identity** (4 connections) — `server/report-service.ts`
- **summarizeReports()** (4 connections) — `server/report-overview.ts`
- **replyTemplate()** (4 connections) — `src/app/reports/review-context.ts`
- **reviewContext()** (4 connections) — `src/app/reports/review-context.ts`
- *... and 25 more nodes in this community*

## Relationships

- [Bank Question Edit](Bank_Question_Edit.md) (18 shared connections)
- [Report Question Email](Report_Question_Email.md) (13 shared connections)
- [Triage Report Lease](Triage_Report_Lease.md) (12 shared connections)
- [Reply Report Replies](Reply_Report_Replies.md) (12 shared connections)
- [Client Adminoverviewpanel Adminportal](Client_Adminoverviewpanel_Adminportal.md) (11 shared connections)
- [Community 46](Community_46.md) (7 shared connections)
- [Community 114](Community_114.md) (7 shared connections)
- [Tutor Metrics Bounded](Tutor_Metrics_Bounded.md) (5 shared connections)
- [Intake Verification Reports & Audits](Intake_Verification_Reports_&_Audits.md) (5 shared connections)
- [Useacademicyear Usesearchindex Questionsearch](Useacademicyear_Usesearchindex_Questionsearch.md) (3 shared connections)
- [Chapter Selection & Flow Breadcrumbs](Chapter_Selection_&_Flow_Breadcrumbs.md) (2 shared connections)
- [Files Dedupe Blocks](Files_Dedupe_Blocks.md) (1 shared connections)

## Source Files

- `server/report-inbox.ts`
- `server/report-overview.ts`
- `server/report-question.ts`
- `server/report-service.ts`
- `src/app/reports/contracts.ts`
- `src/app/reports/dashboard-contracts.ts`
- `src/app/reports/review-context.ts`
- `src/test/reports/inbox.test.ts`
- `src/test/reports/overview.test.ts`
- `src/test/reports/question.test.ts`
- `src/test/reports/review-context.test.ts`
- `src/test/reports/service.test.ts`

## Audit Trail

- EXTRACTED: 195 (100%)
- INFERRED: 0 (0%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*