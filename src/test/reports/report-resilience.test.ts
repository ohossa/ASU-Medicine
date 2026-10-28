import { describe, it, expect, vi } from 'vitest';
import { resolveReportQuestion } from '../../../server/report-question';
import { reportStore } from '../../../server/report-store';
import { createReportService, ReportError, isReportError } from '../../../server/report-service';

describe('Question Reporting Resilience & Resolution Suite', () => {
  it('resolves MGL3-CH4-BIOC-0527 with correct medical answer and explanation', async () => {
    const snapshot = await resolveReportQuestion({
      moduleCode: 'MGL-3',
      chapterId: 204,
      questionId: 'MGL3-CH4-BIOC-0527',
      category: 'wrong_answer',
      explanation: 'its supposed to be unconjugated',
      requestId: 'test-uuid-1',
    });

    expect(snapshot.moduleCode).toBe('MGL-3');
    expect(snapshot.chapterId).toBe(204);
    expect(snapshot.question.id).toBe('MGL3-CH4-BIOC-0527');
    // Verify medical fix: correctIndex must be 1 ("Unconjugated bilirubin")
    expect(snapshot.question.correctIndex).toBe(1);
    expect(snapshot.question.options?.[1]).toBe('Unconjugated bilirubin');
    expect(snapshot.question.explanation).toContain('Unconjugated bilirubin');
  });

  it('resolves question across all chapters even if chapterId is mismatched (e.g. 4 instead of 204)', async () => {
    const snapshot = await resolveReportQuestion({
      moduleCode: 'MGL-3',
      chapterId: 4, // Intentionally wrong chapter (Biochemistry practice instead of CA-2)
      questionId: 'MGL3-CH4-BIOC-0527',
      category: 'wrong_answer',
      explanation: 'test fallback',
      requestId: 'test-uuid-2',
    });

    // Should find it in Chapter 204 through second-pass search
    expect(snapshot.chapterId).toBe(204);
    expect(snapshot.chapterTitle).toBe('CA-2 — Biochemistry');
    expect(snapshot.question.id).toBe('MGL3-CH4-BIOC-0527');
  });

  it('gracefully handles live edits failure without crashing report resolution', async () => {
    const failingGetEdits = vi.fn().mockRejectedValue(new Error('Redis connection refused'));

    const snapshot = await resolveReportQuestion(
      {
        moduleCode: 'MGL-3',
        chapterId: 204,
        questionId: 'MGL3-CH4-BIOC-0527',
        category: 'wrong_answer',
        explanation: 'test with redis down',
        requestId: 'test-uuid-3',
      },
      failingGetEdits,
    );

    expect(snapshot.question.id).toBe('MGL3-CH4-BIOC-0527');
    expect(failingGetEdits).toHaveBeenCalledWith('MGL-3');
  });

  it('detects ReportError instances and duck-typed status errors accurately', () => {
    const realError = new ReportError(404, 'Not found');
    expect(isReportError(realError)).toBe(true);
    expect(realError.status).toBe(404);

    const duckTyped = { status: 403, message: 'Forbidden', isReportError: true };
    expect(isReportError(duckTyped)).toBe(true);

    const genericError = new Error('Database connection failed');
    expect(isReportError(genericError)).toBe(false);
  });

  it('persists report to fallback store when Redis is unavailable, returning confirmation', async () => {
    const fallbackReport = {
      id: 'r_test_fallback_123456789012345678901234567890',
      requestHash: 'hash-abc',
      reporterId: 'user_123',
      category: 'wrong_answer' as const,
      explanation: 'its supposed to be unconjugated',
      snapshot: {
        moduleCode: 'MGL-3',
        chapterId: 204,
        chapterTitle: 'CA-2 — Biochemistry',
        subjectName: 'Biochemistry',
        version: 'ver-1',
        question: {
          id: 'MGL3-CH4-BIOC-0527',
          type: 'mcq' as const,
          lecture: 5,
          text: 'An increased rate of red blood cell destruction characteristically results in an elevation of which blood component?',
          subjectColor: 'biochem' as const,
          explanation: '',
        },
      },
      status: 'new' as const,
      notes: '',
      revision: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notification: { state: 'pending' as const },
    };

    const created = await reportStore.create(fallbackReport);
    expect(created.created).toBe(true);
    expect(created.report.id).toBe(fallbackReport.id);

    const retrieved = await reportStore.get(fallbackReport.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(fallbackReport.id);

    const list = await reportStore.list('all', 0, 10);
    expect(list.reports.some((r) => r.id === fallbackReport.id)).toBe(true);
  });

  it('completes report submission end-to-end even when Redis is down', async () => {
    const service = createReportService({
      authenticate: async () => ({
        id: 'user_student_1',
        reporter: { name: 'Student', username: 'student1', email: 'student@asu.codes', emailVerified: true },
        isAdmin: false,
      }),
      resolveQuestion: (input) => resolveReportQuestion(input),
      store: reportStore,
      sendEmail: async () => ({ state: 'pending' }),
    });

    const result = await service.submit('mock-jwt-token', {
      requestId: '00000000-0000-0000-0000-000000000001',
      moduleCode: 'MGL-3',
      chapterId: 204,
      questionId: 'MGL3-CH4-BIOC-0527',
      category: 'wrong_answer',
      explanation: 'its supposed to be unconjugated',
    });

    expect(result.saved).toBe(true);
    expect(typeof result.id).toBe('string');
    expect(result.id.startsWith('r_')).toBe(true);
  });

  it('retrieves recovered report r_dc185985f0cd0a26eb08483e566d837219cb0e4c for MGL3-CH5-PATH-0847 without 404', async () => {
    const reportId = 'r_dc185985f0cd0a26eb08483e566d837219cb0e4c';
    const report = await reportStore.get(reportId);

    expect(report).not.toBeNull();
    expect(report?.id).toBe(reportId);
    expect(report?.snapshot.question.id).toBe('MGL3-CH5-PATH-0847');
    expect(report?.snapshot.moduleCode).toBe('MGL-3');
    expect(report?.explanation).toBe('Bro this is micro');
    expect(report?.category).toBe('formatting');
    expect(report?.snapshot.question.correctIndex).toBe(3);
    expect(report?.snapshot.question.options?.[3]).toBe('HEV');
  });

  it('lists recovered report r_dc185985f0cd0a26eb08483e566d837219cb0e4c in admin portal inbox', async () => {
    const list = await reportStore.list('all', 0, 50);
    const found = list.reports.find((r) => r.id === 'r_dc185985f0cd0a26eb08483e566d837219cb0e4c');

    expect(found).toBeDefined();
    expect(found?.snapshot.question.id).toBe('MGL3-CH5-PATH-0847');
    expect(found?.status).toBe('new');
    expect(list.counts.new).toBeGreaterThanOrEqual(1);
  });
});
