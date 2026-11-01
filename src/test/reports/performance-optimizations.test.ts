import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  verifyToken: vi.fn(),
  supabase: null as any,
}));

vi.mock('@clerk/backend', () => ({
  verifyToken: mocks.verifyToken,
}));

vi.mock('../../../server/supabase-client', () => ({
  getSupabase: () => mocks.supabase,
}));

describe('Performance & Supabase Egress Optimizations', () => {
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

  it('Phase 1 ETag check returns 304 without querying data column when ETag matches', async () => {
    mocks.verifyToken.mockResolvedValue({ sub: 'user_perf_test' });

    const metadataSelectSpy = vi.fn(() => ({
      eq: vi.fn(() => ({
        maybeSingle: vi.fn(async () => ({
          data: { updated_at: '2026-11-01T12:00:00.000Z' },
          error: null,
        })),
      })),
    }));

    const dataSelectSpy = vi.fn();

    mocks.supabase = {
      from: vi.fn((table: string) => {
        if (table === 'user_progress') {
          return {
            select: vi.fn((cols: string) => {
              if (cols === 'updated_at') {
                return metadataSelectSpy();
              }
              dataSelectSpy(cols);
              return {
                eq: vi.fn(() => ({
                  maybeSingle: vi.fn(async () => ({ data: null, error: null })),
                })),
              };
            }),
          };
        }
        return {};
      }),
    };

    const { default: handler } = await import('../../../api/sync');
    const expectedEtag = '"2026-11-01T12:00:00.000Z"';
    const req: any = {
      method: 'GET',
      headers: {
        authorization: 'Bearer valid_token',
        'if-none-match': expectedEtag,
      },
    };
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(304);
    expect(res.headers['etag']).toBe('W/"2026-11-01T12:00:00.000Z"');
    expect(res.headers['server-timing']).toMatch(/etag;dur=\d+/);
    // CRITICAL: Ensure the large 'data' column was NEVER selected!
    expect(dataSelectSpy).not.toHaveBeenCalled();
    expect(metadataSelectSpy).toHaveBeenCalled();
  });

  it('Server-Timing headers are populated on successful sync requests', async () => {
    mocks.verifyToken.mockResolvedValue({ sub: 'user_perf_test_2' });

    mocks.supabase = {
      from: vi.fn((table: string) => {
        if (table === 'user_progress') {
          return {
            select: vi.fn((_cols?: string) => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(async () => ({
                  data: {
                    updated_at: '2026-11-01T14:00:00.000Z',
                    academic_year: 3,
                    data: { test_key: 1 },
                  },
                  error: null,
                })),
              })),
            })),
          };
        }
        return {};
      }),
    };

    const { default: handler } = await import('../../../api/sync');
    const req: any = {
      method: 'GET',
      headers: {
        authorization: 'Bearer valid_token',
        // No If-None-Match, full fetch
      },
    };
    const res = mockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.headers['server-timing']).toMatch(/db;dur=\d+/);
    expect(res.headers['etag']).toBe('W/"2026-11-01T14:00:00.000Z"');
  });
});
