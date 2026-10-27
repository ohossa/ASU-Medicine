import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import importedBank from '../imports/year-3/semester-1/MGL-3.json';

const LEDGER_DIR = path.resolve('docs/verification/git-ca2-import-2026-10-27');

describe('GIT Assessment 2 (CA-2) Intake & Past Exams Verification', () => {
  it('verifies master page-by-page audit across all 539 pages with zero unaccounted pages', () => {
    const masterLedgerPath = path.join(LEDGER_DIR, 'master-page-ledger.json');
    expect(fs.existsSync(masterLedgerPath), 'master-page-ledger.json exists').toBe(true);
    const ledger = JSON.parse(fs.readFileSync(masterLedgerPath, 'utf8'));

    expect(ledger.metadata.totalPages).toBe(539);
    expect(ledger.metadata.unaccountedPages).toBe(0);
    expect(ledger.pages).toHaveLength(539);

    const pages = ledger.pages;
    const pageNumbers = pages.map((p: any) => p.pageNumber);
    expect(new Set(pageNumbers).size).toBe(539);

    const dispositions = pages.map((p: any) => p.disposition);
    expect(dispositions.filter((d: string) => d === 'QUESTIONS_MCQ')).toHaveLength(254);
    expect(dispositions.filter((d: string) => d === 'ANSWER_KEY')).toHaveLength(253);
    expect(dispositions.filter((d: string) => d === 'COVER_PAGE')).toHaveLength(10);
    expect(dispositions.filter((d: string) => d === 'EXPLANATORY_MATERIAL')).toHaveLength(19);
    expect(dispositions.filter((d: string) => d === 'SUMMARY_NOTES')).toHaveLength(1);
    expect(dispositions.filter((d: string) => d === 'BLANK')).toHaveLength(2);
  });

  it('verifies MGL-3 chapters, exam periods, and question counts', () => {
    const chapters = importedBank.chapters as any[];
    expect(chapters).toHaveLength(25);

    const practiceChapters = chapters.filter((c) => (c.bankSection ?? 'practice') === 'practice');
    expect(practiceChapters).toHaveLength(8);

    const ca1Chapters = chapters.filter((c) => c.bankSection === 'past-exams' && (c.examPeriod === 'ca-1' || c.id < 200));
    expect(ca1Chapters).toHaveLength(8);
    for (const ch of ca1Chapters) {
      expect(ch.examPeriod).toBe('ca-1');
      expect(ch.title).toMatch(/^CA-1 — /);
    }

    const ca2Chapters = chapters.filter((c) => c.bankSection === 'past-exams' && c.examPeriod === 'ca-2');
    expect(ca2Chapters).toHaveLength(9);
    for (const ch of ca2Chapters) {
      expect(ch.examPeriod).toBe('ca-2');
      expect(ch.title).toMatch(/^CA-2 — /);
    }

    const practiceCount = practiceChapters.reduce((sum, c) => sum + c.subjects.reduce((s: number, sub: any) => s + sub.questions.length, 0), 0);
    const ca1Count = ca1Chapters.reduce((sum, c) => sum + c.subjects.reduce((s: number, sub: any) => s + sub.questions.length, 0), 0);
    const ca2Count = ca2Chapters.reduce((sum, c) => sum + c.subjects.reduce((s: number, sub: any) => s + sub.questions.length, 0), 0);

    expect(practiceCount).toBe(5622);
    expect(ca1Count).toBe(670);
    expect(ca2Count).toBe(247);
    expect(practiceCount + ca1Count + ca2Count).toBe(6539);
  });

  it('verifies all 247 CA-2 questions conform strictly to the schema', () => {
    const ca2Chapters = (importedBank.chapters as any[]).filter((c) => c.bankSection === 'past-exams' && c.examPeriod === 'ca-2');
    const ca2Questions = ca2Chapters.flatMap((c) => c.subjects.flatMap((s: any) => s.questions));
    expect(ca2Questions).toHaveLength(247);

    for (const q of ca2Questions) {
      expect(typeof q.id).toBe('string');
      expect(q.id).toMatch(/^MGL3-CH[1-9]-[A-Z]+-\d{4}$/);
      expect(q.type).toBe('mcq');
      expect(typeof q.lecture).toBe('number');
      expect(q.lecture).toBeGreaterThanOrEqual(1);

      expect(typeof q.text).toBe('string');
      expect(q.text.trim().length).toBeGreaterThan(0);

      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.options.length).toBeLessThanOrEqual(5);

      expect(typeof q.correctIndex).toBe('number');
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);

      expect(typeof q.explanation).toBe('string');
      expect(q.explanation.trim().length).toBeGreaterThan(0);
      expect(q.explanation.trim().split(/\s+/).length).toBeLessThanOrEqual(65);
    }
  });

  it('verifies deduplication and exclusion ledgers', () => {
    const dedupPath = path.join(LEDGER_DIR, 'deduplication-ledger.json');
    expect(fs.existsSync(dedupPath)).toBe(true);
    const dedup = JSON.parse(fs.readFileSync(dedupPath, 'utf8'));
    expect(dedup.internalDuplicates).toHaveLength(6);
    expect(dedup.ca1Duplicates).toHaveLength(1);
    expect(dedup.totalFiltered).toBe(7);

    const exclPath = path.join(LEDGER_DIR, 'exclusion-ledger.json');
    expect(fs.existsSync(exclPath)).toBe(true);
    const exclusions = JSON.parse(fs.readFileSync(exclPath, 'utf8'));
    expect(exclusions).toHaveLength(32);
  });
});
