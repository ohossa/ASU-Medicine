# Release cleanup — 8 October 2026

## Completed

- Strict application, tooling and NodeNext API TypeScript checks now pass. Strictness retained; no compiler suppression added.
- Build now runs all three type checks. GitHub workflow runs regression tests before building.
- 48 test files / 324 tests pass, including saved-answer validation, history dates, malformed AI-provider responses and existing GIT bank/correction checks.
- Native Node 24 import smoke test passed for all four API functions. Fixed explicit ESM relative imports, ioredis named constructor imports, and lz-string CommonJS default import.
- Restored package-lock.json and verified an isolated npm ci installation. Project remains private; Node 24 configured both in package.json and Vercel.
- Patched React Router to 7.18.4, Vite to 6.4.4 and compatible transitive dependencies. Production npm audit reports zero vulnerabilities. Three moderate findings remain in development-only mammoth CLI -> argparse -> sprintf-js. npm reports only a breaking mammoth downgrade; that was not applied. This command-line intake tool is not included in student bundles.
- Typed saved answers, guarded malformed answer records, preserved undated history rows, fixed fallback error rendering and flagged-question module routing.
- GIT bank untouched during release cleanup: 6,178 questions, including 670 past-exam/recall questions. Historical medical-answer policy remains unchanged.
- Vercel authentication works. Existing Clerk and Redis settings were inspected by name only; server secret values were not pulled into local files.
- REPORT_ADMIN_USER_ID was set in Production and Preview to the user-provided owner account. Preview REPORT_ALLOWED_ORIGINS includes the dedicated release-preview alias and the production domains.

## Release isolation

PREVIEW_STAGE is based on the existing Git HEAD plus the selected website/API changes. Other working bank edits (including P1-1.json), .env files, credentials, preparation archives, bank backups and agent directories were not copied. RELEASE_FILES.json records exact overlay hashes. The original working tree remains uncommitted; no GitHub push or production promotion has occurred.

## Verification evidence

CLEAN_INSTALL.log, TYPECHECK.log, TESTS.log, BUILD.log, DEPENDENCY_AUDIT.json, PRODUCTION_DEPENDENCY_AUDIT.json and VERIFICATION.json. The first hosted build exposed NodeNext API import diagnostics; those were fixed and checked before the corrected preview was deployed.

## Remaining acceptance checks

- Corrected preview endpoint checks and deployment log verification.
- Sign in as the pinned owner, submit a clearly labelled test report, and exercise add/edit/remove/restore/export with a test question. Verify persistence across reloads and deployment; remove the synthetic question from practice afterward while retaining its audit trail.
- Sign in as an ordinary student and confirm private administration is denied.
- Physical iPhone/iPad Safari review. Earlier viewport checks are documented separately; this task's local browser automation was rejected by the browser security policy and no workaround was attempted.
- User review and final publication. A working preview is not a production launch.

## Hosted results

Preview: https://asu-medicine-git-release-preview-omarhossa-ms-projects.vercel.app

Corrected deployment dpl_7WganyD7TkK15vMYuyeL7oDjyxZF built successfully with no TypeScript diagnostics in the hosted API compiler. Home and GIT routes return 200. Both private admin endpoints return 401 without a Clerk session. The public corrections endpoint returns 503: runtime logs identify DNS ENOTFOUND for the existing Redis database hostname. This is an external connection blocker, not an authentication bypass or successful persistence test. The user has been asked to update the existing connection directly in Vercel Production and Preview. No substitute database or data deletion was performed.

The preview uses Vercel deployment protection. Owner admin/report/editor persistence and authenticated student denial remain unverified until the connection is repaired and account sessions are available. No promotion to asu.codes and no Git push occurred.

## Redis follow-up

After the user updated the hosted Redis connection, deployment dpl_5axCXR2oQzwJYxHn3CWMiVWuJtbZ built successfully. Home returns 200. The all-module and GIT-specific published-corrections endpoints now return 200 (zero stored edits); this verifies live Redis reads and canonical GIT bank availability. Private admin/report access remains 401 without a signed-in session. No database writes, synthetic questions, Git push or production promotion were performed. Authenticated owner editing/report persistence and an ordinary-student denial check still require real account sessions. See REDIS_HOSTED_CHECKS.json and REDIS_REDEPLOYMENT.log.
