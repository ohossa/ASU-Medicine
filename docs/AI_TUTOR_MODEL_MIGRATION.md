# AI tutor model migration (2026-10-08)

NVIDIA returned HTTP 410 because `meta/llama-3.1-8b-instruct` was retired. This is a model lifecycle error, not evidence of an invalid API key.

The NVIDIA adapter now defaults to `meta/llama-3.3-70b-instruct`. Missing, blank, or explicitly retired model overrides use this replacement; other explicit models remain configurable. The NVIDIA endpoint, tutor prompt, response contract, authentication and rate limits are unchanged.

Official provider reference: https://docs.api.nvidia.com/nim/reference/meta-llama-3_3-70b-instruct

Production and preview `NVIDIA_HINT_MODEL` must use the replacement. Existing `NVIDIA_API_KEY` stays exclusively in Vercel. A new deployment is required for environment changes to take effect.

Regression tests mock the provider HTTP boundary and cover absent, blank, retired and alternative model settings. These tests verify request construction and response parsing; they do not verify the production key or available provider quota. After deployment, test a signed-in tutor conversation. If NVIDIA then returns 401/403, investigate key permissions; 429 means provider quota/rate limits.
