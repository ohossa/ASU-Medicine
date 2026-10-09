# Local release review — 9 October 2026

Nothing committed or pushed. This is local verification, not a claim that all historical medical answers are independently verified.

## Completed checks

- JavaScript suite: **102 files / 584 tests passed**.
- `npm run build`: passed all three TypeScript projects and the production Vite/PWA build.
- All **42 imported banks** passed structural/quality validation.
- Python bank-quality tests: 15 passed.
- Redis ledger verification against isolated fakeredis: 6 passed. No production database was used.
- `git diff --check`: passed.
- Custom practice picker browser flow: three complete topics selected; 35 questions counted. Individual-question selection; exact two-question resume; canonical order; oral-cavity score 1/1 and palate score 0/1 on results and original cards. One session in Activity. Responsive dialog inspected at desktop, phone 390×844 and tablet 768×1024 with no horizontal overflow and visible action footer.

## Bank corrections discovered during review

The validator initially found 84 errors across MINF-1, MBL-2 and MRS-2. The cleanup ledger records eight conservative display cleanups and ten excluded unresolved parent questions. Original banks and every excluded item are preserved here.

Display cleanups removed scanner marks, bidirectional control characters and appended neighboring headings; answer indexes and option order were retained. Eight excluded respiratory case records lacked MCQ choices; two additional respiratory items contained unresolved corrupted text. This is a structural release check. Existing historical keys retain their historical provenance and are not certified as medically verified by these checks.

## User experience changes in this review

- Server-confirmed XP bubble replaces confetti; no confetti on results. Actual positive awarded amount only; duplicate zero awards remain quiet; reduced-motion support.
- Multi-topic / individual-question practice replaces the shared all-topic banner. One history record, per-topic scores, exact subset resume, current-key retakes, original question IDs for server XP and progression.
- Partial topic attempts are labelled Practiced; combined time is not misrepresented as each topic's time.
- Removed an outer AnimatePresence wrapper that attempted to animate multiple unkeyed non-animation route/status children and produced duplicate-key/wait-mode warnings.

Implementation details: `docs/CUSTOM_PRACTICE.md`.

## Checks that require the deployed environment or actual device

- Local Clerk/API configuration rejects cloud sync. Account-isolated queue, grading, duplicate XP and storage are covered by tests, but live cross-device saving and the XP bubble need a production acceptance check after an authorized deployment. Never report local queued changes as confirmed cloud writes.
- Actual iPhone Safari audio mixing with Spotify/YouTube needs device confirmation; browser width emulation does not emulate iOS audio policy.
- Groq production configuration and tutor response require live acceptance after deployment.
- AI report triage remains in shadow mode until the documented labelled pilot is reviewed. It does not silently discard reports.
- Card/Apple Pay support is intentionally unavailable until a provider is configured. InstaPay and Vodafone Cash links remain manual transfers; no transfers were sent for this review.

## Push boundary

Before a future authorized push, inspect the staging list. Exclude private tooling/cache directories (`.hermes`, `.superdesign`, Python caches), local bank backups (`*.bak`) and one-off preview files. Do not stage secrets, credentials or local environment files. Keep the necessary implementation, tests, documentation and reviewed question-bank changes. This review did not stage files.
