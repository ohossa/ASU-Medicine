# AI tutor model migration (2026-10-08)

Both `meta/llama-3.1-8b-instruct` and `meta/llama-3.3-70b-instruct` returned HTTP 410 on production. Documentation pages persisted after retirement; the live `https://integrate.api.nvidia.com/v1/models` catalog excludes both endpoints.

The default and existing retired overrides now use `writer/palmyra-med-70b`, listed in the live catalog on 2026-10-08. Production/preview model settings were updated. The secret API key remains exclusively in Vercel.

For a future 410, the adapter reads the live catalog and retries once with an approved listed text model (Palmyra-Med, Palmyra-Med 32k, or Mistral Large 2), excluding the failed model. It never retries authentication, quota or general server failures. Requests have bounded timeouts; empty content fails explicitly. Upstream raw error bodies are no longer exposed to students.

Regression tests cover default/retired/alternative settings, successful catalog recovery, missing fallback, no retries on 401/403/429/500, and empty responses. Full suite/build are release gates. These are mocked provider-boundary tests, not proof of production credentials or quota. Live catalog availability alone does not prove successful inference; a signed-in tutor conversation must confirm it.

Free alternatives: Groq offers a quota-limited free plan (https://console.groq.com/docs/rate-limits); Gemini has model-dependent free tiers (https://ai.google.dev/gemini-api/docs/pricing). Switching providers requires provisioning a key directly in Vercel. Do not paste keys into chat or store them in Git.

## Groq activation

Production subsequently returned NVIDIA HTTP 404 for Palmyra-Med despite its catalog listing. Provider availability was not confirmed by a successful inference, so NVIDIA remains an optional adapter rather than the production choice.

The owner provisioned `GROQ_API_KEY` directly in Vercel. Set `HINT_AI_PROVIDER=groq` for Production/Preview and redeploy. No Groq secret is downloaded or committed. The Groq adapter uses `openai/gpt-oss-120b` (a production model), or an explicit `GROQ_HINT_MODEL` override. Its request preserves the same tutor prompts and conversation history. GPT-OSS uses low reasoning effort and excludes reasoning from the returned response; only final text is displayed. Completion budget is 1024 tokens including reasoning, with the existing system prompt requesting concise explanations. HTTP failures are not retried, private provider error bodies are hidden, and an empty answer fails explicitly. Existing authentication and per-user rate limits are preserved.

Groq's published free plan lists 30 requests/minute, 1,000/day, 8,000 tokens/minute and 200,000/day for GPT-OSS 120B as of 2026-10-08. These are organization-wide limits shared by all students, not per-student allowances. Exact account limits may differ. Remain on the Free plan to avoid paid usage; do not assume unlimited free access. https://console.groq.com/docs/rate-limits

After redeployment verify a signed-in tutor request. Structural/mocked tests cannot prove provider key validity or quota. An owner/student session is required; unauthenticated requests must remain denied.
