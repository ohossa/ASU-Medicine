# 🏥 ASU Medical Portal — Improvement Roadmap (v2)

> **Status:** Updated 2026-06-18 after comprehensive codebase audit + 131 tests + 6 AI tutor builds.  
> **Done so far:** Matching redesign, AI Chat Tutor, useQuizEngine, 135 tests, error boundaries, lazy JSON loading, performance wins, premium loading screen.  
> **Next:** Schema expansion, gamification, countdown timer, spaced repetition, insane design overhaul.

---

## ✅ DONE — Already Shipped (18 items)

| # | Item | Evidence |
|---|------|----------|
| **QW7** | `defer` on `<script>` tag | `index.html` |
| **QW8** | Preconnect Clerk domain | `index.html` |
| **1.9** | Module coverage gap (35 modules mapped) | `data.ts` with all years |
| **2.5** | Matching question redesign (drag-drop, tap, haptics, SVG, bilingual) | `MatchingQuestion.tsx` + 15 tests |
| **2.6** | Expand All Explanations toggle | `ResultsDashboard.tsx:624` |
| **2.7** | Pause/resume timer on overlays | `useQuizEngine.ts:93` |
| **4.1** | Lazy-load JSON banks via `import.meta.glob` | `data.ts` + `data.test.ts` |
| **4.3** | Favicon atlas + WebP/PNG | `public/manifest.json`, `index.html` links |
| **4.4** | `loading="lazy"` on `<img>` | `ImageWithFallback.tsx`, `ClinicalCaseSolver.tsx` |
| **4.5** | Preconnect Clerk + analytics domains | `index.html` |
| **4.6** | Preload Arabic font (Amiri) | `index.html` |
| **4.7** | `reportCompressedSize: false` + `chunkSizeWarningLimit` | `vite.config.ts` |
| **5.1** | Extract `useQuizEngine` hook + 50 tests | `useQuizEngine.ts`, `useQuizEngine.test.ts` |
| **5.3** | Unit tests — `checkAnswerCorrect`, data load, AI panel | 6 test files, 135 tests |
| **5.4** | Route-level error boundaries | `FeatureErrorBoundary` on `/quiz`, `/marks-calculator`, `/analytics` |
| **6.5** | AI-powered tutoring (interactive chat, per-question history, NVIDIA/OpenRouter/Google adapters, bilingual, typing indicator, breakout parsing, rate limit handling) | `AIChatPanel.tsx` (150+ lines), `useHintSystem.ts`, `api/hint.ts`, 135 tests |
| **Loading** | Premium vitals loading screen (ECGMonitor, "Loading vitals…", hairline progress, fade exit) | `LoadingScreen.tsx`, `App.tsx` |
| **Audit** | 22-audit-item fix pass (tsconfig.node.json coverage, fillblank sub-questions, key props, data load rejections, invalid Tailwind shades, rate limiter caps, eslint deps) | 10 commits |

---

## 🔥 P0 — Burn-Down Next (Ship These First)

### Schema Foundation (Blocks Everything Below)

| # | Recommendation | Blocker | Effort |
|---|---------------|---------|--------|
| **1.1** | **Add `difficulty: 1-5` to Question type** | `types.ts` + all JSON banks need backfill | Medium |
| **1.2** | **Add `estimatedTimeSeconds` to Question** | Timer only uses type-defaults (60-600s) | Quick |
| **1.3** | **Add `bloomLevel` taxonomy** | Missing entirely | Medium |
| **1.4** | **Add `tags: string[]` to Question** | Missing entirely | Medium |
| **5.2** | **Fix `any` types in `data.ts`** (20 instances) | `strict: true` blocked in tsconfig | Quick |
| **5.7** | **Add Zod schemas for Question, ChapterData, SubjectData** | No runtime validation today | Medium |

### INSANE Quiz UX

| # | Recommendation | Why it matters | Effort |
|---|---------------|-------------|--------|
| **2.1** | **Live streak / XP / level HUD** | Right now XP is tracked but invisible during quiz — dead feedback loop | Medium |
| **2.2** | **Countdown timer + urgency indicator** | Exam-simulation mode. Students need time-pressure training. Ring animation green → amber → red. | Medium |
| **6.1** | **Spaced repetition / Smart Review** | SM-2 algorithm. After sessions, schedule weakest Qs at increasing intervals (1d → 3d → 7d → 14d). This is THE highest-value learning feature for medical students. | Large |
| **2.9** | **Module completion rings on dashboard** | "I'm 72% done with CNS" — instant dopamine hit | Medium |
| **6.3** | **"Weakest Topics" auto-recommendation** | Post-results: "Start a focused Cranial Nerves session?" Removes decision fatigue. | Medium |

### INSANE Design Overhaul

| # | Recommendation | Impact | Effort |
|---|---------------|--------|--------|
| **INSANE-1** | **Premium exam simulation mode** | Full-screen, no outer UI, just question + timer + progress bar. Dark mode only. Think "flight simulator" for medical exams. Pressure test mode. | Large |
| **INSANE-2** | **3D rotate card reveal on answer** | Instead of instant show, question card flips 180° to reveal explanation. Tactile, Apple-like. | Medium |
| **INSANE-3** | **Sound design overhaul** | Correct = soft chime. Wrong = gentle thud. Streak = satisfying combo sound. Timer urgency = accelerating pulse. Final score = orchestral swell. NOT annoying beeps. | Medium |
| **INSANE-4** | **Confetti physics upgrade** | Not just generic confetti. Module-themed particles: CNS = neural synapses (tiny lightning bolts), Anatomy = red blood cells, Pathology = DNA helix fragments. | Medium |
| **INSANE-5** | **Micro-interactions on every button** | Scale-down on press, haptic on correct, subtle glow on hover. 60fps everywhere. | Medium |
| **INSANE-6** | **Glassmorphism dashboard cards** | Frosted glass with subtle reflections. Think Apple Music's "Browse" cells. | Quick |
| **INSANE-7** | **Animated data visualizations** | Topic accuracy: liquid-fill progress bars. Weak areas: pulsing heatmap. Streak: fire particles. | Medium |
| **INSANE-8** | **Custom cursor on desktop** | Cursor becomes a small glowing orb. On hover over interactive elements, it expands and changes color. | Quick |

---

## 🔥 P1 — High Priority

### Quiz Polish

| # | Recommendation | Effort |
|---|---------------|--------|
| **2.3** | Swipe navigation (mobile) | Medium |
| **2.4** | Topic-level historical trends in ResultsDashboard | Large |
| **2.10** | Subject-specific color theming per module | Medium |
| **3.1** | `aria-live` for quiz answer states (not just matching) | Quick |
| **3.2** | Focus trap in shortcuts modal + grid panel | Medium |
| **3.3** | Global `prefers-reduced-motion` | Quick |
| **3.10** | High-contrast mode support | Medium |

### Gamification

| # | Recommendation | Effort |
|---|---------------|--------|
| **6.2** | Peer leaderboard / class average | Large |
| **6.4** | Daily streak + study streak calendar (GitHub heatmap) | Medium |

### Architecture

| # | Recommendation | Effort |
|---|---------------|--------|
| **4.2** | Fix SW precache (inject hashed chunks at build) | Large |
| **4.8** | Route prefetching for high-probability routes | Medium |
| **5.5** | Debounce cloud sync pull (not just push) | Quick |
| **5.6** | Type-aware ESLint rules | Quick |

---

## ⚡ P2 — Medium Priority

| # | Recommendation | Effort |
|---|---------------|--------|
| **1.5** | Media fields (`imageUrl`, `videoUrl`, `audioUrl`) | Large |
| **1.6** | Fix lecture-number defaults | Quick |
| **1.7** | Validate placeholder explanations | Quick |
| **1.8** | Improved duplicate detection | Medium |
| **1.10** | Chapter-keyword auto-sorting | Medium |
| **1.11** | Bulk importer revision workflow | Medium |
| **1.12** | AI analytics fields (avgCorrectRate, totalAttempts) | Quick |
| **2.8** | LevelUpOverlay bilingual (currently hardcoded EN) | Quick |
| **3.5** | Ensure 44×44px touch targets across app | Medium |
| **3.8–3.9** | Semantic HTML + icon-only `aria-label`s | Quick |
| **4.9** | Add loading skeletons for all async content | Medium |

---

## 🗓️ Suggested Implementation Order

| Phase | Items | Focus |
|-------|-------|-------|
| **Phase 1 (Data First)** | 1.1, 1.2, 1.3, 1.4, 5.2, 5.7 | Schema locks. Once done, everything above can build on it. |
| **Phase 2 (Quiz Crush)** | 2.1, 2.2, 2.3, 2.9, 6.1, INSANE-1, INSANE-2, INSANE-3 | The core study loop. This is what students feel every day. |
| **Phase 3 (Gamification)** | 2.9, 6.3, 6.4, INSANE-4, INSANE-5 | Hooks for retention and motivation. |
| **Phase 4 (Design Overhaul)** | INSANE-6, INSANE-7, INSANE-8 | Polish layer. Only AFTER core loops work. |
| **Phase 5 (A11y + Perf)** | 3.1, 3.2, 3.3, 3.9, 3.10, 4.2, 4.8, 4.9 | Quality-of-life for edge cases. |

---

## 📋 Stack for Implementation

- **React 19 + TypeScript 6.0.3 + Tailwind 4** — stable, proven
- **Vitest + happy-dom + @testing-library/react** — already running 135 tests
- **motion/react** — animation engine
- **Framer Motion** — LoadingScreen, LevelUpOverlay
- **lucide-react** — icons
- **Clerk** — auth + cloud sync + userButton
- **NVIDIA NIM / OpenRouter** — AI tutoring backend
- **Recharts or Tremor** — data viz (new addition needed)

---

## 🎓 Student Impact Score

| Feature | Students Helped | Frequency Used | Learnability |
|---------|-----------------|----------------|------------|
| Spaced Repetition (6.1) | 10/10 | Daily | 1 session |
| Countdown Timer (2.2) | 9/10 | Every quiz | Immediate |
| XP/Streak HUD (2.1) | 8/10 | Every quiz | Immediate |
| Card Flip Reveal (INSANE-2) | 7/10 | Every answer | Immediate |
| Sound Design (INSANE-3) | 7/10 | Every interaction | Immediate |
| Weakest Topics (6.3) | 9/10 | After every session | 1 session |
| Module Rings (2.9) | 6/10 | Dashboard | Immediate |
| Difficulty Sorting (1.1) | 7/10 | Study planning | Requires onboarding |

---

*Plan v2. 27 done, 40+ remaining. This is the roadmap to the holy-shit product. Time is not an excuse.*
