# Question reporting and your admin portal

Students can use the small **Report** button in quizzes, results, question search, and bookmarked questions. They choose a reason, optionally identify a case subquestion, and add an explanation. “Something else” requires an explanation. A successful submission means the report was saved, even if email delivery is unavailable.

Your portal is at **/admin** and the report inbox is at **/admin/reports**. Sign in using your verified **omarhmaged@gmail.com** Clerk account. The server checks this identity on every administrative request; hiding the link is only a convenience. Other students cannot read reports, change statuses, or retry notifications. Additional admin sections can be added to the portal navigation later.

## Production configuration

Configure these as server environment variables in the hosting dashboard. Never use a `VITE_` prefix for secrets or commit their values.

| Variable                                              | Purpose                                                                                                                                                         |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLERK_SECRET_KEY`                                    | Secret key for the same Clerk instance used by the website.                                                                                                     |
| `REDIS_URL`                                           | Redis connection URL; alternatively use either REST pair below.                                                                                                 |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN`               | Alternative Upstash REST connection.                                                                                                                            |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Also supported instead of the preceding Redis settings.                                                                                                         |
| `RESEND_API_KEY`                                      | Resend API key with permission to send email.                                                                                                                   |
| `REPORT_EMAIL_FROM`                                   | A sender on your verified Resend domain, such as `ASU Reports <reports@your-verified-domain>`.                                                                  |
| `REPORT_SITE_URL`                                     | Public site URL for admin email links; defaults to `https://asu.codes`.                                                                                         |
| `REPORT_ALLOWED_ORIGINS`                              | Comma-separated authorized Clerk session origins; defaults to `https://asu.codes,https://www.asu.codes`. Add the exact preview/local origin when testing there. |
| `REPORT_ADMIN_USER_ID`                                | Recommended additional owner pin: your Clerk user ID. If set, both this ID and the verified owner email must match.                                             |

All notification recipients are fixed server-side to **omarhmaged@gmail.com**. The Gmail address is the recipient and sign-in identity; it does not need to be the sending domain.

Deploy through the project's normal Vercel workflow after setting the variables. `vercel.json` bundles the canonical question JSON files with the API. Plain `vite` serves the interface only; local API testing requires a server environment that runs Vercel functions, such as `vercel dev`, with the appropriate variables.

## Managing reports

1. Open your account menu and choose **Admin portal**.
2. Open **Question reports**, filter by status, and select a report.
3. Review the student's reason alongside the saved question, answers, and complete source snapshot.
4. Add private notes and set **New**, **Reviewing**, **Fixed**, or **Dismissed**. Saving checks the revision to prevent overwriting changes from another window.
5. If email is unconfigured, failed, or pending, configure the provider and use **Retry email**. “Accepted by provider” means Resend accepted the email; check its delivery logs to confirm delivery.

Changing a report status does not edit the question bank. Correct questions separately using the existing content workflow. Reports retain their original question snapshot and version hash even after the bank changes.

## Storage and reliability

Reports use `asu_reports:v1:` keys, separate from student progress synchronization. Report records have no automatic expiration. Use a persistent Redis service with backups and an eviction policy suitable for durable records. Each student is limited to ten new reports per hour. Submission retries reuse a request ID to prevent duplicate records; Resend also receives an idempotency key for its provider-supported window. Repeated manual retries after that window may send another email.

The server resolves question text from the canonical bank, validates inputs, and ignores no client-provided source content: extra source fields are rejected. Missing server authentication or storage configuration produces an explicit error instead of claiming success. An email error leaves the report in the inbox for later retry. Failed or interrupted notification bookkeeping can leave a saved report marked pending.

## Launch check

After deployment, sign in as the owner and verify the inbox opens. Use a separate student account to verify `/admin` and administrative API requests are denied. Submit one real test report, check the saved snapshot and reason in the inbox, confirm email delivery in Resend and Gmail, then mark the report dismissed. Verify that the same submission retried does not create a second record and that a normal quiz's progress still saves.

Local automated checks cover validation, identity restrictions, canonical snapshots, duplicate submission behavior, email failure handling, UI submission, and the admin gate. Real Clerk/Redis/Resend integration and delivery must be verified against the configured deployment. No live email was sent during implementation.

## Implementation verification — September 13, 2026

- Full test suite: 232 tests passed across 24 files.
- Production Vite/PWA build passed; existing large-chunk warnings remain.
- No TypeScript diagnostics in the new report/admin files. The wider project still has 233 diagnostics across its app and node configurations.
- Isolated browser preview with mocked sign-in/API: report submission confirmation verified; desktop and 390px mobile layouts inspected with no horizontal overflow.
- Existing question-bank files were unchanged by this implementation.
- Production deployment, live Redis operations, and real email delivery were not performed.
