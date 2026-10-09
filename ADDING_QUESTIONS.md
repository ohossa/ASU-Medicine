# Adding questions to ASU Medical Portal

Use **[CONVERSION_PROMPTS_MASTER.md](./CONVERSION_PROMPTS_MASTER.md)**, Portable v3. It is a single self-contained prompt for any capable AI chat, including one without this repository or our conversation.

For your exact upload-to-live sequence and ready-to-copy requests, use **[START_TO_FINISH.md](./question-workflow/START_TO_FINISH.md)**.

1. Supply the prompt and question PDFs, in upload waves if needed. The AI reads every page visually, extracts full source text/questions/answers, records duplicates/uncertainty, and saves a resumable package. **The book is not required yet.**
2. Supply the book/layout later with **[CHAPTER_ORGANIZATION_PROMPT.md](./question-workflow/CHAPTER_ORGANIZATION_PROMPT.md)** and the full saved job. Build the exact book map, complete the master’s source-based medical review, then classify accepted versions and assemble without changing their content.
3. Provide current website destination data or return the full package to this repository-capable agent. Map questions to actual module/chapter/subject/lecture destinations and export flat per-module incoming JSON.
4. Stage/validate the intended import, apply it when authorized, verify the bank/tests/build/UI, then publish when explicitly requested and check the live website.

## Formats and paths

- Incoming batch: `{ "moduleCode": "CODE", "questions": [...] }`. Its flat questions have no manually generated canonical IDs.
- Canonical bank: `src/imports/year-N/semester-N/CODE.json`, with `schemaVersion: 1`, metadata and chapter/subject nesting.
- Intake: `data-format-v2/question-intake/year-N/semester-N/CODE [Name]/` with `_raw`, `_ready`, `_imported`, `_reports`, `_rejected`.
- Only intended incoming JSON goes in `_ready`. Keep ledgers, review records, report JSON and other artifacts elsewhere.
- Exact formats for all six question types, subject names, key indices and evidence requirements are embedded in the main prompt's Section 12.
- An offline chat can use [website-destination-context.json](./question-workflow/website-destination-context.json) as a dated map; verify it against current banks before import. It contains no teaching authority and does not prove deployed contents.

## Repository checks

Run from the repository after inspecting current code, runner availability and the intended queued files:

```sh
npx tsx data-format-v2/scripts/import-ready.ts --dry-run --strict
npx tsx data-format-v2/scripts/validate-banks.ts
npm test
npm run build
```

After a satisfactory staged result, backup and authorization to import, the bulk mutation command is `npx tsx data-format-v2/scripts/import-ready.ts --strict`. It scans every `_ready` folder; do not run it blindly on historical files. The single-batch importer writes directly and needs equivalent staging/backup precautions.

Verify actual routes, preserved fields, duplicate handling and every `needsReview` entry. “Strict” and a zero exit code do not establish that every incoming item was accepted. Do not change existing question IDs, delete unrelated content, or reorder existing lecture indices as an incidental import effect.

Successful local import/build is not deployment. The final stage confirms that the intended release is live and affected question routes, types, answers, explanations and visuals work. If access or checks are blocked, report the exact pending stage.

See [question-workflow/README.md](./question-workflow/README.md) for preserved original Pulse prompts and instruction backups.
