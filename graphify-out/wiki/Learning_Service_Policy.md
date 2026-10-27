# Learning Service Policy

> 27 nodes

## Key Concepts

- **learning.ts** (20 connections) — `api/learning.ts`
- **learning-store.ts** (18 connections) — `server/learning-store.ts`
- **evalRedis()** (16 connections) — `server/report-store.ts`
- **learning-policy.ts** (13 connections) — `server/learning-policy.ts`
- **learning-service.ts** (13 connections) — `server/learning-service.ts`
- **award()** (9 connections) — `server/learning-store.ts`
- **saveProfile()** (9 connections) — `server/learning-store.ts`
- **dashboard()** (8 connections) — `server/learning-store.ts`
- **weekKey()** (7 connections) — `server/learning-policy.ts`
- **getProfile()** (7 connections) — `server/learning-store.ts`
- **prepareReward()** (6 connections) — `server/learning-policy.ts`
- **createLearningService()** (6 connections) — `server/learning-service.ts`
- **learning-policy.test.ts** (5 connections) — `src/test/reports/learning-policy.test.ts`
- **cairoDay()** (4 connections) — `server/learning-policy.ts`
- **lifetime()** (4 connections) — `server/learning-store.ts`
- **profileKey()** (4 connections) — `server/learning-store.ts`
- **weekly()** (4 connections) — `server/learning-store.ts`
- **learning-service.test.ts** (4 connections) — `src/test/reports/learning-service.test.ts`
- **Dependencies** (3 connections) — `server/learning-service.ts`
- **initialProfile()** (3 connections) — `server/learning-store.ts`
- **account()** (2 connections) — `server/learning-service.ts`
- **setup()** (2 connections) — `src/test/reports/learning-service.test.ts`
- **service** (2 connections) — `api/learning.ts`
- **Req** (1 connections) — `api/learning.ts`
- **Res** (1 connections) — `api/learning.ts`
- *... and 2 more nodes in this community*

## Relationships

- [Bank Question Edit](Bank_Question_Edit.md) (10 shared connections)
- [Serverless Error Inbox & Redis](Serverless_Error_Inbox_&_Redis.md) (7 shared connections)
- [Learning Correctionstatus Facts](Learning_Correctionstatus_Facts.md) (6 shared connections)
- [Flagged Questions & Results UI](Flagged_Questions_&_Results_UI.md) (5 shared connections)
- [Triage Report Lease](Triage_Report_Lease.md) (4 shared connections)
- [Tutor Metrics Bounded](Tutor_Metrics_Bounded.md) (3 shared connections)
- [Report Question Email](Report_Question_Email.md) (2 shared connections)
- [Chapter Selection & Flow Breadcrumbs](Chapter_Selection_&_Flow_Breadcrumbs.md) (2 shared connections)
- [Reply Report Replies](Reply_Report_Replies.md) (1 shared connections)
- [Sync Dbclient Handler](Sync_Dbclient_Handler.md) (1 shared connections)

## Source Files

- `api/learning.ts`
- `server/learning-policy.ts`
- `server/learning-service.ts`
- `server/learning-store.ts`
- `server/report-store.ts`
- `src/test/reports/learning-policy.test.ts`
- `src/test/reports/learning-service.test.ts`

## Audit Trail

- EXTRACTED: 101 (94%)
- INFERRED: 6 (6%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [index](index.md) to navigate.*