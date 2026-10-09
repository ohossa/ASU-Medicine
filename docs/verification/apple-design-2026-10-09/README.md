# Design review: ASUCodes

Local audit, 9 October 2026. Overall rating: **Needs work**. The site's distinctive element is the medical/vitals identity with subject colours and a quiet study surface. The next improvement should be clearer information and faster access, with less competing decoration.

## Critical findings addressed locally

### Critical: local year selection prevented access

**What:** Local `/api/sync?status=true` reported Redis and Clerk server configuration absent. Year saving failed and the modal blocked entry.

**Why:** `loading.md › Best practices`: “Let people do other things in your app or game while they wait for content to load.” A preview without server credentials should not pretend it can cloud-save.

**Fix:** Development loopback hosts store the authenticated account's year in its own browser cache, with explicit local-preview copy. Production saving remains cloud-backed and rejects failed writes. Tests cover account isolation and explicit production mode on localhost. No secrets or admin bypass added.

### Critical: year dialog scrollbar escaped its rounded container

**What:** The scrolling content shared the rounded panel boundary; background scrolling also remained possible.

**Why:** `layout.md › Best practices` and `accessibility.md › Vision`: content and controls must remain perceivable and operable at constrained sizes.

**Fix:** Outer `overflow-hidden` rounded shell, inset rounded scroll panel, dynamic viewport maximum height, overscroll containment and background scroll locking. Existing keyboard focus handling retained.

## Improvements

### High: duplicate tracking screens produce competing statistics

**What:** My Learning and Performance Dashboard have separate calculations. The latter assigns missing module codes to MEM-2 and groups seven sessions as its trend, rather than calendar days.

**Why:** `layout.md › Best practices`: a clear hierarchy should communicate useful information. Different definitions of the same metric undermine that clarity.

**Fix planned:** One year-scoped hub with Overview, Progress, Activity and Rewards, shared selectors, explicit definitions and unclassified legacy records. See [hub plan](../../UNIFIED_LEARNING_HUB_MASTER_PLAN.md).

### High: search results and scope are limited

**What:** Current search indexes all years, lacks taxonomy scope, ignores options/explanations/case children and displays only the first 100 results without paging. In-browser lipase search returned 68 matches; an empty query reported 25,784 indexed entries. That is an index entry count, not a claim of unique medically verified questions.

**Why:** `layout.md › Best practices` and `loading.md › Best practices`: users need access to relevant content without unnecessary navigation or blocking.

**Fix planned:** Current-year default, structured filters, relevant ranked results, reachable pagination, stable question links and version-aware indexing. Search input label and back/filter/clear 44px targets are already fixed. See [search plan](../../QUESTION_SEARCH_MASTER_PLAN.md).

### High: repeated artificial loading delays

**What:** App startup, generic LoadingScreen and lazy entry fallbacks can produce consecutive loading screens. Startup progresses by a timer and marks bank data ready even in a catch branch.

**Why:** `loading.md › Best practices`: “Show something as soon as possible.” `loading.md › Showing progress` distinguishes known from unknown progress.

**Fix planned:** One truthful readiness coordinator, cached account preference, route-level bank loading and explicit failures. Remove artificial completion holds instead of elongating the animation. See [loading plan](../../LOADING_EXPERIENCE_MASTER_PLAN.md).

### Medium: shared accessibility and control sizing

**What:** Search previously used 36px navigation controls and a 20px clear target. Calculator removal used 36px. Several other dense controls, including the 36px account avatar, still need deliberate target review.

**Why:** `buttons.md › Best practices` and `accessibility.md › Vision`: comfortable controls and visible interaction states matter across input devices.

**Fix applied:** Targeted 44px controls, explicit search name, shared 3px keyboard outlines, MotionConfig reduced motion, reduced transparency fallback and increased-contrast semantic tokens. Remaining controls should be migrated component by component rather than stretched indiscriminately.

### Medium: small labels and weak secondary text

**What:** Source inventory identifies 10–12px labels in quiz, chapter, results, search and tracker components. Colour-pair calculations show #9ca3af on white at 2.54:1 and #6b7280 on #141724 at 3.69:1, unsuitable for normal-sized essential text. These are palette candidates, not proof every occurrence uses that background.

**Why:** `typography.md › Best practices` and `color.md › Best practices`: readable hierarchy requires size and sufficient contrast.

**Fix planned:** Essential copy 16–17px, metadata generally 13px; replace weak essential colour pairs with semantic tokens and measure actual computed backgrounds. New focus colours measure 5.48:1 against white and 12.05:1 against #141724. See `contrast-calculations.json`.

## Craft notes

Keep the medical identity, but spend visual emphasis on the student's next action. Reduce content blur and simultaneous animated accents. Preserve subject colours as taxonomy rather than decorating every status with gradients. Support belongs below the four study tools as an optional secondary action; it also remains accessible in the footer/account menu. Case Solver is removed from Tools and its old route redirects home. Financial support and website issue reporting now have distinct labels.

## What works

- Familiar module → subject → chapter organization and separated past exams.
- Minimal quiz header, explicit feedback and missed-question retry.
- Account-scoped year cache and stable question identities.
- Concealed search answers until requested.
- Dedicated optional support page with actual recipient and refund contact.

## Evidence and scope

- Source inventory: 47 primary page/shared UI files, captured in `source-inventory.json`. Heuristic hits guide review and do not prove defects by themselves. Additional routing, preference, learning and boot sources were inspected.
- Browser: local account selected Year 3 and could enter the site; refresh restored the selection without the dialog.
- Home width checks: 320, 390, 768 and 1280px; document widths stayed within their viewports. Measurements: `home-width-checks.json`.
- Mobile search: 390px viewport, 384px document width; Back/Clear/Filters measured 44 × 44px. Calculator tablet: 768px viewport, 762px document width; current-year modules included GIT 13CP/260 marks.
- Support Tools link opened the local support page with the authorised payment details; no payment actions were triggered.
- Screenshots: `year-dialog.jpg`, `tools-desktop.jpg`, `search-mobile.jpg`. Year dialog screenshot predates the added background scroll lock; the inner scrollbar correction is present.
- Automated: **484 tests across 72 files passed**; TypeScript/production build passed; `git diff --check` passed. Suite emits a pre-existing LearningHub async act warning and an expected tutor-metrics failure-path diagnostic; neither is a failing test. Build retains its large-chunk warning (included in the loading plan).
- Build precache: 158 entries, 24,474.18KiB. This is precache size, not measured startup network transfer.
- Local correction-service warning is expected without server credentials; bundled banks remain available. It is not hidden or falsely reported as cloud success.

No publication, bank modification or live admin permission change occurred. This is a source review and representative browser/test verification, not an exhaustive physical-device or screen-reader certification. The search/hub/loading architectural changes are planned, not implemented in this pass.
