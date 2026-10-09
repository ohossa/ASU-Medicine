# Report triage and design implementation

Status: implemented locally on 9 October 2026; not published. The first operating mode is **shadow**. No real owner-labelled pilot is claimed.

## What students and the owner get

Student reporting remains unchanged in its core behavior: the canonical question snapshot and original report are saved before any review. An unavailable AI provider cannot prevent report submission. Private reporter details remain in the owner inbox. Models receive an allowlisted question projection and scrubbed report notes, not the reporter identity object.

The owner has grouped AI assessments, a short reason/action, source excerpts and links, model/rules/version details, uncued answer comparison, reassessment, and pilot feedback. Queue controls review one group or up to 20 sequential groups and can stop after the current job is saved. They do not edit, dismiss or resolve reports. Existing question editing requires the owner's normal save and revision guards.

Shadow mode keeps the default inbox unfiltered. After a successful pilot, the priority view excludes only completed, current low-priority assessments; All reports and Low priority remain accessible. Failed, stale and uncertain assessments cannot disappear into the low-priority bucket. Three distinct reporters raise a cached low assessment to uncertain.

## Pipeline

1. Group exact module/question/version/child/category issues; deduplicate report IDs. Hash substantive notes and triage rules for cache invalidation.
2. Check blank prompts, missing/duplicate options, invalid keys and missing answer content deterministically, without provider usage.
3. Classify with a configurable smaller model. Force medical review for key/wording/explanation/ambiguity concerns.
4. Derive the answer independently with every option considered. This phase contains the parent case stem where necessary but neither the key, explanation nor student's suggestion.
5. Retrieve up to four public PubMed abstracts via fixed NCBI endpoints, with bounded response size/time and redirects rejected. Model URLs are never fetched.
6. Evaluate the independent answer **and the specific report concern, including the recorded explanation**, against fetched sources. Validate all citation IDs and exact quoted text. Unsupported or conflicting medical conclusions remain uncertain.
7. Re-read the live question version after review. Store a separate assessment under its fingerprint, protected by the current lease. Preserve original reports and question content.

PubMed abstract retrieval is not a comprehensive textbook verification service. It can miss relevant anatomy and lack enough detail to settle a report. That yields uncertainty. Exact quotations prove retrieval, not the infallibility of a model's interpretation. AI prioritization remains advisory.

## API and storage

`GET /api/question-reports?action=triage` returns the owner's view. Owner-only POST actions are `triage-run`, `triage-reassess`, `triage-label`, and `triage-mode`. Existing list queries accept `triage=all|priority|low`; filtering happens before pagination/counts.

Redis `asu_triage:v1` holds sidecars, mode, current labels, an append-only label audit, leases and anonymous daily call counts. Assessment rules currently use `triage-2`. A new rule version creates new fingerprints; old pilot labels do not activate the new rules.

The 90-second global lease covers the 55-second bounded job. Save/release operations check the lease token. Retries honor provider timing, remain unreviewed, and stop after five automatic failures; explicit owner reassessment resets that attempt count. Original reports are the durable queue. Processing currently runs through owner controls, not an unattended cron service.

## Configuration and budget

Use server-side Vercel configuration only; no keys go into browser bundles or Git:

- Existing `GROQ_API_KEY`, existing Redis configuration, existing Clerk owner authorization.
- Optional `TRIAGE_CLASSIFIER_MODEL` (default `openai/gpt-oss-20b`).
- Optional `TRIAGE_MEDICAL_MODEL` (default `openai/gpt-oss-120b`).
- Optional `TRIAGE_DAILY_CALL_LIMIT` (default 50 provider calls; hard cap 200).

This is a **call** budget, not a number-of-reports or monetary budget. A medical group can consume three calls. Each provider response is capped at 1,800 output tokens; question contexts are bounded. Recent low tutor quota prevents reserving a triage call. No paid fallback is introduced. Free-tier availability/rate limits depend on the account and provider.

Official provider references checked 9 October 2026: [Groq models](https://console.groq.com/docs/models), [structured outputs](https://console.groq.com/docs/structured-outputs). Strict JSON schemas are also validated by the server.

## Owner pilot and release

1. Publish only after the user's existing local-review hold is lifted. Verify owner-only access and the configured provider on the actual deployment; keep shadow mode.
2. Review real groups and record independent owner labels/notes. Required: at least 50 current completed groups, at least 10 actionable groups, no false-low classifications and no critical misses. Recall must be at least 95%.
3. Inspect uncertainties and all low-priority decisions. Do not manufacture labels or treat mocked tests as pilot evidence.
4. Enable prioritization only when the server gate passes. The server re-evaluates current versions and labels on every view; insufficient current pilot coverage falls back to shadow.
5. Continue auditing low-priority items; rollback immediately through the mode control if needed. All original reports remain available.

## Design changes

Shared study buttons/status/surfaces and report/admin CSS improve readable density, focus and 44px main action targets. Account settings use semantic colors and an accessible language selector. The report dialog keeps its focus trap and Escape behavior while clipping its inset scrolling area. Login honors reduced motion. Decorative canvas work pauses when hidden and stops continuous frames when motion is reduced.

The replacement loader uses a small ASU mark, ASUCodes wordmark, quiet indicator and concise status. It disappears when the caller reports readiness; it never pads loading with an animation timer. Existing resource/route gates retain their actual data-readiness behavior.

## Verification

TypeScript checks passed; 554 tests across 94 files passed; production build passed. Evidence logs and final review findings: [execution ledger](verification/report-triage-design-2026-10-09/progress.md).

Coverage includes projection/privacy, clinical parent context, explanation-specific evidence, structure, malformed outputs, invented citations, unsupported/stale medical assessments, authorization before reads, budget denial, provider retry timing, redirect control, durable retry/reassessment, pilot lock, language labeling, reduced-motion/hidden animation, and existing report/admin/quiz behavior.

No live model request, real owner pilot or physical-device certification was performed. Fresh browser review was blocked by browser security policy; this is documented rather than bypassed. The existing large-chunk build warning remains a performance follow-up, not a build failure.
