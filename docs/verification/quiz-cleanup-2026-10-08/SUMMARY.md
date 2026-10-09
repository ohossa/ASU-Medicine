# Quiz layout and entry defaults — 8 October 2026

- Shuffle thumb anchored at 2px within a fixed 28px track, with 12px travel and a 12px thumb. Browser measurement confirms containment in both enabled and disabled states. Original enabled preference restored after testing.
- Quiz breadcrumb strip removed; existing Back control saves the ordered question IDs, answers and elapsed time before leaving. Other browsing breadcrumbs remain available.
- Home carousel defaults to Year 3 and announces its selected year through aria-pressed.
- Year 3 defaults to Semester 1. Explicit semester query links remain authoritative; other year defaults unchanged.
- Full tests: 37 files, 271 tests pass. Production build passes. No new normalized strict type diagnostics; existing strict type errors remain.
- Browser: Year 3 selected on home; entering Year 3 immediately shows GIT in Semester 1. Saved screenshots use real local UI.
- No production push/deployment.
