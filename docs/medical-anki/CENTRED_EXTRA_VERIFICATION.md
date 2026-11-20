# Centred Extra workflow verification

12 November 2026 · workflow version2.1. This is a saved-workflow/template update, not a new Anki release or Genital card batch.

## What is now standard

Both Basic and Cloze use the same conditional Extra Section wrapper. The title, supplementary text and images are centred; empty Extra has no box. Main questions/answers retain left alignment, the approved font and spacing. Revealed Cloze targets remain amber/gold with accessible light/dark values. Source/FacultyDrugList remain outside Extra. No medical text, GUID/schema identity or source pixels were changed.

The full contract is in the production skill's `references/answer-layout.md`. Its five `assets/` files include both front/back templates and the complete CSS. The module's five `templates/` snapshots are equal to `make_models()` output; a regression test rejects drift. Both global and portal copies of the two medical skills and their workflow/prompt mirrors are synchronised. The global `.agents` and `.claude` aliases resolve to the user `.codex` copies; project `.codex`/`.claude` aliases resolve to project `.agents` copies. This is local/repository persistence, not account/cloud sync.

## Evidence

- **42 project tests PASS.** The expanded conditional-panel regression failed on the old Cloze template before the shared-tail fix, then passed for both Basic and Cloze with empty/populated Extra. New asset-parity checks cover all five files.
- **108 browser views PASS** using native Anki-generated HTML: six fixture notes × two faces ×320/390/1100px ×light/nightMode/night_mode. Checks include conditional wrapper/title, actual image centre geometry, centred Extra text, unchanged left-aligned main text, readable contrast, loaded images, proportions and no horizontal overflow.
- Six fixture notes use copied approved urinary records with synthetic supplementary layout content/images, in a disposable collection. Their temporary APKG is removed. They are not new production/Genital cards.
- Direct screenshots inspected: UG-P1-L004-N006 at320px dark (Cloze plus centred small rectangle/text) and UG-P1-L001-N003 at1100px light (Basic plus small/wide rectangles). The rectangles test layout, not medical relevance.
- Four physical skill folders (two user-level, two repository-level) pass skill-creator validation. The image evidence validator retains its16 passing regression tests.
- Source cards, registries and existing release APKG hashes are frozen and checked after this task. No existing collection/package was silently patched.

Module-specific evidence remains under `Urogenital_Anki_Project/reports/centred_extra_template_qa.json` and `reviews/layout_fixture_screenshots/` in the original workspace; those contain private QA fixtures and are not included in the portable kit. The guide/assets alone cannot establish medical accuracy, complete future source coverage, permissions, safe future package imports or physical mobile-client behaviour.

## Scope and next step

Current files supersede the earlier Basic-only box and left-aligned Extra instructions. Existing APKGs retain their earlier templates; saving a skill does not modify imported cards. An explicitly requested rebuild must use a new versioned filename and repeat full release verification. Part2 source packets and layout are prepared; no Genital authoring was started here. The source/source-review/model-routing/update rules otherwise remain intact.

Before sharing a future release, test actual full-deck native imports/updates and renders, not only this six-note fixture. Physical AnkiMobile/AnkiDroid testing has not been performed for this template revision. Prior source/clinical/reuse limitations remain documented; no zero-error guarantee is made.
