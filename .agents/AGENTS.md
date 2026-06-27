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

## Quality & Testing Rules

- **Auto-Verification**: After making any changes to the import scripts or the JSON files, you must run:
  - Vitest routing tests: `npx vitest run src/app/import-routing.test.ts`
  - Special Senses module tests: `npx vitest run src/app/special-senses.test.ts`
  - Bank JSON schema validator: `npx tsx data-format-v2/scripts/validate-banks.ts`

---

## Git & Release Rules

- **Git Push Constraint**: Do **NOT** push commits to GitHub (e.g., via `git push`) unless the user explicitly tells you to do so. You may commit changes locally, but pushing must be requested or approved by the user first.

