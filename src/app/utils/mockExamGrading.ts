import type { AinShamsGradeInfo } from '../types/mockExam';

/**
 * Maps a percentage score to the official Ain Shams Faculty of Medicine grading scale.
 * 
 * - A+ : >= 90% (4.0 GPA · Excellent)
 * - A  : >= 85% (3.75 GPA · Excellent)
 * - B+ : >= 80% (3.3 GPA · Very Good)
 * - B  : >= 75% (3.0 GPA · Very Good)
 * - C+ : >= 70% (2.5 GPA · Good)
 * - C  : >= 65% (2.0 GPA · Satisfactory)
 * - D  : >= 60% (1.5 GPA · Passing)
 * - F  : < 60%  (0.0 GPA · Fail)
 */
export function calculateAinShamsGrade(scorePercent: number): AinShamsGradeInfo {
  const rounded = Math.round(scorePercent);
  if (rounded >= 90) {
    return {
      grade: 'A+',
      gpaPoints: 4.0,
      status: 'Excellent',
      color: 'text-emerald-700 dark:text-emerald-300',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      badgeBorder: 'border-emerald-300 dark:border-emerald-800',
    };
  }
  if (rounded >= 85) {
    return {
      grade: 'A',
      gpaPoints: 3.75,
      status: 'Excellent',
      color: 'text-emerald-700 dark:text-emerald-300',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      badgeBorder: 'border-emerald-300 dark:border-emerald-800',
    };
  }
  if (rounded >= 80) {
    return {
      grade: 'B+',
      gpaPoints: 3.3,
      status: 'Very Good',
      color: 'text-teal-700 dark:text-teal-300',
      badgeBg: 'bg-teal-50 dark:bg-teal-950/60',
      badgeBorder: 'border-teal-300 dark:border-teal-800',
    };
  }
  if (rounded >= 75) {
    return {
      grade: 'B',
      gpaPoints: 3.0,
      status: 'Very Good',
      color: 'text-teal-700 dark:text-teal-300',
      badgeBg: 'bg-teal-50 dark:bg-teal-950/60',
      badgeBorder: 'border-teal-300 dark:border-teal-800',
    };
  }
  if (rounded >= 70) {
    return {
      grade: 'C+',
      gpaPoints: 2.5,
      status: 'Good',
      color: 'text-amber-700 dark:text-amber-300',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
      badgeBorder: 'border-amber-300 dark:border-amber-800',
    };
  }
  if (rounded >= 65) {
    return {
      grade: 'C',
      gpaPoints: 2.0,
      status: 'Satisfactory',
      color: 'text-amber-700 dark:text-amber-300',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
      badgeBorder: 'border-amber-300 dark:border-amber-800',
    };
  }
  if (rounded >= 60) {
    return {
      grade: 'D',
      gpaPoints: 1.5,
      status: 'Passing',
      color: 'text-orange-700 dark:text-orange-300',
      badgeBg: 'bg-orange-50 dark:bg-orange-950/60',
      badgeBorder: 'border-orange-300 dark:border-orange-800',
    };
  }
  return {
    grade: 'F',
    gpaPoints: 0.0,
    status: 'Fail',
    color: 'text-rose-700 dark:text-rose-300',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
    badgeBorder: 'border-rose-300 dark:border-rose-800',
  };
}
