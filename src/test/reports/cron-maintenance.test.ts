import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import handler from '../../../api/cron-maintenance.js';

vi.mock('../../../server/report-store.js', () => ({
  evalRedis: vi.fn(),
}));

import { evalRedis } from '../../../server/report-store.js';

describe('api/cron-maintenance', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  function createMockRes() {
    const res: any = {
      headers: {},
      statusCode: 200,
      body: null,
      setHeader: vi.fn((k, v) => { res.headers[k] = v; }),
      status: vi.fn((code) => { res.statusCode = code; return res; }),
      json: vi.fn((data) => { res.body = data; return res; }),
    };
    return res;
  }

  it('rejects unauthenticated requests when CRON_SECRET is set', async () => {
    process.env.CRON_SECRET = 'super-secret-cron-token';
    const req: any = { headers: {} };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.body).toEqual({ error: 'Unauthorized: Invalid or missing cron secret' });
  });

  it('rejects invalid bearer tokens when CRON_SECRET is set', async () => {
    process.env.CRON_SECRET = 'super-secret-cron-token';
    const req: any = {
      headers: { authorization: 'Bearer wrong-token' },
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('executes maintenance when valid CRON_SECRET bearer token is provided', async () => {
    process.env.CRON_SECRET = 'super-secret-cron-token';
    const req: any = {
      headers: { authorization: 'Bearer super-secret-cron-token' },
    };
    const res = createMockRes();

    (evalRedis as any)
      .mockResolvedValueOnce('PONG')
      .mockResolvedValueOnce(3);

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.checks.redis.status).toBe('healthy');
    expect(res.body.checks.redis.prunedKeys).toBe(3);
    expect(res.body.checks.banksCatalog.status).toBe('verified');
    expect(res.body.checks.banksCatalog.totalBanks).toBe(42);
    expect(typeof res.body.durationMs).toBe('number');
  });

  it('handles Redis unavailability gracefully without failing the entire maintenance response', async () => {
    delete process.env.CRON_SECRET;
    const req: any = { headers: {} };
    const res = createMockRes();

    (evalRedis as any).mockRejectedValueOnce(new Error('Connection refused'));

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.checks.redis.status).toBe('unavailable');
    expect(res.body.checks.redis.message).toContain('Connection refused');
    expect(res.body.checks.banksCatalog.status).toBe('verified');
  });
});
