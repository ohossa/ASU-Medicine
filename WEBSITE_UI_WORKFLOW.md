# Website UI and release workflow

Updated 13 October 2026. Apply the repository's [Apple design skill](.agents/skills/apple-design/SKILL.md) and its relevant references to UI work. Translate the guidance to React and the web; do not claim whole-site compliance from a few screenshots.

## Study navigation

1. Inspect the actual catalog and canonical chapter/branch structure. Integrated chapters use Chapter → Subject → Topic; subject-first modules keep Subject → Topic; single-branch chapters open directly to topics.
2. Audit before extending `subjectBranches` in `src/app/learning/practiceNavigation.ts`. Current integrated support is MBL-2, MEM-2, audited multi-branch MCVS-2/MCNS-2 chapters, MSS-2 past exams only, and MRS-2 when populated. Repeated virtual topic rows do not count as independent subjects. GIT keeps its question-bank/past-exam separation.
3. Scope search, empty states and custom practice to the chosen branch. Preserve canonical subject indices, topic keys and question IDs. Show each topic title once; suppress an identical smaller branch label. Use correct singular/plural counts.
4. Above 20 questions, offer 20, 40 or the whole topic. Keep stable canonical chunks and existing selected-question fingerprints. Resume a valid unfinished chunk before choosing the next uncompleted one; a final chunk can contain fewer questions. Whole-topic selection includes every question in that topic.
5. Progress and chunk completion use available account-scoped, current-version history. False and zero-index answers are valid responses; uncommitted case drafts are not completed answers. Preserve grading, XP, history and resume behavior.
6. Server learning entries use canonical JSON hashes, while runtime attempts can use explicit/content-derived assessment versions. Resolve server-compatible versions through `src/app/loading/learningQuestionVersions.ts`, including correction revision, overlay guards, case-child inheritance and cache isolation. Disable short-session launch while loading; provide retry and whole-topic fallback on failure.
7. Returning from a quiz preserves the selected branch. Changing module or chapter resets it. Mobile breadcrumbs show parent/current with an accessible full-path menu; desktop shows the path. Retain keyboard traversal, Escape focus restoration, outside dismissal and RTL support.

## Persistent design rules

- Never reintroduce the subject colour-coding guide box.
- Quiz sound controls show the icon only. Keep accessible action/state labels and pressed state.
- Use semantic surfaces/text in light and dark appearances, visible focus, at least 44px action targets, readable hierarchy and reduced-motion support.
- Keep phone dialogs and path menus within the viewport. Check long topic names, empty searches and small remaining batches.

## Verification and publication

Inspect `git status`, the remote head and existing published changes first. Reconstruct the authorized release on current `origin/main` when the shared checkout contains unrelated work. Copy only reviewed files; preserve already published banks and unrelated local changes. Regenerate `src/app/generated/bankManifest.json` from the release tree. Never copy a stale manifest or stage private sources, credentials, caches or backup banks.

Run affected navigation/session/version/loader/grading regressions, then the complete required suite and `npm run build` (all three strict TypeScript projects). Existing focused tests cover Histology, branch routing, scoped custom practice, stable chunks, resume, false/zero answers, correction versions and breadcrumbs. Extend them only for actual new behavior. Save the tested tree/hash and results.

Inspect relevant desktop and phone flows, including subject-first GIT and chapter-first Blood, topic search, short/whole sessions, quiz return, long paths and focus. Check light/dark and RTL when affected; report the appearances and flows actually inspected. Read-only production checks do not prove authenticated learning writes.

Stage an explicit file list; inspect cached names, stats and `git diff --cached --check`. After authorized commit/push, verify GitHub CI for the exact SHA and the distinct Vercel deployment. Check `https://asu.codes` HTML, hashed entry/module assets and the released bank's canonical data against the tested build. Inspect `/api/question-bank?action=published` for valid JSON and check overlay compatibility. A GitHub Pages success alone does not establish Vercel/API health.

Keep source/review and local verification reports historical. Record fresh production evidence separately with commit, deployment, commands, counts, hashes and limitations. Do not claim publication until those checks succeed.
