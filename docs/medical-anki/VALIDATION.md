# Workflow validation record

10 November 2026 · version 2.0

## Installed and mirrored

- `~/.codex/skills/medical-anki-production/` and `medical-image-extraction/` are the canonical local user-scope skill folders.
- Corresponding `~/.agents/skills/` links resolve to those folders. No account/cloud synchronisation was performed.
- Both skill packages passed the skill-creator `quick_validate.py` frontmatter/name/scaffold validator.
- Installed workflow references match the workspace guides byte for byte. The start prompt is mirrored too.
- Previous image/Anki guides, master prompt and visual-library handoff were preserved in `outputs/workflow_history/2026-11-10/` before replacement.

## Meaningful portable-validator tests

Run with a Python 3.11+ environment containing Pillow:

```sh
python -m unittest discover -s /absolute/path/to/medical-image-extraction/scripts -p 'test_*.py'
```

Observed: **16 tests passed**, including source/image tamper detection, stale selection/draft rejection, missing image, wrong dimensions, duplicate declared/draft IDs, omitted appended canonical note, missing pair/no-image review, unviewed asset, unchecked visible text, unresolved blocking finding, library-only mode and valid 603×392 native raster acceptance.

Synthetic fixture review flags are test data, not production visual evidence. The read-only validator verifies declared evidence, file hashes/dimensions and exact canonical draft-ID/pair coverage. It cannot establish the truth of a review statement, completeness of an upstream draft against its book, semantic crop geometry, medical accuracy, image permissions, Anki import compatibility or actual physical-device behaviour. Those remain explicit workflow gates.

## Separate AI forward test

A separate Sol pass read the skills and viewed two actual figures, then worked through shared-deck update and interruption/appended-note scenarios. It did not read current production final reports/proposals. The workflow itself contains the historical figure examples, so the scenarios were **outcome-informed**, not blind.

The pass supported using the clear native GBM diagram after the full source/mapping check, rejected the full analgesic figure's conflicting peripheral mechanism, and preserved the distinction between gross/microscopic evidence. It identified a real validator hole: a hashed draft could contain a note omitted from all declared review lists. The validator now parses the defined canonical JSON note array and enforces exact IDs; regression tests and a separate rerun rejected the original malformed case. Broken portable routing was corrected, and authorised metadata-change exceptions are now explicit.

The complete observations, primary-literature source links, original finding and superseding rerun are retained in [Medical_Anki_Workflow_Forward_Test.md](FORWARD_TEST.md).

## Existing implementation evidence

The current Part 1 urinary illustrated APKG passed:

- 38 project tests.
- Native Anki fresh/repeat/text→image and later drug-list/media update imports with established recipient review history.
- All canonical field roundtrips, stable note/card/model/field/template identities, scheduling/revlog preservation and 195 image payload hashes.
- Native missing/unused media: zero/zero.
- 10,272 actual native HTML rendering variants, light/dark at 390/1,100 px; 168 representative screenshots, with selected direct visual inspection.

These checks belong to that exact artifact and current environment, not to every future deck. Its full report is `Urogenital_Anki_Project/reports/PART_1_FINAL_ANALYSIS.md` in the workspace; no deck/textbook/image corpus is bundled with these skills. No independent clinician review or actual AnkiMobile/AnkiDroid testing is claimed.

## Current official Anki documentation checked

Checked on 10 November 2026: [Packaged deck updating](https://docs.ankiweb.net/manual/importing/packaged-decks) describes note freshness, import options and field/template identity issues. [Media](https://docs.ankiweb.net/manual/media) confirms Check Media does not scan templates and symlinks are not followed for media sync. The workflow therefore requires independent template/CSS resource checks and actual copied package media, in addition to native checks.

## Acceptance and remaining boundary

Both skills and their mirrored workflows are saved and structurally validated; the meaningful validator defect discovered during forward testing is fixed and retested. The workflow kit is a portable guide/evidence tool, not a universal already-tested APKG builder. New books, crops, note types, Anki versions and client environments need their own source, content, visual, import/update and rendering evidence. No future zero-error guarantee is made.


## 12 November2026 answer-layout revision

The updated standard covers BOTH Basic and Cloze, with centred Extra text/images. [Current layout verification](CENTRED_EXTRA_VERIFICATION.md) records42 project tests and108 native-HTML browser checks. This extends the workflow and does not regenerate existing APKGs. The original November10/11 evidence above remains historical.
