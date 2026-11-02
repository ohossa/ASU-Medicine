import { describe, it, expect } from 'vitest';
import { getModuleAcademicYear } from '../data';

describe('getModuleAcademicYear', () => {
  it('resolves standard hyphen-delimited module codes accurately', () => {
    expect(getModuleAcademicYear('IBM-1')).toBe(1);
    expect(getModuleAcademicYear('MCNS-2')).toBe(2);
    expect(getModuleAcademicYear('MGL-3')).toBe(3);
    expect(getModuleAcademicYear('MED2-4')).toBe(4);
    expect(getModuleAcademicYear('SUR1-5')).toBe(5);
  });

  it('resolves modules without hyphen-number from catalog syllabus mapping', () => {
    expect(getModuleAcademicYear('ASU101')).toBe(1);
  });

  it('uses fallback route year when valid (1-5)', () => {
    expect(getModuleAcademicYear(undefined, 3)).toBe(3);
    expect(getModuleAcademicYear('UNKNOWN', 2)).toBe(2);
  });

  it('returns null for unrecognized module code with no valid fallback', () => {
    expect(getModuleAcademicYear('NONEXISTENT_XYZ')).toBeNull();
    expect(getModuleAcademicYear(undefined, undefined)).toBeNull();
    expect(getModuleAcademicYear(undefined, 0)).toBeNull();
    expect(getModuleAcademicYear(undefined, 6)).toBeNull();
  });
});
