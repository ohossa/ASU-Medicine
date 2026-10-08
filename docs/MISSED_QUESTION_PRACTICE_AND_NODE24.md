# Missed-question practice and Node 24

## Student flow

Complete an attempt, then choose **Retry missed questions** on its results page. The badge counts parent questions needing another attempt. Wrong, skipped, and ungraded answers follow exactly the existing results grading rules. A case is retried in full if any part is missed. Correct parent questions are excluded. If every question is correct, no empty retry action is shown.

A retry starts at question 1 with fresh answers, timer, flags and essay drafts. The account shuffle preference applies. The original bank, IDs, options and answer keys are unchanged. Retry practice uses a ` · Missed questions` subject/session/history label, avoiding replacement of the regular full-topic session or its latest topic result. The retry's grade is for its smaller question set; it is not a new full-topic grade. History can reopen completed retries using their saved IDs. **Retake Session** on a retry repeats that retry set; use the topic browser to practice the complete topic again. Retry again from its results page to focus on the remaining misses.

Temporary retries are saved separately from full-topic attempts; the normal topic resume prompt does not discover this separate retry slot. Completed retry attempts appear in history. This release does not add a persistent due-for-review queue or merge mastery across attempts.

## Node runtime upgrade

The Vercel notice concerns **Node.js 20 to Node.js 24**, not versions 0.2 and 0.24. Vercel's official notice says Node 20 builds/functions were deprecated on 1 October 2026. Existing deployments continue running; new deployments must use a supported version.

Local changes:

- `package.json`: engines.node = `24.x`, which Vercel uses for the next deployment.
- `.nvmrc`: `24`.
- GitHub Pages workflow: setup-node runtime `24`.
- Local verification runtime: Node `v24.16.0`.

No production project setting was modified and no deployment was triggered. The live Vercel upgrade takes effect on the next deployment. After deploying, verify the build runtime and authenticated API/storage paths. The API credentials are still absent locally, so this release cannot establish live Clerk/Redis configuration compatibility.

Official sources:

- https://vercel.com/changelog/node-js-20-is-being-deprecated
- https://vercel.com/docs/functions/runtimes/node-js/node-js-versions

## Verification

- Test-first regressions: wrong/skipped selection, all supported grading formats, full-case retention, separate labels, callback selection, and perfect-score empty state.
- Full suite: **37 files, 270 tests passed** under Node 24.
- Production Vite/PWA build: passed under Node 24.
- Strict TypeScript: existing diagnostics remain; no new normalized diagnostic messages versus the previous delivery.
- Browser visual check: real results component with explicitly labelled synthetic questions; screenshot in `docs/verification/missed-practice-2026-10-08/results-preview.png`. No real student progress was created for that preview. Temporary preview files were removed.
- No Git push or production deployment.
