# Admin and student experience implementation

Requested scope: complete owner-only admin access, reports, editable questions, account shuffle preferences, and practical performance/UX improvements. Keep changes local for user testing before publishing.

- Reuse verified-owner authentication (omarhmaged@gmail.com); authenticate every administrative request on the server. Optional Clerk user-ID pin binds ownership to one account.
- Retain the existing private report inbox and student reason/free-text form.
- Add a searchable question editor for all supported formats, validated saves, optimistic concurrency, durable revision history, restore/export operations, and shared corrected content for students. Reports retain immutable submitted snapshots.
- Store corrections in durable Redis separately from student progress. Never edit deployed filesystem files or silently lose corrections across builds. Expose only published question content to students, never reports or audit identities.
- Add account-scoped shuffle preference. Shuffle new attempts only; restore the exact saved ID order for resumed attempts. Keep options and answer keys aligned and unchanged.
- Serve local API routes through Vite's development middleware without weakening authentication. Missing secrets/storage remain explicit configuration errors.
- Verify security, validation, stale writes, persistence, shuffled resume, account switching, report UI, and full application tests/build.
- Document configuration and performance findings. Suggest XP/gamification options without inventing a reward system before the user chooses its rules.
