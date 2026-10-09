# ASUCodes: website design and experience master plan

Status: local review, 9 October 2026. No publication authorized for this work. This is a practical implementation specification, not a claim that every proposed improvement is already shipped.

## Direction

A calm medical study workspace: clear hierarchy, readable questions, predictable controls, restrained depth and meaningful feedback. Preserve the existing brand, subject colours, English/Arabic support and familiar navigation. Apple design principles guide the web experience; native iOS conventions are not imposed on a browser app.

The installed skill is `.agents/skills/apple-design/SKILL.md`. References below are relative to that directory. Existing Manrope/Archivo typography can remain; consistency, legibility and spacing matter more than changing to an Apple font.

## Completed locally

- Year selection works on localhost without storing server secrets. Development loopback previews use an account-scoped browser preference; published builds retain authenticated cloud saving and failure handling.
- The year dialog clips its rounded outer boundary, scrolls inside an inset panel, and locks background scrolling. Local copy accurately describes browser-only persistence.
- Case Solver is removed from study tools and its route redirects home. Four study tools remain. Support ASUCodes appears below them, with a secondary footer/account entry.
- Shared keyboard focus is visible in light/dark modes. Motion follows the user's reduced-motion preference through MotionConfig. Reduced transparency and increased contrast have shared CSS fallbacks.
- Search back/filter/clear controls and calculator section removal now have 44px targets. The search input has an accessible label.
- Website issue reporting and financial support have distinct names.

No question text, keys or bank membership changed in this design pass. Unrelated local learning/support work is preserved.

## Shared design system

| Element | Standard | Implementation boundary |
| --- | --- | --- |
| Background | Quiet neutral canvas; solid content cards | Keep decorative particles subordinate; pause animation when hidden |
| Typography | 16–17px primary content; readable line height; 13px metadata baseline | Smaller labels require deliberate contrast checks; no tiny essential instructions |
| Colour | Existing subject palette; semantic success, caution, error | Colour always paired with text/icon; contrast verified in both themes |
| Controls | 44px touch targets; clear hover, focus, selected and disabled states | Create reusable components instead of globally stretching quiz/navigation buttons |
| Materials | Opaque reading surfaces; restrained blur in navigation | Reduced-transparency fallback must stay readable |
| Motion | Short state transitions; no essential meaning conveyed only by animation | Respect reduced motion; stop idle/background animation loops |
| Layout | One primary action per section; deliberate spacing; no horizontal page overflow | Long chapter names, Arabic and text enlargement must wrap |
| Navigation | Stable location and obvious back action | Minimal quiz header; preserve attempt state when leaving and returning |

Relevant skill references: `references/hig/accessibility.md` (Vision and Motion), `layout.md` (Best practices), `typography.md` (Best practices), `color.md` (Best practices), `buttons.md` (Best practices), `materials.md` (Best practices), `motion.md` (Best practices), `loading.md` (Best practices and Showing progress), and `references/cross-platform.md`.

## Whole-site coverage and next work

| Area | Review finding / next action | Acceptance gate |
| --- | --- | --- |
| Home and year picker | Fixed preview blocker and modal boundary; simplify repeated labels | Year preference survives refresh without cross-account inheritance |
| Year/semester/module navigation | Preserve Semester 1 default; align card hierarchy | Keyboard and touch navigation across Years 1–3 |
| Mode, subject and chapter selection | Keep study bank separate from past exams; wrap long titles | Counts reconcile with published banks; no content relocation in visual refactor |
| Quiz and results | Maintain compact header and unified grading | True/false feedback, sound, results and missed retry agree; no answer leakage |
| History | Maintain exact stored attempt results; distinguish incomplete attempts | Legacy result opens correctly without assigning unknown records to a guessed module |
| Search | Add current-year scope, ranking, complete results and stable deep links | See search plan |
| Marks calculator | Consistent labelled inputs and target sizes | GIT totals 260 including 10 activities; pass conditions and rounding remain tested |
| My Learning / Performance | Consolidate into one hub and remove duplicated statistics | See unified hub plan |
| Authentication/account | Clear selection/sync states; no endless blocking overlay | Production auth remains enforced; retry preserves input |
| Report flow / admin | Dense readable review screens; explicit status/actions; stable editing | Owner-only server authorization retained; no destructive action implied by styling |
| Support | Secondary entry under Tools, footer and account menu | Optional support, clear recipient and refund contact; no study interruption |
| Boot / route loading | Eliminate artificial waiting and repeated loading screens | See loading plan |

## Priority and implementation sequence

1. Keep the local accessibility/onboarding fixes and verify preview.
2. Consolidate learning selectors and statistics before designing the hub's final cards.
3. Upgrade search correctness and scoping, then performance and navigation.
4. Replace boot timers with honest readiness and route-level data loading.
5. Refactor remaining pages onto shared Button, Field, Card, Dialog and Status components in small groups. Preserve stable routes and all question IDs.
6. Review admin, report, account and authentication screens with authorised test accounts. Finish physical device checks before publishing.

Detailed specifications: [Unified learning hub](UNIFIED_LEARNING_HUB_MASTER_PLAN.md), [Question search](QUESTION_SEARCH_MASTER_PLAN.md), [Loading](LOADING_EXPERIENCE_MASTER_PLAN.md). Support details remain in [Donation plan](DONATION_PAGE_MASTER_PLAN.md).

## Release checks

- Typecheck, unit/integration suite, production build and clean diff formatting.
- Representative widths 320, 390, 768, 1024 and 1280; portrait/landscape; English/Arabic; both themes; 200% text zoom.
- Keyboard-only navigation, visible focus, accessible names, dialog escape/focus return, screen reader spot checks, reduced motion/transparency and forced colours.
- Real iPhone, Android and iPad/Safari checks; desktop emulation does not prove every physical device works.
- Functional regressions: year and semester default, saved preferences, quiz grading, missed retry, history, calculator, reporting, admin permissions and cloud sync.
- Do not expose secrets, reset student history/XP, or auto-publish support while preparing these changes.

Evidence and remaining scope: [Audit record](verification/apple-design-2026-10-09/README.md).

## Final local pass — 9 October 2026

Admin/report/account/authentication polish and shared controls are implemented locally. Report scrolling is inset; account settings use readable semantic colors; login respects reduced motion; decorative canvas work pauses in hidden tabs. The rejected ECG loader is replaced with a minimal wordmark and real readiness indicator. See [implementation and evidence](REPORT_TRIAGE_IMPLEMENTATION.md).

The source/test/build review is complete for this pass. Fresh browser selection was blocked by browser security policy, so no new screenshot or physical-device certification is claimed. Live owner/provider pilot and actual phone/iPad checks remain release gates. No push or commit was made.
