> Updated: use [Vercel-only setup](VERCEL_ONLY_ADMIN_SETUP.md). Server keys are no longer requested locally. Production requires the explicit owner ID pin. Creation and reversible removal are now implemented.

# Owner administration and student experience

Implemented locally, 8 October 2026. No GitHub push or production deployment has been performed.

## Use it

- Student site: http://127.0.0.1:5183/
- Report inbox: http://127.0.0.1:5183/admin/reports
- Question studio: http://127.0.0.1:5183/admin/questions
- The owner link is also in the signed-in user menu.
- Enable **Shuffle** in a bank, topic, or quiz header. It applies to new attempts. Saved attempts resume in their original order, even after the preference changes. Options and answer keys are never shuffled independently.
- Report a question while solving, reviewing results, searching, or viewing flagged questions. Choose a reason and optionally explain the issue. Reports preserve the question snapshot at submission time.
- In the inbox, review the report, follow **Edit this question**, publish a correction, then mark the report fixed. Marking a report fixed alone does not edit its question.
- Studio form editing supports prompts, options, correct MCQ/true-false answers, essay model answers, and explanations. The full format editor handles matching, blanks/accepted variants, and case parts. Stable question IDs, part IDs/order, and lecture routing cannot change.
- Saves validate the entire question and require the latest revision number. A conflicting save leaves the draft intact. Revisions can be loaded as drafts and republished; the original source is always retained. Export revisions downloads the complete module audit history.
- Unsaved signed-in editor drafts stay on the current device under that account, with an unload warning. Another account cannot restore them. A draft with an outdated revision is not automatically restored.

## Required server setup

Add these to `.env.local` for development and the hosting environment for production. Never put secrets in a `VITE_` variable, Git, or chat.

```dotenv
CLERK_SECRET_KEY=<server key for the same Clerk instance as the client>
# Use one storage option:
REDIS_URL=<durable Redis connection>
# Or:
UPSTASH_REDIS_REST_URL=<Upstash REST URL>
UPSTASH_REDIS_REST_TOKEN=<Upstash REST token>
# Optional: pin to the owner Clerk user ID for additional account binding.
REPORT_ADMIN_USER_ID=<your Clerk user ID>
# Production default; add an explicitly trusted preview origin if needed.
REPORT_ALLOWED_ORIGINS=https://asu.codes,https://www.asu.codes
```

Verified owner email: **omarhmaged@gmail.com**. Every administrative endpoint checks Clerk on the server and requires this verified email. If a user-ID pin is configured, both email and ID must match. Students cannot read private reports, histories, or edit questions. The client menu is only a convenience; it grants no authorization.

Restart the local server after editing environment variables. Vite now executes the actual API handlers locally, including authentication. It adds its loopback development origins only during local serving. No authentication bypass or mock admin account is installed.

Optional email notifications use the existing reporting service's Resend configuration; the private inbox is authoritative. Notification failures do not erase reports or pretend that email was delivered.

## Storage and publication

- Reports: `asu_reports:v1:*`, durable, separate from progress.
- Question corrections: `asu_question_edits:v1:*`, durable Redis records and immutable revision history; no expiry. Atomic Lua saves check/increment revisions and write history together.
- Cloud progress: `asu_data:<Clerk user ID>:*`. Sync merges deltas; only explicit nulls delete a key. Unrelated saved keys survive preference updates.
- Shuffle: account-scoped local setting, timestamp conflict resolution during cloud pull, durable cloud preference without progress's 30-day TTL. It works locally immediately; cross-device persistence needs configured cloud storage.
- Published corrections expose question content and source fingerprints only, never reporter identities, owner audit identities, or notes. The public bank already exposes answers as study material.
- A correction applies only if its source fingerprint, question ID, and lecture still match the deployed source. Outdated overrides are held rather than applied to a changed question.
- Active quiz snapshots remain stable. Saved attempts containing a changed question version cannot resume against different answer keys; start a fresh attempt.
- Corrections are fetched at application startup and after an owner save, with an eight-second timeout. If unavailable, a visible banner and retry button identify that the bundled bank is being used.
- Editing currently covers canonical V2 banks. Legacy V1-only banks are not listed as editable. This is a format limitation, not a claim that every historical bank has been migrated.

## Tests and current verification boundary

Automated checks cover verified-email ownership, optional user-ID pinning, unauthorized reads/writes, report rate limits/idempotency/private snapshots, revision conflicts, invalid keys/IDs/routing, editor error handling, correction fingerprints, changed-question resume protection, account preference isolation, shuffled order restoration, and cloud delta semantics.

Run `npm test` and `npm run build`. Full strict app type checking is `npx tsc --noEmit -p tsconfig.app.json`; the repository has pre-existing diagnostics, recorded separately in `docs/verification/admin-ux-2026-10-08/`. Plain root `tsc --noEmit` does not check referenced projects.

At delivery, this computer still lacks the Clerk secret and Redis credentials. Live authenticated report submission, real Redis transactions, cross-device sync, and an owner edit round trip therefore remain unverified. API requests fail closed with explicit configuration errors. Automated tests use controlled fixtures and do not establish real hosting configuration or medical correctness of answer keys.

## Optimizations applied

- Load independent bank chunks concurrently while preserving registration order.
- Load the question studio only when visiting that admin route.
- Debounce question search and return 25 rows per server page.
- Correct the cloud delta deletion bug and filter account-scoped shuffle/session keys.
- Validate writes, keep drafts and revisions, prevent stale saved-answer reuse, and expose correction-load failures.
- Reuse glass panels, subject colours, rounded controls, accessible switch semantics and existing interactive breadcrumbs. Remove duplicated question counts from topic cards.

## Recommended next improvements, in order

1. **Bank manifest and loading by module.** Current startup still loads all banks; the production service worker precaches roughly 20 MB. Keep a small module/count manifest and fetch the selected bank on demand. Cache visited modules, and offer an explicit offline download. This needs coordinated navigation/offline changes and a migration test, not just deletion of precache entries.
2. **Due-for-review and incorrect-question practice.** Reuse stable IDs and attempt results to offer missed questions and spaced review. Account sync should preserve per-question state and handle corrected question versions.
3. **Mobile/accessibility refinement.** Audit keyboard flow, screen readers, contrast, reduced motion, touch targets, and long case layouts. Prefer subtle depth and fast transitions over animations that delay studying.
4. **Operational checks.** Add owner-visible storage/auth health, backup restore drills, errors and speed measurements, and monitoring of report/correction failures. Do not include personal report text in analytics.
5. **Large-bank search.** Add an indexed search backend if filtering whole module arrays becomes a measured bottleneck; current pagination bounds responses, not the server scan.
6. **Gamification.** Start with personal progress, weekly study goals, and mastery badges. XP could reward a first correct answer per unique question/day, with caps and no repeat farming. Essays are self-graded and should not award competitive accuracy XP. Keep leaderboards optional and separate verified objective scores from self-assessment. Define these rules before implementation.

The recommended first product addition is missed-question practice; the first performance project is module-based loading. Neither requires a new medical review of the bank.
