import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const API_KEY = process.env.OPENROUTER_API_KEY || '';
const BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL = 'deepseek/deepseek-chat';
const CONCURRENCY = 8;
const PER_CALL = 5;
const MAX_TOKENS = 2000;
const TIMEOUT_MS = 25000;

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function needsE(q: any) {
  if (!q.explanation || q.explanation === 'N/A') return true;
  if (!q.keyConcept || q.keyConcept === 'N/A') return true;
  if ((q.type === 'mcq' || q.type === 'truefalse') && (!q.correctAnswer || q.correctAnswer === 'N/A')) return true;
  if (q.type === 'essay' && (!q.modelAnswer || q.modelAnswer === 'N/A')) return true;
  return false;
}

async function callLLM(sys: string, usr: string): Promise<string> {
  const ctrl = new AbortController();
  const tmr = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://kimchi.dev',
        'X-Title': 'CNS Enrichment'
      },
      body: JSON.stringify({ model: MODEL, messages: [{ role: 'system', content: sys }, { role: 'user', content: usr }], max_tokens: MAX_TOKENS, temperature: 0.2 })
    });
    clearTimeout(tmr);
    if (!resp.ok) {
      const txt = await resp.text();
      console.error(`  HTTP ${resp.status}: ${txt.slice(0, 200)}`);
      throw new Error(`HTTP ${resp.status}`);
    }
    const data = await resp.json() as any;
    return data.choices?.[0]?.message?.content || '';
  } catch (e: any) {
    clearTimeout(tmr);
    if (e.name === 'AbortError') throw new Error('Timeout');
    throw e;
  }
}

function clean(raw: string): string {
  let t = raw.trim();
  if (t.startsWith('```json')) t = t.slice(7);
  else if (t.startsWith('```')) t = t.slice(3);
  if (t.endsWith('```')) t = t.slice(0, -3);
  return t.trim();
}

async function enrichBatch(n: number) {
  const ns = String(n).padStart(2, '0');
  const inPath = `data-format-v2/interim/batch-${ns}.json`;
  const outPath = `data-format-v2/interim/batch-${ns}-enriched.json`;
  const resumePath = `data-format-v2/interim/batch-${ns}-resume.json`;
  const flagPath = `data-format-v2/interim/batch-${ns}-flagged.txt`;

  console.log(`=== Batch ${ns} ===`);
  const batch = JSON.parse(readFileSync(inPath, 'utf8'));
  const questions = batch.questions;

  const todoIdxs: number[] = [];
  for (let i = 0; i < questions.length; i++) if (needsE(questions[i])) todoIdxs.push(i);
  console.log(`Total ${questions.length}, todo ${todoIdxs.length}`);
  if (todoIdxs.length === 0) { writeFileSync(outPath, JSON.stringify(batch, null, 2)); return; }

  const doneChunks = new Set<number>();
  if (existsSync(resumePath)) { try { const r = JSON.parse(readFileSync(resumePath, 'utf8')); for (const x of r.doneChunks||[]) doneChunks.add(x); } catch {} }

  const chunks: number[][] = [];
  for (let i = 0; i < todoIdxs.length; i += PER_CALL) chunks.push(todoIdxs.slice(i, i + PER_CALL));
  console.log(`${chunks.length} chunks`);

  const sys = `You are a medical education content enrichment engine.
TASK: For each question in the input JSON array, generate these fields if they are missing:
- explanation: 2-4 medically accurate sentences explaining WHY the correct answer is correct.
- keyConcept: One high-yield flashcard takeaway (max 1 sentence).
- correctAnswer: Only if empty string or "N/A" and type is mcq/truefalse. Fill if ≥80% confident; otherwise leave empty.
- modelAnswer: Only if empty string and type is essay. Generate 3-6 sentences.
RULES: Return ONLY a valid JSON array of the exact same length and order. Only modify empty/N/A fields. Preserve all existing data exactly. Do NOT change chapterTitle, subject, lecture, type, text. Use medical-student language. No markdown fences. No extra text.`;

  let enrichedCount = 0;
  const flagged: any[] = [];
  const inFlight = new Set<Promise<void>>();

  for (let ci = 0; ci < chunks.length; ci++) {
    if (doneChunks.has(ci)) { enrichedCount += chunks[ci].length; continue; }
    const idxs = chunks[ci];
    const chunk = idxs.map(i => questions[i]);
    const p = (async () => {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const text = await callLLM(sys, `Enrich ${chunk.length} questions. Return ONLY JSON array of same length/order.\n\nINPUT:\n${JSON.stringify(chunk, null, 2)}\n\nOUTPUT (JSON only):`);
          const cleaned = clean(text);
          let parsed: any[];
          try { parsed = JSON.parse(cleaned); } catch {
            console.warn(`  [${ns}] chunk ${ci+1} parse fail on attempt ${attempt}. Retrying...`);
            if (attempt < 3) continue;
            console.error(`  [${ns}] chunk ${ci+1} parse fail after 3 attempts`);
            parsed = JSON.parse(JSON.stringify(chunk));
          }
          if (parsed.length !== chunk.length) {
            console.error(`  [${ns}] chunk ${ci+1} length mismatch ${parsed.length} vs ${chunk.length}`);
            parsed = JSON.parse(JSON.stringify(chunk));
          }
          for (let j = 0; j < parsed.length; j++) {
            const q = questions[idxs[j]];
            const e = parsed[j];
            if (e.__FLAGGED) { flagged.push({ batch: ns, chunk: ci, index: idxs[j], reason: e.__FLAG_REASON }); delete e.__FLAGGED; delete e.__FLAG_REASON; }
            if ((!q.explanation || q.explanation === 'N/A') && e.explanation) q.explanation = e.explanation;
            if ((!q.keyConcept || q.keyConcept === 'N/A') && e.keyConcept) q.keyConcept = e.keyConcept;
            if ((!q.correctAnswer || q.correctAnswer === 'N/A') && e.correctAnswer) q.correctAnswer = e.correctAnswer;
            if ((!q.modelAnswer || q.modelAnswer === 'N/A') && e.modelAnswer) q.modelAnswer = e.modelAnswer;
          }
          enrichedCount += idxs.length;
          doneChunks.add(ci);
          writeFileSync(resumePath, JSON.stringify({ doneChunks: [...doneChunks] }));
          writeFileSync(outPath, JSON.stringify(batch, null, 2));
          console.log(`  [${ns}] chunk ${ci+1}/${chunks.length} ok (${enrichedCount}/${todoIdxs.length})`);
          return;
        } catch (e: any) {
          console.error(`  [${ns}] chunk ${ci+1} attempt ${attempt} fail: ${e.message}`);
          if (attempt < 3) await sleep(2000 * attempt);
        }
      }
    })();
    inFlight.add(p); p.then(() => inFlight.delete(p));
    if (inFlight.size >= CONCURRENCY) await Promise.race(inFlight);
  }
  await Promise.all(inFlight);
  writeFileSync(outPath, JSON.stringify(batch, null, 2));
  writeFileSync(flagPath, flagged.map((f: any) => `[${f.batch} ${f.chunk} ${f.index}] ${f.reason}`).join('\n') || '(none)');
  console.log(`Batch ${ns} done. Enriched ${enrichedCount}/${todoIdxs.length}. Flagged ${flagged.length}`);
}

async function main() {
  for (let n = 1; n <= 10; n++) await enrichBatch(n);
  console.log('\nAll 10 batches enriched.');
}
main().catch(e => { console.error(e); process.exit(1); });
