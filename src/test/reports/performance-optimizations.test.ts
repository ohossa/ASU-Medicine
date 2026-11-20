import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  verifyToken: vi.fn(),
  r2Client: { send: vi.fn() },
  getR2Json: vi.fn(),
  putR2Json: vi.fn(),
}));

vi.mock('@clerk/backend', () => ({
  verifyToken: mocks.verifyToken,
}));

vi.mock('../../../server/r2-client.js', () => ({
  getR2Client: () => mocks.r2Client,
  getR2Json: mocks.getR2Json,
  putR2Json: mocks.putR2Json,
  getR2BucketName: () => 'a-plus-storage',
}));

describe('Performance & Cloudflare R2 Zero-Egress Optimizations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CLERK_SECRET_KEY = 'test_secret_perf';
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

  it('Phase 1 ETag check returns 304 without querying data payload when ETag matches', async () => {
    mocks.verifyToken.mockResolvedValue({ sub: 'user_perf_test' });

    mocks.getR2Json.mockResolvedValue({
      data: null,
      etag: '"2026-11-01T12:00:00.000Z"',
      notModified: true,
    });

    const { default: handler } = await import('../../../api/sync');

    const req: any = {
      method: 'GET',
      url: '/api/sync',
      headers: {
        authorization: 'Bearer valid_token',
        'if-none-match': '"2026-11-01T12:00:00.000Z"',
      },
    };

    const res = mockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(304);
    expect(res.headers['etag']).toBe('"2026-11-01T12:00:00.000Z"');
    expect(res.headers['server-timing']).toMatch(/r2-etag;dur=\d+/);
  });

  it('Server-Timing headers are populated on successful sync requests', async () => {
    mocks.verifyToken.mockResolvedValue({ sub: 'user_perf_test' });

    mocks.getR2Json.mockResolvedValue({
      data: { theme: 'dark' },
      etag: '"2026-11-01T14:00:00.000Z"',
      notModified: false,
    });

    const { default: handler } = await import('../../../api/sync');

    const req: any = {
      method: 'GET',
      url: '/api/sync',
      headers: {
        authorization: 'Bearer valid_token',
      },
    };

    const res = mockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.headers['server-timing']).toMatch(/r2;dur=\d+/);
    expect(res.headers['etag']).toBe('"2026-11-01T14:00:00.000Z"');
  });
});
