# Question reporting and private admin portal

Approved scope: small themed report action with category and optional explanation; email omarhmaged@gmail.com; private extensible admin portal. User confirmed this is the verified sign-in email.

1. Add shared report contracts and server service tests (unauthenticated/forbidden, payload validation, persistence, idempotency, email failures, admin status updates).
2. Implement server-only Clerk identity check, durable isolated Redis namespace, rate limits, report snapshots from canonical banks, idempotent Resend notifications. Never use the existing destructive sync endpoint.
3. Add reusable accessible report dialog and actions in quiz, results, search and bookmarks. Snapshot canonical question and optional subquestion context; no automatic content changes.
4. Add /admin shell, overview and reports inbox with filters, pagination, detail view, internal notes, statuses and email retry. Verify owner on server; client visibility is convenience only.
5. Test student UI, backend permissions and data handling, run existing suite/build, inspect changed files and document production configuration.

Design: existing Manrope/Archivo, teal accents, white/zinc surfaces, subtle borders, compact report icon, responsive dialog and master-detail inbox. One admin verified email, optionally pin Clerk user ID server-side. Auth failures never expose data. Students cannot list reports. Email stored as pending/failed/sent, saved reports survive delivery failure. Report state uses revisions for concurrent admin updates. Report data has no expiry; rate counters do.

Deployment: local implementation only. Actual delivery requires server Clerk key, Redis, Resend API key and verified sender; no credentials embedded. Final report must distinguish tested local implementation from unverified production email.
