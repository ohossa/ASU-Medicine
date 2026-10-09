# Custom practice and question XP feedback

Implemented locally on 9 October 2026. No commit or push performed.

## Topic selection

The shared SubjectSelect footer now opens **Build your practice → Choose topics**, replacing the previous all-topics banner for every module using this screen.

- Select whole topics, or expand a topic and choose individual parent questions.
- Search topic titles and question stems. Search does not change the selection; Select all selects the entire collection and Clear removes the entire selection.
- Empty topics cannot be selected. Start is disabled until at least one question is selected.
- Question counts count parent questions. Case result totals count their graded subquestions.
- With Shuffle off, the canonical topic order and original question order are retained, regardless of the order in which boxes were checked. With Shuffle on, the existing account preference shuffles the entire selected set.
- Native modal dialog provides Escape, keyboard focus containment, return focus and body scroll locking. Its inner list scrolls within the rounded container; summary and Start remain visible. English and Arabic labels are supplied.

## Identity, grading and progress

`practiceTopics` maps existing subject/lecture metadata to topics. Unmapped questions receive an explicit Other questions group; no question disappears merely because it has an unexpected lecture number.

`selectedPractice` clones selected questions and attaches session-only topic attribution. IDs, content versions, options, correct indexes and original bank objects remain unchanged. Duplicate IDs are included once. The existing learning endpoint grades the original published question ID server-side and uses its original subject/topic; grouping cannot create a new XP identity.

The existing per-answer XP queue is used. End-of-session submissions are retained; server idempotency prevents repeated XP. Self-graded essays still earn only personal XP, as previously agreed.

## History and results

A combined attempt creates **one** history entry, with `topicResults` and a compressed question snapshot containing topic attribution. It does not create additional synthetic attempts or duplicate study time.

Results display each selected topic's correct/total/percentage. Original topic names also appear on question review cards and in quiz headers. Topic cards use the latest relevant module/chapter/topic score from history; scores from another module with the same chapter ID cannot bleed across.

A partial custom attempt is labelled Practiced rather than Completed. Cards show the selected-question denominator, not the complete topic size; the topic's full question count remains visible separately. The combined elapsed time is not repeated as though it were each topic's elapsed time.

## Resume and retake

Custom subsets have compact deterministic storage keys. Resume verifies the full saved ID set, restores its saved order, and rebuilds topic attribution. Current content-version checks remain active. A custom attempt is never widened to the entire chapter on resume.

Drafts continue through the account-scoped session/cloud-sync path. Typed essay drafts remain local. A retake uses the current published grading key and omits withdrawn questions while retaining topic attribution. Missed-question retries use their own subset key.

## XP bubble

The floating mint bubble appears only for a positive personal XP award confirmed by the server. It shows the returned amount, rather than a hard-coded +10, and disappears after 2.2 seconds. Duplicate awards returning zero do not show a bubble. It is account-scoped and suppressed in hidden tabs. Reduced-motion preferences disable its rise/tilt animation.

Confetti is disabled in the shared effects config and removed from results-page celebration calls. Achievements remain recorded. The authenticated learning write cap is 60/minute to accommodate immediate answer updates; server grading, duplicate protection and daily leaderboard caps remain active.

## Verification

Automated coverage includes canonical ordering, mixed topic attribution after shuffle, false/zero answers, case subquestion scoring, subset resume, withdrawn-question rejection, current-key retakes, compressed snapshots, one history entry with preserved topic results, whole-topic and individual selection, empty topic disabling, search, Clear and dialog cancellation/focus return. Existing learning queue/ledger tests cover positive confirmed XP and duplicate zero awards.

Browser verification: GIT past-exam anatomy, three-topic selection (35 questions), individual-question selection, exact two-question resume, canonical order, one correct and one incorrect answer, distinct topic results, and corresponding topic-card scores. Layout inspected at desktop, 390×844 and 768×1024; no horizontal overflow and the action footer remained visible.

Local preview cannot verify production cloud writes or server-confirmed XP visually: its Clerk/API configuration rejects cloud sync. Automated service and queue tests passed. A live cross-device sync check remains a deployment acceptance step; no hosted credentials or Redis records were altered for these checks.
