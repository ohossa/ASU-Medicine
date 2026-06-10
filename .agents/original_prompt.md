# Original User Request

## Initial Request — 2026-06-10T18:39:54Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

Optimize the Core Web Vitals (LCP, CLS, INP, FCP) for the ASU Medicine React SPA.

Working directory: /Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal
Integrity mode: development

## Requirements

### R1. Audit and Baseline
Analyze the ASU Medicine React SPA (Vite) codebase to identify the current rendering strategy (CSR), list all render-blocking resources, fonts, third-party scripts, and images. Report the JS bundle size and identify the LCP candidate element and CLS risks.

### R2. Core Web Vitals Optimization
Implement optimizations across four key areas following React/Vite best practices (since Next.js optimizations do not apply):
1. **LCP:** Optimize above-the-fold elements (preloading, lazy loading removal, proper image sizing).
2. **CLS:** Add explicit dimensions to dynamic content/images and prevent FOIT with font swapping.
3. **INP:** Debounce/throttle heavy event listeners, break up long tasks, and optimize React re-renders (`React.memo`, `useMemo`).
4. **FCP:** Remove unused CSS/JS, implement route-based code splitting, and defer non-critical scripts.

### R3. Verification and Reporting
Produce a detailed checklist of implemented changes, provide any build configuration modifications (e.g. `vite.config.ts`), and outline a step-by-step browser DevTools verification plan for the user.

## Acceptance Criteria

### LCP & CLS Optimization
- [ ] Above-the-fold images have `loading="eager"` and `<link rel="preload">` tags in `index.html`.
- [ ] All `<img>` tags have explicit `width` and `height` attributes to prevent CLS.
- [ ] Critical fonts include `font-display: swap` to prevent FOIT.

### INP & FCP Optimization
- [ ] Heavy event listeners (if any) are debounced/throttled.
- [ ] Unnecessary re-renders are mitigated with `React.memo` or `useMemo` where beneficial.
- [ ] Non-critical scripts use `defer` or `async`.

### Verification Deliverables
- [ ] A checklist of implemented changes is provided to the user.
- [ ] Exact browser DevTools steps are provided to verify each fix locally before deploying.
- [ ] A deployment verification plan for Vercel Speed Insights is provided.

**NOTE:** This task is assigned with a `/goal` flag. Be extremely thorough and do not stop until the goal has been completely fulfilled and all acceptance criteria are verifiably met.
