# ASUCodes release status

Updated 11 October 2026. This is the current status index. Older dated verification records preserve what was true during those checks; their local-only notes do not describe the later release.

## Deployed

| Area | Release | Current scope |
| --- | --- | --- |
| Unified progress and rewards | `ecf2579` | Current-year overview, progress, activity, rewards and opt-in rankings; canonical question awards and essay-only personal XP |
| Question search | `ecf2579` | Current-year scope, taxonomy/status filters, worker ranking, pagination, case children and stable links |
| Loading | `ecf2579` | Actual readiness, module loading, account year cache, retryable resources and theme initialization |
| Support page | `ecf2579` | Public bilingual support, InstaPay/Vodafone Cash, recipient/copy links, WhatsApp refund contact and estimated monthly costs |
| Custom multi-topic practice and XP feedback | `ecf2579` | Ordered/shuffled selected topics, per-topic results and server-confirmed XP bubble |
| Cross-device question progress | `e55a7fe` | Cloud attempt merge, latest/ever/first-answer data and canonical server XP deduplication |
| Admin replies | `39d2ff4` | Flat report list, original student note beside snapshot, copy context, cloud drafts, email preview/send and reply history. Owner confirmed live email works. |
| AI report assistance | `ecf2579` | Owner-run, budgeted, evidence-assisted review. Shadow mode preserves every report; no automatic question corrections or student emails. |

## 11 October follow-up

Published implementation: `044308d`. Vercel deployment confirmed successful; production admin controls and email-context preview verified. Unauthenticated reporting API access returns 401.

The current update restores default-on sound outside iPhone Safari, keeps iPhone Safari default-muted, honours explicit choices, and adds an always-visible bilingual sound control. Sound preferences synchronize between mounted controls and browser tabs. Both feedback engines share the policy and request ambient mixing when supported. Older Safari may pause other audio after an explicit unmute; the control explains that limitation. No browser-width test can prove actual iOS audio mixing.

The historical-pilot checkbox allows the owner to assess closed reports without reopening them. The default queue processes open reports only. Counts distinguish open and historical pending groups. Running AI assessment never records an owner label or changes report status.

New student reply emails include a mobile-friendly original-question card with the answer, explanation and student report. The preview includes the same server-projected content, and the rendered email freezes for delivery retries. Legacy pending messages retain their original provider payload.

Past Exams appears above regular chapter/subject/topic choices. Shared presentation helpers recognize `bankSection: past-exams` and English/Arabic past-exam labels, so future modules inherit this behavior. Source IDs, book order within each collection, grading and quiz order remain unchanged.

## Actual remaining gates

- **AI priority filtering:** live inbox inspected 11 October: nine report groups, all dismissed, nine stored AI assessments and zero owner pilot labels. At least 50 current completed owner-labelled groups, including 10 actionable cases, no false-low placements, no critical misses and at least 95% actionable recall remain required. Nine reports cannot establish the required pilot. Historical assessment helps start it; no synthetic reports or invented labels may count. Stale source versions and failed assessments remain visible and do not count as current completed labels.
- **Physical devices:** the owner offered to test iPhone Safari after deployment. Real iPad/Android and assistive-technology checks remain unconfirmed until actual results are recorded. Responsive browser checks and semantic/keyboard tests are tracked separately.
- **Cards / Apple Pay:** no approved merchant or hosted checkout is configured. Keep unavailable until eligible provider setup and live payment/refund testing are complete.
- **Accounting ledger:** optional extension; the public page does not automatically confirm transfers or calculate funds raised. Estimated running costs are not an accounting statement.

## Documentation rules

Use this index before interpreting a historic local-review hold. The user authorized publication of the student/support release and the email update. Future features still require their own publication authorization. Original question-bank intake and medical-review rules remain in `QUESTION_IMPORT_WORKFLOW.md`; UI/test success does not retrospectively verify every medical answer.

Verification for this follow-up: [pilot, audio and accessibility receipt](verification/pilot-audio-accessibility-2026-10-11/README.md).
