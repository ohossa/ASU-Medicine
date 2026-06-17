# 🏥 ASU Medical Portal — Improvement Roadmap

> **Purpose:** The best possible website to help ASU medical students in their journey.  
> **Status:** Planning document — no code changed.  
> **Last updated:** 2026-06-14  
> **Sync-safe:** All recommendations preserve `localStorage` keys and cloud-sync contracts unless explicitly noted.

---

## 📊 Executive Summary

| Dimension | # Recs | Priority |
|-----------|--------|----------|
| **Question Data & Content Quality** | 12 | 🔥 Highest |
| **Design / UI** | 10 | 🔥 High |
| **Accessibility** | 10 | 🔥 High |
| **Performance** | 8 | ⚡ Medium-High |
| **Code / Architecture** | 7 | ⚡ Medium |
| **Features & Gamification** | 5 | 🎯 Medium |
| **TOTAL** | **52** | |

> **Your stated priorities:** content quality (prevent future errors, improve chapter sorting) + visual design.

---

## 🚀 Quick Wins — Do These First (< 1 day each)

| # | Recommendation | File(s) | Effort |
|---|---------------|---------|--------|
| QW1 | **Replace 1.4MB favicon.png** with a purpose-built 192×192 + 512×512 WebP/PNG set (total < 40KB) | `public/favicon.png`, `public/manifest.json`, `index.html` | Quick |
| QW2 | **Add `loading="lazy"`** to all below-the-fold `<img>` tags | `ClinicalCaseSolver.tsx`, `ImageWithFallback.tsx` | Quick |
| QW3 | **Add `aria-pressed`** to ResultsDashboard filter buttons (`All` / `Incorrect` / `Flagged`) | `ResultsDashboard.tsx` | Quick |
| QW4 | **Add `aria-live="polite"` announcements** for correct/incorrect answer feedback | `QuizInterface.tsx` | Quick |
| QW5 | **Add explicit `width`/`height`** to ClinicalCaseSolver scan image to prevent CLS | `ClinicalCaseSolver.tsx` | Quick |
| QW6 | **Increase question-grid mobile touch targets** from `h-9` (36px) to `h-11` (44px) minimum | `QuizInterface.tsx` | Quick |
| QW7 | **Add `defer` to `<script>` tag** in index.html for explicit loading intent | `index.html` | Quick |
| QW8 | **Preconnect Clerk auth domain** (`*.clerk.accounts.dev`) to shave DNS + TLS setup time | `index.html` | Quick |
| QW9 | **Add `motion-reduce:` prefix** to `wrong-shake` animation + global background blobs | `QuizInterface.tsx`, `App.tsx` inline styles, `theme.css` | Quick |
| QW10 | **Add manifest `screenshots` + `categories`** for rich Chrome install UI | `public/manifest.json` | Quick |

---

## 🧠 Dimension 1 — Question Data & Content Quality (12 recs)

> **Why this matters:** Your #1 priority. The import pipeline is the engine of the entire platform. If data is messy, students lose trust.

### 1.1 Add `difficulty` field (1–5) to canonical question schema
- **Current:** No difficulty rating exists. Every question is treated as equal weight.
- **Proposed:** Add `difficulty: 1 | 2 | 3 | 4 | 5` to `Question` and `SubQuestion` in `types.ts`, update `import-batch.ts` to parse/assign it, and update the conversion prompt in `CONVERSION_PROMPTS_MASTER.md`.
- **Student benefit:** Adaptive quizzing — weaker students get easier questions first. AI tutoring can scaffold.
- **Complexity:** Medium
- **Files:** `src/app/types.ts`, `data-format-v2/scripts/import-batch.ts`, `ADDING_QUESTIONS.md`

### 1.2 Add `estimatedTimeSeconds` per question
- **Current:** No pacing data. Exam simulation is impossible.
- **Proposed:** Add `estimatedTimeSeconds?: number` to `Question`. Auto-populate during import (e.g., MCQ = 60s, Essay = 300s, Case = 600s) with manual override.
- **Student benefit:** Timed exam mode feels realistic. Students learn pacing.
- **Complexity:** Medium
- **Files:** `src/app/types.ts`, `data-format-v2/scripts/import-batch.ts`, `QuizInterface.tsx`

### 1.3 Add Bloom's Taxonomy level (`bloomLevel`)
- **Current:** Questions are flat. No way to filter by cognitive level.
- **Proposed:** Add `bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create'`.
- **Student benefit:** Students can focus on "application" questions before exams. Curriculum mapping for professors.
- **Complexity:** Medium
- **Files:** `src/app/types.ts`, `import-batch.ts`, `CONVERSION_PROMPTS_MASTER.md`

### 1.4 Replace free-text `keyConcept` with structured `tags: string[]`
- **Current:** `keyConcept` is a single uncontrolled sentence. Hard to search or cluster.
- **Proposed:** Add `tags: string[]` alongside `keyConcept`. Auto-extract tags from `keyConcept` via AI during import.
- **Student benefit:** "Show me all questions tagged `oligodendrocytes` across all modules."
- **Complexity:** Medium
- **Files:** `src/app/types.ts`, `import-batch.ts`, `QuizInterface.tsx`

### 1.5 Add first-class media support (`imageUrl`, `videoUrl`, `audioUrl`)
- **Current:** Zero media fields. No diagrams, ECGs, histology slides, or heart sounds.
- **Proposed:** Add `imageUrl?: string`, `videoUrl?: string`, `audioUrl?: string` to `Question`. Host images in `public/questions/` or S3/CDN.
- **Student benefit:** Medical education is VISUAL. A neuroanatomy question without a brainstem image is incomplete.
- **Complexity:** Large
- **Files:** `src/app/types.ts`, `validate-banks.ts`, `QuizInterface.tsx`, `ClinicalCaseSolver.tsx`

### 1.6 Fix lecture-number defaults that destroy granularity
- **Current:** When `lecture` is omitted, importer falls back to `chapter.id` (e.g., `2`). `data.ts` hardcodes `lecture: 1`.
- **Proposed:** If lecture is missing, leave it `undefined` and let the UI show "—" instead of a fake number. Add a validation warning during import.
- **Student benefit:** Filtering by "Lecture 4" actually works.
- **Complexity:** Quick
- **Files:** `data-format-v2/scripts/import-batch.ts`, `src/app/data.ts`

### 1.7 Validate and flag generic placeholder explanations
- **Current:** Default explanation is `"Review the related lecture material for the rationale."` — zero learning value.
- **Proposed:** `validate-banks.ts` should reject/warn on this exact string during import.
- **Student benefit:** Every question teaches something, not just points to a textbook.
- **Complexity:** Quick
- **Files:** `data-format-v2/scripts/import-batch.ts`, `validate-banks.ts`

### 1.8 Improve duplicate detection for content upgrades
- **Current:** Duplicates keyed solely by normalized `text + options`. A revised question with a better explanation is skipped.
- **Proposed:** Include `explanation` hash in the duplicate key, or support an explicit `"revision"` workflow with `--force-update` flag.
- **Student benefit:** Content editors can improve questions without manual JSON surgery.
- **Complexity:** Medium
- **Files:** `data-format-v2/scripts/import-batch.ts`

### 1.9 Close module coverage gap (30 modules have no question bank)
- **Current:** Only 5 JSON files exist: `MCNS-2`, `MEM-2`, `MSS-2`, `P3-2`, `R-2`.
- **Proposed:** Add placeholder JSONs for all 35 modules with a `"comingSoon": true` flag so the UI shows them gracefully instead of empty states.
- **Student benefit:** Students see the full curriculum roadmap. Reduces "where are Year 3 questions?" confusion.
- **Complexity:** Quick (bulk file creation)
- **Files:** `src/imports/year-*/semester-*/*`

### 1.10 Implement chapter-keyword matching for auto-sorting
- **Current:** Chapter sorting uses chapter title fuzzy match. You asked for keywords per chapter to improve accuracy.
- **Proposed:** Add a `keywords: string[]` array to each chapter in the canonical JSON. The importer matches questions to chapters by keyword overlap score.
- **Student benefit:** Much more accurate chapter routing. Fewer misplaced questions.
- **Complexity:** Medium
- **Files:** `data-format-v2/scripts/import-batch.ts`, canonical module JSONs

### 1.11 Support revision workflow in bulk importer
- **Current:** Pipeline only supports "add" or "skip". No update-in-place.
- **Proposed:** Add `--revision-id` flag or detect improved fields (better explanation, added keyConcept) and merge instead of skip.
- **Student benefit:** Content teams can iterate quickly.
- **Complexity:** Medium
- **Files:** `data-format-v2/scripts/import-ready.ts`, `import-batch.ts`

### 1.12 Reserve AI analytics fields (`avgCorrectRate`, `totalAttempts`, `discriminationIndex`)
- **Current:** No usage analytics stored on questions.
- **Proposed:** Add optional analytics fields to Question schema. Back-fill from usage logs later.
- **Student benefit:** Future AI tutor can recommend weakest areas based on real student performance.
- **Complexity:** Quick (schema only)
- **Files:** `src/app/types.ts`

---

## 🎨 Dimension 2 — Design / UI (10 recs)

### 2.1 Show live streak/XP/level during quiz
- **Current:** `pulseEngine` tracks streak/energy/mood but UI never surfaces it. Only canvas background noise and occasional `LevelUpOverlay`.
- **Proposed:** Add a subtle top-bar HUD: 🔥 streak count, ⭐ XP bar, level badge.
- **Student benefit:** Psychological reinforcement loop. Correct answers feel rewarding in real-time.
- **Complexity:** Medium
- **Files:** `src/app/components/QuizInterface.tsx`, `src/app/lib/pulseEngine.ts`

### 2.2 Add per-question countdown timer + urgency indicator
- **Current:** Only elapsed timer. `timerUrgency` field in pulseEngine is dead code.
- **Proposed:** Configurable per-question timer (e.g., MCQ 60s, Essay 300s) with color-coded urgency ring (green → amber → red).
- **Student benefit:** Exam simulation feels realistic. Builds time-pressure skills.
- **Complexity:** Medium
- **Files:** `QuizInterface.tsx`, `pulseEngine.ts`

### 2.3 Add swipe navigation for mobile questions
- **Current:** Strictly button-based Previous/Next. No touch gestures.
- **Proposed:** `onTouchStart/onTouchEnd` horizontal swipe detector on the question card. Use `motion` drag handler with snap-back on insufficient swipe distance.
- **Student benefit:** Native-app feel on phones. One-handed study during commutes.
- **Complexity:** Medium
- **Files:** `QuizInterface.tsx`

### 2.4 Add topic-level breakdown + historical trend in ResultsDashboard
- **Current:** Single-session score only. No trajectory over time.
- **Proposed:** Bar chart per subject/chapter showing accuracy trend across last 5 sessions. Recommend "Top 3 weakest topics."
- **Student benefit:** Students understand exactly where to focus next.
- **Complexity:** Large
- **Files:** `ResultsDashboard.tsx`, `AnalyticsDashboard.tsx`

### 2.5 Redesign matching questions for better UX
- **Current:** Native `<select>` with small chevron. No drag-and-drop or card-swap.
- **Proposed:** Tappable card-pairing interface with haptic feedback (on supported devices).
- **Student benefit:** Less cognitive load. More tactile and satisfying.
- **Complexity:** Large
- **Files:** `QuizInterface.tsx`

### 2.6 Add "Expand All Explanations" toggle in ResultsDashboard
- **Current:** Each explanation is individually collapsed. Reviewing 50 questions = 50 clicks.
- **Proposed:** Master toggle: "Expand All". Default to expanded for incorrect answers only.
- **Student benefit:** Post-session review is frictionless.
- **Complexity:** Quick
- **Files:** `ResultsDashboard.tsx`

### 2.7 Add pause/resume with timer freeze
- **Current:** Timer runs unconditionally even when shortcuts/grid modals are open.
- **Proposed:** Pause timer on overlay open. Resume on close. Optional `usePageVisibility` tab-switch pause.
- **Student benefit:** Fair play. Checking shortcuts or the bathroom break doesn't penalize time.
- **Complexity:** Medium
- **Files:** `QuizInterface.tsx`

### 2.8 Improve LevelUpOverlay with i18n and accessibility
- **Current:** Bare `🧬` emoji with no `role="img"`, `aria-label`, or translatable text.
- **Proposed:** `aria-label="Level up: Vitals rising!"`. Pipe text through `t()`.
- **Student benefit:** Screen readers and Arabic students get proper feedback.
- **Complexity:** Quick
- **Files:** `LevelUpOverlay.tsx`, LanguageContext translations

### 2.9 Add module completion progress rings on Dashboard
- **Current:** Dashboard cards show static stats. No visual completion indicator.
- **Proposed:** Ring chart per module: % of chapters fully studied (all questions answered at least once).
- **Student benefit:** Immediate visual motivation. "I'm 72% done with CNS."
- **Complexity:** Medium
- **Files:** `pages/Dashboard.tsx`, `SyllabusTracker.tsx`

### 2.10 Subject-specific color theming per module
- **Current:** `subjectColor` is mapped globally. No per-module accent.
- **Proposed:** Each module gets a unique accent color that tints the header, progress bars, and buttons. E.g., CNS = purple, Endocrine = teal.
- **Student benefit:** Visual identity makes modules memorable.
- **Complexity:** Medium
- **Files:** `types.ts`, `Dashboard.tsx`, `QuizInterface.tsx`, `theme.css`

---

## ♿ Dimension 3 — Accessibility (10 recs)

### 3.1 Add `aria-live` announcements for quiz answer states
- **Current:** Visual-only feedback (green/red borders, check/X icons, shake animation).
- **Proposed:** Hidden `aria-live="polite"` region that announces "Correct. Cranial nerve VI exits at the pontomedullary junction." or "Incorrect. The correct answer was B."
- **Student benefit:** Screen-reader users know immediately if they were right and why.
- **Complexity:** Quick
- **Files:** `QuizInterface.tsx`

### 3.2 Trap focus in keyboard shortcuts modal + grid panel
- **Current:** Overlays lack `FocusTrap`, `aria-modal`, and `aria-live`. `Esc` doesn't close them.
- **Proposed:** Wrap in `<dialog>` or a focus trap. `Esc` closes. Focus returns to trigger on close.
- **Student benefit:** Focus doesn't drift "behind" the overlay.
- **Complexity:** Medium
- **Files:** `QuizInterface.tsx`

### 3.3 Respect `prefers-reduced-motion` globally
- **Current:** Blob animations, `wrong-shake`, entrance/exit variants run unconditionally.
- **Proposed:** Wrap in `motion-reduce:` Tailwind prefix or `reducedMotion` prop on `motion` components.
- **Student benefit:** Users with vestibular disorders aren't affected by animations.
- **Complexity:** Quick
- **Files:** `QuizInterface.tsx`, `App.tsx` inline styles, `theme.css`

### 3.4 Add screen-reader labels to year/semester/module selection cards
- **Current:** Large clickable surfaces are `<div>` or `<button>` without `aria-label`.
- **Proposed:** `aria-label="Year 2 — 6 modules, 540 marks"` on each card.
- **Student benefit:** Screen readers describe what it is before selection.
- **Complexity:** Quick
- **Files:** `App.tsx`, `YearModules.tsx`, `Dashboard.tsx`

### 3.5 Ensure 44×44px minimum touch targets across the app
- **Current:** `UserButton` is `w-9 h-9` (36px). Question grid buttons are 36px on mobile. Icon-only buttons are similarly small.
- **Proposed:** Audit all `w-8`, `w-9`, `h-8`, `h-9` interactive elements and bump to minimum `w-11 h-11` (44px).
- **Student benefit:** WCAG 2.5.5 compliance. Easier tapping for motor-impaired users.
- **Complexity:** Medium
- **Files:** Across all components (grep for `w-9`, `h-9`, `w-8`, `h-8` on interactive elements)

### 3.6 Add `role` and `aria-pressed` to custom toggle buttons
- **Current:** Filter buttons in ResultsDashboard visually change color but have no accessible state.
- **Proposed:** `aria-pressed={isActive}` + `role="button"`.
- **Student benefit:** Screen readers announce which filter is active.
- **Complexity:** Quick
- **Files:** `ResultsDashboard.tsx`, `QuizInterface.tsx`

### 3.7 Ensure essay grading buttons are keyboard-reachable after reveal
- **Current:** After reveal, focus stays on the body. Tab order is long.
- **Proposed:** `gradingButtonRef.current?.focus()` after reveal so Enter/1/2 works immediately.
- **Student benefit:** Keyboard-only users can grade without excessive tabbing.
- **Complexity:** Quick
- **Files:** `QuizInterface.tsx`

### 3.8 Add `aria-label` to icon-only buttons
- **Current:** Many `<button>` elements contain only an icon (e.g., flag, settings, grid).
- **Proposed:** Every icon-only button gets `aria-label={t('flagQuestion')}` or equivalent.
- **Student benefit:** Screen readers describe the action.
- **Complexity:** Quick
- **Files:** `QuizInterface.tsx`, `App.tsx`, `MarksCalculator.tsx`

### 3.9 Use semantic `<main>`, `<nav>`, `<aside>` instead of generic `<div>`
- **Current:** Many page regions use `<div className="...">` without semantic roles.
- **Proposed:** Replace top-level layout divs with `<main>`, `<nav>`, `<aside>`, `<section>`.
- **Student benefit:** Screen reader users can jump to regions with shortcuts.
- **Complexity:** Medium
- **Files:** `App.tsx`, `Dashboard.tsx`, `QuizInterface.tsx`

### 3.10 Add high-contrast mode support
- **Current:** Only light/dark themes. No high-contrast.
- **Proposed:** Detect `prefers-contrast: high` and use `border-black/60` + solid backgrounds instead of glassmorphism.
- **Student benefit:** Legibility for low-vision users.
- **Complexity:** Medium
- **Files:** `theme.css`, `styles/index.css`

---

## ⚡ Dimension 4 — Performance (8 recs)

### 4.1 Lazy-load module question banks instead of eager glob
- **Current:** `data.ts` uses `import.meta.glob('../imports/**/*.json', { eager: true })`, pulling ~792KB JSON into the initial JS bundle.
- **Proposed:** Switch to dynamic `import()` per module. Load Year-2 MCNS-2 only when the student selects it.
- **Student benefit:** First paint drops by ~500ms on mobile. Students see the dashboard instantly.
- **Complexity:** Medium
- **Files:** `src/app/data.ts`, `vite.config.ts`

### 4.2 Fix Service Worker precache for hashed JS/CSS chunks
- **Current:** `sw.js` only precaches 6 top-level files. No hashed `dist/assets/` chunks.
- **Proposed:** Inject a Workbox precache manifest at build time, or maintain a `dist/assets/` manifest that the SW reads.
- **Student benefit:** True offline experience. App works without network after first install.
- **Complexity:** Large
- **Files:** `public/sw.js`, `vite.config.ts`

### 4.3 Replace 1.4MB favicon with optimized icon set
- **Current:** Single `favicon.png` is 1.4MB and reused as 192×192 and 512×512.
- **Proposed:** Generate 192px (~10KB) and 512px (~25KB) WebP/PNGs. Use `<link rel="icon">` for favicon and manifest for PWA icons.
- **Student benefit:** Faster cold loads. Less data on repeat visits.
- **Complexity:** Quick
- **Files:** `public/favicon.png`, `public/manifest.json`, `index.html`

### 4.4 Add `loading="lazy"` to images + deferred offscreen content
- **Current:** Zero lazy loading. All images download on first paint.
- **Proposed:** Add `loading="lazy"` to all below-the-fold images. Lazy-load `ClinicalCaseSolver` and `ImageWithFallback` content.
- **Student benefit:** Reduced data usage on mobile. Faster LCP.
- **Complexity:** Quick
- **Files:** `ClinicalCaseSolver.tsx`, `ImageWithFallback.tsx`

### 4.5 Preconnect Clerk, analytics, and ASU domains
- **Current:** No `<link rel="preconnect">` or `<link rel="dns-prefetch">`.
- **Proposed:** Add preconnect hints for Clerk auth, Vercel Analytics, and any external API.
- **Student benefit:** Faster auth check and avatar load on cold start.
- **Complexity:** Quick
- **Files:** `index.html`

### 4.6 Preload Arabic font subset (Amiri)
- **Current:** Only Latin subsets of Manrope/Archivo are preloaded. Arabic font downloads late.
- **Proposed:** Add `<link rel="preload" href="/fonts/amiri-*-arabic.woff2">` with `media="(min-resolution: 0.001dpcm)"` or unconditional.
- **Student benefit:** Arabic users see correct font immediately. No FOUT.
- **Complexity:** Quick
- **Files:** `index.html`, `public/fonts/`

### 4.7 Add `reportCompressedSize: false` to vite.config.ts for faster CI builds
- **Current:** Vite computes gzip sizes for every chunk, slowing CI.
- **Proposed:** Add `build.reportCompressedSize: false`, `build.chunkSizeWarningLimit: 600`.
- **Student benefit:** Faster deployments = more frequent updates.
- **Complexity:** Quick
- **Files:** `vite.config.ts`

### 4.8 Add `<link rel="prefetch">` for high-probability routes
- **Current:** No route prefetching. Browser discovers chunks after navigation starts.
- **Proposed:** After dashboard loads, prefetch `/year-2` and `/marks-calculator` chunks.
- **Student benefit:** Subsequent navigations feel instant.
- **Complexity:** Medium
- **Files:** `pages/Dashboard.tsx`, `main.tsx`

---

## 🏗️ Dimension 5 — Code / Architecture (7 recs)

### 5.1 Extract QuizInterface state machine into `useQuizEngine` hook
- **Current:** `QuizInterface.tsx` is 1,193 lines. State logic (timer, navigation, scoring, answer validation) is interleaved with JSX.
- **Proposed:** Extract pure state machine: `useQuizEngine({ questions, onFinish })` returning `{ current, answers, timer, goTo, submitAnswer, revealAnswer, gradeEssay, ... }`.
- **Student benefit:** More stable quiz. Fewer bugs. Easier to test.
- **Complexity:** Large
- **Files:** `QuizInterface.tsx`, new `src/app/hooks/useQuizEngine.ts`

### 5.2 Type the remaining `any` types in data.ts
- **Current:** ~20 `any` types remain in raw JSON parser functions.
- **Proposed:** Replace with `zod` schemas or at least specific interfaces for incoming batch format.
- **Student benefit:** Fewer runtime errors when importing new modules. Type-safe data pipeline.
- **Complexity:** Medium
- **Files:** `src/app/data.ts`, `data-format-v2/scripts/import-batch.ts`

### 5.3 Add unit tests for `checkAnswerCorrect` and score validators
- **Current:** Zero test files. `checkAnswerCorrect` handles 6 question types with edge cases.
- **Proposed:** Add Vitest + `happy-dom`. Cover MCQ, Essay, Matching, FillBlank, CaseStudy, TrueFalse.
- **Student benefit:** Bug prevention. Confidence when adding new question types.
- **Complexity:** Medium
- **Files:** `src/app/utils/quiz.test.ts`, `src/app/utils/safeStorage.test.ts`

### 5.4 Add route-level error boundaries
- **Current:** Only one top-level `<ErrorBoundary>`.
- **Proposed:** Wrap each major route (`/quiz`, `/marks-calculator`, `/analytics`) with its own error boundary so a crash in one doesn't take down the whole app.
- **Student benefit:** If quiz crashes, they can still access marks calculator without refresh.
- **Complexity:** Medium
- **Files:** `src/app/App.tsx`, `FeatureErrorBoundary.tsx`

### 5.5 Consolidate `useCloudSync` polling strategy
- **Current:** Cloud sync pushes on every `localStorage` change with no debounce.
- **Proposed:** Add a 2-second debounce + exponential backoff on failures. Show "Syncing…" indicator.
- **Student benefit:** Less API noise. Students know their progress is saved.
- **Complexity:** Medium
- **Files:** `src/app/hooks/useCloudSync.ts`

### 5.6 Add ESLint type-aware rules and react-specific plugins
- **Current:** Basic ESLint config. No type-aware linting.
- **Proposed:** Enable `tseslint.configs.recommendedTypeChecked` + `eslint-plugin-react-x` + `eslint-plugin-react-dom`.
- **Student benefit:** Catches bugs before build. Better code quality = fewer crashes.
- **Complexity:** Medium
- **Files:** `eslint.config.js`

### 5.7 Add `zod` validation at import pipeline entry
- **Current:** JSON is parsed but never validated against a schema.
- **Proposed:** Define `zod` schemas for incoming batch format. Reject malformed batches before they pollute the canonical bank.
- **Student benefit:** Corrupt questions never reach students.
- **Complexity:** Medium
- **Files:** `data-format-v2/scripts/validate-banks.ts`, `import-batch.ts`

---

## 🎯 Dimension 6 — Features & Gamification (5 recs)

### 6.1 Add spaced repetition / Smart Review mode
- **Current:** Questions are presented linearly or randomly. No re-testing of weak areas.
- **Proposed:** After a session, track incorrect/pending questions. Offer "Review Mistakes" mode that prioritizes them with increasing intervals (1 day → 3 days → 7 days).
- **Student benefit:** Evidence-based learning (Ebbinghaus forgetting curve). Students retain knowledge longer.
- **Complexity:** Large
- **Files:** `QuizInterface.tsx`, `progress.tsx`, `src/app/utils/storage.ts`

### 6.2 Add peer leaderboard or class average comparison
- **Current:** Solo experience. No social comparison.
- **Proposed:** Anonymous aggregate stats per module (e.g., "You scored 85%. Class average: 72%.")
- **Student benefit:** Motivation through gentle competition. Context for their performance.
- **Complexity:** Large
- **Files:** `ResultsDashboard.tsx`, `api/` (backend endpoint)

### 6.3 Add "Weakest Topics" auto-recommendation
- **Current:** Dashboard shows available questions but no personalized guidance.
- **Proposed:** Based on last 5 sessions, automatically surface: "Your weakest areas: 1) Cranial Nerves (45%), 2) Cerebellum Pathways (52%). Start a focused session?"
- **Student benefit:** Removes decision fatigue. Students know exactly what to study.
- **Complexity:** Medium
- **Files:** `AnalyticsDashboard.tsx`, `Dashboard.tsx`

### 6.4 Add daily streak + study streak calendar
- **Current:** No streak tracking visible.
- **Proposed:** Heatmap calendar (GitHub-style) on Dashboard showing study days. Reset warning: "2 days until your streak breaks!"
- **Student benefit:** Habit formation. Consistent daily study.
- **Complexity:** Medium
- **Files:** `Dashboard.tsx`, `progress.tsx`

### 6.5 Add AI-powered tutoring hints (Claude/OpenAI)
- **Current:** No AI integration despite having `@google/genai` and `openai` in dev dependencies.
- **Proposed:** When a student answers incorrectly twice, offer: "💡 Hint: Think about which cranial nerve is responsible for lateral eye movement." Powered by Claude/OpenAI with syllabus context.
- **Student benefit:** Socratic learning. Reduces frustration without giving the answer.
- **Complexity:** Large
- **Files:** `QuizInterface.tsx`, `api/` (backend endpoint for AI hint generation)

---

## ✅ Master Checklist

Tick these off as you implement. Bold = Quick Wins.

### Content & Data
- [ ] **1.1** Add `difficulty` field
- [ ] **1.2** Add `estimatedTimeSeconds`
- [ ] **1.3** Add `bloomLevel`
- [ ] **1.4** Add `tags: string[]`
- [ ] **1.5** Add media support (`imageUrl`, `videoUrl`, `audioUrl`)
- [ ] **1.6** Fix lecture defaults
- [ ] **1.7** Flag placeholder explanations
- [ ] **1.8** Improve duplicate detection
- [ ] **1.9** Close module coverage gap
- [ ] **1.10** Add chapter-keyword matching
- [ ] **1.11** Support revision workflow
- [ ] **1.12** Reserve analytics fields

### Design / UI
- [ ] **2.1** Live streak/XP HUD
- [ ] **2.2** Countdown timer + urgency
- [ ] **2.3** Swipe navigation
- [ ] **2.4** Topic breakdown + trends
- [ ] **2.5** Matching redesign
- [ ] **2.6** Expand All Explanations
- [ ] **2.7** Pause/resume timer
- [ ] **2.8** LevelUpOverlay i18n
- [ ] **2.9** Module completion rings
- [ ] **2.10** Subject-specific accents

### Accessibility
- [ ] **3.1** `aria-live` answer announcements
- [ ] **3.2** Focus trap in modals
- [ ] **3.3** `prefers-reduced-motion`
- [ ] **3.4** `aria-label` on selection cards
- [ ] **3.5** 44px touch targets
- [ ] **3.6** `aria-pressed` on toggles
- [ ] **3.7** Focus grading buttons after reveal
- [ ] **3.8** `aria-label` on icon-only buttons
- [ ] **3.9** Semantic HTML landmarks
- [ ] **3.10** High-contrast mode

### Performance
- [ ] **4.1** Lazy-load JSON banks
- [ ] **4.2** Fix SW precache
- [ ] **4.3** **Optimize favicon**
- [ ] **4.4** **Lazy-load images**
- [ ] **4.5** **Preconnect Clerk**
- [ ] **4.6** **Preload Arabic font**
- [ ] **4.7** **Vite build tweaks**
- [ ] **4.8** Prefetch routes

### Code / Architecture
- [ ] **5.1** Extract `useQuizEngine` hook
- [ ] **5.2** Type `any`s in data.ts
- [ ] **5.3** Add unit tests
- [ ] **5.4** Route error boundaries
- [ ] **5.5** Debounce cloud sync
- [ ] **5.6** Type-aware ESLint
- [ ] **5.7** `zod` validation

### Features
- [ ] **6.1** Spaced repetition
- [ ] **6.2** Peer leaderboard
- [ ] **6.3** Weakest Topics recommendation
- [ ] **6.4** Daily streak calendar
- [ ] **6.5** AI tutoring hints

---

## 🗓️ Suggested Implementation Order

| Phase | Items | Focus |
|-------|-------|-------|
| **Week 1** | QW1–QW10 + 1.6, 1.7, 1.9, 2.6, 2.8, 3.1–3.8 | Quick Wins + Safety |
| **Week 2** | 1.1–1.4, 1.10, 1.12, 2.9, 4.5–4.8 | Data foundation |
| **Week 3** | 2.1–2.3, 2.7, 3.9–3.10, 4.1 | Quiz UX polish |
| **Month 2** | 1.5, 1.8, 1.11, 2.4–2.5, 4.2, 5.1–5.3 | Large features |
| **Month 3** | 6.1–6.5 | AI + advanced gamification |

---

## 🛡️ Safety Notes

- **No `localStorage` keys are changed** in any Quick Win or most Medium items.
- **Cloud sync** continues to work as-is for all items except 5.5 (which improves it).
- **Data format changes** (1.1–1.5, 1.10–1.12) are **additive only** — backward compatible with existing JSON banks.
- **Question banks** in `src/imports/` are untouched by Quick Wins.

---

*End of plan. If you want me to implement any of these, just say the number(s) and I'll commit each one separately with full rollback safety.*
