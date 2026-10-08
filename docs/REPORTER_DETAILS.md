# Private reporter details — 8 October 2026

New question reports store the authenticated Clerk account's name, username, primary email and email verification status alongside its existing account ID and submission timestamp. The server fetches the account after token verification; the client cannot submit or override these fields. When no primary email exists, the server uses a verified address if available, then the first account address. Missing names/emails remain null.

The report detail panel displays this submission-time snapshot and an email contact link. Long emails and account IDs wrap; the two-column detail layout collapses on narrow screens. Older reports remain readable and explicitly show “Not recorded” where no identity snapshot was saved. No account directory or private report data is exposed to students; submission responses return only the report ID and saved status. Email links open the owner's mail application and do not send a message automatically.

Identity snapshots do not change if students later rename accounts or change email addresses. Admin authorization still requires the owner's verified email and the configured account ID. The existing reporting store preserves the extra fields automatically; no Redis migration, credential download, or destructive rewrite is needed.

Verification: targeted authentication, spoofing, privacy, owner UI and legacy-report checks pass. The full suite has 351 passing tests across 49 suites; strict application/tooling/API type checks and production build pass. Tests use controlled Clerk fixtures; an authenticated live report submission remains a separate acceptance check.

## Suggested next additions

1. Report triage filters: module, subject, topic, age and severity, with a keyword search.
2. Group reports by question and show repeat-report counts so the largest issues rise to the top.
3. Revision comparison before publishing: prompt, options, answer and explanation changes shown together, with existing restore/history controls.
4. Content health overview: missing explanations, answer validation failures, duplicate candidates and empty topics.
5. Operational status: persistence health, latest successful deployment, failed notifications and backlog age.

Keep these owner-only. Existing edit/remove/restore/export and revision conflict protection should be reused.
