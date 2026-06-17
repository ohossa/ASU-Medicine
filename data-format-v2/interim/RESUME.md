# CNS Question Bank Enrichment — Resume Status

## Progress
- **Batch 01**: 192/354 enriched (54% done). Resume file exists.
- **Batches 02–10**: 0/3,183 enriched. Ready to start.
- **Total**: 192/3,537 enriched (5.4%)

## What Was Done
1. Parsed 3,537 questions from 81 cleaned chunks → `mcns2-interim.json`
2. Mapped subjects (12) and chapters (10)
3. Split into 10 batches (`batch-01.json` … `batch-10.json`)
4. Enriched Batch 01 Q0–Q99 manually (100 questions)
5. API-enriched 92 more questions in Batch 01 via DeepSeek (before credits ran out)

## Why It Stopped
- OpenRouter API key ran out of free credits (HTTP 402 after ~20 calls).
- Session turn limit reached (72/73).

## How to Continue in a New Session
1. Top up OpenRouter credits at https://openrouter.ai/settings/credits
   OR provide a new OpenRouter API key in `.env.local`.
2. Open a new Kimchi session in this project.
3. Say: **"Resume enriching the CNS question bank from where we stopped."**
4. The script `data-format-v2/scripts/enrich-fast.ts` will auto-resume from `batch-01-resume.json` and continue through all 10 batches.

## Script Settings (verified working)
- Model: `deepseek/deepseek-chat`
- PER_CALL: 5 questions per API call
- MAX_TOKENS: 2000
- CONCURRENCY: 8 concurrent calls
- Time estimate: ~5–7 min per batch once API credits are available.

## Files
- `mcns2-interim.json` — full parsed dataset
- `batch-01.json` … `batch-10.json` — split batches
- `batch-01-enriched.json` — 192 enriched questions
- `batch-01-resume.json` — chunks 0–19 already done
- `enrich-fast.ts` — the resume-capable enrichment script
