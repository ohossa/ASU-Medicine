#!/usr/bin/env node
/**
 * Extract raw chunks from the CNS question file for agent-based processing.
 * Usage: npx tsx extract-chunks.ts [output_dir]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

const OUT_DIR = process.argv[2] ?? path.join(
  REPO_ROOT,
  "data-format-v2",
  "question-intake",
  "year-2",
  "semester-2",
  "MCNS-2 [Central Nervous System]",
  "_cleaned"
);

const MAX_CHUNK_QUESTIONS = 90;
const QUESTION_START_RE =
  /^\*\*\d+[\d\-\.]+\.\*\*|^\*\*\d+\.\*\*|^\*\*\d+\-[\d]+\.\*\*|^\d+[\.,;:]\s/i;
const SECTION_HEADER_RE = /^Part\s+\d+\s*$|^##\s+Head\s+and\s+Neck\s+Questions/i;

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function buildChunks(rawText: string) {
  const lines = rawText.split("\n");
  const chunks: Array<{
    index: number;
    section: string;
    startLine: number;
    endLine: number;
    content: string;
    questionCount: number;
  }> = [];
  let chunkIndex = 1;
  let currentSection = "Unknown";
  let chunkStartLine = 0;
  let chunkLines: string[] = [];
  let chunkQuestions = 0;

  function flushChunk(endLine: number) {
    if (chunkLines.length === 0) return;
    const sectionMatch = chunkLines.join("\n").match(SECTION_HEADER_RE);
    const effectiveSection = sectionMatch
      ? sectionMatch[0].trim()
      : currentSection;
    chunks.push({
      index: chunkIndex++,
      section: effectiveSection,
      startLine: chunkStartLine,
      endLine,
      content: chunkLines.join("\n"),
      questionCount: chunkQuestions,
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const sectionMatch = line.match(SECTION_HEADER_RE);
    if (sectionMatch) {
      if (chunkLines.length > 0) {
        flushChunk(i - 1);
        chunkLines = [];
        chunkQuestions = 0;
      }
      currentSection = sectionMatch[0].trim();
      chunkStartLine = i;
    }
    const isQuestion = QUESTION_START_RE.test(line.trim());
    if (isQuestion) chunkQuestions++;
    if (
      chunkQuestions >= MAX_CHUNK_QUESTIONS &&
      isQuestion &&
      chunkLines.length > 0
    ) {
      flushChunk(i - 1);
      const overlap = chunkLines.slice(-5);
      chunkLines = [...overlap];
      chunkStartLine = Math.max(0, i - overlap.length);
      chunkQuestions = overlap.filter((l) =>
        QUESTION_START_RE.test(l.trim())
      ).length;
    }
    chunkLines.push(line);
  }
  if (chunkLines.length > 0) flushChunk(lines.length - 1);

  return chunks.filter((c) => c.questionCount > 0);
}

function main() {
  ensureDir(OUT_DIR);
  const rawText = fs.readFileSync(RAW_PATH, "utf-8");
  const chunks = buildChunks(rawText);

  console.log(`Extracted ${chunks.length} chunks`);
  let totalQuestions = 0;

  for (const chunk of chunks) {
    const fileName = path.join(OUT_DIR, `raw_chunk_${String(chunk.index).padStart(3, "0")}.txt`);
    fs.writeFileSync(fileName, chunk.content, "utf-8");
    totalQuestions += chunk.questionCount;
    console.log(`  raw_chunk_${String(chunk.index).padStart(3, "0")}.txt — ${chunk.section} — ${chunk.questionCount} questions`);
  }

  console.log(`\nTotal questions: ${totalQuestions}`);
  console.log(`Output directory: ${OUT_DIR}`);
}

main();
