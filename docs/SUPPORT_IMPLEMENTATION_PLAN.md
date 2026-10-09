# Support page implementation plan

Goal: implement the approved Superdesign draft locally with real owner transfer details, public access, honest unavailable card checkout, useful recovery help and responsive presentation. No push.
Architecture: a public, lazy-loaded support entry separate from Clerk/study boot. Existing study providers remain in StudyEntry. SupportPage consumes a typed, allowlisted public configuration; scoped CSS follows the approved design. No payment server or donor ledger until those separately specified systems are needed.
Spec: DONATION_PAGE_MASTER_PLAN.md and Superdesign draft 11e7afc5-7099-4c96-95f7-9ed848517fbf version 2, approved by user.

- [x] Write failing support configuration and component tests: real copy/link targets, denied clipboard, no amount selected, method switching, unavailable cards, refund URL, semantic FAQ and honest empty budget.
- [x] Implement public configuration, bilingual page and scoped responsive CSS. Preserve site brand/typography and reduced-motion behaviour.
- [x] Write failing entry test showing /support opens without mounting Clerk, year lookup or study bank loading. Split public and private boot without weakening admin routes.
- [x] Add browsing-only footer and home discovery links. Never add support prompts to question-solving screens.
- [x] Run component tests, full clean-release regressions, typecheck/build and browser mobile/tablet/desktop, appearance, keyboard and RTL checks.
- [x] Save design/review/testing receipt and local preview; keep support, payment details and related source changes uncommitted/unpushed.

Review focus: same-phone transfers can copy addresses; selected amount never promises deep-link prefilling; lack of card account never becomes fake checkout; no clipboard permission does not strand the user; signed-out visitors can view support while owner/admin remains protected.
