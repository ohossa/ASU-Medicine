---
name: medical-image-extraction
description: Extract, crop and review medical figures from authorised textbook PDFs, lecture PDFs and PowerPoint files, and verify their exact relevance when enriching Anki cards.
---

# Medical image extraction

Read [the full visual workflow](references/workflow.md) before extraction or pairing. For a complete deck, use the sibling [medical-anki-production](../medical-anki-production/SKILL.md); this skill can also produce an image library without cards.

The user supplies source scope and intended audience. Preserve originals and hashes; account for every in-scope page/slide. Extract native assets and render pages/slides, then inspect actual useful figures at readable size. Catalogue names, retrieval scores and contact sheets do not establish acceptance.

Choose composite PDF crops, normally at 300 DPI, when labels/arrows are vector overlays. An undistorted, fully labelled original raster can be preferable to its stretched slide/PDF placement. Do not enlarge a bitmap or reject a clear one solely to satisfy a nominal DPI/pixel threshold. Preserve upright orientation, proportions, complete authentic captions/keys and source credit. Split distinct figures; retain genuinely unified panels. Stitch only authentic distant source regions; no invented labels, masking or synthetic medical detail.

Read all visible medical text and compare the source identity and exact card target. Record honest partial coverage. Reject misleading, clipped, irrelevant or unreadable images and thank-you/decoration slides. Leave a card without a picture where none fits; audit important visual targets before finalising. Online alternatives require original-page inspection, provenance and individual reuse checks for the audience.

Keep image sources, links, references and credits out of every Anki deck and subdeck description and out of review-card prose. Record image provenance in the media manifest. Supply required credits in a companion attribution file distributed with the APKG when the terms permit. If the required credit cannot be provided there or in an intact credit already accompanying the image, choose a different permitted figure. Preserve original creator marks. Inspect imported descriptions before release.

Require actual visual curation and a separate exact-pair review bound to source/draft/selection/asset hashes. Preserve valid unchanged evidence; re-view changed crops/pairs. Checkpoint explicit ID sets, not array slices. Never manufacture review flags from a matcher or mechanical validator.

When pairing for Anki, use the sibling [answer-layout contract](../medical-anki-production/references/answer-layout.md): BOTH Basic and Cloze need the conditional Extra Section box, with its text and images centred. Keep centring in scoped CSS; preserve source pixels, captions, aspect ratio and main question/answer alignment.

For an Anki update, freeze medical fields/identities, enrich Extra only, copy approved bytes to hash filenames and test actual fresh/repeat/update imports, media parity and light/dark mobile/desktop rendering using the linked production workflow. A second AI review is not independent clinician review; browser widths are not physical mobile clients.

## Mechanical evidence check

When an extraction/pairing run uses the portable evidence format, read [the bundle contract](references/bundle-contract.md) and run:

```sh
python3 scripts/verify_visual_bundle.py /absolute/path/selection.json /absolute/path/second_review.json
```

Run from this skill directory, using a Python environment with Pillow. The command is read-only: it checks declared file hashes/dimensions, exact ID/pair coverage and hash-bound review records. It cannot prove medical relevance, readable labels, actual human/AI viewing, permissions or safe Anki updates. It supplements, never replaces, those gates. The project may instead use an equivalent existing schema/validator; do not migrate a sound existing pipeline just to use this format.
