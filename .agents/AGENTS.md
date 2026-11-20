# ASU Portal Project Rules

## Documentation Synchronization Rule

> [!IMPORTANT]
> **Constraint**: Any time you modify the question bank structure, schema, subject lists, or the import pipeline scripts (`import-ready.ts`, `import-batch.ts`, or `intake-agent.ts`), you **MUST** update the corresponding documentation markdown files in the repository.
> 
> The specific files to keep synchronized are:
> 1. [schema.md](file:///Users/omarhossa/Documents/Medcine%20ASU/ASU-Medical-Portal/data-format-v2/schema.md) — The canonical database schema specification.
> 2. [HOW_TO_USE.md](file:///Users/omarhossa/Documents/Medcine%20ASU/ASU-Medical-Portal/data-format-v2/HOW_TO_USE.md) — Detailed guide on importer scripts, options, flags, and workflow.
> 3. [import-workflow.md](file:///Users/omarhossa/Documents/Medcine%20ASU/ASU-Medical-Portal/data-format-v2/import-workflow.md) — Importer sequence and features.
> 4. [ADDING_QUESTIONS.md](file:///Users/omarhossa/Documents/Medcine%20ASU/ASU-Medical-Portal/ADDING_QUESTIONS.md) — Quick start guide for adding new questions.

---

## Import & Auto-Routing Rules

- **Smart Auto-Sorting**: Always check for matching lecture names in the module's `lectureNames` list before performing fallback keyword matching. Smart routing matches the topic against `lectureNames` (exact match first, then substring match).
- **Subject Mappings**: Ensure ENT and Ophthalmology subjects in Anki / raw question files map correctly to the `"clinical"` subject ID in `MSS-2.json`.

---

## Medical Anki and visual asset workflows

Read the project-local `docs/medical-anki/START_HERE.md`, `MEDICAL_ANKI_WORKFLOW.md` and `IMAGE_EXTRACTION_WORKFLOW.md`, then apply both sibling skills in `.agents/skills/medical-anki-production/` and `.agents/skills/medical-image-extraction/`. Paths here are relative to the repository root.

Preserve textbook authority, complete source accounting, standalone concise recall, exact card–image relevance, immutable published identities and actual Anki update tests. Composite PDF rendering normally uses 300 DPI; complete readable native rasters are allowed, especially when slide placement distorts them. No artificial upscaling, fixed minimum-pixel rejection, blanket catalogue approval or destructive parity cleanup. Preserve authentic labels/captions/keys, inspect all visible text and use separate hash-bound asset/pair review. Mechanical tests do not establish medical accuracy, actual viewing, permissions or physical mobile behaviour. Use the current workflow's applicable gates rather than historical Urogenital-specific test counts.

---

## Quality & Testing Rules

- **Auto-Verification**: After making any changes to the import scripts or the JSON files, you must run:
  - Vitest routing tests: `npx vitest run src/app/import-routing.test.ts`
  - Special Senses module tests: `npx vitest run src/app/special-senses.test.ts`
  - Bank JSON schema validator: `npx tsx data-format-v2/scripts/validate-banks.ts`

---

## Git & Release Rules

- **Git Push Constraint**: Do **NOT** push commits to GitHub (e.g., via `git push`) unless the user explicitly tells you to do so. You may commit changes locally, but pushing must be requested or approved by the user first.

---

## Skills & Memory Architecture

- **Operating Playbook**: Refer to [`docs/AGENT_SKILLS_AND_MEMORY_PLAYBOOK.md`](file:///Users/omarhossa/Documents/Medcine%20ASU/ASU-Medical-Portal/docs/AGENT_SKILLS_AND_MEMORY_PLAYBOOK.md) for skill triggers and the 4-tier memory hierarchy.
- **Project Scratchpad**: Consult and maintain [`MEMORY.md`](file:///Users/omarhossa/Documents/Medcine%20ASU/ASU-Medical-Portal/MEMORY.md) for persistent project gotchas, module code rules, and architectural invariants.




### Approved medical-card Extra layout (12 November 2026)

Both Basic and Cloze require the conditional Extra Section box: title, supplementary text and images centred; empty Extra hidden; main question/answer alignment unchanged. Preserve amber/gold revealed Cloze contrast. Use `.agents/skills/medical-anki-production/references/answer-layout.md` and the five matching `assets/` files; CSS alone does not create the Cloze wrapper. This supersedes the earlier Basic-only/left-aligned Extra guidance and does not authorise new card content or modification of existing APKGs.
