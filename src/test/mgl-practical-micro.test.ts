import { describe, it, expect, beforeAll } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { getModuleQuestionCounts, getChaptersForModuleAndMode, ensurePracticalDataLoaded } from "../app/data";

describe("MGL-3 Microbiology Practical Bank", () => {
  beforeAll(async () => {
    await ensurePracticalDataLoaded("MGL-3");
  });

  it("loads 826 total practical questions in getModuleQuestionCounts", () => {
    const counts = getModuleQuestionCounts("MGL-3");
    expect(counts.practicalCount).toBe(826);
  });

  it("builds the practical chapter with correct metadata", () => {
    const chapters = getChaptersForModuleAndMode("MGL-3", "practical");
    expect(chapters.length).toBe(7);

    const microChapter = chapters.find((c) => c.id === 306)!;
    expect(microChapter).toBeDefined();
    expect(microChapter.id).toBe(306);
    expect(microChapter.title).toBe("Practical — Microbiology");
    expect(microChapter.bankSection).toBe("practical");
    expect(microChapter.subjects.length).toBe(1);

    const microSubject = microChapter.subjects[0];
    expect(microSubject.id).toBe("microbiology");
    expect(microSubject.questions.length).toBe(51);
  });

  it("validates all 51 questions for schema completeness", () => {
    const chapters = getChaptersForModuleAndMode("MGL-3", "practical");
    const microChapter = chapters.find((c) => c.id === 306)!;
    const questions = microChapter.subjects[0].questions;

    questions.forEach((q) => {
      expect(q.id).toMatch(/^MGL3-PRAC-MIC-\d{4}$/);
      expect(q.type).toBe("mcq");
      expect(q.text.trim().length).toBeGreaterThan(15);
      expect(q.options).toBeDefined();
      expect(q.options!.length).toBeGreaterThanOrEqual(3);
      expect(q.correctIndex).toBeDefined();
      expect(q.correctIndex!).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex!).toBeLessThan(q.options!.length);
      expect(q.explanation?.trim().length).toBeGreaterThan(20);
      expect(q.keyConcept?.trim().length).toBeGreaterThan(10);

      if (q.media?.imageUrl) {
        const diskPath = path.join(process.cwd(), "public", q.media.imageUrl.replace(/^\//, ""));
        expect(fs.existsSync(diskPath), `Missing media file: ${diskPath} for ${q.id}`).toBe(true);
      }
    });
  });

  it("verifies key clinical answers match Ain Shams practical curriculum", () => {
    const chapters = getChaptersForModuleAndMode("MGL-3", "practical");
    const microChapter = chapters.find((c) => c.id === 306)!;
    const questions = microChapter.subjects[0].questions;

    // Q1: Next step for Gram -ve bacilli in dysentery -> Oxidase test
    expect(questions[0].options![questions[0].correctIndex!]).toBe("Performing oxidase test");

    // Q2: TSI K/A, no gas, no H2S, citrate neg -> Shigella dysenteriae
    expect(questions[1].options![questions[1].correctIndex!]).toContain("Shigella dysenteriae");

    // Q5: EHEC selective medium -> Sorbitol MacConkey
    expect(questions[4].options![questions[4].correctIndex!]).toBe("Sorbitol MacConkey agar");

    // Q10: Rice-water diarrhea comma-shaped -> Vibrio cholerae
    expect(questions[9].options![questions[9].correctIndex!]).toBe("Vibrio cholerae");

    // Q11: Vibrio enrichment medium -> Alkaline peptone water
    expect(questions[10].options![questions[10].correctIndex!]).toBe("Alkaline peptone water");

    // Q15: 4h vomiting food poisoning -> Staph. aureus
    expect(questions[14].options![questions[14].correctIndex!]).toBe("Staph. aureus");
  });
});
