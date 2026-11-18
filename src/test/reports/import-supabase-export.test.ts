import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseCsv, coerceValue, detectTableFromFilename, importRecordsToD1 } from '../../../scripts/import-supabase-export.js';

vi.mock('../../../server/d1-client.js', () => ({
  d1Batch: vi.fn(async () => []),
  isD1Configured: vi.fn(() => true),
  d1QueryFirst: vi.fn(),
}));

describe('Supabase Export Ingestion CLI (scripts/import-supabase-export.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('parseCsv', () => {
    it('correctly parses simple CSV records', () => {
      const csv = `user_id,year,xp,alias\nuser_1,2,500,Student Alpha\nuser_2,3,1200,Student Beta`;
      const result = parseCsv(csv);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        user_id: 'user_1',
        year: '2',
        xp: '500',
        alias: 'Student Alpha',
      });
      expect(result[1]).toEqual({
        user_id: 'user_2',
        year: '3',
        xp: '1200',
        alias: 'Student Beta',
      });
    });

    it('handles quoted fields with commas and escaped quotes', () => {
      const csv = `id,snapshot,notes\n1,"{""title"": ""Heart, Lung, Liver""}","Needs review, high priority"`;
      const result = parseCsv(csv);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
      expect(result[0].snapshot).toBe('{"title": "Heart, Lung, Liver"}');
      expect(result[0].notes).toBe('Needs review, high priority');
    });

    it('handles multiline quoted values', () => {
      const csv = `id,explanation\n101,"Line 1\nLine 2\nLine 3"`;
      const result = parseCsv(csv);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('101');
      expect(result[0].explanation).toBe('Line 1\nLine 2\nLine 3');
    });
  });

  describe('coerceValue', () => {
    it('coerces booleans and boolean strings to 1/0 for integer columns', () => {
      expect(coerceValue('opt_in', true)).toBe(1);
      expect(coerceValue('opt_in', false)).toBe(0);
      expect(coerceValue('opt_in', 'true')).toBe(1);
      expect(coerceValue('opt_in', 'false')).toBe(0);
      expect(coerceValue('correct', 't')).toBe(1);
      expect(coerceValue('correct', 'f')).toBe(0);
    });

    it('coerces integers cleanly', () => {
      expect(coerceValue('xp', '1500')).toBe(1500);
      expect(coerceValue('level', '4')).toBe(4);
      expect(coerceValue('streak', '')).toBe(0);
      expect(coerceValue('streak', null)).toBe(0);
    });

    it('coerces objects to JSON string', () => {
      expect(coerceValue('snapshot', { a: 1 })).toBe('{"a":1}');
    });
  });

  describe('detectTableFromFilename', () => {
    it('detects correct table names from standard export filenames', () => {
      expect(detectTableFromFilename('learning_profiles.csv')).toBe('learning_profiles');
      expect(detectTableFromFilename('reports_export_2026.json')).toBe('reports');
      expect(detectTableFromFilename('report_replies_backup.csv')).toBe('report_replies');
      expect(detectTableFromFilename('question_edits.csv')).toBe('question_edits');
      expect(detectTableFromFilename('learning_entries.csv')).toBe('learning_entries');
      expect(detectTableFromFilename('unknown_file.csv')).toBeNull();
    });
  });

  describe('importRecordsToD1', () => {
    it('performs dry run without invoking d1Batch', async () => {
      const { d1Batch } = await import('../../../server/d1-client.js');
      const records = [
        { user_id: 'u1', year: 2, xp: 100 },
        { user_id: 'u2', year: 3, xp: 200 },
      ];
      const result = await importRecordsToD1('learning_profiles', records, { dryRun: true });
      expect(result.inserted).toBe(2);
      expect(result.errors).toBe(0);
      expect(d1Batch).not.toHaveBeenCalled();
    });

    it('batches statements and calls d1Batch in chunks', async () => {
      const { d1Batch } = await import('../../../server/d1-client.js');
      const records = Array.from({ length: 5 }, (_, i) => ({
        user_id: `user_${i}`,
        year: 1,
        xp: i * 50,
      }));

      const result = await importRecordsToD1('learning_profiles', records, { batchSize: 2 });
      expect(result.inserted).toBe(5);
      expect(result.errors).toBe(0);
      expect(d1Batch).toHaveBeenCalledTimes(3); // 2 + 2 + 1
    });
  });
});
