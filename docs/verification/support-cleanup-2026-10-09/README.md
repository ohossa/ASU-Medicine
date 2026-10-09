# Annotated footer, support header and profile-menu cleanup

Local changes only, 9 October 2026. No commit, push, bank edits, payment configuration or transfer was performed.

## Requested changes

- Main footer consolidated into shared PortalFooter: ASUCodes, Contact and Support; no visible email address, institutional heading or paragraph.
- Support header university image removed; text changed to Support the project / دعم المشروع.
- Reused profile ThemeToggle on support. Native keyboard switch, truthful dark-mode state, contained thumb, reduced-motion support and 44px target. LTR track geometry preserved inside Arabic RTL layout.
- Globe language control replaces the full-language text button; same bilingual support-page behavior retained.
- Personal note rewritten in English and Arabic with purpose, free access and running costs stated plainly.
- Profile Dashboard menu item removed; support menu uses the existing Lucide HeartHandshake icon from the Tools card.

## Design reasoning

Adapted the already approved portal/support direction, with the user's explicit annotations supplying the requested changes. No new design direction or remote draft needed.

Apple skill references: branding.md > Best practices (brand defers to content; familiar components), toggles.md > Best practices (clear setting and opposing states). Practical web translation: native button/switch semantics, readable labels, shared components and contained geometry. The smaller footer is an editorial choice, not a claim that Apple mandates this exact layout.

## Verification

- 557 tests across 95 files passed; production build includes passing TypeScript checks. Existing large-chunk warning remains.
- Added meaningful keyboard Space/Enter toggle coverage, RTL direction checks, bilingual control behavior and footer destination tests. Existing support/payment tests pass.
- Browser verified the actual home profile menu has no Dashboard entry and retains Learning Hub and Support.
- Support header observed at 320px in English and Arabic, light and dark themes. Document width 314px at a 320px viewport; no horizontal overflow. Control targets: globe 52.93 × 46.05px, theme 64 × 44px, back 44 × 44px. Thumb remains within its track in RTL.
- Enter toggled the real theme switch; Arabic toggle rendered the translated content and LTR payment address. Original dark theme and English support page restored. Viewport reset.
- Screenshot evidence: support-header.png and footer.png. This is representative browser verification, not physical-device certification.
- git diff --check passed for edited tracked files.
