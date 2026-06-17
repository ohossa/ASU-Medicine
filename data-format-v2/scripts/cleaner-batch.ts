#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════
 * MEDARK OCR Cleaner Batch Processor — Chunked LLM Pipeline
 * ═══════════════════════════════════════════════════════════════
 *
 * Splits `main CNS questions.txt` into ~80-question chunks, feeds each
 * chunk to GPT-4o (via OpenRouter) with the OCR_CLEANER_PROMPT.md
 * system prompt, and saves cleaned blocks to `_cleaned/chunk_NNN.txt`.
 *
 * Usage:
 *   npx tsx data-format-v2/scripts/cleaner-batch.ts --pilot
 *   npx tsx data-format-v2/scripts/cleaner-batch.ts --all
 *   npx tsx data-format-v2/scripts/cleaner-batch.ts --start 10 --limit 5
 *   npx tsx data-format-v2/scripts/cleaner-batch.ts --all --force
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

/* ──────────────── Constants & Paths ──────────────── */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");

const RAW_PATH = path.join(
  REPO_ROOT,
  "data-format-v2",
  "question-intake",
  "year-2",
  "semester-2",
  "MCNS-2 [Central Nervous System]",
  "_raw",
  "main CNS questions.txt"
);

const CLEANED_DIR = path.join(
  REPO_ROOT,
  "data-format-v2",
  "question-intake",
  "year-2",
  "semester-2",
  "MCNS-2 [Central Nervous System]",
  "_cleaned"
);

const PROMPT_PATH = path.join(REPO_ROOT, "OCR_CLEANER_PROMPT.md");
const PROGRESS_PATH = path.join(CLEANED_DIR, "progress.json");

const MAX_CONCURRENCY = 1;
const MAX_CHUNK_QUESTIONS = 90;
const RETRIES = 3;
const RETRY_DELAYS = [2000, 5000, 10000]; // ms
const LLM_TIMEOUT_MS = 900_000;
const MAX_TOKENS = 16_384;

const QUESTION_START_RE =
  /^\*\*\d+[\d\-\.]+\.\*\*|^\*\*\d+\.\*\*|^\*\*\d+\-[\d]+\.\*\*|^\d+[\.,;:]\s/i;
const SECTION_HEADER_RE = /^Part\s+\d+\s*$|^##\s+Head\s+and\s+Neck\s+Questions/i;

/* ──────────────── Types ──────────────── */

interface ChunkPlan {
  index: number;
  section: string;
  startLine: number;
  endLine: number;
  content: string;
  questionCount: number;
  outputFile: string;
}

interface ProgressJson {
  totalChunks: number;
  processedChunks: number;
  failedChunks: number;
  lastProcessedAt: string;
  estimatedQuestions: number;
  chunks: Array<{
    index: number;
    section: string;
    questionCount: number;
    outputFile: string;
    status: "done" | "failed" | "skipped";
  }>;
}

/* ──────────────── CLI Args ──────────────── */

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    all: args.includes("--all"),
    pilot: args.includes("--pilot"),
    force: args.includes("--force"),
    start: parseInt(getArg(args, "--start") ?? "0", 10),
    limit: parseInt(getArg(args, "--limit") ?? "0", 10),
  };
}

function getArg(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return undefined;
  return args[idx + 1];
}

/* ──────────────── File I/O ──────────────── */

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadPrompt(): string {
  if (!fs.existsSync(PROMPT_PATH)) {
    console.error(`❌ Prompt file not found: ${PROMPT_PATH}`);
    process.exit(1);
  }
  return fs.readFileSync(PROMPT_PATH, "utf-8");
}

function loadEnvLocal(): Record<string, string> {
  const envPath = path.join(REPO_ROOT, ".env.local");
  const out: Record<string, string> = {};
  if (!fs.existsSync(envPath)) return out;
  for (const line of fs.readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const m = line.match(
      /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/
    );
    if (!m || line.trim().startsWith("#")) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

/* ──────────────── Chunking ──────────────── */

function buildChunks(rawText: string): ChunkPlan[] {
  const lines = rawText.split("\n");
  const chunks: ChunkPlan[] = [];
  let chunkIndex = 1;

  let currentSection = "Unknown";
  let sectionStartLine = 0;
  let questionCount = 0;
  let chunkStartLine = 0;
  let chunkLines: string[] = [];
  let chunkQuestions = 0;

  function flushChunk(endLine: number) {
    if (chunkLines.length === 0) return;
    const content = chunkLines.join("\n");
    // Detect actual section from first few lines if Possible
    const sectionMatch = content.match(SECTION_HEADER_RE);
    const effectiveSection = sectionMatch
      ? sectionMatch[0].trim()
      : currentSection;

    chunks.push({
      index: chunkIndex++,
      section: effectiveSection,
      startLine: chunkStartLine,
      endLine,
      content,
      questionCount: chunkQuestions,
      outputFile: path.join(CLEANED_DIR, `chunk_${String(chunkIndex - 1).padStart(3, "0")}.txt`),
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect section header
    const sectionMatch = line.match(SECTION_HEADER_RE);
    if (sectionMatch) {
      // Flush previous chunk if any
      if (chunkLines.length > 0) {
        flushChunk(i - 1);
        chunkLines = [];
        chunkQuestions = 0;
      }
      currentSection = sectionMatch[0].trim();
      sectionStartLine = i;
      chunkStartLine = i;
    }

    // Detect question boundary
    const isQuestion = QUESTION_START_RE.test(line.trim());
    if (isQuestion) {
      questionCount++;
      chunkQuestions++;
    }

    // Start a new chunk if we've hit max questions and this line is a question boundary
    if (
      chunkQuestions >= MAX_CHUNK_QUESTIONS &&
      isQuestion &&
      chunkLines.length > 0
    ) {
      flushChunk(i - 1);
      // Add trailing context (last 5 lines) as overlap
      const overlap = chunkLines.slice(-5);
      chunkLines = [...overlap];
      chunkStartLine = Math.max(0, i - overlap.length);
      chunkQuestions = overlap.filter((l) => QUESTION_START_RE.test(l.trim())).length;
    }

    chunkLines.push(line);
  }

  // Flush final chunk
  if (chunkLines.length > 0) {
    flushChunk(lines.length - 1);
  }

  return chunks.filter(c => c.questionCount > 0);
}

/* ──────────────── LLM Client ──────────────── */

async function callLLM(
  systemPrompt: string,
  chunkText: string
): Promise<string> {
  const env = { ...loadEnvLocal(), ...process.env };

  // 0. Try Gemini first (fast, high quality)
  if (env.GEMINI_API_KEY) {
    console.log("→ Using Gemini (gemini-2.5-flash)…");
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Process this chunk of raw OCR text. Return ONLY cleaned question blocks following the exact format specified in your instructions. No markdown code fences. No extra commentary. Start directly with the first \`---\` line.\n\n${chunkText}`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.1,
        maxOutputTokens: 8192,
      },
    });
    const text = res.text ?? "";
    if (!text.trim()) throw new Error("Gemini returned an empty response.");
    return stripMarkdownFences(text);
  }

  // 1. Try OpenRouter / Mimimax first
  const key = env.OPENAI_API_KEY ?? env.MIMIMAX_API_KEY;
  if (key) {
    const isOpenRouter = key.startsWith("sk-or-v1-");
    const isMimimax = !isOpenRouter;
    console.log(
      `→ Using ${isMimimax ? "MiMo" : isOpenRouter ? "OpenRouter" : "OpenAI"}…`
    );
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({
      apiKey: key,
      baseURL: isMimimax
        ? "https://api.xiaomimimo.com/v1"
        : isOpenRouter
        ? "https://openrouter.ai/api/v1"
        : undefined,
      timeout: LLM_TIMEOUT_MS,
      defaultHeaders: isMimimax ? { "api-key": key } : undefined,
    });
    const res = await client.chat.completions.create({
      model: isMimimax
        ? "mimo-v2.5-pro"
        : isOpenRouter
        ? "meta-llama/llama-3.3-70b-instruct"
        : "gpt-4o",
      temperature: 0.1,
      max_tokens: MAX_TOKENS,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content:
            `Process this chunk of raw OCR text. Return ONLY cleaned question blocks following the exact format specified in your instructions. No markdown code fences. No extra commentary. Start directly with the first \`---\` line.\n\n` +
            chunkText,
        },
      ],
    });
    const content = res.choices[0]?.message?.content ?? "";
    if (!content.trim()) throw new Error("LLM returned an empty response.");
    return stripMarkdownFences(content);
  }

  // 2. Fallback to Groq
  if (env.GROQ_API_KEY) {
    console.log("→ Using Groq (llama-4-scout)…");
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({
      apiKey: env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
      timeout: LLM_TIMEOUT_MS,
    });
    const res = await client.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.1,
      max_tokens: 8192,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content:
            `Process this chunk of raw OCR text. Return ONLY cleaned question blocks following the exact format specified in your instructions. No markdown code fences. No extra commentary. Start directly with the first \`---\` line.\n\n` +
            chunkText,
        },
      ],
    });
    const content = res.choices[0]?.message?.content ?? "";
    if (!content.trim()) throw new Error("Groq returned an empty response.");
    return stripMarkdownFences(content);
  }

  // 2. Fallback to DeepSeek
  if (env.DEEPSEEK_API_KEY) {
    console.log("→ Using DeepSeek (deepseek-chat)…");
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({
      apiKey: env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
      timeout: LLM_TIMEOUT_MS,
    });
    const res = await client.chat.completions.create({
      model: "deepseek-chat",
      temperature: 0.1,
      max_tokens: 12000,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content:
            `Process this chunk of raw OCR text. Return ONLY cleaned question blocks following the exact format specified in your instructions. No markdown code fences. No extra commentary. Start directly with the first \`---\` line.\n\n` +
            chunkText,
        },
      ],
    });
    const content = res.choices[0]?.message?.content ?? "";
    if (!content.trim()) throw new Error("DeepSeek returned an empty response.");
    return stripMarkdownFences(content);
  }

  // 2. Try Kimchi endpoint
  if (env.KIMCHI_API_KEY && env.KIMCHI_BASE_URL) {
    console.log("→ Using Kimchi (kimi-k2.6)…");
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({
      apiKey: env.KIMCHI_API_KEY,
      baseURL: env.KIMCHI_BASE_URL,
      timeout: LLM_TIMEOUT_MS,
    });
    const res = await client.chat.completions.create({
      model: "kimi-k2.6",
      temperature: 0.1,
      max_tokens: 12000,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content:
            `Process this chunk of raw OCR text. Return ONLY cleaned question blocks following the exact format specified in your instructions. No markdown code fences. No extra commentary. Start directly with the first \`---\` line.\n\n` +
            chunkText,
        },
      ],
    });
    const content = res.choices[0]?.message?.content ?? "";
    if (!content.trim()) throw new Error("Kimchi returned an empty response.");
    return stripMarkdownFences(content);
  }

  // 3. Try DeepSeek
  if (env.DEEPSEEK_API_KEY) {
    console.log("→ Using DeepSeek (deepseek-chat)…");
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({
      apiKey: env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
      timeout: LLM_TIMEOUT_MS,
    });
    const res = await client.chat.completions.create({
      model: "deepseek-chat",
      temperature: 0.1,
      max_tokens: 12000,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content:
            `Process this chunk of raw OCR text. Return ONLY cleaned question blocks following the exact format specified in your instructions. No markdown code fences. No extra commentary. Start directly with the first \`---\` line.\n\n` +
            chunkText,
        },
      ],
    });
    const content = res.choices[0]?.message?.content ?? "";
    if (!content.trim()) throw new Error("DeepSeek returned an empty response.");
    return stripMarkdownFences(content);
  }

  console.error("❌ No LLM API key found. Set GEMINI_API_KEY, OPENAI_API_KEY, or MIMIMAX_API_KEY in .env.local");
  process.exit(1);
}

function stripMarkdownFences(text: string): string {
  let cleaned = text
    .replace(/^```(?:markdown)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  // Strip any model preamble before the first --- block
  const match = cleaned.match(/^---/m);
  if (match && match.index !== undefined && match.index > 0) {
    cleaned = cleaned.slice(match.index);
  }
  return cleaned;
}

async function callLLMWithRetry(
  systemPrompt: string,
  chunk: ChunkPlan
): Promise<{ success: true; text: string } | { success: false; error: string }> {
  let lastErr = "";

  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const text = await callLLM(systemPrompt, chunk.content);
      return { success: true, text };
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
      const delay = RETRY_DELAYS[attempt] ?? 15000;
      console.warn(
        `  ⚠ Chunk ${chunk.index} attempt ${attempt + 1}/${RETRIES + 1} failed: ${lastErr}`
      );
      if (attempt < RETRIES) {
        console.warn(`  ⏳ Retrying in ${delay}ms…`);
        await sleep(delay);
      }
    }
  }

  return { success: false, error: lastErr };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/* ──────────────── Concurrency Semaphore ──────────────── */

function createSemaphore(limit: number) {
  let running = 0;
  const queue: Array<() => void> = [];

  async function acquire(): Promise<() => void> {
    if (running < limit) {
      running++;
      return () => {
        running--;
        if (queue.length > 0) queue.shift()?.();
      };
    }
    return new Promise((resolve) => queue.push(() => {
      running++;
      resolve(() => {
        running--;
        if (queue.length > 0) queue.shift()?.();
      });
    }));
  }

  return acquire;
}

/* ──────────────── Main ──────────────── */

async function main() {
  const args = parseArgs();

  if (!args.all && !args.pilot && args.limit === 0) {
    console.log(`
Usage:
  npx tsx cleaner-batch.ts --pilot          Process first 3 chunks only
  npx tsx cleaner-batch.ts --all            Process all unprocessed chunks
  npx tsx cleaner-batch.ts --start N        Start from chunk index N (1-based)
  npx tsx cleaner-batch.ts --limit M        Process at most M chunks
  npx tsx cleaner-batch.ts --all --force    Re-process every chunk
`);
    process.exit(0);
  }

  ensureDir(CLEANED_DIR);

  if (!fs.existsSync(RAW_PATH)) {
    console.error(`❌ Raw file not found: ${RAW_PATH}`);
    process.exit(1);
  }

  const systemPrompt = loadPrompt();
  const rawText = fs.readFileSync(RAW_PATH, "utf-8");

  console.log(`📄 Raw file: ${RAW_PATH}`);
  console.log(`   Size: ${rawText.length.toLocaleString()} chars, ${rawText.split("\n").length.toLocaleString()} lines\n`);

  // Build chunk plan
  const allChunks = buildChunks(rawText);
  console.log(`🔪 Split into ${allChunks.length} chunks\n`);

  // Filter chunks based on CLI args
  let targetChunks = allChunks;

  if (args.pilot) {
    targetChunks = allChunks.slice(0, 3);
    console.log(`🧪 PILOT MODE — processing first ${targetChunks.length} chunks\n`);
  }

  if (args.start > 0) {
    targetChunks = targetChunks.filter((c) => c.index >= args.start);
  }

  if (args.limit > 0) {
    targetChunks = targetChunks.slice(0, args.limit);
  }

  // Skip already-processed chunks unless --force
  if (!args.force) {
    const beforeCount = targetChunks.length;
    targetChunks = targetChunks.filter((c) => {
      if (fs.existsSync(c.outputFile)) {
        const stat = fs.statSync(c.outputFile);
        if (stat.size > 100) return false; // Already done
      }
      return true;
    });
    const skipped = beforeCount - targetChunks.length;
    if (skipped > 0) {
      console.log(`⏭  Skipping ${skipped} already-processed chunk(s)\n`);
    }
  }

  if (targetChunks.length === 0) {
    console.log("✅ Nothing to process. Use --force to re-process.\n");
    process.exit(0);
  }

  const totalToProcess = targetChunks.length;
  const results: ProgressJson["chunks"] = loadExistingProgress();
  const acquire = createSemaphore(MAX_CONCURRENCY);
  let done = 0;
  let failed = 0;

  console.log(`🚀 Processing ${totalToProcess} chunk(s) with concurrency ${MAX_CONCURRENCY}\n`);

  const tasks = targetChunks.map((chunk) =>
    (async () => {
      const release = await acquire();
      try {
        console.log(
          `[${++done}/${totalToProcess}] Chunk ${String(chunk.index).padStart(3, "0")} — ${chunk.section} (${chunk.questionCount} questions)`
        );

        const res = await callLLMWithRetry(systemPrompt, chunk);

        if (res.success) {
          fs.writeFileSync(chunk.outputFile, res.text, "utf-8");
          results.push({
            index: chunk.index,
            section: chunk.section,
            questionCount: chunk.questionCount,
            outputFile: path.relative(REPO_ROOT, chunk.outputFile),
            status: "done",
          });
          console.log(`   ✅ Saved → ${path.relative(REPO_ROOT, chunk.outputFile)}`);
        } else {
          failed++;
          const failPath = chunk.outputFile.replace(".txt", "_FAILED.txt");
          fs.writeFileSync(
            failPath,
            `CHUNK ${chunk.index} FAILED AFTER ${RETRIES + 1} ATTEMPTS\nERROR: ${res.error}\n\n--- RAW TEXT ---\n${chunk.content}`,
            "utf-8"
          );
          results.push({
            index: chunk.index,
            section: chunk.section,
            questionCount: chunk.questionCount,
            outputFile: path.relative(REPO_ROOT, failPath),
            status: "failed",
          });
          console.log(`   ❌ FAILED → ${path.relative(REPO_ROOT, failPath)}`);
        }
      } finally {
        release();
      }
    })()
  );

  await Promise.all(tasks);

  // Save progress
  const progress: ProgressJson = {
    totalChunks: allChunks.length,
    processedChunks: results.filter((r) => r.status === "done").length,
    failedChunks: results.filter((r) => r.status === "failed").length,
    lastProcessedAt: new Date().toISOString(),
    estimatedQuestions: allChunks.reduce((s, c) => s + c.questionCount, 0),
    chunks: results,
  };
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2), "utf-8");

  console.log(`\n═══════════════════════════════════════════════════════════════`);
  console.log(`  Done: ${progress.processedChunks} / ${progress.totalChunks} chunks`);
  console.log(`  Failed: ${progress.failedChunks}`);
  console.log(`  Estimated questions in raw file: ${progress.estimatedQuestions}`);
  console.log(`  Output directory: ${path.relative(REPO_ROOT, CLEANED_DIR)}`);
  console.log(`═══════════════════════════════════════════════════════════════\n`);

  if (progress.failedChunks > 0) {
    console.warn(`⚠️  ${progress.failedChunks} chunk(s) failed. Review _FAILED.txt files.\n`);
    process.exit(2);
  }
}

function loadExistingProgress(): ProgressJson["chunks"] {
  if (!fs.existsSync(PROGRESS_PATH)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(PROGRESS_PATH, "utf-8")) as ProgressJson;
    return data.chunks ?? [];
  } catch {
    return [];
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
