import { describe, it, expect } from 'vitest';
import mug3Bank from '../imports/year-3/semester-1/MUG-3.json';
import iae1Bank from '../imports/year-1/semester-1/IAE-1.json';
import { checkAnswerCorrect } from './utils/quiz';

describe('Reported Questions Verification & Integrity Regression Tests', () => {
  function findQuestion(bank: any, targetId: string) {
    for (const ch of bank.chapters || []) {
      for (const sub of ch.subjects || []) {
        for (const q of sub.questions || []) {
          if (String(q.id) === targetId) return q;
        }
      }
    }
    return null;
  }

  it('verifies MUG3-CH203-PHYS-0105 (21-hydroxylase deficiency) is medically authentic and properly formatted', () => {
    const q = findQuestion(mug3Bank, 'MUG3-CH203-PHYS-0105');
    expect(q).toBeDefined();
    expect(q.type).toBe('mcq');
    expect(q.text).toContain('21-hydroxylase');
    expect(q.options.length).toBe(4);
    expect(q.correctIndex).toBe(0);
    expect(q.options[0]).toContain('Excess adrenal androgen');
    expect(q.explanation).toContain('CYP21A2');
    expect(checkAnswerCorrect(q, 0)).toBe(true);
    expect(checkAnswerCorrect(q, 1)).toBe(false);
  });

  it('verifies MUG3-CH203-PHYS-0106 (Cystinuria transport defect) is medically authentic', () => {
    const q = findQuestion(mug3Bank, 'MUG3-CH203-PHYS-0106');
    expect(q).toBeDefined();
    expect(q.type).toBe('mcq');
    expect(q.text).toContain('cystinuria');
    expect(q.options.length).toBe(4);
    expect(q.correctIndex).toBe(0);
    expect(q.options[0]).toContain('calculus formation');
    expect(q.explanation).toContain('Cystine, Ornithine, Lysine, Arginine');
    expect(checkAnswerCorrect(q, 0)).toBe(true);
  });

  it('verifies MUG3-CH103-PHYS-0126 (Fanconi syndrome calcitriol deficiency) is medically authentic', () => {
    const q = findQuestion(mug3Bank, 'MUG3-CH103-PHYS-0126');
    expect(q).toBeDefined();
    expect(q.type).toBe('mcq');
    expect(q.text).toContain('Fanconi syndrome');
    expect(q.options.length).toBe(4);
    expect(q.correctIndex).toBe(0);
    expect(q.options[0]).toContain('Calcitriol');
    expect(q.explanation).toContain('1α-hydroxylase');
    expect(checkAnswerCorrect(q, 0)).toBe(true);
  });

  it('verifies MUG3-CH101-ANAT-0022 (Nephrectomy renal artery ligation) is medically authentic', () => {
    const q = findQuestion(mug3Bank, 'MUG3-CH101-ANAT-0022');
    expect(q).toBeDefined();
    expect(q.type).toBe('mcq');
    expect(q.text).toContain('nephrectomy');
    expect(q.options.length).toBe(4);
    expect(q.correctIndex).toBe(0);
    expect(q.options[0]).toContain('abdominal aorta');
    expect(checkAnswerCorrect(q, 0)).toBe(true);
  });

  it('verifies MUG3-CH103-PHYS-0111 (Anterior relations of right ureter) is medically authentic', () => {
    const q = findQuestion(mug3Bank, 'MUG3-CH103-PHYS-0111');
    expect(q).toBeDefined();
    expect(q.type).toBe('mcq');
    expect(q.text).toContain('NOT cross anteriorly');
    expect(q.options.length).toBe(4);
    expect(q.correctIndex).toBe(0);
    expect(q.options[0]).toContain('Obturator neurovascular bundle');
    expect(checkAnswerCorrect(q, 0)).toBe(true);
  });

  it('verifies MUG3-CH201-ANAT-0023 (Double ureter embryology) is medically authentic', () => {
    const q = findQuestion(mug3Bank, 'MUG3-CH201-ANAT-0023');
    expect(q).toBeDefined();
    expect(q.type).toBe('mcq');
    expect(q.text).toContain('Duplication of the ureter');
    expect(q.options.length).toBe(4);
    expect(q.correctIndex).toBe(0);
    expect(q.options[0]).toContain('ureteric bud');
    expect(checkAnswerCorrect(q, 0)).toBe(true);
  });

  it('verifies MUG3-CH3-PHYS-2135 (Renal autoregulation pressure range) has explicit range options', () => {
    const q = findQuestion(mug3Bank, 'MUG3-CH3-PHYS-2135');
    expect(q).toBeDefined();
    expect(q.type).toBe('mcq');
    expect(q.options.length).toBe(4);
    expect(q.options[1]).toBe('80–180 mmHg');
    expect(q.correctIndex).toBe(1);
    expect(checkAnswerCorrect(q, 1)).toBe(true);
    expect(checkAnswerCorrect(q, 0)).toBe(false);
  });

  it('verifies MUG3-CH1-ANAT-0593 (Bladder support / ptosis prevention) is medically authentic', () => {
    const q = findQuestion(mug3Bank, 'MUG3-CH1-ANAT-0593');
    expect(q).toBeDefined();
    expect(q.type).toBe('mcq');
    expect(q.text).toContain('NOT involved in supporting the urinary bladder');
    expect(q.options.length).toBe(4);
    expect(q.options[3]).toBe('Lateral umbilical fold');
    expect(q.correctIndex).toBe(3);
    expect(checkAnswerCorrect(q, 3)).toBe(true);
  });

  it('verifies MUG3-CH1-ANAT-0536 (Renal hilum anterior-to-posterior relations) is medically authentic', () => {
    const q = findQuestion(mug3Bank, 'MUG3-CH1-ANAT-0536');
    expect(q).toBeDefined();
    expect(q.type).toBe('mcq');
    expect(q.text).toContain('anterior-to-posterior order');
    expect(q.options[1]).toContain('Renal vein, renal artery, renal pelvis');
    expect(q.correctIndex).toBe(1);
    expect(checkAnswerCorrect(q, 1)).toBe(true);
  });

  it('verifies IAE-1-SRC-0680 (CNS meninges fill-in-the-blank) has clean primaries and flexible acceptedAnswers', () => {
    const q = findQuestion(iae1Bank, 'IAE-1-SRC-0680');
    expect(q).toBeDefined();
    expect(q.type).toBe('fillblank');
    expect(q.blanks).toEqual(['dura mater', 'arachnoid mater', 'pia mater', 'subarachnoid']);
    expect(q.acceptedAnswers.length).toBe(4);

    // Standard clinical input
    expect(checkAnswerCorrect(q, { inputs: ['dura mater', 'arachnoid mater', 'pia mater', 'subarachnoid'] })).toBe(true);
    // Short input
    expect(checkAnswerCorrect(q, { inputs: ['dura', 'arachnoid', 'pia', 'subarachnoid'] })).toBe(true);
    // Reverse meningeal order (from deep to superficial)
    expect(checkAnswerCorrect(q, { inputs: ['pia mater', 'arachnoid mater', 'dura mater', 'subarachnoid'] })).toBe(true);
    // Input with articles
    expect(checkAnswerCorrect(q, { inputs: ['the dura mater', 'the arachnoid', 'the pia mater', 'subarachnoid space'] })).toBe(true);
    // Wrong input
    expect(checkAnswerCorrect(q, { inputs: ['pleura', 'peritoneum', 'pericardium', 'epidural'] })).toBe(false);
  });

  it('enforces that zero questions in MUG-3 have <= 2 options or question fragments as options', () => {
    const headers = new Set(['anatomy', 'patho', 'pharma', 'micro', 'physio', 'histo', 'biochem']);
    for (const ch of mug3Bank.chapters) {
      for (const sub of ch.subjects) {
        for (const q of sub.questions) {
          if (q.type === 'mcq') {
            expect(q.options.length, `QID ${q.id} has only ${q.options.length} options`).toBeGreaterThanOrEqual(4);
            for (const opt of q.options) {
              expect(headers.has(opt.toLowerCase().trim()), `QID ${q.id} has header as option: ${opt}`).toBe(false);
            }
            const correctOpt = q.options[q.correctIndex];
            expect(correctOpt.endsWith('?'), `QID ${q.id} has correct option ending with ?: ${correctOpt}`).toBe(false);
          }
        }
      }
    }
  });
});
