# D1 Read Budget Implementation Plan

**Goal** Reduce the ASU portal's routine D1 reads while preserving authoritative XP, complete learning history, and owner-only analytics.

**Baseline** Cloudflare showed 4.25 million reads by 5:02 p.m. Cairo on November 27. Routine XP reconciliation and dashboard history contributed 3.82 million combined. The November 26 total was 6.15 million in D1 Analytics. November 20 also showed a separate burst of admin aggregation and backup reads.

## 1. Database and verification

- Add an additive migration for the XP reconciliation flag and an indexed, database-ordered entry change feed. Provide the award lookup index as a separate, optional migration. Apply it to an existing-schema fixture and validate on the schema for new installs.
- Keep one latest revision per entry, including deletions. Track inserts and visible changes from any writer. Verify stable revisions for no-op writes, bounded feed size, indexes in query plans, and isolation between accounts.
- Measure reads and writes. The Free allowance is 5 million reads and 100,000 writes per UTC day. The production table had 76,998 entries at preflight. Creating the award lookup index would consume about 77,000 writes before ordinary traffic. Keep that migration out of the Free-tier rollout unless there is enough capacity for both. Fresh databases can create the index before data arrives.

## 2. XP and student dashboard

- Reconcile profiles once on first use after migration. Keep recovery for missing profiles and permit targeted rechecks. Preserve higher stored totals and level.
- Commit answer entries and their corresponding profile update as one D1 transaction. Verify a repeated correct answer, concurrent submissions, rollback on an entry write error, and independent profile settings changes.
- Keep the existing full response for older clients. New clients use an account-bound local snapshot and a D1 cursor to request changed entries and deletions. Rebuild from a full response when the cursor is invalid. Check cold start, account switches, retakes, cross-device changes, no-change responses and legacy fallback.

## 3. Owner analytics

- Move expensive learning aggregations behind the existing daily maintenance job. Read the last successful private snapshot after checking owner access. Verify that repeat reads avoid a D1 aggregation and a failed refresh preserves the previous snapshot.
- Keep the backup job available. Track its separate read budget alongside the recurring learning queries.

## 4. Release and rollback

- Run migration and concurrency fixtures, focused tests, typecheck, and production build in the isolated worktree. Preserve the current production branch and question-bank edits.
- Before releasing, capture account usage and confirm room for the additive migration and the write overhead. Apply `server/d1-migrations/20261127-learning-read-budget.sql` before the app and verify the new flag, feed index and triggers. The optional `server/d1-optional-migrations/20261127-learning-award-index.sql` is a separate operation.

- Seed the first admin snapshot before routing owner traffic to the new build. In an authorized environment with the production project credentials loaded, run `npx tsx -e 'import { refreshAdminLearningSnapshot } from "./server/admin-learning-snapshot.ts"; refreshAdminLearningSnapshot().then(console.log).catch(error => { console.error(error); process.exitCode = 1; })'`. The existing job then refreshes it daily at 01:00 UTC after the backup.
- Leave the award lookup index out if the write quota is tight. Add it later when it can be built while leaving enough room for normal traffic. Check `EXPLAIN QUERY PLAN` and D1 write totals after adding it.
- After release, exercise an authenticated student account on two clients and the owner analytics route. Compare total rows and dominant query volumes over a full UTC day and check both read and write allowances. If a release must be reverted, the old application can run with the additive schema. A point-in-time database restore can reuse revisions. Bump the server cursor prefix before serving traffic from the restored database so clients reload full history. The JSON backup restore adds rows through the feed triggers and marks affected profiles for XP reconciliation.

## Production preflight

- Production returned HTTP 500 from the maintenance route because its Vercel deployment had no `CRON_SECRET`. Set a Production-only Vercel Secret before building the deployment. After cutover, requests without it must return 401. Check the first scheduled run's status for both analytics and backups.
- The initial snapshot was built from one bounded D1 scan and verified by reading it back from R2. It counted 77,011 learning entries and used 77,011 D1 reads.
- The core migration wrote eight D1 rows and installed the reconciliation flag, change feed and three triggers. The production query planner uses the change-feed index for cursor reads. The optional large award index is deferred.
- The production baseline had a stale MUG-3 manifest test expectation. The release checks the generated manifest against the actual bank bytes and preserves the existing count assertions.
