---
type: "query"
date: "2026-10-23T09:28:08.732486+00:00"
question: "How do raw clinical and medical questions flow through convertSubQuestion() in the Question Intake & Schema Pipeline into the runtime Question[] array consumed by QuizPayload?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["convertSubQuestion()", "import-ready.ts", "validate-banks.ts", "data.ts", "generate-bank-manifest.mjs", "QuizPayload"]
---

# Q: How do raw clinical and medical questions flow through convertSubQuestion() in the Question Intake & Schema Pipeline into the runtime Question[] array consumed by QuizPayload?

## Answer

Expanded from original query via vocab: ['question', 'intake', 'schema', 'pipeline', 'convert', 'clinical', 'runtime', 'import', 'validate', 'payload', 'batch', 'manifest']. Traversed from convertSubQuestion() in data-format-v2/scripts/import-ready.ts through validate-banks.ts, src/imports/**/*.json, scripts/generate-bank-manifest.mjs, src/app/data.ts, to src/app/App.tsx. convertSubQuestion() normalizes case subquestions (-SQ1, -SQ2) with deterministic IDs and strict schema validation. At build-time, generate-bank-manifest.mjs catalogs 42 banks into bankManifest.json without embedding questions. At runtime, data.ts lazily loads the module bank, builds ChapterData[], and App.tsx hydrates QuizPayload for QuizInterface.

## Outcome

- Signal: useful

## Source Nodes

- convertSubQuestion()
- import-ready.ts
- validate-banks.ts
- data.ts
- generate-bank-manifest.mjs
- QuizPayload