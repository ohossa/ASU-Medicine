# ASU Medical Portal — Full Optimization Execution Prompt

Below is a comprehensive, multi-file optimization plan for the ASU Medical Portal codebase at `/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal`. Execute these in the order listed. Each task includes the exact file path, line numbers, and precise instructions.

---

## PRIORITY LEGEND
- 🔴 **P0 — Critical** (fix immediately, user-facing impact)
- 🟠 **P1 — High** (next sprint, quality/performance)
- 🟡 **P2 — Medium** (important but not urgent)
- 🟢 **P3 — Low** (nice to have)

---

## 🔴 P0 — Critical (Fix Immediately)

### 0.1 Fix 1.3MB Favicon — public/favicon.png
This PNG file is 1.3MB and gets downloaded on every page load. A favicon should be <50KB.
**Action:** Run this command to compress it, or delete it and rely on favicon.svg:
```bash
cd /Users/omarhossa/Documents/Medcine\ ASU/ASU-Medical-Portal
# Option A: Compress existing PNG
ffmpeg -i public/favicon.png -quality 50 -vf scale=256:256 public/favicon-small.png && mv public/favicon-small.png public/favicon.png
# Option B: Remove it entirely (favicon.svg is superior)
rm public/favicon.png
```
If you delete it, also update `index.html` line 23 to use SVG only:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```
And update `public/manifest.json` to remove the PNG icon entry.

### 0.2 Fix Broken Hero Image Preload — index.html:36
Line 36 preloads `/src/assets/hero.png` — this is a Vite source path that does NOT exist in production builds.
**Action:** Remove the entire line:
```html
<!-- DELETE this line -->
<link rel="preload" as="image" href="/src/assets/hero.png" />
```

### 0.3 Remove Google Fonts URL from Service Worker Precaching — public/sw.js:12
The `PRECACHE_ASSETS` array includes a Google Fonts CSS URL (`https://fonts.googleapis.com/css2?family=Amiri:...`). All fonts are self-hosted in `/public/fonts/`. This external URL will:
- Fail when offline
- Cause CORS errors
- Try loading fonts that are already local
**Action:** Delete line 12 from the array (the Google Fonts URL). Result should be:
```js
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.png",
  "/favicon.svg",
  "/asu-medicine-logo.webp",
  "/icons.svg",
];
```

### 0.4 Add Error Boundaries to All Lazy Routes — src/app/App.tsx (lines 1231-1378)
Every `<Route>` uses `<Suspense>` but NO `<ErrorBoundary>`. If a chunk fails to load, the user gets a blank screen.
**Action:** Wrap each lazy route. Pattern for every route in the `<Routes>` block:
```tsx
import { ErrorBoundary } from './components/ErrorBoundary';
// ...
<Route path="/" element={
  <ErrorBoundary fallback={<div className="fixed inset-0 flex items-center justify-center bg-background text-foreground text-sm font-medium">Failed to load. Please refresh the page.</div>}>
    <Suspense fallback={<div className="fixed inset-0 bg-background pointer-events-none" />}>
      <Dashboard ... />
    </Suspense>
  </ErrorBoundary>
} />
```
Apply to ALL routes inside the `<Routes>` block.

### 0.5 Make Quiz Choices Keyboard-Accessible — src/app/components/QuizInterface.tsx (~line 650-700)
Answer choices are `<div onClick={...}>` with no `role`, `tabIndex`, or `onKeyDown`. Keyboard-only users cannot navigate.
**Action:** For each choice wrapper element (the clickable answer option), add:
- `role="radio"`
- `tabIndex={0}`
- `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(choiceIndex); }}`
- `aria-checked={isSelected ? 'true' : 'false'}`
- `aria-label={`Option ${choiceIndex + 1}: ${choiceText}`}`

### 0.6 Extract Timer to Prevent Full Re-render Every Second — src/app/components/QuizInterface.tsx (~lines 96-103)
`setInterval(1000)` calls `setElapsed` which re-renders the entire 1202-line component every second.
**Action:** Create a separate `TimerDisplay.tsx` component:
```tsx
// TimerDisplay.tsx
import { useEffect, useRef, useState } from 'react';

interface Props { isRunning: boolean; onElapsed?: (s: number) => void; }
export function TimerDisplay({ isRunning, onElapsed }: Props) {
  const [display, setDisplay] = useState('00:00');
  const startRef = useRef(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!isRunning) return;
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const s = Math.floor((Date.now() - startRef.current) / 1000);
      const m = Math.floor(s / 60).toString().padStart(2, '0');
      const sec = (s % 60).toString().padStart(2, '0');
      setDisplay(`${m}:${sec}`);
      onElapsed?.(s);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, onElapsed]);

  return <span>{display}</span>;
}
```
Then replace the inline timer in `QuizInterface.tsx` with `<TimerDisplay />`.

### 0.7 Add `loading="lazy"` to All Images — src/app/components/QuizInterface.tsx (diagram images)
All `<img>` tags have no lazy loading, blocking initial paint.
**Action:** Find all `<img>` elements and add:
```tsx
<img src={diagramUrl} alt="Diagram" loading="lazy" decoding="async" />
```

---

## 🟠 P1 — High Priority

### 1.1 Reconcile Subject Colors Between CSS and JS — Multiple files
Subject colors conflict:
- `src/styles/theme.css:43-89` defines CSS colors (e.g., physiology = `#10B981`)
- `src/app/theme/subjectThemes.ts:6-18` defines different JS colors (e.g., physiology = `#2dd4bf`)

**Action:** Pick ONE source of truth. Best approach:
1. Keep colors in `theme.css` as the single source.
2. Update `subjectThemes.ts` to read from computed CSS colors:
```ts
export function applySubjectTheme(id?: string) {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const key = `--color-${id?.replace(/\d+/g, '') || 'physiology'}`;
  const color = style.getPropertyValue(key)?.trim() || '#2dd4bf';
  root.style.setProperty('--subject-accent', color);
  root.style.setProperty('--subject-glow', color);
}
```
3. Delete the hardcoded `SUBJECT_THEMES` object in `subjectThemes.ts`.

### 1.2 Delete Dead CSS Entry Point — src/index.css (entire file, 124 lines)
This is from the old Vite template. It defines conflicting variables, duplicate `.dot-pattern`, and `#root` width constraints (1126px wide!). It conflicts with `src/styles/theme.css`. It is NOT imported anywhere (`main.tsx` imports `src/styles/index.css`).
**Action:** Delete the entire file `src/index.css`.

### 1.3 Remove Duplicate CSS Animations in JSX — src/app/App.tsx (lines 1168-1220)
There's an inline `<style>` tag inside `MainApp` that re-defines `shrinkHeader`, `popUp`, `floatBlob1`, `floatBlob2` keyframes — these already exist in `src/styles/theme.css:413-468` with slightly different values.
**Action:** Remove the ENTIRE `<style>` block (lines 1168 through 1220, inclusive). The theme.css versions will take over.

### 1.4 Split QuizInterface.tsx (1202 lines) — src/app/components/QuizInterface.tsx
Monolithic file combining timer, question rendering, review mode, answer checking.
**Action:** Create three new files:
- `QuizQuestion.tsx` — single question + choice rendering + keyboard handling
- `QuizReview.tsx` — review mode with question grid  
- `QuizFinishModal.tsx` — submit confirmation dialog
Then import them into `QuizInterface.tsx`.

### 1.5 Extract Inline Modals to Separate Files — src/app/App.tsx (lines 1399-1702)
Four inline modals bloat `MainApp`:
- Premium Coming Soon (lines 1399-1436)
- Support & Bug Report (lines 1443-1509)
- Language Selection (lines 1510-1602)
- ASU Portals (lines 1604-1702)

**Action:** Create four component files:
- `src/app/components/ComingSoonModal.tsx`
- `src/app/components/SupportModal.tsx`
- `src/app/components/LanguageModal.tsx`
- `src/app/components/PortalsModal.tsx`

Move the JSX from App.tsx into each file, pass props for state handlers, then render them with `<AnimatePresence>`.

### 1.6 Reduce Backdrop-filter Blur on Mobile — src/styles/theme.css:272
`backdrop-filter: blur(24px) saturate(180%)` is expensive on mobile GPUs.
**Action:** Add after line 276:
```css
@media (max-width: 768px) {
  .glass-panel { backdrop-filter: blur(8px) saturate(120%); }
}
```

### 1.7 Move Hardcoded Contact Info to Config — src/app/App.tsx (lines 1472, 1485)
Email `omarhmaged@gmail.com` and WhatsApp `+201040479155` are hardcoded.
**Action:** Create `src/app/lib/config.ts`:
```ts
export const CONTACT = {
  email: import.meta.env.VITE_CONTACT_EMAIL || 'omarhmaged@gmail.com',
  whatsapp: import.meta.env.VITE_CONTACT_WHATSAPP || '201040479155',
} as const;
```
Then change App.tsx to use `CONTACT.email` and `CONTACT.whatsapp`.

### 1.8 Add JSON-LD Structured Data — index.html (before </head>)
No structured data for SEO — Google can't generate rich snippets.
**Action:** Add before `</head>` (around line 36):
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "ASU Medical Portal",
  "url": "https://asu.codes",
  "description": "Master the ASU medical syllabus through structured assessment, clinical case solvers, and interactive quizzes.",
  "applicationCategory": "EducationalApplication",
  "educationalLevel": "http://schema.org/TertiaryEducation",
  "offers": { "@type": "Offer", "price": "0" },
  "author": {
    "@type": "EducationalOrganization",
    "name": "Ain Shams University Faculty of Medicine"
  }
}
</script>
```

### 1.9 Enhance PWA Manifest — public/manifest.json
Missing: description, screenshots, maskable icon, categories. Orientation locked to portrait.
**Action:** Replace the file with:
```json
{
  "short_name": "ASU Portal",
  "name": "ASU Medical Portal",
  "description": "ASU Faculty of Medicine exam preparation portal with quizzes, clinical cases, and progress tracking",
  "categories": ["education", "medical"],
  "icons": [
    { "src": "/favicon.svg", "type": "image/svg+xml", "sizes": "any", "purpose": "any" },
    { "src": "/favicon.png", "type": "image/png", "sizes": "512x512", "purpose": "any" },
    { "src": "/asu-medicine-logo.webp", "type": "image/webp", "sizes": "512x512", "purpose": "maskable" }
  ],
  "screenshots": [
    { "src": "/social-preview.png", "sizes": "1200x630", "type": "image/png" }
  ],
  "start_url": "/",
  "background_color": "#0c0e16",
  "theme_color": "#0c0e16",
  "display": "standalone",
  "orientation": "any"
}
```

### 1.10 Add Arabic Font Preload — index.html (after line 35)
Amiri font is not preloaded, causing a flash for RTL users.
**Action:** Add after line 35:
```html
<link rel="preload" href="/fonts/amiri-400-normal-arabic.woff2" as="font" type="font/woff2" crossorigin />
```

---

## 🟡 P2 — Medium Priority

### 2.1 Reduce Font Weight Overload — src/styles/fonts.css & public/fonts/
42 font files = ~1.4MB. Many weights are unused.
**Action in fonts.css:**
- **Archivo:** Remove `@font-face` declarations for weights 100, 200, 300, 500 (keep 400, 600, 700, 800, 900)
- **Manrope:** Remove weights 300, 800 (keep 400, 500, 600, 700)
- **Amiri:** Remove latin-ext and latin subsets (keep only arabic)
**Action in public/fonts/:**
Delete the unused .woff2 files that correspond to removed declarations.

### 2.2 Make Feature Flags Reactive — src/app/lib/fx.config.ts
`FX` is a plain `const` object. Toggling at runtime won't re-render components.
**Action:** Create `FxContext.tsx`:
```tsx
import { createContext, useContext, type ReactNode } from 'react';
import { FX, type FxKey } from './fx.config';

const FxContext = createContext(FX);
export function FxProvider({ children }: { children: ReactNode }) {
  return <FxContext.Provider value={FX}>{children}</FxContext.Provider>;
}
export const useFx = () => useContext(FxContext);
```
Then wrap `<App />` with `<FxProvider>` in `main.tsx`. Change all `import { FX } from ...` to `const FX = useFx()`.

### 2.3 Lazy-Load Canvas Confetti — src/app/ConfettiManager.tsx
`canvas-confetti` (~15KB) imported eagerly even if FX.confetti is false.
**Action:** In `ConfettiManager.tsx`, use dynamic import:
```tsx
const confetti = await import('canvas-confetti');
```
Remove the static import from `celebrate.ts`.

### 2.4 Add Page Visibility Pause to InteractiveBackground — src/app/components/ui/InteractiveBackground.tsx
Canvas animation runs when tab is hidden, wasting CPU/battery.
**Action:** In the `useEffect` that starts `requestAnimationFrame`, add:
```tsx
const handleVisibility = () => {
  if (document.hidden) {
    cancelAnimationFrame(rafId);
  } else {
    rafId = requestAnimationFrame(loop);
  }
};
document.addEventListener('visibilitychange', handleVisibility);
return () => {
  document.removeEventListener('visibilitychange', handleVisibility);
  cancelAnimationFrame(rafId);
};
```

### 2.5 Add Missing OG Tags — index.html
**Action:** Add after line 21:
```html
<meta property="og:locale" content="en_US" />
<meta property="og:site_name" content="ASU Medical Portal" />
```

### 2.6 Make Theme-Color Meta Dynamic — src/app/App.tsx
**Action:** In `MainApp`, after the theme state is available:
```tsx
useEffect(() => {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', isDark ? '#0c0e16' : '#f8f9fc');
}, [isDark]);
```
Also update the default in `index.html:25` to the light mode value `#f8f9fc` to prevent the initial flash of dark bar.

### 2.7 Replace Inline Styles with CSS Custom Properties — src/app/components/QuizInterface.tsx
Many elements use `style={{ border: ..., background: ... }}` that change per subject.
**Action:** On the quiz container element, set CSS variables once:
```tsx
<div style={{ '--subject-border': style.border, '--subject-bg': style.bg } as React.CSSProperties}>
```
Then use `var(--subject-border)` in classNames instead of inline styles.

### 2.8 Remove Duplicate .dot-pattern — src/index.css (lines 100-106)
This class is also in `src/styles/theme.css:382-385`. Since `src/index.css` is being deleted (1.2), this is already handled.

### 2.9 Add Dynamic Theme-Color on Initial Load — src/main.tsx
**Action:** Before rendering, set the theme-color meta tag:
```tsx
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const meta = document.querySelector('meta[name="theme-color"]');
if (meta) meta.content = prefersDark ? '#0c0e16' : '#f8f9fc';
```

---

## 🟢 P3 — Low Priority

### 3.1 Add ErrorBoundary to SignedOut Route — src/app/App.tsx (line 1760-1764)
**Action:** Wrap `<LoginScreen />` in `<ErrorBoundary>`:
```tsx
<SignedOut>
  <ErrorBoundary fallback={<div>Something went wrong with login.</div>}>
    <Suspense fallback={<LoadingScreen />}>
      <LoginScreen />
    </Suspense>
  </ErrorBoundary>
</SignedOut>
```

### 3.2 Add Cache-Control Headers to vercel.json
**Action:** Update `vercel.json`:
```json
{
  "regions": ["iad1"],
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(index.html|)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    }
  ]
}
```

### 3.3 Add aria-label to Icon-Only Buttons — Throughout all components
**Action:** Search all JSX for icon-only buttons (no visible text). Add:
- `aria-label` for each button
- `aria-expanded` for toggle buttons
- `aria-controls` pointing to the controlled element's ID

### 3.4 Compress Social Preview Image — public/social-preview.png
624KB for a 1200x630 image — should be ~100-200KB.
**Action:** Run:
```bash
ffmpeg -i public/social-preview.png -quality 85 public/social-preview.jpg
```
Then update the OG URLs in `index.html` to reference `.jpg`.

### 3.5 Add Skip-to-Content Link — src/app/App.tsx
**Action:** Add at the very beginning of `MainApp`'s return:
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-physiology focus:text-white focus:rounded-lg focus:outline-none">
  Skip to content
</a>
```
Add `id="main-content"` to the `<main>` element on line 1222.

### 3.6 Strip C2PA Metadata from favicon.svg — public/favicon.svg
227KB due to Adobe C2PA content credentials. A favicon should be ~2KB.
**Action:** Regenerate or minify the SVG, stripping out the manifest data. Or create a much smaller inline SVG.

### 3.7 Add Missing Open Graph image dimensions — index.html
**Action:** After line 14, add:
```html
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```
After line 21, add:
```html
<meta name="twitter:image:width" content="1200" />
<meta name="twitter:image:height" content="630" />
```

### 3.8 Migrate Clerk CSS Overrides to Appearance API (cleanup)
**Action:** After completing the above, the `<style>` block removal in 1.3 removes the duplicate `shrinkHeader` keyframes. Verify that `shrinkHeader` and `shrinkHeaderDark` keyframes in `theme.css:450-469` are the correct ones and the `<style>` block removal was clean.

---

## EXECUTION ORDER

### Batch 1 — File Cleanup (safe, no-regret changes):
1. Delete `src/index.css` (dead file)
2. Remove inline `<style>` from `App.tsx` lines 1168-1220
3. Remove Google Fonts URL from `sw.js:12`
4. Fix broken preload in `index.html:36`
5. Remove unused font weight declarations from `fonts.css`
6. Delete unused font files from `public/fonts/`

### Batch 2 — Performance (measurable gains):
7. Compress/remove favicon
8. Add `loading="lazy"` to images in QuizInterface
9. Extract Timer into child component
10. Add mobile blur reduction in theme.css
11. Add Page Visibility pause to InteractiveBackground
12. Lazy-load canvas-confetti

### Batch 3 — Resilience (prevent crashes):
13. Wrap all lazy routes with `<ErrorBoundary>`
14. Extract modals to lazy-loaded components

### Batch 4 — Accessibility (compliance):
15. Add keyboard handling to quiz choices
16. Add `aria-label` to icon-only buttons
17. Add skip-to-content link
18. Add JSON-LD structured data

### Batch 5 — Polish:
19. Reconcile subject colors
20. Add Arabic font preload
21. Enhance PWA manifest
22. Move hardcoded strings to config
23. Add cache-control headers to vercel.json

---

## VERIFICATION

After each batch, run:
```bash
cd /Users/omarhossa/Documents/Medcine\ ASU/ASU-Medical-Portal
npm run build 2>&1
```
The build should complete without errors. Then test:
```bash
npm run dev &
# Manually navigate to key pages and verify they render
```
