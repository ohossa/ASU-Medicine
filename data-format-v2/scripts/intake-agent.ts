// Medark Syllabus-Aware PDF/Doc Question Intake Agent
//
// Usage:
//   npx tsx data-format-v2/scripts/intake-agent.ts <document-path> <module-code>
//   npx tsx data-format-v2/scripts/intake-agent.ts exam_paper.pdf MCNS-2

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* ============================== Constants ================================ */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const IMPORTS_DIR = path.join(REPO_ROOT, "src", "imports");
const INTAKE_DIR = path.join(REPO_ROOT, "data-format-v2", "question-intake");

const VALID_SUBJECTS = [
  "Anatomy", "Histology", "Physiology", "Biochem",
  "Microbiology", "Pathology", "Pharma", "Clinical",
] as const;

const VALID_TYPES = ["mcq", "truefalse", "matching", "essay", "case", "fillblank"] as const;

// Safety cap so a 300-page PDF doesn't blow the context window.
const MAX_INPUT_CHARS = 180_000;

/* ================================ Types ================================== */

interface CanonicalChapter {
  id: number;
  title: string;
  subtitle?: string;
}

interface CanonicalModule {
  moduleCode?: string;
  chapters: CanonicalChapter[];
  [key: string]: unknown;
}

interface IntakeQuestion {
  chapterId?: number;
  needsReview?: boolean;
  reviewReason?: string;
  subject: (typeof VALID_SUBJECTS)[number];
  type: (typeof VALID_TYPES)[number];
  text: string;
  options?: string[];
  correctAnswer?: string;
  correctIndex?: number;
  explanation?: string;
  modelAnswer?: string;
}

interface IntakeBatch {
  moduleCode: string;
  questions: IntakeQuestion[];
}

/* ============================ Small utilities ============================ */

function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

/** Minimal .env.local parser — avoids a dotenv dependency. */
function loadEnvLocal(): Record<string, string> {
  const envPath = path.join(REPO_ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const out: Record<string, string> = {};
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith("#")) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

/** Recursively walk a directory, yielding absolute file/dir paths. */
function* walk(dir: string): Generator<{ full: string; isDir: boolean }> {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    yield { full, isDir: entry.isDirectory() };
    if (entry.isDirectory()) yield* walk(full);
  }
}

/* ========================= 1. Document extraction ======================== */

async function extractText(docPath: string): Promise<string> {
  if (!fs.existsSync(docPath)) fail(`Document not found: ${docPath}`);
  const ext = path.extname(docPath).toLowerCase();

  try {
    if (ext === ".pdf") {
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(fs.readFileSync(docPath));
      return data.text;
    }
    if (ext === ".docx") {
      const mammoth = await import("mammoth");
      const { value } = await mammoth.extractRawText({ path: docPath });
      return value;
    }
  } catch (err) {
    fail(`Failed to extract text from ${path.basename(docPath)}: ${(err as Error).message}`);
  }
  fail(`Unsupported format "${ext}". Supported formats: .pdf, .docx`);
}

/* ===================== 2. Canonical syllabus loading ===================== */

interface SyllabusLocation {
  filePath: string;
  year: string;     // e.g. "year-2"
  semester: string; // e.g. "semester-1"
  module: CanonicalModule;
}

function loadCanonicalSyllabus(moduleCode: string): SyllabusLocation {
  const target = `${moduleCode}.json`.toLowerCase();

  for (const { full, isDir } of walk(IMPORTS_DIR)) {
    if (isDir || path.basename(full).toLowerCase() !== target) continue;

    const rel = path.relative(IMPORTS_DIR, full).split(path.sep);
    const year = rel.find((p) => /^year-\d+$/i.test(p));
    const semester = rel.find((p) => /^semester-\d+$/i.test(p));
    if (!year || !semester) continue;

    let module: CanonicalModule;
    try {
      module = JSON.parse(fs.readFileSync(full, "utf8"));
    } catch (err) {
      fail(`Canonical file ${full} is not valid JSON: ${(err as Error).message}`);
    }
    if (!Array.isArray(module.chapters) || module.chapters.length === 0) {
      fail(`Canonical file ${full} has no "chapters" array.`);
    }
    return { filePath: full, year, semester, module };
  }

  fail(
    `Could not locate canonical syllabus "${target}" under ${IMPORTS_DIR}.\n` +
    `  Expected layout: src/imports/year-{N}/semester-{N}/${moduleCode}.json`
  );
}

/* ============================ 3. LLM structuring ========================= */

function buildSystemPrompt(moduleCode: string, chapters: CanonicalChapter[]): string {
  const chapterList = chapters
    .map((c) => `  - id ${c.id}: ${c.title}${c.subtitle ? ` — ${c.subtitle}` : ""}`)
    .join("\n");

  return `You are a medical education content structuring engine for the MEDARK v2 platform.

You will receive raw text extracted from an exam paper or question document.
Convert every distinct question into the MEDARK v2 incoming batch JSON schema.

OUTPUT: Respond with ONLY a single valid JSON object. No markdown fences, no commentary.

Schema:
{
  "moduleCode": "${moduleCode}",
  "questions": [
    {
      "chapterId": <number>,            // MUST be one of the canonical chapter IDs below
      "subject": "<string>",            // One of: ${VALID_SUBJECTS.join(", ")}
      "type": "<string>",               // One of: ${VALID_TYPES.join(", ")}
      "text": "<full question stem>",
      "options": ["...", "..."],        // mcq / truefalse only
      "correctAnswer": "<option text>", // or "correctIndex": <number>
      "explanation": "<brief rationale, write one if missing>",
      "modelAnswer": "<for essay/case questions>"
    }
  ]
}

Canonical chapters for module ${moduleCode} (the ONLY valid chapterId values):
${chapterList}

Rules:
1. Map each question to the single most appropriate chapterId from the list above.
2. NEVER invent a chapterId. If a question does not fit any chapter, OMIT the
   "chapterId" field entirely and add "needsReview": true with a short "reviewReason".
3. Preserve original wording; fix only obvious OCR artifacts (broken hyphenation, stray line breaks).
4. For true/false questions use options ["True", "False"].
5. Skip non-question content (instructions, headers, page numbers, mark schemes without stems).`;
}

async function callLLM(env: Record<string, string>, systemPrompt: string, rawText: string): Promise<string> {
  const userPrompt = `Raw extracted document text:\n\n"""\n${rawText}\n"""`;

  if (env.GEMINI_API_KEY) {
    console.log("→ Using Gemini (gemini-2.5-pro)…");
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    const res = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });
    if (!res.text) fail("Gemini returned an empty response.");
    return res.text;
  }

  if (env.OPENAI_API_KEY) {
    const isOpenRouter = env.OPENAI_API_KEY.startsWith("sk-or-v1-");
    console.log(`→ Using ${isOpenRouter ? "OpenRouter" : "OpenAI"} (${isOpenRouter ? "openai/gpt-4o" : "gpt-4o"})…`);
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      baseURL: isOpenRouter ? "https://openrouter.ai/api/v1" : undefined
    });
    const res = await client.chat.completions.create({
      model: isOpenRouter ? "openai/gpt-4o" : "gpt-4o",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    const content = res.choices[0]?.message?.content;
    if (!content) fail("LLM returned an empty response.");
    return content;
  }

  fail("No LLM API key found. Add GEMINI_API_KEY or OPENAI_API_KEY to .env.local");
}

/* ====================== 4. Validation & normalization ==================== */

function validateBatch(raw: string, moduleCode: string, chapters: CanonicalChapter[]): IntakeBatch {
  let parsed: IntakeBatch;
  try {
    // Strip accidental markdown fences defensively.
    parsed = JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g, ""));
  } catch (err) {
    fail(`LLM response was not valid JSON: ${(err as Error).message}`);
  }

  if (!Array.isArray(parsed.questions)) fail(`LLM response missing "questions" array.`);

  const validIds = new Set(chapters.map((c) => c.id));
  let flagged = 0;

  const questions = parsed.questions.map((q, i) => {
    const out: IntakeQuestion = { ...q };

    // Chapter mapping: strip any invented IDs and flag for review.
    if (out.chapterId !== undefined && !validIds.has(out.chapterId)) {
      console.warn(`  ⚠ Q${i + 1}: invented chapterId ${out.chapterId} stripped → flagged for review`);
      delete out.chapterId;
      out.needsReview = true;
      out.reviewReason = out.reviewReason ?? "Model returned a non-canonical chapterId";
    }
    if (out.chapterId === undefined) {
      out.needsReview = true;
      flagged++;
    }

    // Enum validation.
    if (!VALID_SUBJECTS.includes(out.subject)) {
      console.warn(`  ⚠ Q${i + 1}: invalid subject "${out.subject}" → defaulted to "Clinical", flagged`);
      out.subject = "Clinical";
      out.needsReview = true;
      out.reviewReason = out.reviewReason ?? "Invalid subject value";
    }
    if (!VALID_TYPES.includes(out.type)) {
      console.warn(`  ⚠ Q${i + 1}: invalid type "${out.type}" → defaulted to "mcq", flagged`);
      out.type = "mcq";
      out.needsReview = true;
      out.reviewReason = out.reviewReason ?? "Invalid question type";
    }
    if (!out.text?.trim()) {
      console.warn(`  ⚠ Q${i + 1}: empty question text → flagged`);
      out.needsReview = true;
      out.reviewReason = out.reviewReason ?? "Empty question text";
    }
    return out;
  });

  if (flagged > 0) console.warn(`  ⚠ ${flagged} question(s) flagged for manual review (no chapter mapping).`);

  return { moduleCode, questions };
}

/* ============================ 5. Output saving =========================== */

function resolveReadyDir(year: string, semester: string, moduleCode: string): string {
  const semesterDir = path.join(INTAKE_DIR, year, semester);

  // Match an existing "{moduleCode}*" module directory if one exists.
  if (fs.existsSync(semesterDir)) {
    const match = fs
      .readdirSync(semesterDir, { withFileTypes: true })
      .find((e) => e.isDirectory() && e.name.toLowerCase().startsWith(moduleCode.toLowerCase()));
    if (match) return path.join(semesterDir, match.name, "_ready");
  }

  // Otherwise create the canonical location.
  return path.join(semesterDir, moduleCode, "_ready");
}

function saveBatch(batch: IntakeBatch, year: string, semester: string, moduleCode: string): string {
  const readyDir = resolveReadyDir(year, semester, moduleCode);
  fs.mkdirSync(readyDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").replace("T", "_").slice(0, 19);
  const outPath = path.join(readyDir, `${moduleCode}_batch_intake_${timestamp}.json`);
  fs.writeFileSync(outPath, JSON.stringify(batch, null, 2), "utf8");
  return outPath;
}

/* ================================= Main ================================== */

async function main(): Promise<void> {
  const [docPath, moduleCode] = process.argv.slice(2);
  if (!docPath || !moduleCode) {
    fail("Usage: npx tsx data-format-v2/scripts/intake-agent.ts <document-path> <module-code>");
  }

  console.log(`\n📄 Medark Intake Agent — ${path.basename(docPath)} → ${moduleCode}\n`);

  // 1. Extract document text.
  let rawText = await extractText(docPath);
  rawText = rawText.trim();
  if (!rawText) fail("Extraction produced no text. Is the document a scanned image? (OCR not supported)");
  if (rawText.length > MAX_INPUT_CHARS) {
    console.warn(`  ⚠ Document is large (${rawText.length} chars); truncating to ${MAX_INPUT_CHARS}.`);
    rawText = rawText.slice(0, MAX_INPUT_CHARS);
  }
  console.log(`→ Extracted ${rawText.length.toLocaleString()} characters.`);

  // 2. Load canonical syllabus.
  const { filePath, year, semester, module } = loadCanonicalSyllabus(moduleCode);
  console.log(`→ Canonical syllabus: ${path.relative(REPO_ROOT, filePath)} (${module.chapters.length} chapters)`);

  // 3. LLM structuring.
  const env = { ...loadEnvLocal(), ...process.env } as Record<string, string>;
  const systemPrompt = buildSystemPrompt(moduleCode, module.chapters);
  const llmResponse = await callLLM(env, systemPrompt, rawText);

  // 4. Validate and normalize.
  const batch = validateBatch(llmResponse, moduleCode, module.chapters);

  // 5. Save.
  const outPath = saveBatch(batch, year, semester, moduleCode);

  const reviewCount = batch.questions.filter((q) => q.needsReview).length;
  console.log(
    `\n✔ Done: ${batch.questions.length} question(s) parsed` +
    (reviewCount ? ` (${reviewCount} flagged for review)` : "") +
    `\n  Saved to: ${path.relative(REPO_ROOT, outPath)}\n`
  );
}

main().catch((err) => fail(err instanceof Error ? err.message : String(err)));
