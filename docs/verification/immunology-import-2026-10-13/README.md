# Immunology intake — 13 October 2026

Prepared locally for Year 1 → Semester 1 → Immunology Module (`MIM-1`, 3 CP, 60 marks). Not committed, pushed or deployed.

## Accounting

| Item | Count |
| --- | ---: |
| Designated question PDFs | 12 |
| Physical pages accounted for | 421 |
| In-scope pages visually reconciled | 219 |
| Excluded department pages | 202 |
| Extracted parent occurrences | 924 |
| Accepted source occurrences | 735 |
| Unique released questions | 640 |
| Consolidated duplicate copies | 95 |
| Withheld original occurrences | 189 |
| MCQs | 603 |
| Standalone essays | 33 |
| Multipart essay containers | 4 |
| Multipart essay children | 17 |
| Book chapters | 13 |
| Separate Past Exams chapter | 1 |
| Concept topics | 46 |
| Corrected recorded answer keys | 11 |

924 = 640 representatives + 95 duplicate copies + 189 withheld occurrences. Child counts are additional to parent counts. Original PDFs and their SHA256 hashes are unchanged. Every occurrence remains linked to an explicit decision. No previous MIM-1 questions existed.

## Source scope and organization

The designated study guide is a taxonomy reference only: its PDF contents page 2 establishes thirteen chapters. Only the contents and cover were visually used for organization; the book’s clinical content was not treated as reviewed answer evidence. Question-derived concept topics consolidate related tests; no predicted questions were generated.

The department book contributes Immunology questions 1–500, PDF pages 116–198, with printed keys on 199–201. Pages 114–115 are the Immunology cover/blank boundary. Microbiology pages 1–113 and Virology pages 202–290 are excluded. Contents page 5 and Virology boundary 202 were inspected to confirm scope, but remain excluded question-source pages. All other designated folder PDFs were included recursively.

The existing internal `microbiology` subject ID and display category remain for compatibility with the portal loader. This is the Immunology module and every imported question is in the designated Immunology scope. Past Exams contains only the source-labeled final-exam block; no exam date was invented. It appears first through existing shared navigation policy.

| Chapter | Questions | Topics |
| --- | ---: | ---: |
| Overview of Immune System: Cells and Organs | 25 | 2 |
| Innate Immunity | 62 | 4 |
| Antigens and Self-Molecules | 38 | 3 |
| Cell Mediated Immune Response | 90 | 6 |
| Humoral Immune Response | 102 | 7 |
| The Complement | 32 | 3 |
| Immunization | 34 | 2 |
| Immunity to Microbes | 37 | 3 |
| Hypersensitivity | 68 | 5 |
| Tolerance and Autoimmunity | 50 | 2 |
| Transplantation | 26 | 2 |
| Tumor Immunology | 17 | 2 |
| Immunodeficiency Diseases | 44 | 4 |
| Past Exams | 15 | 1 |

## Review, corrections and holds

All released parents and the seventeen essay children have saved evidence-grounded answer reviews. MCQ reviews compare all alternatives; essay/model answers and child evidence are substantive. Hash gates bind the review to the extracted stem/options and child content. Source OCR, continuation context and medical wording repairs retain before/after logs. Printed keys were compared rather than automatically accepted. The 11 recorded-key corrections are listed in `key-corrections.json`; spelling/shape repairs are not counted as wrong keys.

The reviewers were Codex agents. Most medical reviews were nonblind with source keys visible. A separate agent checked all 125 root-review prompts/dispositions and a second agent performed targeted QC of 13 department questions; these were nonblind checks and are not independent clinician adjudication. Specific issues were corrected or withheld. No fabricated solve timestamps or human-review claims were made.

The 189 withheld occurrences remain in the readable held archive and job extraction ledger. Reasons include multiple defensible single-answer choices, incomplete/obscured wording, outdated absolute claims, ambiguous clinical framing, and an unresolved primary-evidence access limitation for department q310. Image-dependent questions remain excluded under the established policy. There are zero unresolved `needs_review` records in the completed disposition ledger; withheld content is not approved for students.

## Deduplication coverage

Exact full-content fingerprints preserve negation, charge, decimals, reviewed answer meaning and option-reference semantics. Full comparisons of 532 first-pass lexical candidates plus 4 changed/new comparisons adjudicated semantic duplicates. One conflicting hapten three-way decision was explicitly resolved by retaining the fuller five-option question. The merged archive preserves every original copy and source key. Distinct distractor sets were generally retained when they change the tested comparison.

The cross-bank search covered 5,305 existing Year 1 Semester 1 questions. 478 initial candidates were individually checked plus 3 final new candidates; none was equivalent to a new Immunology question. Existing banks were not modified. Structural fingerprints are unique under both intake and repository checks. Lexical retrieval plus saved semantic comparisons cannot prove the absence of every distant paraphrase; this report does not promise an absolute semantic-duplicate guarantee.

## Integration and verification

The four multipart essay groups use the supported canonical `case` container, retaining their 17 essay children and reviewed model answers. Student JSON excludes audit-only evidence fields; the portable decisions and complete job archive retain provenance. Every accepted answer, explanation, model answer and child is conserved through staging and runtime loading. Stable IDs use `MIM1-CH…-MICR-…`; content versions are explicit SHA256 values. All topics are nonempty, with at most 30 questions in one topic.

The candidate was built in a clean archive of origin/main. The shared checkout contains unrelated changes, which were preserved. Integration uses an explicit bank/manifest/test/report allowlist; no bulk importer or `_ready` scan was used. No owner overlays were fetched or changed: the previous MIM-1 bank was empty, and the local browser clearly reports it is using the bundled bank.

Verification logs and the exact candidate hash are recorded in `verification.json`. Full Vitest, strict app/node/API TypeScript checks, production build, bank validation, all-format runtime mapping, correct/incorrect grading, history/missed questions and stale-version resume checks are required. Browser checks include Year1Semester1 activation,603MCQ/37essay/640mixed counts, Past Exams priority, direct topics, shorter/whole sessions, feedback and essay display at representative phone/tablet/desktop sizes. Any live API/audio/device limitation is explicitly recorded in that verification file.

## Artifacts

- `summary.json`: final counts and bank hash.
- `sources.json`: portable source inventory and hashes.
- `occurrence-decisions.jsonl`: all924 decisions, source anchors, keys and evidence.
- `release-ledger.json`: every released ID and duplicate relationships.
- `key-corrections.json`: eleven recorded-key corrections.
- `topic-counts.json`: final chapter/topic mapping.
- `conservation.json`: source/payload conservation gates.
- Full originals, renders, raw OCR, exact reviews and duplicate adjudications remain in the separate dated import job.
- Readable delivery: `Immunology_Questions_and_Answers.txt` and `Immunology_Withheld_Questions.txt`.

No production release was authorized for this intake.

## Final local checks

123 test files / 708 tests passed; strict app, Node and API TypeScript checks and production/PWA build passed. All modules hide empty Past Exams in the selected mode, including GIT and search collection choices; saved unavailable selections recover. Populated exams remain first. Case-part accessible feedback and standalone essay feedback were corrected and tested. The local browser confirmed Immunology essay has no exam block and MCQ retains 15 past exam questions. Live correction API and cloud persistence were not verified.

Local shared-checkout integration verified: 8 targeted test files / 34 tests passed; `git diff --check` passed. Hash comparison preserved 2,260 unrelated existing files and all other bank manifest entries.
Shared-checkout strict app, Node and API TypeScript checks also passed.
