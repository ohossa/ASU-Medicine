# Authorized question-quality release — 9 October 2026

This release combines the completed Semester 1 audit and dedicated IBM-1 OCR follow-up. The resulting bank contains 4,078 parent questions, including 1,416 Biochemistry questions. The adjacent audit reports contain correction decisions, exclusions, complete duplicate originals, source provenance and review limitations.

The release was isolated from the shared workspace on the current production baseline. Only the five reviewed Semester 1 banks, intake guards, quiz table/wrapping fix, regression tests, audit tooling and review evidence are included. No unrelated application features or Semester 2 bank changes are included.

Fresh verification: **475 application tests in 69 files and 15 Python behavioral tests passed**. Strict app, Node and API typechecks and the production build are required before publication; logs accompany this report. The GitHub-connected Vercel production deployment and live module assets must be checked against the exact pushed commit, alongside the published-owner-overlay API.

## Confirmed production deployment

Commit `f41a1db607e9062898d444a0abe22e8c7ea85863` was pushed to `main`. Vercel Production deployment `6964044945` succeeded, and GitHub Actions run `37949265503` succeeded. The `asu.codes` HTML references the new entry asset, which references `IBM-1-BsPcQWyL.js`. Its bytes match the tested build, and parsing its embedded JSON without executing the JavaScript confirms all 1,416 questions match the canonical bank, including the six-pair matching exercise and clarified UTP question. The published-overlay API returned valid JSON with zero edits. See `production-verification.json`.
