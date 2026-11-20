# Medical Anki and image workflows — start here

Saved in the ASU Medical Portal project on **11 November 2026**. These are actual project files, not links to the creator's home directory. Any AI can follow the Markdown; a skill system and the previous chat are optional.

## Read in this order

1. [Medical Anki production workflow](../../MEDICAL_ANKI_WORKFLOW.md): source authority, exam analysis, coverage, writing, review, identities, APKG/update tests and delivery.
2. [Medical image extraction and pairing workflow](../../IMAGE_EXTRACTION_WORKFLOW.md): source inventory, PDF/PPTX extraction, correct crops/keys, upright proportions, online images, exact pairing and visual verification.
3. [Copyable project start prompt](../../MEDICAL_ANKI_START_PROMPT.md): fill in the actual sources, module/part, parent deck, baseline package, intended audience, authorised changes, output directory and client environment.

Use both complete skills together:

- [medical-anki-production](../../.agents/skills/medical-anki-production/SKILL.md)
- [medical-image-extraction](../../.agents/skills/medical-image-extraction/SKILL.md)

The complete skill folders, supporting references, read-only validator and its regression tests are in `.agents/skills/`. Relative `.codex/skills/` and `.claude/skills/` aliases resolve to those same in-repository folders. The canonical `.agents` copies remain usable if a platform does not support symlinks. No account/cloud installation is implied.

## Give another AI this prompt

```text
Read docs/medical-anki/START_HERE.md, MEDICAL_ANKI_WORKFLOW.md,
IMAGE_EXTRACTION_WORKFLOW.md and both complete skills under .agents/skills/.
Follow MEDICAL_ANKI_START_PROMPT.md with the source paths and scope I provide.
Use the designated textbook as tested-text authority. Write direct recall
without source narration. Use the dedicated Source field for page references.
Keep deck and subdeck descriptions free of image credits and links. Distribute
any required credits separately where the image terms allow. Review/freeze text first,
then add only relevant, directly inspected images in Extra with a separate
hash-bound pairing review. Preserve published note/model identities and test
fresh, repeat and established-history updates in disposable Anki collections.
Deliver the APKG, coverage/media breakdown and update instructions.
Do not assume access to earlier chats or the creator's computer, process
unrelated sources, mutate live Anki, publish or push without authorisation.
```

For a skill-capable AI, you can instead begin with `$medical-anki-production` and `$medical-image-extraction`, then provide the completed run prompt. Skill discovery varies by product; direct Markdown reading is the fallback.

## Share or move to another computer

[Download the portable workflow kit](Medical_Anki_Workflow_Kit.zip). It contains both sibling skill folders, the full guides, starting prompt and verification evidence. Extract it and read its `START_HERE.md`; install both folders into that AI's supported user/project skill location if desired. No Anki deck, textbook or lecture image corpus is included. Supply the actual authorised teaching files for the new job.

The portal's Anki website listing is separate from producing a local APKG. Saving these files does not publish anything on the website or alter students' collections. Historical urinary output paths in the guides are implementation examples, not portable dependencies. Part 2 genital production remains paused until explicitly requested.

## Verify and maintain

[Validation scope and prior evidence](VALIDATION.md) and [the separate forward-test record](FORWARD_TEST.md) distinguish mechanical checks, actual image observations, AI medical source review and unperformed independent clinical/device testing. The optional visual-bundle validator requires Python 3.11+ and Pillow; read [its contract](../../.agents/skills/medical-image-extraction/references/bundle-contract.md). It is not an APKG builder or proof of medical correctness.

Run the 16 synthetic regression cases with a suitable Python environment:

```sh
python -m unittest discover -s .agents/skills/medical-image-extraction/scripts -p 'test_*.py' -q
```

They check hashes, dimensions, review/pair coverage and exact canonical note IDs, including appended notes. They do not assert that synthetic fixtures received real visual review.

Root guide files mirror the matching skill references; synchronise both after an authorised edit and verify their hashes. Update project `AGENTS.md`/`.agents/AGENTS.md`/`CLAUDE.md` routing if entrypoints change. Preserve old related files in `history/`; never restore the old blanket minimum-resolution/catalogue-perfection rules as current instructions. User-scope skills are maintained separately. Synchronise and verify them after an authorised workflow edit.

A future release still needs its own source, all-card/pair, import/update, media and rendering evidence. No workflow can promise zero mistakes or universal client compatibility.


## Current answer layout — 12 November 2026

Both Basic and Cloze use a conditional Extra Section box with centred title, text and images, while main questions/answers remain left-aligned and Cloze answers retain accessible amber/gold. Read the production skill’s `references/answer-layout.md` and copy its five `assets/` files. Earlier Basic-only boxes or left-aligned Extra instructions are superseded. Empty Extra is hidden. Saving these defaults does not change existing APKGs or begin Part2 authoring.
