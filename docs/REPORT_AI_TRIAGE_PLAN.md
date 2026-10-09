# AI Report Triage: Proposed Design

Status: implemented locally in shadow mode on 9 October 2026; not deployed. Real owner-labelled pilot and live provider/device verification remain release gates. See [implementation and operation](REPORT_TRIAGE_IMPLEMENTATION.md).

## Goal and decisions

Reduce the owner's review workload while preserving genuine errors and every original report. The default inbox shows likely actionable and uncertain reports. Low-priority reports move to an accessible secondary view with a visible count; AI does not delete, dismiss, resolve, or edit questions. The owner confirms every correction. Quota failures remain visible as unreviewed reports.

## Pipeline

1. Persist the student's original report and canonical question/version before starting AI work. Submission success never depends on the AI provider.
2. Group by module, canonical question/version, and issue. Keep each reporter's original explanation and identity in the private inbox. Send no name, email, account ID, avatar, or contact details to the AI.
3. Run free deterministic checks first: answer-key bounds, missing/duplicate options, blank prompts, stale question versions, missing answer content, and obvious formatting. Group duplicate reports instead of evaluating each student message separately.
4. Classify remaining reports with a small configurable model. Inputs are delimited source material, not executable instructions. Classify wrong key, ambiguous wording, multiple/no correct options, explanation mismatch, missing content, formatting, irrelevant, and uncertain. Return validated JSON with issue, priority, short rationale, proposed action, evidence requirements, and confidence band. Confidence is not a probability of correctness.
5. Escalate possible medical/key errors to a stronger model. First solve the question and assess every option without the recorded key or student's suggested answer, then compare against both. A mismatch, multiple defensible answers, missing context, or conflicting sources always remains actionable/uncertain.
6. Retrieve authoritative evidence for disputed medical conclusions through a controlled backend. Store only actually fetched evidence URLs, locators and short supporting propositions. Model-suggested URLs alone do not count as verification. No supporting evidence means uncertain, not dismissed.
7. Store a sidecar assessment keyed by question hash and report-content hash. Owner edits make old assessments stale. Retries and workers are idempotent; leases recover crashed jobs. A new substantive report or contradiction invalidates the prior conclusion and triggers reassessment.

## Inbox experience

- **Needs your decision:** likely genuine defects, evidence conflicts, and multiple/no-answer questions.
- **Uncertain / unreviewed:** insufficient evidence, pending work, provider failures, or outdated assessments.
- **Low priority:** likely misunderstanding, vague feedback, or irrelevant reports, with a readable reason.
- **All reports:** original immutable reports, including duplicates and prior owner decisions.

Each grouped card shows the original question/options/key, unique student count, report excerpts, AI verdict and rationale, evidence, model/version, assessment date, and question version. Actions: approve proposed correction in the existing editor, dismiss with a reason, mark reviewing, disagree with AI, request reassessment. Existing optimistic edit/revision guards prevent an old suggestion overwriting a newer correction.

Multiple distinct students and newly contradictory evidence raise priority. A structurally invalid question, a proposed key change, or failure to find a unique correct answer can never be routed to low priority automatically. Uncertain items remain visible by default. The owner can turn off AI sorting and return to the unfiltered inbox.

## Cost and reliability

Use the existing hosted Groq account with a separate model configuration and job budget. Evaluate GPT-OSS 20B for classification and GPT-OSS 120B for escalations; verify both are available to the specific account at activation. Groq currently lists both as production models. Use JSON schema outputs where supported, with server-side validation regardless of provider guarantees.

Limit output to a short rationale, cache by stable question/version and issue, group repeated messages, and escalate only medical/ambiguous cases. Give the student tutor priority over background report jobs because they share provider limits. Bound concurrency, token output, daily jobs and retries; honor 429 retry timing. A paused queue never hides reports or marks them checked. Log usage without prompts or reporter identities. No paid-provider fallback or automatic spending change.

Do not assume that the tutor's Groq key provides unlimited free web retrieval. The evidence retriever and its limits must be configured and verified separately; without retrieval the medical gate stays uncertain.

## Safety and tests

Test prompt injection in student notes, malformed JSON, invented citations, contradictory options, incorrect historical keys, duplicate submissions, multiple-answer prompts, stale owner edits, worker crashes, timeouts, quota exhaustion, account access, private identities and consent boundaries. Verify links against retrieved content; a source about the topic is not enough to support the exact conclusion.

Start in shadow mode on 50–100 reports with owner-labelled outcomes. Compare actionable-error recall, false low-priority placements, usefulness, cost per grouped issue and processing time. Inspect every critical-error miss and revise the gate before enabling prioritization. Audit a sample of low-priority results continually and expose owner feedback. No model or pilot can guarantee zero mistakes.

## Implementation stages

1. Versioned triage sidecars, grouped queue, deterministic checks and shadow-mode admin view.
2. Small-model classification, structured-output validation, budgets and retry handling.
3. Stronger medical review and verified evidence retrieval.
4. Owner-labelled pilot and false-low-priority tests.
5. Enable the prioritized inbox, retain all-report access, audit metrics and rollback switch.

References checked 2026-10-08: https://console.groq.com/docs/models ; https://console.groq.com/docs/structured-outputs ; https://console.groq.com/docs/rate-limits
