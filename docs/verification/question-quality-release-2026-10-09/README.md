# Authorized question-quality release — 9 October 2026

This release combines the completed Semester 1 audit and dedicated IBM-1 OCR follow-up. The resulting bank contains 4,078 parent questions, including 1,416 Biochemistry questions. The adjacent audit reports contain correction decisions, exclusions, complete duplicate originals, source provenance and review limitations.

The release was isolated from the shared workspace on the current production baseline. Only the five reviewed Semester 1 banks, intake guards, quiz table/wrapping fix, regression tests, audit tooling and review evidence are included. No unrelated application features or Semester 2 bank changes are included.

Fresh verification: **475 application tests in 69 files and 15 Python behavioral tests passed**. Strict app, Node and API typechecks and the production build are required before publication; logs accompany this report. The GitHub-connected Vercel production deployment and live module assets must be checked against the exact pushed commit, alongside the published-owner-overlay API.
