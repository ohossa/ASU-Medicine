# Private administration — Vercel-only setup

User preference: keep server secrets exclusively in Vercel. Do not download them, run `vercel env pull`, put them in local files, or commit them to GitHub. The browser publishable Clerk key is a public application identifier and is distinct from the server secret.

## Set in the existing Vercel project

Open Project → Settings → Environment Variables. Select Production, mark secrets Sensitive, and add:

| Name | Value source |
|---|---|
| `CLERK_SECRET_KEY` | Secret API key from the same Clerk project as the website's publishable key |
| `UPSTASH_REDIS_REST_URL` | Existing Upstash database's REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | That database's REST token |
| `REPORT_ADMIN_USER_ID` | Clerk User ID of the account with verified `omarhmaged@gmail.com` |

Alternatively use `REDIS_URL` instead of the two Upstash variables. Never prefix a server secret with `VITE_`. Production administrator authorization requires the verified owner email AND the explicitly configured user ID; it fails closed if the production ID pin is missing. Local tests still support verified-email authorization without a pin, but no server credentials are configured locally.

Default trusted web origins: `https://asu.codes,https://www.asu.codes`. If the deployed URL differs, set `REPORT_ALLOWED_ORIGINS` to the exact intended origins. To test a preview, configure the appropriate variables for Preview too and explicitly authorize its origin. Do not pull secrets to the computer to run that test.

Redeploy after adding environment variables. Environment changes do not update a running deployment. Node 24 is pinned in package.json. The release preview has been deployed; see the verification report for publication status.

Official Vercel references:

- https://vercel.com/docs/environment-variables/managing-environment-variables
- https://vercel.com/docs/environment-variables/sensitive-environment-variables

## What the code supports now

- Admin menu appears only after a successful server authorization check, including the account pin. It hides on an account change. A direct `/admin` URL grants no access by itself.
- Private report inbox with statuses, notes, immutable question snapshots, and a link to edit the target question.
- Search/edit existing questions across all 11 currently populated canonical banks (21,696 source questions at this check).
- Add validated MCQ, true/false, essay, blank, matching and case questions. Select the destination chapter/subject and lecture/topic. New IDs are generated in the editor.
- Remove questions from student practice; removal is reversible, retains audit history, and does not erase the source PDF/bank or old quiz history.
- Restore removed questions, load previous revisions, and export complete module revision history. A newly created question has no original source draft; use its history instead.
- Published additions/removals/corrections are applied from an immutable source baseline on each refresh, avoiding duplicate additions and allowing removed source questions to be restored.
- New attempts and browsing use the refreshed bank. Attempts already in progress retain their question snapshot. A removed or corrected question invalidates an incompatible saved attempt.
- The form edits basic content. The full format editor edits complex question parts, matching/blank rubrics and other supported metadata. IDs, original lecture routing, and existing part IDs/order are protected. New module/chapter creation and moving existing questions are separate features, not silently permitted by this editor.
- Empty planned modules are not listed for question creation until they have chapter/subject routing. This does not change their locked/coming-soon status.

## Hosting verification still required

After configuring Vercel and publishing the reviewed code:

1. Sign in with the pinned owner account; confirm the menu and portal appear.
2. Sign in with an ordinary student; confirm the menu is absent and private API reads/writes return denied access.
3. Submit a test report as that student; verify it appears only in the owner's inbox.
4. Create a clearly labelled test question; reload as a student and verify its routing and answer.
5. Edit it, verify the new revision, remove it, reload, restore it, and verify it returns once.
6. Verify history/export survive a deployment. Test two conflicting saves and confirm the older save fails.
7. Remove the synthetic test question from practice and retain its audit trail.

Live hosted Redis reads and unauthenticated access denial have passed. Authenticated Clerk/Redis writes and email delivery have not been tested yet. Automated tests use fixtures; they do not prove hosting credentials are valid. Email notifications are optional and require the existing Resend environment configuration. Reports persist in the private inbox regardless of email delivery status.

## Remaining work

- Production and Preview environment variables and the owner account pin are configured.
- Publish the reviewed code without unrelated workspace changes or secrets.
- Complete the hosted owner/student/persistence checks.
- Performance improvements such as module-based bank loading and a smaller offline cache remain optional follow-ups. They do not block this admin setup.
