# Admin overview implementation plan

Scope: extend the existing owner-only overview, report inbox and tutor service.

1. Summarize every report, with deduplicated IDs and unresolved question grouping. Rank unresolved groups by distinct reporters, then report count, then latest report. Link directly to reports and the existing editor.
2. Persist anonymous daily Groq request outcomes and provider token usage in Redis using atomic increments. Cairo calendar days, 32-day retention, no student identities or question/conversation content. Capture only an allowlist of numeric quota headers and their observation time. Metrics failures must not interrupt tutor replies.
3. Add an authenticated owner-only overview API action. Authenticate before any report/usage reads. Preserve report overview if usage storage is unavailable; explicitly label unavailable metrics rather than showing false zeroes.
4. Reuse existing admin visual styles with a responsive priority list and tutor panel. Preserve report controls, status updates and editor workflows.
5. Test rankings, pagination completeness, owner enforcement, usage sanitization/error isolation and UI loading/error states. Run all tests and strict production build in the isolated verification directory. Commit only task files, push and verify production deployment plus signed-out denial.

Live quota snapshots may be stale and reflect the entire provider organization. Site metrics begin at deployment and may undercount if storage fails. No billing claims or secret configuration changes are included.
