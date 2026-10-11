# Authorized release — 11 October 2026

The user authorized pushing the completed Ethics import and three quiz UI changes. The release was reconstructed from origin/main in an isolated checkout with an explicit file list. Unrelated local files and original PDF inputs were excluded; private filesystem prefixes were made portable in published audit records.

Release-stage verification: 112 test files / 642 tests passed (`npm test -- --maxWorkers=2`); `npm run build` passed including app, Node and API TypeScript projects and PWA generation; staged diff whitespace check passed. Existing large-bank chunk warnings remain.

The local preparation reports describe the earlier pre-publication state. The production commit and deployment checks are recorded separately after pushing.
