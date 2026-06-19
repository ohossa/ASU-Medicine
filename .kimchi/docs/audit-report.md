# Comprehensive Audit Report

**Date:** 2026-06-18
**Scope:** api/hint.ts, QuizInterface.tsx, AIChatPanel.tsx, useHintSystem.ts, useQuizEngine.ts, ResultsDashboard.tsx, data.ts, App.tsx
**Tests:** 131/131 passed
**Build:** Passes
**TypeScript (src):** Zero errors
**TypeScript (api):** Not covered by project tsconfig — errors found (see below)

---

## Verdict: NEEDS_FIXES

---

## Issue 1 [CRITICAL]: api/hint.ts is outside TypeScript project coverage
- **File:** `tsconfig.app.json`, `tsconfig.node.json`
- **Description:** `tsconfig.app.json` only includes `"src"`. `tsconfig.node.json` only includes `vite.config.ts`. The `api/` directory is excluded entirely. Consequently, `npx tsc --noEmit` passes with zero errors while `api/hint.ts` contains real TypeScript errors.
- **Fix:** Add `api/**/*.ts` to the `include` array of `tsconfig.node.json` (or create a dedicated `tsconfig.api.json` referenced by the root `tsconfig.json`).

## Issue 2 [CRITICAL]: api/hint.ts references non-existent properties on HintRequest
- **File:** `api/hint.ts`
- **Lines:** 396-397 (`req.modelAnswer`), 400-401 (`req.blanks`)
- **Description:** `buildSystemPrompt` reads `req.modelAnswer` and `req.blanks`, but these fields are not declared in the `HintRequest` interface. This causes a TypeScript error (`TS2339`) when the file is actually checked.
- **Fix:** Add `modelAnswer?: string; blanks?: string[];` to the `HintRequest` interface, or remove the references from `buildSystemPrompt`.

## Issue 3 [CRITICAL]: AI tutor system prompt enforces Socratic delay, violating explicit product requirement
- **File:** `api/hint.ts`
- **Lines:** 245-246, 248, 253, 256
- **Description:** The system prompt contains:
  - `"You follow Socratic principles: you NEVER give the full answer immediately."`
  - `"NEVER give the full answer on the first message. Begin with a Socratic question."`
  The CRITICAL CONTEXT explicitly states: "The user wants the AI tutor to answer IMMEDIATELY (not Socratic delay)". This is a direct spec violation.
- **Fix:** Remove the Socratic-restriction rules from `buildSystemPrompt`. Allow the model to give the answer directly in the first message.

## Issue 4 [CRITICAL]: AI tutor panel does not automatically trigger the first hint
- **File:** `src/app/components/QuizInterface.tsx`, `src/app/hooks/useHintSystem.ts`
- **Description:** When a student answers a question, `AIChatPanel` appears but `messages` is empty. The student must manually type a message before receiving any AI feedback. Combined with the Socratic prompt, this means the AI tutor never answers immediately. The product requirement is for the AI tutor to answer immediately after the student answers.
- **Fix:** In `QuizInterface.tsx`, auto-send an initial message (e.g., the built-in initial prompt) when `isCompleted` becomes true and `chatMessages.length === 0`. In `useHintSystem.ts`, expose an `initiate` function that sends the first message without waiting for user input.

## Issue 5 [HIGH]: Case-study fillblank sub-questions never show as correct in quiz UI
- **File:** `src/app/components/QuizInterface.tsx`
- **Line:** `getQuestionStatus` (case/casestudy branch)
- **Description:** The function treats all non-MCQ sub-questions as essay-style, checking for `selfGrade`. Fillblank sub-questions have `{ inputs, submitted }` instead of `selfGrade`. As a result, a completed fillblank sub-question always sets `hasPending = true`, so the parent question can never reach `'correct'` status. This breaks the question palette grid status color and the `isCorrect` flag passed to `useHintSystem`.
- **Fix:** In the case/casestudy branch of `getQuestionStatus`, add an explicit check:
  ```typescript
  if (sq.type === 'fillblank') return ans[sq.id]?.submitted === true;
  ```
  before the generic essay check.

## Issue 6 [HIGH]: useQuizEngine.getAnswerState returns 'incorrect' for fully correct case studies
- **File:** `src/app/hooks/useQuizEngine.ts`
- **Line:** `getAnswerState` (case branch, bottom)
- **Description:** After verifying all sub-questions are done (`allDone === true`), the function falls through to `return 'incorrect'`. It never returns `'correct'`. Although `answerState` is currently unused in `QuizInterface.tsx`, any future consumer of this hook will see completed case studies as incorrect.
- **Fix:** After `if (!allDone) return 'submitted';`, add `return 'correct';` instead of falling through.

## Issue 7 [HIGH]: App routes remount entirely on every navigation (state loss)
- **File:** `src/app/App.tsx`
- **Description:** `AnimatePresence` wraps `Routes`, and `Routes` is keyed with `key={location.pathname}`. This forces React to unmount the entire route tree on every pathname change. All local state inside page components (lazy or eager) is destroyed on navigation. For example, search filters, scroll positions, or form inputs on `QuestionSearch`, `HistoryScreen`, etc. are reset when the user navigates away and back.
- **Fix:** Remove `key={location.pathname}` from `<Routes>`. Use per-route `AnimatePresence` inside each page component, or use the React Router + Framer Motion standard pattern where each route component wraps its own exit animation.

## Issue 8 [HIGH]: Unhandled promise rejection if question bank loading fails
- **File:** `src/app/data.ts`, `src/app/App.tsx`
- **Description:** `ensureDataLoaded` stores a rejected `loadPromise` forever if any JSON file fails to load. `App.tsx` calls `ensureDataLoaded().then(() => setDataReady(true))` without `.catch()`, so a load failure becomes an unhandled promise rejection and the loading screen stays forever.
- **Fix:** In `App.tsx`, add `.catch(() => setDataReady(true))` (or show an error state). In `data.ts`, track load errors separately and allow retry on subsequent calls.

## Issue 9 [HIGH]: Missing root-level ErrorBoundary
- **File:** `src/app/App.tsx`
- **Description:** Only `FeatureErrorBoundary` wraps three specific routes. Routes like `/history`, `/case-solver`, `/flagged-questions`, and the dashboard have no error boundary. A runtime exception in any of these components crashes the entire app to a white screen.
- **Fix:** Wrap the `<Routes>` block in a top-level error boundary, or wrap each `<Route>` element individually.

## Issue 10 [MEDIUM]: QuizInterface.tsx sets dead state `_subAnswers`
- **File:** `src/app/components/QuizInterface.tsx`
- **Line:** `const [_subAnswers, setSubAnswers] = useState<Record<string, any>>({});`
- **Description:** `_subAnswers` is written in a `useEffect` but never read. `renderCaseStudy` reads from `value` (`answers[current]`) instead. This is pure dead state adding unnecessary re-renders.
- **Fix:** Remove `_subAnswers` and `setSubAnswers` entirely; use `answers[current]` or `value` directly.

## Issue 11 [MEDIUM]: `lastFocusedSubQ` ref not cleared on blur
- **File:** `src/app/components/QuizInterface.tsx`
- **Description:** `lastFocusedSubQ.current = subQ.id` is set `onFocus` but never reset `onBlur`. If a user focuses a case-study sub-question textarea, then clicks outside, pressing Enter still reveals the answer for the previously focused sub-question instead of doing nothing.
- **Fix:** Add `onBlur={() => { lastFocusedSubQ.current = null; }}` to each sub-question textarea.

## Issue 12 [MEDIUM]: Invalid Tailwind classes (broken styling)
- **Files:** Multiple
- **Classes found:**
  - `text-rose-655` — `src/app/components/QuizInterface.tsx` (not a valid Tailwind shade)
  - `border-gray-150`, `text-gray-650`, `text-gray-750`, `text-gray-805`, `text-gray-450`, `bg-gray-150`, `hover:bg-gray-250`, `border-gray-205` — `QuizInterface.tsx`, `ResultsDashboard.tsx`, `App.tsx`, `StudyTrackerSelectorModal.tsx`, `FlaggedQuestionsScreen.tsx`, `QuestionSearch.tsx`, `MarksCalculator.tsx`, `LanguageProfilePage.tsx`
  - `text-sky-550`, `text-sky-655` — `QuizInterface.tsx`
  - `text-rose-650` — `ResultsDashboard.tsx`, `MarksCalculator.tsx`
  - `dark:hover:bg-gray-750`, `dark:text-gray-250` — `App.tsx`
  - `hover:bg-gray-850` — `StudyTrackerSelectorModal.tsx`
  - `dark:border-gray-850` — `FlaggedQuestionsScreen.tsx`
- **Description:** These classes produce no CSS output because the theme only defines semantic/custom colors (e.g., `physiology`, `clinical`) plus standard Tailwind colors. Standard grays only go up to `950` in steps of 50/100. Intermediate values like `gray-650`, `gray-250`, `rose-655`, etc. silently fail.
- **Fix:** Convert all invalid numeric shades to the nearest valid Tailwind grade (e.g., `650` -> `600` or `700`; `250` -> `200` or `300`; `655` -> `600`). For files outside the audited scope, apply the same fix.

## Issue 13 [MEDIUM]: useHintSystem body consumption race on JSON parse failure
- **File:** `src/app/hooks/useHintSystem.ts`
- **Line:** JSON parse error branch inside `sendMessage`
- **Description:** When `res.json()` throws, the code calls `res.text()`. If `res.json()` consumed the response body stream, `res.text()` will reject. The `.catch(() => '')` guards this, but `bodyText` then becomes `''`, so `bodyText.includes('<!DOCTYPE')` never matches. In development, the code still falls into `if (import.meta.env.DEV)` which is correct, but the HTML-detection branch below it is unreachable.
- **Fix:** Clone the response before consuming it, or accept that the dev branch works and remove the unreachable HTML branch, or handle the error more cleanly by reading the body only once via `res.clone()`.

## Issue 14 [MEDIUM]: `customUserButton` recreated every render, expensive root re-renders
- **File:** `src/app/App.tsx`
- **Description:** `customUserButton` is a large JSX expression defined directly in render. It is passed to almost every page component. On every state change (e.g., timer ticking in a child route), `MainApp` re-renders and `customUserButton` gets a new identity, triggering downstream re-renders in page components.
- **Fix:** Wrap `customUserButton` in `useMemo` with its actual dependencies (`language`, `studentYear`, `user`, `navigate`, etc.).

## Issue 15 [MEDIUM]: `getYearProgress` executed on every render of Analytics route
- **File:** `src/app/App.tsx`
- **Description:** `getYearProgress` iterates all modules, chapters, and subjects, comparing against localStorage history. It is called inline in JSX for the `/analytics` route. `MainApp` re-renders frequently, and this function re-executes each time while the user is on the analytics page.
- **Fix:** Memoize the result with `useMemo`, or move the computation inside `AnalyticsDashboard` itself.

## Issue 16 [MEDIUM]: Redundant/dead imports in App.tsx
- **File:** `src/app/App.tsx`
- **Imports:** `useDeferredMount`, `FX`, `ClerkThemeTogglePortal`, `SyllabusTracker`, and several Lucide icons that are only used by lazy-loaded children (`Calculator`, `Search`, `Heart`, `Clock`, `Award`, `Sun`, `Moon`, `Settings`, `ArrowLeft`, `Layers`).
- **Fix:** Remove unused imports. For icons used only by lazy children, let the child import them directly so tree-shaking can remove them from the main bundle.

## Issue 17 [MEDIUM]: Accessibility gaps in AIChatPanel
- **File:** `src/app/components/AIChatPanel.tsx`
- **Description:**
  - Message list lacks `aria-live="polite"`; screen readers do not announce incoming AI replies.
  - No focus management on panel open (focus does not move to the input).
  - Typing indicator lacks `aria-busy`.
- **Fix:** Add `aria-live="polite" role="log"` to the messages container. On panel open, focus the textarea. Add `aria-busy={loading}` to the assistant message region.

## Issue 18 [MEDIUM]: Accessibility gaps in QuizInterface
- **File:** `src/app/components/QuizInterface.tsx`
- **Description:**
  - Progress bar is decorative only; no `role="progressbar"` or `aria-valuenow`.
  - Timer changes every second but has no `aria-live` attribute.
  - Keyboard shortcuts popover is not a focus trap; Tab can escape to background controls.
  - Question grid buttons lack `aria-label` describing status (correct/incorrect/flagged).
- **Fix:** Add ARIA attributes to the progress and timer elements. Implement a focus trap in the shortcuts popover (or use `role="dialog"` with `aria-modal="true"`). Add `aria-label` to grid buttons.

## Issue 19 [MEDIUM]: Rate limiter Redis array can grow during bursts
- **File:** `api/hint.ts`
- **Description:** `checkRateLimit` stores arrays of timestamps. During a burst (e.g., 10 requests/second), the array grows to thousands of entries before the next request filters old entries. Redis read/write payload grows linearly with burst size.
- **Fix:** Cap the stored array length at `RATE_LIMIT_MAX`, or use a Redis sorted set / TTL-based key instead of an array.

## Issue 20 [LOW]: NVIDIA adapter returns `source: 'custom'` instead of `'nvidia'`
- **File:** `api/hint.ts`
- **Line:** `return { text, source: 'custom' };`
- **Description:** The `NVIDIAAdapter` returns `source: 'custom'` even though `'nvidia'` or `'nim'` would be more accurate. The `HintResponse` type allows `'custom'`, so this is type-safe but semantically wrong.
- **Fix:** Return `source: 'nvidia'`.

## Issue 21 [LOW]: Slightly misleading eslint-disable comment
- **File:** `src/app/components/ResultsDashboard.tsx`
- **Line:** `// eslint-disable-next-line @typescript-eslint/no-unused-vars`
- **Description:** The next line destructures `t` and `language` from `useLanguage()`. Both are actually used later (`t(...)` and `isRTL`). The eslint-disable is unnecessary.
- **Fix:** Remove the comment.

## Issue 22 [LOW]: `detectProvider` does not strongly default to NVIDIA
- **File:** `api/hint.ts`
- **Description:** `detectProvider` returns `'nvidia'` only if `NVIDIA_API_KEY` is set; otherwise it falls back to `'static'`. The CRITICAL CONTEXT says the backend "defaults to NVIDIA provider". In practice it defaults to whichever key is present, or static. This is not a bug, but the comment at the top of the file could be clarified.
- **Fix:** Either set `HINT_AI_PROVIDER=nvidia` in the deployment config, or update the file comment to match actual behavior.

---

## Tests
All 131 tests pass. However, there are no tests covering:
- `api/hint.ts` (no test file exists for it)
- `QuizInterface.tsx` keyboard shortcut logic
- `App.tsx` routing and error-boundary behavior
- `data.ts` JSON parsing failure paths

## Build
Build succeeds. Chunk size warnings emitted for `MCNS-2` (~2.6 MB) — consider splitting CNS data or compressing it.

## Secrets
No secrets found in any audited file. `.env` and `.env.local` are correctly gitignored.
