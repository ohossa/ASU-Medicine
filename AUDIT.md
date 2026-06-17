# ASU Medical Portal — Code Audit Report

> Generated during ferment: Medical Portal Code Audit (019ec3dd-07ab-7378-a1bc-6ab62e5ce4f3)
> Audit date: 2026-06-14

---

## Summary

| Severity | Count |
|---|---|
| 🔴 Critical | 2 |
| 🟠 High | 10 |
| 🟡 Medium | 8 |
| 🟢 Low | 6 |
| **Total** | **26** |

---

## 🔴 Critical

### C1 — Broken asset preload in index.html
- **File:** `index.html`
- **Line:** 35
- **Issue:** `<link rel="preload" as="image" href="/src/assets/hero.png" />` references a Vite source path. In production, `src/` is compiled away so this will 404. The file exists at `src/assets/hero.png` but must be moved to `public/hero.png` and the href changed to `/hero.png`.
- **Fix:** Move `hero.png` to `public/hero.png`. Update preload href to `/hero.png`.

### C2 — Oversized favicon with C2PA metadata
- **File:** `public/favicon.svg`
- **Line:** N/A (entire file)
- **Issue:** File is 221.7KB. A favicon should be <5KB. Contains embedded Adobe C2PA content-credentials metadata that bloats the file and wastes bandwidth on every page load. The service worker also precaches this file.
- **Fix:** Strip C2PA metadata or replace with a minified inline SVG (~2KB). Also remove the precache entry from `sw.js` since `index.html` uses `/favicon.png`, not `/favicon.svg`.

---

## 🟠 High

### H1 — God component: App.tsx is 1,767 lines
- **File:** `src/app/App.tsx`
- **Lines:** 1–1767
- **Issue:** Handles routing, global state machine, quiz orchestration, localStorage persistence, browser history sync, popstate handling, cloud sync, Clerk auth UI, FX/gamification wiring, modal management, background effects, and auto-routing safety nets. Single file is unmaintainable and prevents code reuse.
- **Fix:** Extract inline components to dedicated files. Extract business logic to custom hooks. Break routing into route-level components.

### H2 — 25 useState hooks in single component
- **File:** `src/app/App.tsx`
- **Line:** Throughout
- **Issue:** 25 `useState` declarations in one file create a brittle state machine where one state corruption affects the entire app. No state normalization or reducer pattern.
- **Fix:** Consolidate related state into context providers or custom hooks (e.g., `useQuizState`, `useNavigationHistory`).

### H3 — TypeScript strict mode disabled
- **File:** `tsconfig.app.json`
- **Line:** Missing compilerOptions
- **Issue:** `strict: true`, `strictNullChecks`, and `noImplicitAny` are not enabled. Runtime null/undefined and implicit-any bugs can slip through.
- **Fix:** Add `"strict": true`, `"strictNullChecks": true`, `"noImplicitAny": true` to `compilerOptions`.

### H4 — implicit-any throughout data.ts
- **File:** `src/app/data.ts`
- **Lines:** 356, 357, 358, 363, 380, 393, 409, 641-643, 658-659, 669-670, 689, 691, 693, 698, 741
- **Issue:** 19 `any` annotations. Raw JSON data from `import.meta.glob` flows through `transformV2Question`, `detectDbTypeOfJson`, and `assertUniqueQuestionIds` without type guards. A malformed JSON file could crash the app at runtime.
- **Fix:** Replace `any` with `unknown`, add runtime type guards (e.g., `typeof obj === 'object' && obj !== null`), and define proper raw types.

### H5 — implicit-any and type gaps in App.tsx
- **File:** `src/app/App.tsx`
- **Lines:** 231-236, 380, 385, 851, 991
- **Issue:** 10 `: any` annotations. Setters declared as `any`, `activeChapters` as `any[]`, `handleSelectHistory` as `any`, `checkAnswerCorrect` answer as `any`, `SYLLABUS_MODULES` find callback as `any`.
- **Fix:** Replace with proper React setter types (`React.Dispatch<React.SetStateAction<T>>`), strongly-typed arrays, and a union `AnswerValue` type.

### H6 — Duplicated `checkAnswerCorrect` logic
- **Files:** `src/app/App.tsx:851`, `src/app/components/QuizInterface.tsx:64`, `src/app/components/ResultsDashboard.tsx:62`
- **Issue:** Same scoring logic defined in 3 files with slight drift. The App.tsx version is missing the `correctScrambledIndex !== -1` guard that QuizInterface and ResultsDashboard have. Any bug fix must be applied in three places.
- **Fix:** Extract to `src/app/utils/quiz.ts` and import in all three consumers.

### H7 — Duplicated `norm` string utility
- **Files:** `src/app/components/QuizInterface.tsx:62`, `src/app/components/ResultsDashboard.tsx:60`
- **Issue:** Identical one-liner `const norm = (s: any) => String(s ?? '').trim().toLowerCase()` duplicated verbatim.
- **Fix:** Extract to `src/app/utils/string.ts` and import both places.

### H8 — Raw localStorage access without try/catch
- **File:** `src/app/App.tsx` (plus others)
- **Lines in App.tsx:** 241-246, 526, 536, 683-691 (many unprotected)
- **Issue:** Writes and reads to localStorage are not wrapped in try/catch. Crashes in Safari Private Mode, incognito, or when storage quota is exceeded. 22 raw localStorage calls in App.tsx alone.
- **Fix:** Create `safeStorage.ts` wrapper with try/catch and migrate all call sites.

### H9 — Unthrottled history.pushState spam
- **File:** `src/app/App.tsx`
- **Lines:** 722 (`replaceState`), 735 (`pushState`)
- **Issue:** `window.history.pushState` and `replaceState` fire on every state change without debouncing. Rapid transitions can flood the history stack and cause `SecurityError` on Safari.
- **Fix:** Debounce the history-sync effect with `requestAnimationFrame` or 50ms timeout.

### H10 — ~45 unused runtime dependencies
- **File:** `package.json`
- **Issue:** 12 packages have zero imports anywhere. 33 more are used only by dead UI primitives. This bloats the bundle by ~85%.
- **Fix:** Remove dead packages in two batches (completely unused → UI-only), keeping build verification after each batch.

---

## 🟡 Medium

### M1 — Missing OG metadata in index.html
- **File:** `index.html`
- **Lines:** After line 21
- **Issue:** Missing `og:locale`, `og:site_name`, `og:image:width`, `og:image:height`, `twitter:image:width`, `twitter:image:height`.
- **Fix:** Add the missing meta tags.

### M2 — Twitter meta uses `property` instead of `name`
- **File:** `index.html`
- **Lines:** 23-28
- **Issue:** Twitter Cards require `name="twitter:..."`, not `property="twitter:..."`. Invalid markup may prevent Twitter Card rendering.
- **Fix:** Change `property="twitter:` to `name="twitter:` on all Twitter meta tags.

### M3 — Inline style block in App.tsx duplicates CSS keyframes
- **File:** `src/app/App.tsx`
- **Lines:** 1168-1220
- **Issue:** A large `<style>{`...`}</style>` block defines `@keyframes shrinkHeader`, `shrinkHeaderDark`, `popUp`, `floatBlob1`, `floatBlob2` inline in JSX. These keyframes likely duplicate definitions in `theme.css`. Inline styles increase bundle size and are harder to maintain.
- **Fix:** Remove the inline `<style>` block. Ensure `theme.css` contains the needed keyframes.

### M4 — External Google Fonts URL in service worker precache
- **File:** `public/sw.js`
- **Line:** 12
- **Issue:** `PRECACHE_ASSETS` contains a Google Fonts CSS URL. An external dependency in precache can fail the entire service worker install if the CDN is unreachable.
- **Fix:** Remove the external URL from `PRECACHE_ASSETS`. Fonts are already self-hosted in `public/fonts/`.

### M5 — Unused font weights declared
- **File:** `public/fonts/` (directory)
- **Issue:** The Google Fonts URL imports many weights (100-900 for Archivo and Manrope) but `index.html` only preloads 3 font files. Many weight files are likely present but unused.
- **Fix:** Audit which weights are actually used in CSS, delete unused font files, and remove weight declarations.

### M6 — Missing Cache-Control headers in vercel.json
- **File:** `vercel.json`
- **Issue:** No `headers` array. Hashed assets should be cached immutably; index.html should be revalidated every time.
- **Fix:** Add `headers` configuration for `/assets/*` (immutable), `index.html` (no-cache), and `/fonts/*` (long cache).

### M7 — @ts-ignore hides startViewTransition types
- **File:** `src/app/App.tsx`
- **Lines:** 760, 762
- **Issue:** `// @ts-ignore` suppresses type errors for `document.startViewTransition`. If the DOM types are ever added, these suppressions will silently remain.
- **Fix:** Create `src/app/types/view-transitions.d.ts` with a proper declaration and remove the `@ts-ignore` comments.

### M8 — Static theme-color causes flash on load
- **File:** `index.html`
- **Line:** 25
- **Issue:** `<meta name="theme-color" content="#0c0e16" />` is hardcoded to dark. In light mode, the browser chrome flashes dark on initial paint before JS runs.
- **Fix:** Set the default to light `#f8f9fc` in index.html, then dynamically update it in App.tsx when theme state is known.

---

## 🟢 Low

### L1 — Dead Vite template file
- **File:** `src/App.tsx`
- **Issue:** Untouched Vite starter template. Never imported by `main.tsx` (which imports `./app/App.tsx`). Adds confusion.
- **Fix:** Delete `src/App.tsx`.

### L2 — 49 dead UI primitive files
- **File:** `src/app/components/ui/*` (49 files)
- **Issue:** Only `InteractiveBackground.tsx` and `StackedCarousel.tsx` are used by production code. The remaining 49 files (accordion, alert-dialog, badge, button, card, chart, command, dialog, drawer, dropdown-menu, form, hover-card, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle, toggle-group, tooltip, use-mobile, utils, calendar, carousel, checkbox, collapsible, context-menu, aspect-ratio, avatar, breadcrumb, input, etc.) are dead code.
- **Fix:** Delete all except `InteractiveBackground.tsx` and `StackedCarousel.tsx`.

### L3 — Redundant framer-motion + motion packages
- **File:** `package.json`
- **Issue:** `framer-motion` and `motion` are the same library. `framer-motion` has 18 imports; `motion` has 3.
- **Fix:** Consolidate all imports to `motion`, remove `framer-motion`.

### L4 — Inline shadow style on quiz container
- **File:** `src/app/components/QuizInterface.tsx`
- **Issue:** Dynamic `style={{ borderColor, backgroundColor }}` for subject colors is applied inline per question. Could be replaced with CSS custom properties for better performance and maintainability.
- **Fix:** Use CSS variables via `style={{ '--subject-border': borderColor }}` and reference in className.

### L5 — Missing skip-to-content link
- **File:** `src/app/App.tsx`
- **Issue:** No skip-to-content link for keyboard navigation accessibility.
- **Fix:** Add `<a href="#main-content">` at the top of `MainApp` return and `id="main-content"` on the `<main>` element.

### L6 — Missing structured data (JSON-LD)
- **File:** `index.html`
- **Issue:** No Schema.org structured data for search engines.
- **Fix:** Add JSON-LD `<script type="application/ld+json">` for WebSite, WebApplication, and EducationalOrganization.

---

## Files Touched by the Audit

| File | Lines | Key Issues |
|---|---|---|
| `src/app/App.tsx` | 1767 | God component, 25 useState, 10 `any`, 22 raw localStorage, history spam, inline styles, duplicated logic |
| `src/app/data.ts` | 803 | 19 `any`, no type guards on JSON |
| `src/app/components/QuizInterface.tsx` | ~1202 | `checkAnswerCorrect` dupe, `norm` dupe, 20+ `any`, missing aria, missing lazy loading |
| `src/app/components/ResultsDashboard.tsx` | ~343 | `checkAnswerCorrect` dupe, `norm` dupe, 1 `any` |
| `package.json` | — | ~45 unused runtime deps |
| `index.html` | 44 | Broken preload, missing OG tags, static theme-color, missing JSON-LD |
| `public/sw.js` | ~82 | External URL in precache |
| `public/favicon.svg` | 1 | 221KB with C2PA |
| `vercel.json` | 8 | No cache headers |
| `src/app/components/ui/` | 51 files | 49 dead files |
| `tsconfig.app.json` | 20 | No strict mode |
| `src/App.tsx` | — | Dead Vite template |

---

## Recommended Fix Order

1. **Batch 1 — File Cleanup** (zero runtime risk): dead `src/App.tsx`, dead UI primitives, unused deps, broken preload, sw.js fix, favicon cleanup
2. **Batch 2 — TypeScript & Safe Storage** (compile-time safety): strict mode, type fixes, safeStorage migration
3. **Batch 3 — Logic Deduplication** (behavior-preserving): extract `quiz.ts`, `string.ts`, `useViewTransition.ts`
4. **Batch 4 — Component Extraction & Navigation** (highest complexity): extract inline components, URL-driven quiz routes
5. **Batch 5 — Polish** (low risk): OG tags, theme-color, aria, skip-link, cache headers, JSON-LD

---

*End of Audit Report*
