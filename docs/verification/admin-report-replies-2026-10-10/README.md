# Admin report replies verification

10 October 2026 · local implementation · synthetic browser data · no real emails sent.

## Automated checks

- Full Vitest suite: **612 tests passed across 109 files**.
- `npm run build`: passed all three TypeScript projects, Vite production build and PWA generation.
- `git diff --check`: passed.
- Production reply Lua: **six isolated fakeredis checks passed**. Includes 16 concurrent reservations with different request IDs and identical content, same-request retry, stale draft revisions, clearing only the sent draft, preserving another device's follow-up draft, and keeping the draft on uncertain delivery.
- Regression confirmed red then green: an unsent email remains in the composer when saving the report decision refreshes the inbox. The selected review is no longer unmounted by a background refresh.

## Browser checks

Used the actual AdminPortal and ReplyComposer in a separate temporary Vite preview with synthetic Clerk hooks, synthetic reports and a mock delivery provider. Production authorization was never bypassed.

- Desktop review: flat question cards, individual student report selection, visibly different question and student-message surfaces.
- Copy student message: clipboard matches the original multiline message exactly.
- Copy review context: includes question and key; does not include synthetic reporter email or profile details.
- Template selection: editable message; preview blocked until instructions are replaced.
- Draft save → preview → explicit send: verified mock provider acknowledgment and immutable message history.
- Mobile 390 × 844: no horizontal overflow. Selected review hides the list; Back to reports restores it; one click reopens the question.
- Light and dark appearances inspected. Viewport override reset after testing.

Screenshots contain synthetic data only:

- `desktop-review-synthetic.png`: question and original report message together.
- `mobile-light-synthetic.png`: mobile student-message panel.
- `reply-preview-synthetic.png`: exact email preview and explicit send control.

## Apple design review

Applied the installed Apple design references as web design principles, retaining the portal's existing fonts and Lucide icons:

- `layout.md › Visual hierarchy`: separate evidence, review decision and student communication; remove nested disclosure for the main question.
- `split-views.md › Best practices`: persistent report navigator on desktop, focused single-pane review with return navigation on small screens.
- `buttons.md › Best practices / Style`: labelled 44px actions, one clear primary action, distinct preview and send steps.
- `entering-data.md › Best practices`: server-filled recipient, editable reply templates and visible validation.
- `accessibility.md › Vision`: text labels accompany colour; focus indicators; responsive wrapping and no horizontal clipping.
- `typography.md › Conveying hierarchy`: clear section headings and readable original text without adding another typeface.
- `color.md › Inclusive color` and `dark-mode.md › Best practices`: semantic blue student feedback, restrained emerald selection and distinct light/dark surfaces.
- `feedback.md`: honest pending/accepted delivery messages and explicit retry/recovery instructions.

## Activation limit

Live sending is **not verified**. It requires a Resend sending key and a sender on a verified domain in the server environment. No API key or sender configuration is embedded in the browser. See `docs/ADMIN_REPORT_REPLIES.md` for the full owner workflow and setup.
