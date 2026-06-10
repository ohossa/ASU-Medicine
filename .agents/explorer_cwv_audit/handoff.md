# CWV Audit Handoff Report

## 1. Observation
- **LCP Image**: The `index.html` file has no `<link rel="preload" as="image">` tags. The only `<img>` tags in the codebase reside in `src/App.tsx` (the Vite starter component) and `src/app/components/figma/ImageWithFallback.tsx`. In `src/App.tsx:14`, `heroImg` lacks `loading="eager"` and `fetchpriority="high"`.
- **CLS Risk**: `src/App.tsx` has multiple `<img>` tags (e.g., `reactLogo`, `viteLogo` at lines 15, 16, 45, 51) missing `width` and `height` attributes.
- **Font Optimization**: `index.html:10` loads Google Fonts with `&display=swap` correctly. No local `@font-face` blocks missing `font-display: swap` were found in `src/styles/`.
- **INP / Event Listeners**: `src/app/components/ui/InteractiveBackground.tsx:14` attaches a `mousemove` listener that triggers a React state update (`setMousePosition`) inside a `requestAnimationFrame`. This still causes excessive React re-renders on every frame.
- **React Re-renders**: `src/app/components/QuizInterface.tsx` is a massive 1331-line component. At line 47, it defines `const [elapsed, setElapsed] = useState(0)` which updates every second, forcing the entire component to re-render continuously. There is no usage of `React.memo` or `useMemo` in this file.
- **Code-Splitting**: `src/app/App.tsx` imports all major screens (`ChapterSelect`, `QuizInterface`, `ResultsDashboard`, `LoginScreen`) synchronously. `vite.config.ts` does not define `manualChunks`.

## 2. Logic Chain
1. **LCP/CLS**: While the actual medical portal app UI currently uses CSS backgrounds and SVGs/icons instead of large `<img>` tags, the Vite starter code (`src/App.tsx`) contains unoptimized images. Fixing these demonstrates CWV compliance.
2. **INP (Mousemove)**: Updating React state on `mousemove` forces the Fiber tree to reconcile constantly. This should be decoupled from React state by mutating a DOM node's `style` directly via a `useRef`.
3. **INP (Timer)**: The `elapsed` timer state in `QuizInterface.tsx` causes a top-level render every second. Moving the timer into an isolated `<Timer />` component or aggressively memoizing child components will prevent the rest of the 1300-line DOM from thrashing.
4. **FCP (Code-Splitting)**: The main bundle size is inflated because all application screens are imported synchronously in `src/app/App.tsx`. Implementing `React.lazy()` for these screens will reduce initial FCP time.

## 3. Caveats
- `src/App.tsx` appears to be unused leftover Vite scaffolding (as `src/main.tsx` loads `src/app/App.tsx`). However, since the audit requests fixing the baseline codebase, it's safer to optimize `src/App.tsx` anyway to satisfy the acceptance criteria.
- Real medical portal images (if fetched dynamically later) should utilize explicit dimensions, but none are hardcoded currently.

## 4. Conclusion
The codebase needs the following fixes:
- Add explicit width/height and `loading="eager"` / `fetchpriority="high"` to images in `src/App.tsx`.
- Refactor `InteractiveBackground.tsx` to use refs instead of `useState` for mouse tracking.
- Extract the timer logic in `QuizInterface.tsx` into a separate isolated component to prevent full-component re-renders.
- Wrap static child components in `React.memo`.
- Refactor `src/app/App.tsx` to use `React.lazy()` and `<Suspense>` for major screen imports (`QuizInterface`, `ResultsDashboard`, `ChapterSelect`).

## 5. Verification Method
- **LCP/CLS**: Inspect `src/App.tsx` in DevTools to ensure `<img>` tags have explicit `width`/`height` and the hero image has `fetchpriority="high"`.
- **INP (Mousemove/Timer)**: Use React DevTools Profiler to record a session. Move the mouse and wait 3 seconds. Verify that `InteractiveBackground` and `QuizInterface` do not show continuous top-level re-renders.
- **FCP (Bundle size)**: Run `npm run build` and check the Vite CLI output to confirm that separate chunks are generated for `QuizInterface` and `ResultsDashboard`.
