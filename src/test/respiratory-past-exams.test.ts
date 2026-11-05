import { describe, it, expect } from "vitest";
import mrsBank from "../imports/year-2/semester-1/MRS-2.json";

describe("MRS-2 Respiratory System Past Exams Chapter", () => {
  it("includes Chapter 4 for Past Exams & Assessments", () => {
    const chapter = mrsBank.chapters.find((c: any) => c.id === 4);
    expect(chapter).toBeDefined();
    expect(chapter?.title).toBe("Past Exams & Assessments");
    expect(chapter?.subjects).toHaveLength(2);
  });

  it("contains Microbiology subject with 18 questions", () => {
    const chapter = mrsBank.chapters.find((c: any) => c.id === 4);
    const micro = chapter?.subjects.find((s: any) => s.id === "microbiology");
    expect(micro).toBeDefined();
    expect(micro?.questions).toHaveLength(18);

    // 16 MCQs + 2 Essays
    const mcqs = micro?.questions.filter((q: any) => q.type === "mcq") || [];
    const essays = micro?.questions.filter((q: any) => q.type === "essay") || [];
    expect(mcqs).toHaveLength(16);
    expect(essays).toHaveLength(2);

    for (const q of micro?.questions || []) {
      expect(q.id).toMatch(/^MRS2-PE-MIC-\d{3}$/);
      expect(q.text.length).toBeGreaterThan(10);
      expect(q.explanation.length).toBeGreaterThan(20);
      expect(q.keyConcept.length).toBeGreaterThan(10);

      if (q.type === "mcq") {
        const mcq = q as any;
        expect(mcq.options.length).toBeGreaterThanOrEqual(4);
        expect(mcq.correctIndex).toBeGreaterThanOrEqual(0);
        expect(mcq.correctIndex).toBeLessThan(mcq.options.length);
      } else if (q.type === "essay") {
        const essay = q as any;
        expect(essay.modelAnswer).toBeDefined();
        expect(essay.modelAnswer.length).toBeGreaterThan(50);
      }
    }
  });

  it("contains Physiology subject with 52 questions", () => {
    const chapter = mrsBank.chapters.find((c: any) => c.id === 4);
    const physio = chapter?.subjects.find((s: any) => s.id === "physiology");
    expect(physio).toBeDefined();
    expect(physio?.questions).toHaveLength(52);

    for (const q of (physio?.questions as any[]) || []) {
      expect(q.id).toMatch(/^MRS2-PE-PHY-\d{3}$/);
      expect(q.text.length).toBeGreaterThan(10);
      expect(q.explanation.length).toBeGreaterThan(20);
      expect(q.keyConcept.length).toBeGreaterThan(10);
      expect(q.type).toBe("mcq");
      expect(q.options.length).toBeGreaterThanOrEqual(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
    }
  });

  it("contains unique question IDs across the entire module", () => {
    const seenIds = new Set<string>();
    for (const chapter of mrsBank.chapters) {
      for (const subject of chapter.subjects || []) {
        for (const question of subject.questions || []) {
          expect(seenIds.has(question.id)).toBe(false);
          seenIds.add(question.id);
        }
      }
    }
    expect(seenIds.size).toBe(2353 + 18 + 52); // 2,423 questions total
  });
});
