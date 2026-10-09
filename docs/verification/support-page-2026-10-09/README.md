# Local support page verification — 2026-10-09

Status: implemented and available at http://127.0.0.1:5183/support. Support changes are uncommitted and unpushed. Git HEAD and origin/main remain c00c492e2d7a9762b4e0c9637f7124bcbbfe58bd (biochemistry organization).

## Implemented

Approved Superdesign draft 11e7afc5-7099-4c96-95f7-9ed848517fbf version 2 adapted into React. Public entry renders without mounting Clerk, student-year selection or academic app; other routes keep StudyEntry and existing authorization. Real owner recipient, InstaPay IPA/link, Vodafone number and WhatsApp refund draft are centralized in src/pages/support/config.ts. Suggested amounts are optional and never modify the payment link. No fake checkout, receipt tracking, funding totals or cost numbers. Card availability remains explicit. Bilingual English/Arabic, light/dark, selectable LTR addresses, copy fallback, native FAQ, keyboard focus and reduced-motion/transparency CSS. Home card, footer links and account-menu action offer discovery. No solving-screen prompts.

## Verification

- Component/entry tests: 9 pass. Exact owner links, absent preselection, guidance-only amounts, clipboard success/failure, card unavailable, Arabic RTL, public entry and private-route branch.
- Targeted working-tree tests including year navigation: 13 pass; TypeScript passed.
- Isolated HEAD-based copy with only support changes: 465 tests across 66 files passed; production TypeScript and Vite/PWA build passed.
- Browser layout widths 320, 390, 768, 1280: page scroll width never exceeded viewport. All button targets at least 44px high.
- Arabic phone view: RTL page with LTR payment address, no overflow.
- Real browser light/dark views checked. Screenshots: desktop-dark.jpg, mobile-arabic.jpg, mobile-payment-light.jpg.
- Keyboard Tab from 25 EGP moves to 50 EGP with a visible solid focus outline.
- Transfer links verified as exact URL strings; no transfer or WhatsApp message was submitted.

## Remaining before support publication

Explicit publication approval. Actual bills for a transparent cost breakdown. Merchant onboarding and live hosted checkout link if cards/Apple Pay are wanted. These are external inputs, not working payment features. All study access stays free. See docs/DONATION_PAGE_MASTER_PLAN.md for accounting, refunds, future hosted checkout, privacy and release workflow.

Clean verification staging directory: /tmp/asu-support-local-2026-10-09. Logs: /tmp/asu-support-clean-tests.log and /tmp/asu-support-final-build.log. Final formatting is checked by the final targeted verification run. Screenshots and width observations describe the tested browser engine, not a guarantee on every physical device.
