# IBM-1 Biochemistry: import and explanation polish

## Current local candidate

- 1,671 unique questions: 1,208 MCQs and 463 essays.
- 2,152 source records fully accounted for; 1,717 released occurrences, 46 duplicates consolidated.
- Two chapters and 20 named topics; Year 1, Semester 1, IBM-1 unlocked.
- GitHub publication authorized; deployment verification is recorded separately.

## Focused medical recheck and explanation polish

Read all 1,678 released stems, choices, explanations and model answers. Improved 427 MCQ explanations and one essay explanation; other essay explanations remain brief.

Seven ambiguous MCQs excluded; four corrections (one model answer, two medical stem corrections and one truncated OCR stem repair). Keys and option order of retained MCQs were preserved.

This is a focused nonblind AI consistency pass over the earlier source-grounded review. It is not a fresh independent clinical certification. New uncertainties were checked against opened authoritative sources; prior evidence was reused for consistent material.

### Medical corrections

- W1-Q08: two actual cytochromes replace the incorrect catalase example; rubric updated.
- 01242: removed outdated implication of only six enzyme classes.
- 00271: removed blanket irreversible classification from the cyanide inhibitor essay.
- 01592: repaired a truncated phospholipid membrane-property stem without changing its choices or key.

### Exclusions

- IBM1-BIO-DRV-20260921-00028: No literally correct option: inulin commonly contains a terminal glucose residue, so complete hydrolysis can release some glucose as well as predominantly fructose. Glycogen, starch and cellulose are glucose polymers. The absolute claim that inulin does not give glucose on hydrolysis cannot be retained as written.
- IBM1-BIO-DRV-20260921-01346: Both ES-complex formation and transient enzyme-substrate covalent bonds are valid aspects of catalysis; chymotrypsin is a counterexample to treating covalent bond formation as an incorrect option. Single-answer stem lacks a qualifier restricting the general mechanism.
- IBM1-BIO-DRV-20260921-02066: Both ES-complex formation and transient enzyme-substrate covalent bonds are valid aspects of catalysis; chymotrypsin is a counterexample to treating covalent bond formation as an incorrect option. Single-answer stem lacks a qualifier restricting the general mechanism.
- IBM1-BIO-DRV-20260921-00478: The keyed glutamate-to-glutamine reaction is false for GDH, but universal presence in every body cell is also not defensible, including mature erythrocytes. The negative stem therefore has more than one problematic alternative.
- IBM1-BIO-DRV-20260921-00429: Both pyruvate and acetate can supply acetyl-CoA for fatty acid synthesis. The stem does not specify the principal carbohydrate-fed route, so the historical pyruvate key does not uniquely exclude acetate.
- IBM1-BIO-DRV-20260921-00158: The stem omits a classification convention. Proline is classified as aliphatic by IMGT and OpenStax, although some teaching schemes separate cyclic residues; the current unique proline exception therefore depends on an unstated convention.
- IBM1-BIO-DRV-20260921-01437: The free-amino-acid stem gives no precise pH or protein environment. At pH 7.4, free cysteine’s side-chain pKa (8.37) is closer than free histidine’s (6.04), contradicting the explanation that all other groups titrate farther away; protein histidine buffering cannot uniquely settle this unqualified comparison.

## Chapter and topic counts

| Chapter / topic | Questions |
| --- | ---: |
| Cell Chemistry & Biophysics / Amino acids and protein structure | 461 |
| Cell Chemistry & Biophysics / Hemoglobin and heme | 13 |
| Cell Chemistry & Biophysics / Iron metabolism | 4 |
| Cell Chemistry & Biophysics / Carbohydrate chemistry | 128 |
| Cell Chemistry & Biophysics / Lipid chemistry and membranes | 146 |
| Cell Chemistry & Biophysics / Vitamins and coenzymes | 72 |
| Cell Chemistry & Biophysics / Nucleotides and nucleic acids | 53 |
| Cell Chemistry & Biophysics / DNA replication | 26 |
| Cell Chemistry & Biophysics / Transcription | 34 |
| Cell Chemistry & Biophysics / Translation | 55 |
| Cell Chemistry & Biophysics / Regulation of gene expression | 21 |
| Enzymes, Bioenergetics & Metabolism / Enzymes and regulation | 240 |
| Enzymes, Bioenergetics & Metabolism / Clinical enzyme markers | 21 |
| Enzymes, Bioenergetics & Metabolism / Glycolysis and pyruvate metabolism | 32 |
| Enzymes, Bioenergetics & Metabolism / Carbohydrate metabolism and glucose homeostasis | 106 |
| Enzymes, Bioenergetics & Metabolism / Glycogen metabolism | 7 |
| Enzymes, Bioenergetics & Metabolism / Pentose phosphate pathway | 4 |
| Enzymes, Bioenergetics & Metabolism / TCA cycle and bioenergetics | 90 |
| Enzymes, Bioenergetics & Metabolism / Amino acid and nitrogen metabolism | 107 |
| Enzymes, Bioenergetics & Metabolism / Lipid metabolism | 51 |

## Audit and reproducibility

- Original source and pre-polish bank are preserved in the job and `polish/bank-before.json`.
- `polish/before-*` contains the complete initial audit. Current accounting preserves all source IDs; excluded originals remain in the audit.
- `polish/decisions.jsonl` contains every current-bank question hash, disposition, reason, precise changes and evidence.
- Base intake: `scripts/build_biochemistry_bank.py`; then replay `scripts/finalize_biochemistry_polish.py JOB REPO`. The base build alone regenerates the pre-polish candidate and must be followed by the polish step.
- Gate rejects missing/duplicate IDs, stale hashes, illegal field changes, unsupported substantive corrections/exclusions, invalid keys, empty explanations or essay rubrics.

## Limits

- Nonblind AI review using opened sources; no independent clinician certification.
- Original PDFs were not inspected; repairs use the designated TXT and its page transcripts.
- No current course textbook was designated, so complete source scope is retained, including advanced metabolism.

## Verification

Fresh verification: 451 tests across 63 files passed; 15 Python parser/polish gate tests passed; production typecheck and build passed. Current logs are in `polish/tests.txt`, `polish/python-tests.txt` and `polish/build.txt`. Unrelated pending XP work is excluded from the release verification.

Current bank SHA256: `14d2214d7dda4e2feac521cbb14d616ba48bcc33938220924b57e2ad630453ef`
