# Owner dashboard

The `/admin` overview adds a full-inbox report summary, a prioritized list of unresolved questions, and anonymous Groq tutor usage. It uses the existing pinned Clerk owner authorization. Other accounts cannot read the overview endpoint.

## Report priorities

`GET /api/question-reports?action=overview` authorizes the owner before reading reports or tutor metrics. Reports are scanned in 500-record pages, deduplicated by report ID, and grouped by module, chapter, and parent question ID. New and reviewing reports count as unresolved. The eight priority questions are ordered by distinct reporting students, then unresolved reports, then recency. Opening a priority question opens its latest unresolved report. The backlog link selects the unresolved inbox filter.

The existing 10,000-report scan guard remains in place. The endpoint fails explicitly above this limit rather than returning incomplete counts. Concurrent inbox changes may require a refresh. Report status changes and question edits remain separate actions.

## Tutor accounting

Only executed Groq attempts are counted. Authentication failures, local rate-limit rejections, and static hints do not increment provider activity. Successful responses record the provider's input, output, and total token usage when available. Provider errors and transport failures increment failure counts.

Counters use atomic Redis Lua increments and the Africa/Cairo calendar day. Redis keys start with `asu_tutor:v1:` and expire after 32 days. No student identity, question text, chat contents, model response, credential, or arbitrary response header is stored. Only four numeric Groq quota headers and an observation timestamp are retained.

The dashboard distinguishes today's website counters from the latest saved provider quota reading. Daily request and minute token limits are shared by the provider account; a saved reading is not a live balance. Metrics started with this release and do not reconstruct earlier activity. Missing token usage cannot be inferred. Storage writes have a 1.5-second bound and are best effort, so these counters are operational indicators, not billing records. Metrics read failures leave report data available.

## Configuration

Existing hosted `REDIS_URL`, Clerk owner configuration, and `GROQ_API_KEY` are sufficient. Credentials stay in Vercel environment variables. No local secret file or new client credential is required.

## Verification

- Tests cover full pagination, deduplication, ranking, parent identity, and empty counts.
- Tests verify owner authorization occurs before any tutor metrics read.
- Tests cover Cairo day boundaries, atomic counter arguments, header allowlisting, safe storage failure, and quota absence.
- UI tests cover report links, source-number removal, empty activity, quota timestamps, and partial storage failure.
- Groq adapter tests verify failed provider attempts are recorded without exposing provider error bodies or retrying.
- The production build checks application, tooling, and NodeNext API TypeScript configurations.

Styles reuse the existing light/dark admin surfaces, with wrapping headings, two-column small-screen stat grids, stacked phone priority rows, and long-text wrapping. Automated component tests do not prove physical-device rendering.
