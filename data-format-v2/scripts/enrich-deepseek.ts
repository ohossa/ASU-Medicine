import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const API_KEY = process.env.OPENROUTER_API_KEY || '';
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-chat';
const CONCURRENCY = 4;
const PER_CALL = 8;
const MAX_TOKENS = 1200;

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
function needsE(q: any) {
  if (!q.explanation || q.explanation === 'N/A') return true;
  if (!q.keyConcept || q.keyConcept === 'N/A') return true;
  if ((q.type === 'mcq' || q.type === 'truefalse') && (!q.correctAnswer || q.correctAnswer === 'N/A')) return true;
  if (q.type === 'essay' && (!q.modelAnswer || q.modelAnswer === 'N/A')) return true;
  return false;
}

async function callLLM(systemPrompt: string, userContent: string): Promise<string> {
  const body = { model: MODEL, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userContent }], max_tokens: MAX_TOKENS, temperature: 0.2 };
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const resp = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}`, 'HTTP-Referer': 'https://kimchi.dev', 'X-Title': 'CNS Enrichment' },
        body: JSON.stringify(body)
      });
      if (!resp.ok) {
        console.error(`  HTTP ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
        await sleep((resp.status === 429 ? 8000 : 3000) * attempt);
        continue;
      }
      const data = await resp.json() as any;
      return data.choices?.[0]?.message?.content || '';
    } catch (e: any) {
      console.error(`  Attempt ${attempt} failed: ${e.message}`);
      await sleep(4000 * attempt);
    }
  }
  throw new Error('All attempts failed');
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
  const batchPath = `data-format-v2/interim/batch-${ns}.json`;
  const outPath = `data-format-v2/interim/batch-${ns}-enriched.json`;
  const resumePath = `data-format-v2/interim/batch-${ns}-resume.json`;
  const flagPath = `data-format-v2/interim/batch-${ns}-flagged.txt`;

  console.log(`\n=== Batch ${ns} ===`);
  const batch = JSON.parse(readFileSync(batchPath, 'utf8'));
  const questions = batch.questions;

  const todoIdxs: number[] = [];
  for (let i = 0; i < questions.length; i++) { if (needsE(questions[i])) todoIdxs.push(i); }
  console.log(`Total ${questions.length}, todo ${todoIdxs.length}`);
  if (todoIdxs.length === 0) { writeFileSync(outPath, JSON.stringify(batch, null, 2)); return; }

  const doneChunks = new Set<number>();
  if (existsSync(resumePath)) { try { const r = JSON.parse(readFileSync(resumePath, 'utf8')); for (const x of r.doneChunks||[]) doneChunks.add(x); } catch {} }

  const chunks: number[][] = [];
  for (let i = 0; i < todoIdxs.length; i += PER_CALL) chunks.push(todoIdxs.slice(i, i + PER_CALL));
  console.log(`${chunks.length} chunks`);

  const sys = `You are a medical education content enrichment engine.\nTASK: For each question in the input JSON array, generate concise, medically accurate enrichment fields: explanation (2-4 sentences), keyConcept (1 sentence). For missing correctAnswer (mcq/truefalse only) fill if >=80% confident. For missing modelAnswer (essay only) fill with 3-6 sentences.\nRULES: Return ONLY a valid JSON array of same length/order. Only modify empty/N/A fields. Do NOT change existing fields. Use medical-student language. No markdown fences. No extra text.`;

  let enrichedCount = 0;
  const flagged: any[] = [];
  const inFlight = new Set<Promise<void>>();

  for (let ci = 0; ci < chunks.length; ci++) {
    if (doneChunks.has(ci)) { enrichedCount += chunks[ci].length; continue; }
    const idxs = chunks[ci];
    const chunk = idxs.map(i => questions[i]);
    const p = (async () => {
      try {
        const text = await callLLM(sys, `Enrich ${chunk.length} questions. Return ONLY JSON array of same length/order.\n\nINPUT:\n${JSON.stringify(chunk, null, 2)}\n\nOUTPUT (JSON only):`);
        const cleaned = clean(text);
        let parsed: any[];
        try { parsed = JSON.parse(cleaned); } catch {
          console.error(`  [${ns}] chunk ${ci+1} parse fail. Raw: ${text.slice(0,300)}`);
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
      } catch (e: any) {
        console.error(`  [${ns}] chunk ${ci+1} fail: ${e.message}`);
      }
    })();
    inFlight.add(p); p.then(() => inFlight.delete(p));
    if (inFlight.size >= CONCURRENCY) await Promise.race(inFlight);
  }
  await Promise.all(inFlight);
  writeFileSync(outPath, JSON.stringify(batch, null, 2));
  writeFileSync(flagPath, flagged.map((f: any) => `[batch ${f.batch} chunk ${f.chunk} idx ${f.index}] ${f.reason}`).join('\n') || '(none)');
  console.log(`Batch ${ns} done. Enriched ${enrichedCount}/${todoIdxs.length}. Flagged ${flagged.length}`);
}

async function main() {
  for (let n = 1; n <= 10; n++) await enrichBatch(n);
  console.log('\nAll 10 batches enriched.');
}
main().catch(e => { console.error(e); process.exit(1); });
