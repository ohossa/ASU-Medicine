import { describe, expect, it } from 'vitest';
import { questionQualityIssues } from '../../data-format-v2/scripts/question-quality';
import { validateModuleFile } from '../../data-format-v2/scripts/validate-banks';
import { auditBankDeep } from '../../scripts/audit-question-quality';

describe('questionQualityIssues zero-mistake safeguards', () => {
  it('flags OCR corruption, truncated stems, and stray page-number options (MUG3-CH1-ANAT-0243 pattern)', () => {
    const issues = questionQualityIssues({
      type: 'mcq',
      text: 'While exposing the kidney from beh aa',
      options: [
        'Lateral cutaneous nerve',
        'IHoinguinal nerve',
        'Subcostal nerve "i',
        'Liohypogastrie ner!',
        '107',
      ],
      correctIndex: 0,
      explanation: 'Posterior relation rationale.',
    });
    expect(issues.some((e) => e.includes('Corrupt OCR'))).toBe(true);
    expect(issues.some((e) => e.includes('stray page-number option "107"'))).toBe(true);
  });

  it('flags broken JSON/LaTeX control characters and unbalanced math delimiters', () => {
    const bellIssues = questionQualityIssues({
      type: 'essay',
      text: 'Explain CAH virilization.',
      modelAnswer: 'Accumulated 17\x07lpha-hydroxyprogesterone shifts to androgens.',
      explanation: 'Enzyme blockade increases adrenal precursors.',
    });
    expect(bellIssues.some((e) => e.includes('LaTeX escape'))).toBe(true);

    const tabLatexIssues = questionQualityIssues({
      type: 'essay',
      text: 'Write the Starling GFR equation.',
      modelAnswer: '$$GFR = K_f (\\text{P}_{GC})$$'.replace('\\text', '\text'),
      explanation: 'Starling forces govern ultrafiltration.',
    });
    expect(tabLatexIssues.some((e) => e.includes('LaTeX escape'))).toBe(true);

    const dollarIssues = questionQualityIssues({
      type: 'essay',
      text: 'Describe the lumbosacral trunk.',
      modelAnswer: 'L4 and L5 ventral rami.',
      explanation: 'Includes upper part of $4 instead of $\\alpha$ correction.',
    });
    expect(dollarIssues.some((e) => e.includes('Unbalanced LaTeX/math delimiter'))).toBe(true);
  });

  it('flags split-sentence OCR prefixes in MCQ options without false-positiving on < or .pptx', () => {
    const splitIssues = questionQualityIssues({
      type: 'mcq',
      text: 'Anterior relations of left kidney',
      options: ['Right suprarenal gland', '< Spleen', 's, a stone usually', 'Stomach'],
      correctIndex: 0,
      explanation: 'Left kidney anterior relations.',
    });
    expect(splitIssues.filter((e) => e.includes('Corrupt option prefix'))).toHaveLength(2);

    const ictIssues = questionQualityIssues({
      type: 'mcq',
      text: 'Which file extension is used by modern PowerPoint presentations?',
      options: ['.pptx', '.xlsx', '.docx', '.pdf'],
      correctIndex: 0,
      explanation: 'PowerPoint uses .pptx since Office 2007.',
    });
    expect(ictIssues).toEqual([]);

    const researchIssues = questionQualityIssues({
      type: 'mcq',
      text: 'Which symbol denotes statistically less than the threshold?',
      options: ['<', '>', '=', '>='],
      correctIndex: 0,
      explanation: 'P-value < 0.05 indicates statistical significance.',
    });
    expect(researchIssues).toEqual([]);
  });

  it('does not false-positive on legitimate numeric MCQs or valid escaped LaTeX', () => {
    const phIssues = questionQualityIssues({
      type: 'mcq',
      text: 'The optimum pH of alkaline phosphatase is:',
      options: ['2', '5', '10', '7'],
      correctIndex: 2,
      explanation: 'Alkaline phosphatase acts optimally at alkaline pH (~9–10).',
    });
    expect(phIssues).toEqual([]);

    const validLatexIssues = questionQualityIssues({
      type: 'essay',
      text: 'Explain CAH virilization.',
      modelAnswer: '$17\\alpha$-Hydroxyprogesterone $\\rightarrow$ adrenal androgens.',
      explanation: 'Valid LaTeX backslashes pass cleanly.',
    });
    expect(validLatexIssues).toEqual([]);
  });

  it('rejects rogue "answer" property and catches deep audit hazards', () => {
    const bank = {
      schemaVersion: 1,
      meta: {
        moduleCode: 'TEST-1',
        moduleName: 'Test Module',
        year: 1,
        semester: 1,
        creditPoints: 1,
        totalMarks: 20,
        keywords: ['test'],
      },
      chapters: [
        {
          id: 1,
          title: 'Test Chapter',
          subtitle: 'Sub',
          emoji: '🧪',
          page: 1,
          lectureRange: '1',
          subjects: [
            {
              id: 'anatomy',
              name: 'Anatomy',
              iconName: 'BookOpen',
              lectures: '1',
              lectureCount: 1,
              questions: [
                {
                  id: 'TEST-1',
                  type: 'essay',
                  lecture: 1,
                  text: 'Discuss the test structure.',
                  modelAnswer: 'Detailed valid model answer.',
                  explanation: 'Detailed valid explanation.',
                  answer: 'Stale rogue field',
                } as any,
                {
                  id: 'TEST-2',
                  type: 'mcq',
                  lecture: 9,
                  text: '12. Which option holds (Answer: A)?',
                  options: ['Option A', 'Both A and B'],
                  correctIndex: 0,
                  explanation: 'Review the related lecture material for the rationale.',
                },
              ],
            },
          ],
        },
      ],
    };

    const errors = validateModuleFile(bank as any);
    expect(errors.some((e) => e.includes('unexpected "answer" property'))).toBe(true);

    const deep = auditBankDeep('test.json', bank);
    expect(deep.some((f) => f.code === 'ANSWER_LEAK_STEM')).toBe(true);
    expect(deep.some((f) => f.code === 'GENERIC_EXPLANATION')).toBe(true);
    expect(deep.some((f) => f.code === 'LEADING_SOURCE_NUMBER')).toBe(true);
    expect(deep.some((f) => f.code === 'SHUFFLE_POSITIONAL_OPTION')).toBe(true);
    expect(deep.some((f) => f.code === 'LECTURE_OUT_OF_RANGE')).toBe(true);
  });
});
