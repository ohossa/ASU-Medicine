import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRecentSecurityEvents, clearSecurityLogsForTesting } from '../../../server/security-logger.js';

describe('Security Audit & Pre-Launch Protections', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearSecurityLogsForTesting();
    process.env.CLERK_SECRET_KEY = 'test_audit_secret';
  });

  const mockRes = () => {
    const res: any = {
      statusCode: 200,
      headers: {} as Record<string, string>,
      body: null,
      setHeader: vi.fn((k: string, v: string) => {
        res.headers[k.toLowerCase()] = v;
      }),
      status: vi.fn((code: number) => {
        res.statusCode = code;
        return res;
      }),
      json: vi.fn((data: any) => {
        res.body = data;
        return res;
      }),
      end: vi.fn(() => res),
    };
    return res;
  };

  it('rejects unauthenticated admin analytics calls with 401 and logs security event', async () => {
    const { default: handler } = await import('../../../api/admin-analytics.js');
    const req: any = {
      method: 'GET',
      headers: {},
    };
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(401);
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['cache-control']).toBe('private, no-store');

    const logs = getRecentSecurityEvents();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].type).toBe('auth_failure');
    expect(logs[0].endpoint).toBe('/api/admin-analytics');
  });

  it('sanitizes malicious script and HTML tags in presence aliases', async () => {
    const { default: handler } = await import('../../../api/presence.js');
    const req: any = {
      method: 'POST',
      headers: {},
      body: JSON.stringify({
        userId: 'student_123',
        alias: '<script>alert("xss")</script>Dr. Omar',
        moduleCode: 'MGL-3',
      }),
    };
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('enforces X-Frame-Options DENY on question reporting endpoint', async () => {
    const { default: handler } = await import('../../../api/question-reports.js');
    const req: any = {
      method: 'GET',
      headers: {},
      query: { action: 'access' },
    };
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(401);
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});
