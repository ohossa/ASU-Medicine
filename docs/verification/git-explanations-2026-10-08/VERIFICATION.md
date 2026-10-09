# Verification evidence

- `npm test`: 44 files / 304 tests pass.
- `npm run build`: pass (Node 24).
- Python explanation gate: seven tests pass.
- `verify_candidate.py`: full retained parent/child explanation coverage; exact question and answer fidelity; every excluded original accounted for; all topic/collection metadata and question order preserved.
- Independent semantic audits: 6,608 exact IDs, bound to reviewed decision hashes or explanation text; root override decisions recorded. These are content reviews, not independent medical certification.
- Strict application TypeScript: 120 distinct existing diagnostics, zero new diagnostics against preceding quality-screen baseline. Not a passing check.
- Browser: visible short explanation after answering an objective question, hidden beforehand; mobile 390 px viewport has no horizontal overflow. Case subquestion reveal behavior has a regression test. Physical iOS Safari was not tested.
- Local preview correctly uses the bundled bank while the existing question-correction service is unavailable. No hosted admin credentials or secret configuration changed.
- No Git push or deployment performed.

## Reproduce

From this artifact directory:

```sh
python3 -m unittest test_explanation_gate.py
python3 verify_candidate.py
```

From `/Users/omarhossa/Documents/Medcine ASU/ASU-Medical-Portal`:

```sh
npm test
npm run build
npx tsc --noEmit -p tsconfig.app.json
```

The last command currently fails with the documented pre-existing baseline. `finalize_explanations.py --apply` intentionally refuses a second application; the original snapshots and final candidate support safe recovery.
