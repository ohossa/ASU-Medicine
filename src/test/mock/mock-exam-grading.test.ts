import { describe, it, expect } from 'vitest';
import { calculateAinShamsGrade } from '../../app/utils/mockExamGrading';

describe('Official Ain Shams Medical Grading Curve', () => {
  it('maps scores >= 90% to A+ (4.0 GPA · Excellent)', () => {
    const res95 = calculateAinShamsGrade(95);
    expect(res95.grade).toBe('A+');
    expect(res95.gpaPoints).toBe(4.0);
    expect(res95.status).toBe('Excellent');

    const res90 = calculateAinShamsGrade(90);
    expect(res90.grade).toBe('A+');
  });

  it('maps scores 85% to 89% to A (3.75 GPA · Excellent)', () => {
    const res88 = calculateAinShamsGrade(88);
    expect(res88.grade).toBe('A');
    expect(res88.gpaPoints).toBe(3.75);
    expect(res88.status).toBe('Excellent');
  });

  it('maps scores 80% to 84% to B+ (3.3 GPA · Very Good)', () => {
    const res82 = calculateAinShamsGrade(82);
    expect(res82.grade).toBe('B+');
    expect(res82.gpaPoints).toBe(3.3);
    expect(res82.status).toBe('Very Good');
  });

  it('maps scores 75% to 79% to B (3.0 GPA · Very Good)', () => {
    const res76 = calculateAinShamsGrade(76);
    expect(res76.grade).toBe('B');
    expect(res76.gpaPoints).toBe(3.0);
  });

  it('maps scores 70% to 74% to C+ (2.5 GPA · Good)', () => {
    const res72 = calculateAinShamsGrade(72);
    expect(res72.grade).toBe('C+');
    expect(res72.gpaPoints).toBe(2.5);
    expect(res72.status).toBe('Good');
  });

  it('maps scores 65% to 69% to C (2.0 GPA · Satisfactory)', () => {
    const res67 = calculateAinShamsGrade(67);
    expect(res67.grade).toBe('C');
    expect(res67.gpaPoints).toBe(2.0);
  });

  it('maps scores 60% to 64% to D (1.5 GPA · Passing)', () => {
    const res61 = calculateAinShamsGrade(61);
    expect(res61.grade).toBe('D');
    expect(res61.gpaPoints).toBe(1.5);
    expect(res61.status).toBe('Passing');
  });

  it('maps scores < 60% to F (0.0 GPA · Fail)', () => {
    const res55 = calculateAinShamsGrade(55);
    expect(res55.grade).toBe('F');
    expect(res55.gpaPoints).toBe(0.0);
    expect(res55.status).toBe('Fail');
  });
});
