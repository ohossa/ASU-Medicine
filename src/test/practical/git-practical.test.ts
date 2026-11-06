import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  ensureDataLoaded,
  ensurePracticalDataLoaded,
  getChaptersForModuleAndMode,
  getModuleQuestionCounts,
} from '../../app/data';
import { practiceTopics } from '../../app/learning/customPractice';
import { toGitTopicChapter } from '../../app/lib/gitBank';

describe('GIT (MGL-3) Practical Question Bank Rebuild & Verification', () => {
  const practicalJsonPath = path.resolve(__dirname, '../../app/data/practical/mgl-3-practical.json');
  const publicDir = path.resolve(__dirname, '../../../public');

  beforeAll(async () => {
    await ensureDataLoaded();
    await ensurePracticalDataLoaded('MGL-3');
  });

  it('mgl-3-practical.json exists on disk and contains exactly 7 chapters totaling 891 questions with combined Pathology', () => {
    const raw = fs.readFileSync(practicalJsonPath, 'utf8');
    const parsed = JSON.parse(raw);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(7);

    const chapterCounts = parsed.map((ch: any) => ({
      id: ch.id,
      title: ch.title,
      count: ch.subjects[0].questions.length,
      topicsCount: ch.subjects[0].lectureNames.length,
    }));

    expect(chapterCounts).toEqual([
      { id: 301, title: 'Practical — Anatomy', count: 315, topicsCount: 4 },
      { id: 302, title: 'Practical — Histology', count: 183, topicsCount: 2 },
      { id: 303, title: 'Practical — Pathology', count: 145, topicsCount: 2 },
      { id: 304, title: 'Practical — Parasitology', count: 84, topicsCount: 1 },
      { id: 305, title: 'Practical — Microbiology', count: 51, topicsCount: 1 },
      { id: 306, title: 'Practical — Physiology', count: 48, topicsCount: 1 },
      { id: 307, title: 'Practical — Biochemistry', count: 65, topicsCount: 4 },
    ]);

    const totalQuestions = chapterCounts.reduce((acc: number, c: any) => acc + c.count, 0);
    expect(totalQuestions).toBe(891);
  });

  it('Pathology chapter cleanly splits into Pathology Museum (95 Qs) and Pathology Lab (50 Qs) topics in UI', () => {
    const practicalChaptersList = getChaptersForModuleAndMode('MGL-3', 'practical');
    const pathoChapter = practicalChaptersList.find(c => c.id === 303)!;
    expect(pathoChapter).toBeDefined();

    // Verify practiceTopics yields the 2 topics directly when clicking the chapter
    const topics = practiceTopics(pathoChapter, 'MGL-3');
    expect(topics).toHaveLength(2);
    expect(topics[0].title).toBe('Pathology Museum (Gross Jars)');
    expect(topics[0].questions).toHaveLength(95);
    expect(topics[1].title).toBe('Pathology Lab (Microscopic Slides)');
    expect(topics[1].questions).toHaveLength(50);
  });

  it('Anatomy and Histology chapters cleanly split into their respective lecture modules', () => {
    const practicalChaptersList = getChaptersForModuleAndMode('MGL-3', 'practical');
    const anatChapter = practicalChaptersList.find(c => c.id === 301)!;
    const anatTopics = practiceTopics(anatChapter, 'MGL-3');
    expect(anatTopics).toHaveLength(4);
    expect(anatTopics[0].questions).toHaveLength(78);
    expect(anatTopics[1].questions).toHaveLength(88);
    expect(anatTopics[2].questions).toHaveLength(80);
    expect(anatTopics[3].questions).toHaveLength(69);

    const histoChapter = practicalChaptersList.find(c => c.id === 302)!;
    const histoTopics = practiceTopics(histoChapter, 'MGL-3');
    expect(histoTopics).toHaveLength(2);
    expect(histoTopics[0].questions).toHaveLength(86);
    expect(histoTopics[1].questions).toHaveLength(97);
  });

  it('toGitTopicChapter preserves practical chapters without stripping topics or questions', () => {
    const practicalChaptersList = getChaptersForModuleAndMode('MGL-3', 'practical');
    for (const ch of practicalChaptersList) {
      const transformed = toGitTopicChapter(ch);
      expect(transformed.subjects).toHaveLength(1);
      expect(transformed.subjects[0].questions.length).toBe(ch.subjects[0].questions.length);
      expect(transformed.subjects[0].lectureNames).toBeDefined();
      expect(transformed.subjects[0].lectureNames!.length).toBeGreaterThan(0);
    }
  });

  it('every question adheres to schema: non-empty stem, valid options, correctIndex, explanation, keyConcept', () => {
    const raw = fs.readFileSync(practicalJsonPath, 'utf8');
    const chapters = JSON.parse(raw);

    for (const ch of chapters) {
      for (const subj of ch.subjects) {
        for (const q of subj.questions) {
          expect(q.id).toBeDefined();
          expect(typeof q.id).toBe('string');
          expect(q.text).toBeDefined();
          expect(q.text.trim().length).toBeGreaterThan(0);
          expect(Array.isArray(q.options)).toBe(true);
          expect(q.options.length).toBeGreaterThanOrEqual(2);
          expect(typeof q.correctIndex).toBe('number');
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThan(q.options.length);
          expect(q.explanation).toBeDefined();
          expect(q.explanation.trim().length).toBeGreaterThan(15);
          expect(q.keyConcept).toBeDefined();
          expect(q.keyConcept.trim().length).toBeGreaterThan(10);
        }
      }
    }
  });

  it('all 746 image-based practical questions reference real, existing WebP assets under public/', () => {
    const raw = fs.readFileSync(practicalJsonPath, 'utf8');
    const chapters = JSON.parse(raw);

    let imageCount = 0;
    for (const ch of chapters) {
      for (const subj of ch.subjects) {
        for (const q of subj.questions) {
          if (q.media && q.media.imageUrl) {
            imageCount++;
            const relativePath = q.media.imageUrl.replace(/^\//, '');
            const absolutePath = path.join(publicDir, relativePath);
            expect(
              fs.existsSync(absolutePath),
              `Image file missing on disk: ${absolutePath} (Question: ${q.id})`
            ).toBe(true);
          }
        }
      }
    }
    expect(imageCount).toBe(759);
  });

  it('getModuleQuestionCounts reports practicalCount as exactly 891 for MGL-3', () => {
    const counts = getModuleQuestionCounts('MGL-3');
    expect(counts.practicalCount).toBe(891);
    expect(counts.mcqCount).toBeGreaterThan(5000);
  });

  it('getChaptersForModuleAndMode returns all 7 practical chapters with correct accent colors in practical mode', () => {
    const practicalChaptersList = getChaptersForModuleAndMode('MGL-3', 'practical');
    expect(practicalChaptersList).toHaveLength(7);
    expect(practicalChaptersList[0].title).toBe('Practical — Anatomy');
    expect(practicalChaptersList[0].accentColor).toBe('anatomy');
    expect(practicalChaptersList[1].accentColor).toBe('histology');
    expect(practicalChaptersList[2].accentColor).toBe('pathology');
    expect(practicalChaptersList[3].accentColor).toBe('parasitology');
    expect(practicalChaptersList[4].accentColor).toBe('microbiology');
    expect(practicalChaptersList[5].accentColor).toBe('physiology');
    expect(practicalChaptersList[6].accentColor).toBe('biochem');
  });

  it('getChaptersForModuleAndMode isolates MCQ practice without any practical sections', () => {
    const mcqChapters = getChaptersForModuleAndMode('MGL-3', 'mcq');
    expect(mcqChapters.length).toBeGreaterThan(0);
    for (const ch of mcqChapters) {
      expect(ch.bankSection).not.toBe('practical');
    }
  });
});
