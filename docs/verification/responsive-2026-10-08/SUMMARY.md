# Responsive verification — 8 October 2026

## Problems reproduced and corrected
- At 375px, Report overlapped Back in the quiz header. Clicking Back actually opened Report. The title disappeared and the avatar partly clipped. Fixed with a separate mobile actions row, compact labelled icon controls, and wrapping at narrow widths. Desktop retains the compact single row.
- Case Solver grids had fixed 220/280px minimum columns inside smaller padded cards. They now use minimums bounded by their available width. Narrow laboratory results use labelled, stacked rows; desktop keeps columns. Blood-pressure tiles have room for their values. Result screens can wrap action buttons.
- PortalShell hid its entire breadcrumb navigation below tablet width, removing the Case Solver's route back to the portal. Added an accessible 44px mobile Back control and a regression test.
- The marks calculator's Back control squeezed into an oval on phones. Calculator title and controls now reflow; Back retains its size.
- Fill-in answer fields are bounded by their containing question cards, including case children.
- Mobile inputs use 16px text to avoid iOS focus zoom. Shuffle, year-selector dots and main entry buttons have larger touch targets. Year dots retain their small visual appearance inside 44px buttons.

## Browser evidence
80 layout measurements saved in browser-checks.json. Widths: 320, 375, 430, 768, 820, 1024 and 1366 pixels, with phone/tablet/desktop height presets. Final measurements found no document horizontal overflow or clipping in the checked controls, and no quiz-header button collisions.

Views: homepage, Year 3 modules, GIT topic cards, active GIT MCQ, Case Solver laboratory results, GIT calculator, History, search, flagged questions, analytics, admin access screen. Report dialogs additionally checked at 320/375/820px; they fit the viewport and remain scrollable. The homepage carousel and breadcrumbs intentionally scroll/show neighbouring cards; they are not treated as accidental page overflow.

Case Solver differential selection and investigations were exercised on a 320px viewport with a long MRI result, including running the simulated test. No question answers or student reports were submitted. Quiz verification resumed an existing ungraded saved session, then used Back to save and leave it; no completed result was created.

## Gates
- 43 files / 297 automated tests pass.
- Node 24 production build passes.
- git diff --check passes.
- Strict application TypeScript still has the pre-existing diagnostics; comparison with the preceding verification adds zero normalized diagnostic messages.
- Browser viewport override reset; temporary testing tab closed; user tabs preserved.
- No Git push or deployment.

## Scope and remaining release gates
These are browser viewport checks, not physical iPhone/iPad Safari/Android certification. They verify representative shared views, not every possible question, account, translated string, browser version or device. The owner editor/inbox cannot be exercised against real services locally because the user requires secrets exclusively in Vercel; the configured-unavailable access screen was checked, while existing editor tests cover fixture behavior. Hosted authorization, reports, editing and persistence tests still remain release gates. The existing correction-service warning is genuine configuration status and was not hidden for screenshots.
