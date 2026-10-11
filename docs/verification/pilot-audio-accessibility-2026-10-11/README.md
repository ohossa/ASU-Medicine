# Pilot, sound and accessibility verification

11 October 2026. Scope: existing report triage pilot, device sound policy, accessible quiz controls and accurate release documentation. Question banks, grading keys, reward amounts and payment integrations are unchanged.

## Production baseline

Authenticated owner navigation to `/admin` and `/admin/reports` worked. The inbox contains nine dismissed reports across nine groups, no open reports and zero owner-labelled pilot groups. Provider configuration is present. Prioritization remains disabled. Real email success was confirmed by the owner after `39d2ff4`.

The existing queue cannot process dismissed reports. The new explicit historical-pilot scope addresses this without reopening a report. It does not invent independent owner labels or weaken the gate. The nine available groups cannot satisfy a 50-group pilot; the numerical shortfall is real.

## Automated verification

- Device-default red test: desktop, Android, iPad and non-Safari iPhone browsers are default-on; iPhone Safari is default-off; explicit unmute works without audioSession; explicit mute persists; experimental API errors do not override a choice.
- Hook tests cover immediate synchronization of separate mounted sound controls; both audio engines use the shared preference.
- Header integration verifies visible sound text and pressed state outside the desktop-only shortcuts menu.
- Accessibility regression verifies the named nonmodal shortcuts panel, initial focus on its close button, Escape close/trigger focus return, and prevention of answer shortcuts while it is open. The nested main landmark is replaced by a named question region, preserving the portal main landmark.
- Pilot red tests demonstrate closed reports cannot previously be assessed. Green tests verify opt-in historical assessment, untouched report state, idempotent completion, no fabricated labels and authorization before reads. UI tests verify default-open scope and the explicit historical request.
- An initial full run passed 624 tests and hit a five-second full-catalog benchmark timeout while the build ran concurrently. The first typecheck also found two new test fixtures missing required explanation fields; those fixtures were fixed. Final verification runs the full suite and build separately and records actual results below.

## Design references

Apple skill used as responsive web guidance: `buttons.md` Best practices, `toolbars.md` Best practices, `toggles.md` Best practices, `accessibility.md` Vision/Mobility; foundations and cross-platform vocabulary were reviewed. The sound action uses a minimum 44px height, visible state text, bilingual action name, pressed state, and a described iPhone music caveat. It wraps with existing quiz actions on narrow screens rather than disappearing into keyboard settings.

## Audio limitations

Ambient audio is requested before context initialization. [MDN AudioSession type](https://developer.mozilla.org/en-US/docs/Web/API/AudioSession/type) describes mixing but the API is not universally available. Older iPhone Safari is silent until explicit opt-in; once opted in, feedback is allowed even when mixing cannot be promised. No sound test claims control over another app's media session.

## Physical verification

Owner confirmed an iPhone Safari is available for testing. Actual iPhone feedback is pending the production update. iPad/Android physical checks and real VoiceOver/TalkBack navigation are not established by viewport emulation or DOM snapshots. This receipt must not be presented as universal device/accessibility certification.

## Final local results

- Full suite: **637 tests, 111 files passed** (`npm test`, sequentially before build).
- Production build: `npm run build` passed all three TypeScript projects, Vite and PWA generation (120 precache entries).
- `git diff --check` passed.
- Browser: quiz sound control at 390px and 320px is visible, minimum 44px height, state updates through click and Space without answering a question. Search at 320/768px has no horizontal document overflow. Support English/Arabic at 320/768px has no horizontal overflow; Arabic content carries `lang=ar` and `dir=rtl`. GIT Past Exams appears before Subjects at 768px with no overflow. The extra nested main landmarks in quiz, chapters, search and progress are replaced with named regions.
- Email context regression: escaped HTML plus plaintext; original key clearly labelled; case parent/reported part preserved; owner notes and profile metadata excluded; payload frozen across ambiguous retries; legacy pending messages remain plain text; preview includes server-provided context. No real student email sent during verification.
- Past-exam ordering regression: stable presentation partition with explicit metadata / English and Arabic labels; no mutation of source arrays or identifiers; generic future module and GIT layout order tested.
- Physical audio, assistive-technology and email-client rendering remain distinct from these automated and DOM checks. No claim of complete device certification.

## Production release verification

Implementation `044308d` pushed to main. GitHub commit status reports successful Vercel deployment. Production `/admin/reports` displays the historical-pilot checkbox and retrieves its counts. The live email preview includes the original question/options, answer, explanation and student note; the temporary preview body was cleared without sending or saving a draft. The public reporting API returns 401 without authentication. Published GIT navigation visibly puts Past Exams before Subjects (production screenshot). Physical iPhone feedback remains pending.

Historical pilot assessment began in shadow mode. Initial batches encountered provider/evidence interruption and one timed-out request. The remaining eligible groups were processed while preserving retry delays; all nine groups now have stored assessments and the historical pending count is zero. Priorities: four need a decision, three uncertain, two low. All reports remain dismissed and visible, with zero owner labels and prioritization disabled. Timeouts are not approvals or owner labels. This is an initial live pilot, not a completed 50-group validation.
