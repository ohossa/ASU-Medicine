# AI tutor model migration (2026-10-08)

Both `meta/llama-3.1-8b-instruct` and `meta/llama-3.3-70b-instruct` returned HTTP 410 on production. Documentation pages persisted after retirement; the live `https://integrate.api.nvidia.com/v1/models` catalog excludes both endpoints.

The default and existing retired overrides now use `writer/palmyra-med-70b`, listed in the live catalog on 2026-10-08. Production/preview model settings were updated. The secret API key remains exclusively in Vercel.

For a future 410, the adapter reads the live catalog and retries once with an approved listed text model (Palmyra-Med, Palmyra-Med 32k, or Mistral Large 2), excluding the failed model. It never retries authentication, quota or general server failures. Requests have bounded timeouts; empty content fails explicitly. Upstream raw error bodies are no longer exposed to students.

Regression tests cover default/retired/alternative settings, successful catalog recovery, missing fallback, no retries on 401/403/429/500, and empty responses. Full suite/build are release gates. These are mocked provider-boundary tests, not proof of production credentials or quota. Live catalog availability alone does not prove successful inference; a signed-in tutor conversation must confirm it.

Free alternatives: Groq offers a quota-limited free plan (https://console.groq.com/docs/rate-limits); Gemini has model-dependent free tiers (https://ai.google.dev/gemini-api/docs/pricing). Switching providers requires provisioning a key directly in Vercel. Do not paste keys into chat or store them in Git.
