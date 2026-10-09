# Startup and loading: implementation master plan

Status: implemented and verified locally, 9 October 2026. No publication. See [implementation and verification report](STUDENT_EXPERIENCE_IMPLEMENTATION.md). The original design and acceptance plan follows.

## Objective

One calm transition into usable content. Returning students should see their saved year immediately from their own cache while cloud refresh happens quietly. Loading must report actual work, recover from failures and never make a ready page wait to finish an animation.

## Current source findings

- `src/app/App.tsx` uses an approximately 2.4-second artificial progress animation plus completion hold. Its data-load catch marks data ready even on failure.
- `src/app/components/LoadingScreen.tsx` has its own timed completion; lazy entry/auth paths can show another loading state after the initial one.
- `src/PortalEntry.tsx` provides an additional lazy entry fallback.
- `src/app/data.ts` calls `loadAllModules().then(refreshQuestionCorrections)` before startup readiness. All module data is a large requirement for a page that only needs a year catalogue.
- Academic-year preference already has account-scoped caching; a confirmed cache should not become a second blocking screen while it refreshes.

## Readiness model

Use one boot coordinator with explicit phases and independent statuses:

| Dependency | Blocks which screen? | Failure behaviour |
| --- | --- | --- |
| Shell/code and small catalogue | Home | Retry with meaningful error; never pretend an empty catalogue loaded |
| Auth session determination | Private study features | Existing Clerk enforcement; sign-in state must not be fabricated |
| Cached year | No network block | Paint account cache immediately; unknown year prompts selection |
| Cloud year refresh | No block with valid cache | Keep cache and show unobtrusive retry status; report failed saves honestly |
| Selected module bank | Its study route | Load route and bank in parallel; retry/offline copy if unavailable |
| Optional published corrections | No block when valid bundled bank exists | Explain bundled version status and retry |
| Other years/modules | Search/all-year views as needed | Background/lazy load with partial readiness clearly labelled |

Do not collapse every failure into `dataReady=true`. Preserve the exact failure for diagnostics without logging tokens or private content.

## Visual behaviour

- Keep the branded vitals motif, reduce decoration and enlarge essential status text. ECG animation is decorative and has a static reduced-motion variant.
- If startup is very fast, render directly. A short 120–200ms delayed indicator avoids flashing a loading overlay; no artificial minimum duration.
- Use an indeterminate indicator for unknown work. Show percentages only when based on measurable transfer/processing progress; do not display 100% while still blocking.
- Keep one loading surface. Route-level skeletons use the destination's geometry; do not return to a full startup screen between tabs.
- Preserve keyboard focus, readable live status and contrast. Avoid announcing every animation frame.
- Errors have specific retry actions. Optional service failures must not block browsing a valid bank.

## Data, cache and update strategy

Separate catalogue/count metadata from module question payloads. Cache by revision/content hash. Load selected module data on demand and preload the next likely route during idle time. Deduplicate concurrent requests; abort stale navigation work where appropriate.

Account preferences remain keyed by authenticated account. Never substitute another account's cached year. Unknown preferences need an explicit choice; local development may use the documented loopback browser-only mode without weakening production.

Review PWA cache policy alongside module lazy loading. Large precache size is not proof every byte blocks startup, so measure actual cold/warm network traffic. Do not blindly cache all API responses or authentication data. Handle new releases without resetting active attempts: finish with the attempt's original bank version, then offer an update. Correctness helpers must remain consistent across cached bundles.

## Measurements and acceptance targets

Capture baseline and improved results on the same device/network: shell paint, LCP, interaction readiness, downloaded bytes, preference resolution, selected module ready, main-thread long tasks and repeated-loader count.

Targets to validate: cached shell usable within 500ms where feasible; cold-load p75 LCP under 2.5 seconds under the chosen test profile; no extra saved-year blocking screen; no forced 2.4-second wait. These are goals, not guaranteed real-world timings. Document test device and network.

## Implementation sequence

1. Instrument current readiness timings without sensitive data.
2. Replace timer-based completion with one tested state machine and explicit errors.
3. Make preferences nonblocking with cache; retain strict cloud-save semantics.
4. Split catalogue and route data; parallelize route imports and selected bank requests.
5. Review PWA revision and stale-attempt behaviour.
6. Profile cold/warm, offline, slow API and reduced motion; compare recorded evidence.

## Tests

Use controllable promises for auth, catalogue, preference and module requests. Cover every arrival order, cached/uncached year, rejected data, optional correction failure, signed-out entry, logout/account switch, rapid route change, retry, offline valid/missing bank and active-attempt update. Assert one visible loading surface, no fake completion and no timer-delayed ready content. Browser checks include mobile Safari and actual slow-network profiles.

Apple skill basis: `references/hig/loading.md` (Best practices; Showing progress), `motion.md`, `accessibility.md`, `typography.md` and `layout.md`. The primary principle is showing useful content as soon as possible.
