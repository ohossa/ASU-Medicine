# GIT past-exam owner corrections — 2026-10-08

Applied to the local website bank. No push or deployment performed.

## Disposition

- Chief-cell question restored with the missing Chief cells option added as E; explanation describes basal rough ER and apical zymogen granules.
- Area-postrema question clarified to ask which vomiting response remains possible despite the lesion; motion sickness is E. A lesion is not described as causing motion sickness.
- Gastrin is already correct in the active gastric-emptying exam question. The erroneous CCK-keyed duplicate remains archived, with its corrected answer documented in the ledger.
- IgM was already correctly keyed; explanation now includes the limitations of negative serology.
- Vomiting-muscle and swallowing-elevator questions remain excluded because several listed choices are valid.
- The unqualified anterior-inguinal-wall and smooth-muscle-mechanism questions are now excluded for multiple valid choices. The existing precise inguinal-wall question asking “along its whole length” remains.
- Earlier source files and exclusion archives are preserved. CORRECTIONS.jsonl records each original and disposition, including superseding IDs.

## Evidence

User owner-correction screenshots and written corrections are the primary change request. SOURCE_IMAGES.json records supplied image paths and hashes when available. Images are evidence only, not new image-based questions.

Current book OCR: GIT_DATABASE_WORK/page_evidence/DOC0001/p0066.txt (serous acini), p0154.txt (chief cells), p0164.txt (area postrema/vestibular vomiting).

Additional authoritative search-retrieved excerpts used to assess ambiguity and explanation wording (not represented as independently opened full-text reviews):

- https://www.ncbi.nlm.nih.gov/books/NBK470204/ — external oblique anterior wall and lateral internal-oblique reinforcement.
- https://www.ncbi.nlm.nih.gov/books/NBK526125/?report=reader — calcium/calmodulin and MLCK pathway.
- https://cdc.gov/mumps/php/laboratories/serology.html — IgM supports recent infection; IgG alone does not diagnose acute infection.
- https://cdc.gov/mumps/php/laboratories/index.html — negative testing does not exclude mumps.

## Verification

6,178 parent questions: 5,508 regular and 670 past-exam/recall questions. All retained question ordering preserved. Exactly two active records removed, one restored, and two existing records updated. All other question objects unchanged.

45 test files / 308 tests pass, including four owner-correction regression tests. Production build passes. Strict TypeScript checking still has 120 pre-existing distinct diagnostics; this change adds zero. This targeted correction run does not certify every historical answer medically.

See VERIFICATION.json, WEBSITE_TESTS.log, BUILD.log and STRICT_TYPECHECK.log. The application release manifest was updated with IDs and question hashes. ORIGINAL_BANK.json and ORIGINAL_MANIFEST.json are recovery snapshots; apply_owner_corrections.py deliberately refuses repeat application.
