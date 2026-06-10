## 2026-06-10T18:46:06Z
You are the Explorer for the ASU Medicine Core Web Vitals Optimization project.
Your mission: Audit the ASU Medicine React SPA (Vite) codebase to identify the current baseline and propose fixes for LCP, CLS, INP, and FCP.

Project Root: /Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal
Your Workspace: /Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/.agents/explorer_cwv_audit

Read:
1. /Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/PROJECT.md
2. /Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/.agents/ORIGINAL_REQUEST.md
3. /Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal/.agents/orchestrator/performance-guide.md

Steps:
1. Audit `index.html` and `src/` to find the LCP image candidate, check if it has `loading="eager"`, `fetchpriority="high"`, and `<link rel="preload">`.
2. Find all `<img>` tags without `width` and `height` attributes (CLS risk).
3. Find font imports/faces missing `font-display: swap`.
4. Scan `src/` for heavy event listeners (e.g. scroll, resize) that need debounce/throttle.
5. Identify React components where `React.memo` or `useMemo` can prevent unnecessary re-renders.
6. Check `vite.config.ts` or routes for code-splitting opportunities (lazy loading routes).
7. Create `handoff.md` in your workspace containing your findings, exact file paths, and the detailed fix strategy for the implementation Worker.
8. Call `send_message` to me with your completion status and the path to your `handoff.md`.
