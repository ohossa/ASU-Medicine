# Owner report review and student replies

Implemented 10 October 2026. Scope: the private admin panel and its authenticated reporting API. Student report submission, question banks, grading, XP, cloud learning sync and public support pages are unchanged.

## Review workflow

1. Open **Admin → Question reports**. Filter by module, subject, chapter, topic, report status or student search.
2. Click a question card or an individual student's report. Question groups are flat cards, not nested accordions. Each student's report remains separately selectable; counts and pagination still cover the full filtered inbox.
3. Read the **Question at submission** panel beside **Student feedback**. The message is preserved exactly, including line breaks and “Something else” submissions. Profile information remains private. Case subquestions, reported parts, options, answer keys, model answers and supplemental question data remain available.
4. Use **Copy student message** for just their note, or **Copy review context** for the question, key, explanation, question parts, source version, category and original note. Review context omits captured name, email, username, account ID and internal notes. The student's own message remains unchanged and may itself contain personal details: review what you paste into an external AI. Nothing is sent to an AI automatically.
5. Review medical claims against the current question and reliable sources. **Edit this question** opens Question studio. Publish an actual correction before marking a report fixed or saying a correction was made. Status changes do not edit the bank.
6. Save your decision and private notes separately.
7. In **Reply to the student**, choose a template or write a custom reply. Templates cover a correct existing answer, a published correction, and a clarification request. Replace bracketed instructions with your own explanation. They cannot be sent unfinished.
8. **Save draft** stores the draft in Redis. Another tab cannot overwrite it with a stale revision. A matching draft clears after its reply is accepted; a different follow-up draft on another device is preserved. Reload conversation to fetch the latest draft; this deliberately replaces unsaved composer text.
9. Select **Preview email**, review the recipient, subject and exact body, then **Send reply**. Sending never happens automatically from selecting a template, changing a status, saving notes or running AI triage.
10. The reply history stores the exact message, frozen recipient, sender, creator, timestamp and provider reference. “Email accepted by provider” confirms provider acknowledgment, not delivery, inbox placement or reading. The student can reply to Omar's email address. Their inbound email goes to that mailbox; it is not imported into this admin panel.

## Email configuration

This reuses the existing Resend report-alert integration:

- `RESEND_API_KEY`: server-only Resend sending key. Never prefix it with `VITE_`, paste it in chat, or commit it.
- `REPORT_EMAIL_FROM`: a sender on a domain verified in Resend, for example `ASUCodes <support@asu.codes>`.
- `CLERK_SECRET_KEY`, the existing pinned owner setting `REPORT_ADMIN_USER_ID`, and existing Redis settings must remain configured.
- Student replies use `Reply-To: omarhmaged@gmail.com`. The original incoming **Admin alert email** is a separate notification addressed to the owner; its retry button never sends a student reply.

Verify the sender domain in Resend using its exact DNS records, then add the two email variables to Vercel Production and Preview and redeploy. For local operation, configure server-only variables in an ignored environment file and restart Vite. Without email configuration, the reply panel explains what is missing and disables sending; review and draft saving remain available.

Official provider references: [sending email](https://resend.com/docs/api-reference/emails/send-email), [domain verification](https://resend.com/docs/dashboard/domains/introduction), [idempotency keys](https://resend.com/changelog/idempotency-keys).

## Authorization, privacy and retries

- Every conversation read, draft save and send verifies owner authorization before private data access. The existing production owner email and Clerk account pin remain mandatory.
- The browser cannot specify `to`, `from`, CC or BCC. The server resolves the reporter's current verified Clerk email, including old reports without captured profile details. Unverified or deleted accounts cannot receive a new reply.
- The outbox is persisted before any provider call. A request UUID is bound to immutable content; changing that content under the same reference is rejected.
- Redis atomically deduplicates identical subject/body replies for the same report across owner devices. Concurrent sends use a lock and the same provider idempotency key.
- Subject, body, recipient and sender freeze at reservation. Changing environment configuration never changes an already reserved sender payload.
- The browser retains its pending send reference under an owner-and-report-scoped key, and the server retains pending/uncertain outbox entries. Reopening recovers the pending message rather than silently creating another send.
- A timeout is **delivery not confirmed**. Retry the exact same reply. The provider's idempotency protection lasts 24 hours; automatic retries are blocked after 23 hours. For an older uncertain send, inspect Resend's log and resolve its actual outcome before initiating another email. Do not remove Redis records to force a resend.
- Internal notes, authentication tokens, account IDs, original report explanations and medical answer snapshots are not automatically appended to email bodies.
- All email bodies are plain text. Student content cannot inject HTML into the outgoing email or admin view.
- Stored report and reply records do not expire. No learning/progress keys are modified.

## API and storage

The existing `/api/question-reports` function contains the additions; no new serverless function is introduced:

- `GET ?action=replies&id=r_...` → owner conversation, draft, verified recipient, configuration status.
- `POST ?action=reply-draft` → `{id, revision, subject, body}`; revision checked atomically.
- `POST ?action=reply-send` → `{id, requestId, subject, body}`; returns `{reply}`.

Redis namespace: `asu_report_replies:v1:` with permanent record, per-report index, draft and content-deduplication keys. Temporary send locks expire after 60 seconds; provider timeout is eight seconds. Draft revision changes never increment the report's decision revision.

## Verification

- Frontend: original message visibility, no question accordion, selectable grouped reports, filters, owner denial, editable templates, preview gate, saved drafts, pending retry references.
- Backend: owner denial before reads, verified recipient lookup, forged-recipient rejection, unfinished-template rejection, immutable send references, concurrent duplicate suppression, ambiguous delivery recovery, safe retry expiry and cloud draft conflicts.
- Real production Lua executed in isolated fakeredis, including 16 competing owner-device reservations and stale draft updates:
  `python scripts/verify-report-replies.py`
  Test-only prerequisite: `fakeredis[lua]` in a separate virtual environment.
- Browser visual and interaction checks use a temporary isolated Vite fixture with synthetic student identities and a mock email provider. Preview fixtures and mock authentication are never included in production builds. No real email was sent during implementation.
