import { readFileSync, writeFileSync } from 'node:fs';

const API_KEY = process.env.OPENROUTER_API_KEY || '';
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-chat';
const CONCURRENCY = 3;
const CHUNK_SIZE = 60;

interface Question {
  [key: string]: any;
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function callLLM(systemPrompt: string, userContent: string, maxTokens = 8192): Promise<string> {
  const body = {
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ],
    max_tokens: maxTokens,
    temperature: 0.3,
  };

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const resp = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': 'https://kimchi.dev',
          'X-Title': 'CNS Enrichment',
        },
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        console.error(`HTTP ${resp.status}: ${txt.slice(0, 300)}`);
        if (resp.status === 429 || resp.status === 503) {
          await sleep(5000 * attempt);
          continue;
        }
        await sleep(2000 * attempt);
        continue;
      }
      const data = await resp.json() as any;
      const text = data.choices?.[0]?.message?.content as string;
      if (!text) throw new Error('Empty response');
      return text;
    } catch (e: any) {
      console.error(`Attempt ${attempt} failed: ${e.message}`);
      await sleep(3000 * attempt);
    }
  }
  throw new Error('All LLM attempts failed');
}

function cleanJsonResponse(raw: string): string {
  let t = raw.trim();
  if (t.startsWith('```json')) t = t.slice(7);
  else if (t.startsWith('```')) t = t.slice(3);
  if (t.endsWith('```')) t = t.slice(0, -3);
  return t.trim();
}

function buildSystemPrompt(): string {
  return `You are a medical education content enrichment engine. You receive arrays of CNS question objects and return enriched arrays with missing fields filled in.

=== RULES (ZERO EXCEPTIONS) ===
1. You MUST return ONLY a valid JSON array. No markdown code fences. No comments. No extra text.
2. The output array MUST have the exact same length and order as the input array.
3. For each question object, you may ONLY modify fields that are null, empty string "", or missing. Preserve all existing data exactly.
4. Generate these fields when empty:
   - "explanation": 2-4 medically accurate sentences explaining WHY the correct answer is correct and WHY major distractors are wrong.
   - "keyConcept": One high-yield flashcard takeaway (max 1 sentence).
   - "correctAnswer": Only for mcq/truefalse types where this field is null/empty. Use your medical knowledge ONLY if >=80% confident. Do NOT guess.
   - "modelAnswer": Only for essay types where this field is empty/"N/A". Generate 3-6 sentences covering key points.
   - "options": Only for mcq types where options.length < 4. Add 1-2 anatomically/pharmacologically plausible distractors to reach 4-5 total. If options are reordered or new options inserted before the correct one, update correctAnswer to the new letter (A=first option). Keep original options exactly.
5. Do NOT change chapterTitle, subject, lecture, type, or text unless they are garbled (flag those instead).
6. If a question is completely garbled or you cannot confidently fill a required field, leave the original object as-is but add special fields "__FLAGGED": true and "__FLAG_REASON": "short reason". The downstream system will handle it.
7. Use medical-student level language. Be concise but precise.
8. NEVER output anything outside the JSON array.

Output format: [{ enriched_question_0 }, { enriched_question_1 }, ...]`;
}

function buildUserPrompt(questions: Question[]): string {
  return `Enrich the following ${questions.length} questions. Return ONLY a JSON array of the same length and order.

INPUT:
${JSON.stringify(questions, null, 2)}

OUTPUT (JSON array only):`;
}

async function enrichBatch(batchNum: number) {
  const numStr = String(batchNum).padStart(2, '0');
  const inPath = `data-format-v2/interim/batch-${numStr}.json`;
  const outPath = `data-format-v2/interim/batch-${numStr}-enriched.json`;

  console.log(`\n=== Processing batch ${numStr} ===`);

  const raw = JSON.parse(readFileSync(inPath, 'utf8')) as { moduleCode: string; questions: Question[] };
  const questions = raw.questions;
  console.log(`Loaded ${questions.length} questions`);

  // stats
  let missingExplanation = 0;
  let missingKeyConcept = 0;
  let missingAnswer = 0;
  let missingModelAnswer = 0;
  let shortOptions = 0;
  for (const q of questions) {
    if (!q.explanation || q.explanation === 'N/A') missingExplanation++;
    if (!q.keyConcept || q.keyConcept === 'N/A') missingKeyConcept++;
    if (!q.correctAnswer || q.correctAnswer === 'N/A') missingAnswer++;
    if (q.type === 'essay' && (!q.modelAnswer || q.modelAnswer === 'N/A')) missingModelAnswer++;
    if (q.type === 'mcq' && q.options && q.options.length < 4) shortOptions++;
  }
  console.log(`Missing: explanation=${missingExplanation}, keyConcept=${missingKeyConcept}, answer=${missingAnswer}, modelAnswer=${missingModelAnswer}, shortOptions=${shortOptions}`);

  const chunks: Question[][] = [];
  for (let i = 0; i < questions.length; i += CHUNK_SIZE) {
    chunks.push(questions.slice(i, i + CHUNK_SIZE));
  }
  console.log(`Split into ${chunks.length} chunks of max ${CHUNK_SIZE}`);

  const enrichedChunks: Question[][] = [];
  const flagged: Array<{ batch: string; chunk: number; index: number; reason: string }> = [];
  const systemPrompt = buildSystemPrompt();

  const inFlight = new Set<Promise<void>>();
  for (let i = 0; i < chunks.length; i++) {
    const chunkIdx = i;
    const chunk = chunks[i];
    const promise = (async () => {
      console.log(`  [batch ${numStr}] Chunk ${chunkIdx + 1}/${chunks.length} starting...`);
      try {
        const userPrompt = buildUserPrompt(chunk);
        const response = await callLLM(systemPrompt, userPrompt, 8192);
        const cleaned = cleanJsonResponse(response);

        let parsed: Question[];
        try {
          parsed = JSON.parse(cleaned) as Question[];
        } catch (e: any) {
          console.error(`  [batch ${numStr}] Chunk ${chunkIdx + 1} JSON parse error: ${e.message}`);
          console.error(`  Raw first 500: ${cleaned.slice(0, 500)}`);
          parsed = JSON.parse(JSON.stringify(chunk));
        }

        if (parsed.length !== chunk.length) {
          console.error(`  [batch ${numStr}] Chunk ${chunkIdx + 1} length mismatch: got ${parsed.length}, expected ${chunk.length}. Using originals.`);
          parsed = JSON.parse(JSON.stringify(chunk));
        }

        for (let j = 0; j < parsed.length; j++) {
          if (parsed[j].__FLAGGED) {
            flagged.push({ batch: numStr, chunk: chunkIdx, index: j, reason: parsed[j].__FLAG_REASON || 'Unknown' });
            delete parsed[j].__FLAGGED;
            delete parsed[j].__FLAG_REASON;
          }
        }

        enrichedChunks[chunkIdx] = parsed;
        console.log(`  [batch ${numStr}] Chunk ${chunkIdx + 1}/${chunks.length} done`);
      } catch (e: any) {
        console.error(`  [batch ${numStr}] Chunk ${chunkIdx + 1} failed: ${e.message}`);
        enrichedChunks[chunkIdx] = JSON.parse(JSON.stringify(chunk));
      }
    })();

    inFlight.add(promise);
    promise.then(() => inFlight.delete(promise));

    if (inFlight.size >= CONCURRENCY) {
      await Promise.race(inFlight);
    }
  }

  await Promise.all(inFlight);

  const enrichedQuestions: Question[] = [];
  for (let i = 0; i < chunks.length; i++) {
    enrichedQuestions.push(...(enrichedChunks[i] || chunks[i]));
  }

  const outData = {
    moduleCode: 'MCNS-2',
    questions: enrichedQuestions,
  };
  writeFileSync(outPath, JSON.stringify(outData, null, 2), 'utf8');
  console.log(`Wrote ${enrichedQuestions.length} questions to ${outPath}`);
  console.log(`Flagged ${flagged.length} questions`);

  const flagPath = `data-format-v2/interim/batch-${numStr}-flagged.txt`;
  const flagContent = flagged.map(f => `[batch ${f.batch} chunk ${f.chunk} idx ${f.index}] ${f.reason}`).join('\n');
  writeFileSync(flagPath, flagContent || '(none)', 'utf8');

  return enrichedQuestions.length;
}

async function main() {
  const batchNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let total = 0;
  for (const num of batchNumbers) {
    const count = await enrichBatch(num);
    total += count;
  }
  console.log(`\n=== All batches enriched. Total questions: ${total} ===`);
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
