# ASUCodes voluntary support page plan

**Status:** Local support-page design and master plan, updated 2026-10-09. Payment details were supplied by Omar for the page. Do not commit, push or deploy the support page until explicitly approved. Do not transact, register a merchant or accept provider terms on the owner’s behalf. Biochemistry was released separately as c00c492.

ASUCodes is a free, independently maintained student project. The support page should explain its real operating costs, make voluntary contributions easy, and give supporters a clear route to recover a mistaken payment. Success means students can find the page, understand where their money goes, and continue studying with the same access whether they contribute or not.

## Recommended payment setup

Use InstaPay and Vodafone Cash for local transfers. Prefer **Paymob hosted payment links in EGP** as the third method, subject to approval of this exact individual-operated project and its voluntary-support use case. Do not offer Buy Me a Coffee in this release: the payout list checked on 2026-10-09 does not include Egypt. Reconsider only after the provider explicitly confirms Egyptian onboarding for this account. Select one card provider for the first release rather than presenting two confusing card buttons.

| Method | Student experience | Owner work before launch |
| --- | --- | --- |
| InstaPay | Open the owner-generated payment link when available, or copy the IPA; confirm recipient name and amount in the payment app | Supply and verify the real IPA, recipient name, and app-generated link/QR; confirm the receiving account permits this use |
| Vodafone Cash | Copy the verified wallet number or use a verified provider-generated QR; transfer in the wallet app | Supply and verify the wallet number and displayed recipient; reconcile received transfers |
| Paymob | Hosted card/Apple Pay checkout; EGP is the preferred configured currency | Obtain merchant/use-case approval, enabled live methods, settlement terms, refund permissions and an actual fee quote; test payment and refund |
| Buy Me a Coffee alternative | Hosted creator support checkout with cards and eligible Apple Pay | Currently unavailable: Egypt is absent from the published payout list checked on 2026-10-09 |
| Direct Stripe | Not selected for the initial Egyptian setup | Egypt is absent from Stripe's direct business-account country list; a supported platform's Express payout availability does not mean an Egyptian individual can open a normal direct Stripe account |

Paymob documents Apple Pay in Egypt, payment-link integration, and full/partial refunds. Availability must also be enabled on this merchant account. Its documentation says Apple Pay has live integration IDs only, so sandbox card tests alone cannot prove live Apple Pay works. Hosted checkout avoids collecting card details inside ASUCodes. [Paymob Apple Pay documentation](https://developers.paymob.com/paymob-docs/payments-and-features/payment-methods/apple-pay-all-regions).

Buy Me a Coffee's payout article checked on 2026-10-09 lists Stripe Standard Connect and Express countries, and Egypt is absent. Earlier eligibility notes are superseded. Do not build a payment promise around unavailable onboarding. [Current payout eligibility](https://help.buymeacoffee.com/en/articles/6258038-supported-countries-for-payouts-on-buy-me-a-coffee).

Buy Me a Coffee publishes a 5% platform fee plus payment processing, a fixed per-payment component, payout fees and possible international surcharges. This makes small foreign-currency payments less efficient than the headline 5% suggests. Confirm the actual account charges and currency before enabling it; do not promise EGP checkout without testing. Paymob's advertised pricing also needs an account-specific quote including tax, settlement, minimums and refunds. Local transfer fees should be described as shown by the student's app, rather than hardcoded permanently into ASUCodes. [Buy Me a Coffee fee breakdown](https://help.buymeacoffee.com/en/articles/8105744-how-to-calculate-charges-on-your-payment), [Paymob pricing](https://www.paymob.com/en/pricing).

**Decision:** Paymob is the preferred Egypt-first card route; Buy Me a Coffee is not a launch option under the currently published country list. Neither is considered activated by this plan. Direct Stripe incorporation is unnecessary complexity for this launch. Apple Pay is a checkout method through a processor, not a separate place for the owner to receive money.

## Where students should see support

| Location | Placement | Visibility rule |
| --- | --- | --- |
| Main year-selection page | A restrained “Keep ASUCodes free” card below the year carousel and study tools | Below the main study actions, not above the student's selected year |
| Global footer | “Support ASUCodes” beside contact/about links | Present on normal browsing pages that already show a footer |
| Account menu | “Support ASUCodes” with a heart icon | Separate from “Report a bug,” with clear labels |
| Results page | One small support card below score, answer review and retry actions | At most once per 30 days after a completed session; dismissible; never tied to a good or bad score |
| About/project information | Short ownership and operating-cost explanation with a support link | Available to anyone interested in the project |
| Question-solving screens | No support prompt, floating widget, animation or donation button | Preserve the clean quiz layout |
| Login, vitals/startup animation, marks calculator inputs | No prompts | No extra steps or loading delay |

The monthly results-card suppression can live in account preferences when signed in and local storage for guests. It must not delay rendering or add a network request to quiz completion. Footer and menu links remain discoverable after a prompt is dismissed. If monthly running costs are covered, replace the results request with a quiet thank-you or omit it.

The route should be `/support`, with linked `/support/transparency` and `/support/refunds` sections or subpages. It must open directly and without a login requirement. Current `App.tsx` wraps the study router inside Clerk `SignedIn`; implement the public support entry point deliberately, with the private study app still protected. Do not make the whole application public to expose this one page.

## Page structure and visual direction

Use the site's existing dark/light palette, typography, rounded panels and restrained emerald accent. Aim for premium spacing, crisp text and subtle depth, not a payment page overloaded with effects. Avoid confetti, countdowns, shaking buttons and pressure language.

1. **Hero:** “Help keep ASUCodes free.” Two lines explain that Omar runs the independent project and voluntary support pays its operating costs. A small “Always free to use” reassurance sits beside the action.
2. **Cost summary:** Current verified monthly running estimate, amount received toward it, and date last updated. The number links to the full breakdown. Show an honest empty state until the owner has entered real bills; no fabricated target or donation count.
3. **Payment choices:** Three equal, accessible cards: InstaPay, Vodafone Cash, and the selected card provider. Clicking a card reveals only that method's instructions. Suggested local amounts of EGP 25, 50, 100 and “Other” are proposals, with no amount preselected. Provider-specific currency/minimums override these suggestions visibly.
4. **How support helps:** Hosting/API usage, database, domain renewal, backups and necessary services actually used. Do not imply every service is a paid subscription if it is currently on a free tier.
5. **A note from Omar:** A short, natural explanation of why the project exists, who maintains it, and how costs are handled.
6. **Transparency:** Monthly summary, carry-forward balance, recent real expenses and redacted receipts where appropriate.
7. **Mistaken payment help:** A prominent plain-language refund link close to the payment choices, not buried solely in terms.
8. **FAQ:** Is payment required? Do supporters get better access? Can I remain anonymous? How are payments confirmed? What happens if costs are already covered? How do refunds work?

On desktop, the payment panel and budget summary can sit alongside each other. Mobile uses a single column with full-width actions; no tiny horizontally scrolling payment selector. Minimum 44px touch targets, visible keyboard focus, adequate contrast, reduced-motion support, correct Arabic RTL, and readable copy at 200% zoom. QR codes need a copy-address alternative for someone using the same phone, not a second-device requirement.

## Proposed student-facing copy

**Introduction:**

“ASUCodes is a free, independent project built and maintained by Omar. If it helps you study and you'd like to support it, you can contribute towards hosting, the database and domain costs. Supporting is completely optional. Everyone gets the same access.”

**Near payment buttons:**

“Check the recipient name and amount before confirming. ASUCodes will never ask for your payment PIN or OTP.”

**Mistaken payment:**

“Sent a payment by mistake or paid twice? Contact me with the transaction reference, amount and date. Once I confirm the payment, I'll arrange its return to the original payer. Your bank or payment provider controls how long it takes to reach you.”

Use “Support ASUCodes” or “voluntary contribution” rather than claiming registered-charity status or issuing tax-deductible receipts. Clearly identify it as an independent student project; do not imply official university ownership or endorsement. If actual organizational status changes, update the description from verified information.

## Payment flows that do not mislead students

### InstaPay and Vodafone Cash

- Show the exact verified recipient, alias/number, copy action and an owner-generated link/QR where available. Test that the QR resolves to the same account as the displayed text.
- The app controls the actual transfer, amount and fees. A suggested amount on ASUCodes is not proof it was prefilled in the app.
- “I've transferred” opens an optional confirmation form; it means **submitted for reconciliation**, not “payment received.”
- Request method, transaction reference, amount and date; ask for contact email only if a receipt or help is requested. An optional redacted proof can be supplied if the reference is insufficient. Never require a bank statement or account balance screenshot.
- Match against the actual receiving bank/wallet statement. A screenshot alone cannot mark funds received. Do not scrape the bank app, request donor credentials, or assume a public InstaPay payment API exists.
- Show a neutral thank-you without blocking study. A supporter can contribute anonymously without creating an ASUCodes account.

### Hosted cards and Apple Pay

- Start with a provider-hosted checkout/payment link. Clearly name the provider, displayed currency, amount and any fee policy before redirecting.
- Preserve the selected amount only where the provider supports it. If fixed payment links are used, each must match its advertised amount; custom amounts use the provider's supported checkout, not a fake form.
- Do not collect PAN, CVV, Apple Pay credentials or banking secrets. Provider secrets, if API integration is chosen, belong only in Vercel's server environment.
- An external return URL is not confirmation of payment. Confirm using a signed webhook and server-side verification, or reconcile the provider dashboard manually for a link-only first release.
- Webhooks require signature verification, amount/currency/reference checks and idempotency. A retry, repeated tab or repeated callback must not create duplicate donations or duplicate refunds.
- Apple Pay should appear only when enabled and eligible. Provide normal card checkout when unavailable; do not show a nonfunctional Apple Pay button to Android users.
- Failed, declined, cancelled and pending payments get distinct messages and do not inflate the funding counter. Never silently route a failed payment to a different provider.

## Transparency and accounting

Enter actual costs before publication. The public page should show a monthly operating estimate and a separately reconciled cash summary:

- Actual recurring hosting, database and service bills.
- Annual domain/other renewals shown both as annual amounts and monthly equivalents when used in the estimate.
- Verified contributions received, separately from merely reported transfers.
- Processor/withdrawal fees, refunds, actual expenses, and remaining available funds.
- The amount Omar personally paid, labeled separately from student contributions.
- A rolling balance and clearly named reserve, if the owner chooses one; avoid counting the reserve as a bill already paid.
- Date last reconciled and date the public statement was published.

Do not double-count annual bills as both cash expenses and twelve monthly cash expenses. Goal coverage should use net eligible funds available toward operating costs, with carried-over funds separately visible; the public breakdown explains the calculation. If the target is met, funds carry forward for future costs and the page says so. Disable payment collection if the project closes; publish the verified remaining-balance disposition and contact affected supporters.

For multiple currencies, keep original amount/currency, actual fees and actual EGP settlement. Use settlement values for the public EGP totals. Avoid presenting a guessed exchange rate as actual received money. Raw donor names, emails, bank numbers, transaction references and bank statements never appear publicly. Publish aggregate monthly summaries and selectively redacted expense receipts. No public donor wall or supporter badge without separate, explicit consent; no XP or leaderboard advantage for donating.

## Refund process

Omar's policy should expressly welcome mistaken, duplicate and unauthorized-payment reports. The owner aims to acknowledge requests within two working days; this is a proposed service commitment to approve, not an automated guarantee. Do not impose an invented short statutory deadline or promise instantaneous refunds.

1. Receive the original transaction reference, method, date, amount and a contact address. Provide a guest-accessible request form and the existing contact email as a fallback.
2. Verify the money actually arrived, the requester is the original payer, and whether a provider dispute or earlier refund already exists.
3. Refund to the original payment method/payer. Card refunds are initiated through the provider, never by sending cash to an unrelated number. Local transfers are returned manually to the verified sender, recording the outgoing reference.
4. Require owner confirmation before execution. AI may summarize a request but must never approve or send a refund.
5. Show requested, verified, refund initiated and refund completed as separate states. Mark completed only when supported by actual provider/transfer evidence. Keep a unique refund record and prevent total refunds exceeding the confirmed contribution.
6. Notify the supporter with the reference and provider-dependent timing. Record a reversal if the provider rejects or later reverses the refund; do not delete the history.

Aim to return the original contribution for a verified mistake. Determine before launch which provider fees are recoverable and which the project would absorb; do not silently deduct a fee or promise bank foreign-exchange differences can always be restored. Hold enough funds to meet pending approved refunds and avoid counting them as money available to spend.

Buy Me a Coffee's platform policy treats ordinary support differently from purchases and does not guarantee refunds; it allows creator-approved returns, notes that depleted creator balances can delay them, and gives processing timing once approved. Obtain confirmation that this project's more welcoming mistaken-payment policy can be honored through its actual account before selecting it. [Provider refund policy](https://help.buymeacoffee.com/en/articles/8722330-buy-me-a-coffee-refund-policy).

## Owner-only administration

Add a separate Support section to the existing owner-only admin area:

- Contributions: method, gross amount, currency, fees, net settlement, reference, timestamps and verification state.
- Matching queue for manual transfers; duplicate-reference detection and clear unmatched records.
- Refund requests with original transaction linkage, verified payer information, approval and outgoing reference.
- Expense entry with categories, amount, currency, date and a private receipt; explicit action to publish a redacted version.
- Monthly statement preview with arithmetic and reconciliation checks before publication.
- Exportable accounting CSV, immutable change history and a payment-method pause switch.

Enforce the existing owner authorization on every server read and write; hiding a menu is not authorization. The owner is already pinned by Clerk ID and verified email. Students can submit a request or see their own case status only with an appropriate scoped token/account check. Public APIs expose a precomputed aggregate summary, never the private ledger. Use server schema validation, abuse limits, signed webhook checks, HTTPS and restricted upload access. Store amounts as integer minor units with currency, not floating-point values.

Keep donor data to the minimum needed for reconciliation/refunds. Make proof images private, strip unnecessary metadata, redact before any publication, and delete them once their defined purpose/retention period is complete. Retain the minimal financial record according to actual applicable requirements. Do not enroll donors in mailing lists automatically or share their details with student reviewers.

## Implementation shape

Reuse the current React/TypeScript/Vite design components and existing owner authorization. Do not rebuild the application shell or couple this work to the pending XP/progress feature.

Proposed units:

- `src/pages/SupportPage.tsx`: public lazy-loaded landing page and payment choices.
- `src/app/components/support/`: payment cards, transfer instructions, funding summary and refund form.
- A shared support link used by `PortalFooter.tsx`, `PortalShell.tsx`, the dashboard and account menu; results placement handled separately with dismissal preferences.
- Server support configuration: verified public receiving details, enabled provider, hosted URL allowlist and refund contact; private provider secrets stay out of client code and Git.
- `api/support.ts` with server helpers, if internal confirmation/refund forms are enabled; minimal validated submissions, private owner reads and aggregate public totals.
- Provider webhook endpoint only for an actual verified API integration. A hosted-link/manual-reconciliation launch does not falsely claim automatic confirmation.
- Private contribution, refund and expense ledger in the existing server datastore, with append-only audit events and idempotency keys. Public month summaries are published snapshots with a last-updated time.

The support bundle loads on its own route and should not increase question-loading work. Reading the public monthly summary must not trigger a bank load or academic-year save. Disabled/unconfigured payment methods are hidden with useful alternatives. If configuration is unavailable, show the contact fallback and no fake payment target.

## Verification before launch

- Mobile widths 320/375/390/430px, tablet portrait/landscape, desktop, Safari and Chrome, Arabic RTL, dark/light theme, keyboard and reduced motion.
- Direct public links signed out; private admin remains blocked for everyone except the owner.
- Copy, QR and redirect recipients match the verified owner details. Invalid/disabled methods do not produce working-looking payment buttons.
- One actual controlled transfer for each local method, plus the associated reconciliation and return workflow.
- Cards: successful, declined, cancelled and pending checkout; exact amount/currency; one live eligible Apple Pay payment and refund after method approval, with owner's authorization for that controlled financial test.
- Repeated confirmations/callbacks, forged success URLs, duplicate webhooks, wrong currencies/amounts, duplicate references and double refund requests do not change totals incorrectly.
- Accounting arithmetic, monthly carry-forward, owner contributions, annual renewals, fees, partial/full refunds and multi-currency settlement use documented examples and automated tests.
- No private donor data in public endpoints, page HTML, analytics, logs, exports intended for the public, or browser bundles.
- All study flows still load quickly, preserve the student's year and quiz progress, and show no fundraising UI during questions.
- Production build and full regression suite pass. The donation feature is not included in Git or any deployment until explicitly authorized.

## Owner inputs needed for implementation and activation

The design can be reviewed without supplying any secret:

1. InstaPay IPA, exact recipient name and an app-generated payment link/QR if available.
2. Vodafone Cash receiving number and exact recipient name; agreement that these public receiving details may be displayed.
3. Actual recurring costs and annual domain renewal bill, with the desired public detail and any proposed reserve.
4. Paymob approval for the individual-operated support use case, or an approved Buy Me a Coffee page and Egyptian payout setup. Prefer Paymob; do not offer Buy Me a Coffee without new written provider confirmation of Egyptian eligibility.
5. Refund contact and agreement to the two-working-day acknowledgment target, fee policy, data retention and anonymous-support defaults.

Provider identity documents and bank credentials go directly to the provider. Server secrets go directly into Vercel environment variables when needed, never into chat or Git. Once the design is approved, build and test the complete feature locally, present the working preview, and request publication only after the receiving details and payment/refund tests are verified.


# Implementation master plan, 2026-10-09

## Confirmed owner setup

- Recipient: **Omar HossamEldin Maged**.
- InstaPay IPA: `omarhossa_@instapay`.
- Owner-supplied link: `https://ipn.eg/S/omarhossa_/instapay/4S0M2b`.
- InstaPay phone and Vodafone Cash wallet: `01040479155`.
- Refund/help: WhatsApp on the same number, `https://wa.me/201040479155`.
- Receiving details are public page configuration, not API credentials. The owner provided them for this purpose. Provider keys must remain server-side in Vercel.
- The alias, recipient and link are owner-supplied; do not label the bank account independently verified until the owner has checked the recipient shown by InstaPay. An app transfer is a separate deliberate action by the supporter.
- No real operating-cost bills, funding target, received total or merchant approval have been provided. Never substitute estimates into published accounting.

## Three approaches considered

1. **Local transfers and hosted card links (recommended first release).** Simple, no card data enters ASUCodes, manual local-transfer reconciliation is honest. Cards remain disabled until an approved account and genuine hosted checkout exist.
2. **Full payment API and donation ledger immediately.** Provides automatic status/refund workflow for cards, but needs merchant approval, verified signed webhooks, server secrets and live testing. It does not automatically reconcile InstaPay or Vodafone Cash.
3. **Third-party creator platform only.** Less code, but country eligibility, foreign currency, fixed fees and payout support can make it unsuitable. Current Buy Me a Coffee list omits Egypt.

Ship a complete, useful first page with the two real local methods. Add card checkout once eligibility is confirmed. Do not build fake progress widgets or payment success screens to fill the gaps.

## Design specification

**Purpose:** let a student support a free independent project in under a minute, understand the recipient, and find recovery help without affecting study access.

**Visual:** retain Manrope/Archivo and the portal’s emerald identity. Solid graphite content surfaces with a dimensional stack of study cards as the signature visual. Quiet glass navigation only. Light mode gets white surfaces and deep emerald. Payment and budget sections have different visual weight; avoid a grid of identical generic feature cards.

**Content order:** short hero and voluntary promise; personal note; payment method choice; operating-cost explanation; mistaken-payment help; concise FAQs; independent-project footer. A direct support anchor skips the hero.

**Compact layout:** single column, payment choices wrap into full-width controls, at least 44px touch targets, no fixed donation bar covering content. **Regular layout:** editorial hero beside study-themed visual, payment instructions alongside transparency details. Text remains selectable and payment addresses never truncate.

**Colours:** graphite `#0D1017`, content surface `#171D29`, primary text `#F6F8FC`, secondary `#ADB8C8`, accent `#5AE0B0`. Light: `#F8F9FC`, `#FFFFFF`, text `#192235`, accent `#087E60`. Recheck actual rendered contrasts, not only nominal tokens. Use colour plus labels/checkmarks for selected method.

**Type:** 16–18px body, 13px minimum utility text, fluid 42–76px hero with natural wrapping. Avoid long all-caps labels, pressure slogans, and donations tied to student scores.

**Motion:** one short optional entrance; no perpetual pulse, 3D cursor tracking or decorative animation around payment confirmation. Reduced-motion and reduced-transparency settings remove effects. Standard native links/buttons and disclosure controls remain familiar.

## First-page behaviour contract

- Support route is public and lazy-loaded, reachable without account or saved-year lookup. It must not import the study bank, CloudSync, academic-year modal or quiz state.
- Default method may be InstaPay, but **no contribution amount is preselected**.
- Suggested amounts are optional guidance in EGP. Explicitly tell users to enter their chosen amount in the payment app; the owner link does not establish automatic amount prefilling.
- InstaPay: show actual IPA and recipient; copy IPA; open the exact owner-supplied HTTPS link. Never create a made-up deep link. A QR, if added, encodes that exact link locally and has a copy/open alternative on the same phone.
- Vodafone Cash: show wallet number and recipient; copy number; explain completing the transfer in the user’s wallet app. Do not claim an unverified automatic wallet checkout.
- Clipboard denial/unsupported browser: keep the address readable/selectable and show a clear manual-copy message. A successful copy announces “Copied” through a polite live region.
- Cards/Apple Pay: clear unavailable state until a real provider checkout is configured. No disabled-looking button that still navigates, no placeholder payment URL, no invented processing fees.
- “I’ve transferred” is optional WhatsApp contact for reconciliation, never automatic payment success or a public donation total update.
- WhatsApp links open a message draft; the student decides whether to send it. Refund drafts ask only for amount, date, method and reference; never PIN/OTP or full bank statement.
- Refund copy promises help arranging a return after reconciling payment, not guaranteed immediate payment or unsupported fee reimbursement. Actual timing and refund fees are described after provider confirmation.
- No XP, leaderboard advantage, badge requirement, content unlock or public name for donating. Any future optional supporter acknowledgement must be explicit opt-in and confer no study advantage.
- Exact costs missing: show honest prose and “Detailed cost breakdown being prepared”; never a fake goal, fake donor number or “0 raised” without a ledger.
- Third-party payment links use HTTPS, `rel="noopener noreferrer"` when opening a new tab, and a constrained domain allowlist. Never accept an arbitrary redirect URL from the page query string.

## Placement and discovery

First launch adds a small home card below the selected-year study actions and one footer/menu link on browsing pages. Questions, login, loading/vitals and calculator input screens stay clear. Results-page invitations are a separate optional iteration, capped at once per 30 days and dismissible. Ordinary support links remain available without popups.

Do not turn the entire Clerk-protected app public. A thin public route outside the signed-in study shell handles `/support` and its anchors; the existing `/admin` gate remains untouched. Public support styles are scoped to avoid global typography/layout regressions.

## Payment provider activation

- Preferred card provider: Paymob hosted links in EGP, pending approval of this exact owner/use case.
- Obtain confirmed merchant eligibility, enabled payment methods, settlement bank, fees/tax, refund permissions, dispute process and support contact directly from Paymob.
- Apple Pay requires actual merchant activation and live integration. Documentation supports Egypt and full/partial refunds but does not prove this account has those capabilities.
- First release can use fixed hosted links if configurable amounts are unavailable; match displayed amount/currency to each real link.
- A return-to-site URL does not prove success. Trust a verified provider event or manual receiving-account reconciliation.
- Owner performs any controlled real payment/refund test. The agent must not transfer funds or accept merchant terms.

## Optional ledger subsystem after launch

Keep it separate from the page: no speculative API dependency on the first render.

Entities: `supportConfig` (public verified methods); `contributions` (private amountMinor, currency, method, provider/reference, status); `refundRequests`; `refundEvents`; `expenses`; `publishedMonthlySummaries`; `auditEvents`.

Local transfer states: reported → reconciliation_pending → confirmed or unverified. Card states: pending → succeeded/failed/cancelled based on authenticated provider evidence. Refund states: requested → reviewed → initiated → completed/failed, with exact refunded amount. Never delete a confirmed contribution to represent a refund; append a refund event.

All monetary values use integer minor units and explicit currency. Confirmed net support = received gross minus actual fees and completed refunds. Available funds = opening balance plus confirmed net support plus disclosed owner contributions minus expenses. Pending and unverified entries never count toward totals. Different currencies are not summed without disclosed exchange rate and settlement basis.

Every owner endpoint checks existing Clerk owner ID and verified email on the server. Students cannot read other donor requests. Webhook signature verification must use the unmodified provider-required payload; retries use a unique provider event ID and idempotent writes. Reject wrong amount/currency/account, replayed invalid signatures and arbitrary browser success claims.

No anonymous publicly writable ledger. If internal forms are introduced, use validated bounded fields, abuse limits, minimal logs, private evidence storage and a documented retention policy. Redact all public receipts. Do not give financial/admin access to academic question reviewers.

## Owner dashboard, when ledger is enabled

One support area: reconciliation queue, refund requests, confirmed contributions, expenses, monthly summary publishing, payment-method pause controls and export. Summary preview must show public information separately from private donor details. Every edit has an actor/timestamp/reason. No totals change before an explicit owner confirmation backed by actual receipt.

## Delivery sequence and acceptance criteria

1. **Design draft:** Superdesign produces the full page; Apple guidance checks typography, layout, contrast, input targets, motion and honest unavailable states. Review the real rendered draft, not just HTML.
2. **Local implementation after design approval:** build React route, actual supplied transfer details, copy fallbacks, WhatsApp links, scoped CSS and public signed-out entry. Do not push.
3. **Local verification:** unit/component tests cover method switching, no selected amount, exact copy values, errors, correct recipient/URLs, unavailable cards, refund draft and no fake totals. Route tests verify no auth/year gate and owner admin remains protected. Exercise 320/390/430px, tablet, desktop, light/dark, RTL, keyboard and reduced motion.
4. **Owner payment check:** independently confirm alias/number/recipient using the actual receiving services. No financial transaction performed by the assistant. Verify the WhatsApp destination.
5. **Publication approval:** present the complete local page and actual bill/fee limitations. Push only explicit support files after approval; exclude pending XP/progress/donation service experiments.
6. **Production verification:** verify commit status, actual route, exact recipient/details, safe redirects, public signed-out access and untouched study routes. Record a release receipt.
7. **Card extension:** only after merchant approval/live hosted links; run provider-specific failure/cancel/pending/refund gates before enabling the third method.
8. **Ledger extension:** separately specified and tested; publish actual monthly aggregates and receipts only after owner review.

## Release checklist

- Real recipient fields and links verified; no private keys in Git/client bundle.
- No fabricated financial figures or charity/tax/university claims.
- All study access remains free and unchanged.
- Support is public, but admin/data remain private.
- Copy and WhatsApp links work with recoverable errors.
- Card/Apple Pay wording reflects actual activation.
- Refund route is visible and truthful.
- Small-screen, keyboard, zoom, appearance and reduced-motion checks pass.
- Full regression tests, typecheck and build pass on an isolated release copy.
- Explicit publication approval, then deployed version and real page verified.

## Current status

Biochemistry is separately live at commit `c00c492`. Support design/plan and newly installed Apple design skill remain local. The approved public support page is implemented locally at `/support`, including InstaPay, Vodafone Cash, bilingual copy, appearance controls, and WhatsApp refund assistance. Card onboarding and actual cost accounting remain owner inputs. No provider account, card API, financial transaction or automatic payment confirmation has been created.
