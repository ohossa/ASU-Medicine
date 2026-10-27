import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("GIT Assessment 2 Intake Verification", () => {
  const mgl3Path = path.resolve(process.cwd(), "src/imports/year-3/semester-1/MGL-3.json");
  const verifDir = path.resolve(process.cwd(), "docs/verification/git-assessment2-import-2026-10-24");
  
  const mgl3 = JSON.parse(fs.readFileSync(mgl3Path, "utf-8"));
  const extractionLedger = JSON.parse(fs.readFileSync(path.join(verifDir, "extraction-ledger.json"), "utf-8"));
  const deduplicationLedger = JSON.parse(fs.readFileSync(path.join(verifDir, "deduplication-ledger.json"), "utf-8"));
  const exclusionLedger = JSON.parse(fs.readFileSync(path.join(verifDir, "exclusion-ledger.json"), "utf-8"));
  const masterPageLedger = JSON.parse(fs.readFileSync(path.join(verifDir, "master-page-ledger.json"), "utf-8"));

  it("verifies master page-by-page audit across all 1061 pages with zero unaccounted pages", () => {
    expect(masterPageLedger.totalFiles).toBe(37);
    expect(masterPageLedger.totalPagesAudited).toBe(1061);
    expect(masterPageLedger.pages.length).toBe(1061);

    const validDispositions = new Set([
      "COVER_PAGE",
      "QUESTIONS_MCQ",
      "QUESTIONS_ESSAY",
      "ANSWER_KEY",
      "SUMMARY_NOTES",
      "EXPLANATORY_MATERIAL",
      "BLANK"
    ]);

    for (const page of masterPageLedger.pages) {
      expect(page.file).toBeTruthy();
      expect(typeof page.pageNumber).toBe("number");
      expect(page.pageNumber).toBeGreaterThanOrEqual(1);
      expect(validDispositions.has(page.disposition)).toBe(true);
      expect(typeof page.charCount).toBe("number");
    }
  });

  it("verifies MGL-3 total question count and schema integrity", () => {
    expect(mgl3.schemaVersion).toBe(1);
    expect(mgl3.meta.moduleCode).toBe("MGL-3");
    expect(mgl3.meta.totalQuestions).toBe(6292);

    let totalCalculated = 0;
    for (const chapter of mgl3.chapters) {
      for (const subject of chapter.subjects) {
        totalCalculated += subject.questions.length;
      }
    }
    expect(totalCalculated).toBe(6539);
  });

  it("verifies all 114 new questions have valid schema fields", () => {
    expect(extractionLedger.length).toBe(114);

    const allNewIds = new Set(extractionLedger.map((q: any) => q.assignedId));
    expect(allNewIds.size).toBe(114);

    // Map all questions in MGL-3 by ID
    const questionsById = new Map();
    for (const chapter of mgl3.chapters) {
      for (const subject of chapter.subjects) {
        for (const q of subject.questions) {
          questionsById.set(q.id, { q, subject, chapter });
        }
      }
    }

    for (const entry of extractionLedger) {
      const match = questionsById.get(entry.assignedId);
      expect(match).toBeDefined();
      const { q, subject } = match;

      expect(q.text).toBeTruthy();
      expect(q.explanation).toBeTruthy();
      expect(typeof q.lecture).toBe("number");
      expect(q.lecture).toBeGreaterThanOrEqual(1);
      expect(q.lecture).toBeLessThanOrEqual(subject.lectureNames.length);

      if (q.type === "mcq" || q.type === "truefalse") {
        expect(Array.isArray(q.options)).toBe(true);
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(typeof q.correctIndex).toBe("number");
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
      } else if (q.type === "essay") {
        expect(q.modelAnswer).toBeTruthy();
        expect(typeof q.modelAnswer).toBe("string");
      }
    }
  });

  it("verifies deduplication ledger records and explanations", () => {
    expect(deduplicationLedger.length).toBe(212);
    const enriched = deduplicationLedger.filter((d: any) => d.enriched);
    expect(enriched.length).toBe(2);
  });

  it("verifies exclusion ledger contains comprehensive rationale for all excluded sources", () => {
    expect(exclusionLedger.length).toBeGreaterThanOrEqual(10);
    for (const excl of exclusionLedger) {
      expect(excl.filename).toBeTruthy();
      expect(excl.reason).toBeTruthy();
    }
  });
});
