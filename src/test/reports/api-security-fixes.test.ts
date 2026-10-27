import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import syncHandler from '../../../api/sync.js';
import cronHandler from '../../../api/cron-maintenance.js';
import presenceHandler from '../../../api/presence.js';
import hintHandler from '../../../api/hint.js';
import { verifyOwner } from '../../../server/admin-analytics-service.js';
import { verifyToken } from '@clerk/backend';

vi.mock('@clerk/backend', () => ({
  verifyToken: vi.fn(),
  createClerkClient: vi.fn(() => ({
    users: {
      getUser: vi.fn(),
      getUserList: vi.fn().mockResolvedValue({ data: [] }),
    },
  })),
}));

vi.mock('../../../server/report-store.js', () => ({
  evalRedis: vi.fn().mockResolvedValue('PONG'),
}));

vi.mock('../../../server/presence-service.js', () => ({
  recordPresence: vi.fn().mockImplementation(async () => {
    return 1;
  }),
  getOnlineUsers: vi.fn().mockResolvedValue({
    onlineCount: 1,
    windowMinutes: 5,
    users: [],
  }),
}));

import { recordPresence } from '../../../server/presence-service.js';

describe('API Security Fixes Verification', () => {
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

  describe('api/sync.ts security', () => {
    it('does not leak environment variables via ?status=true without auth', async () => {
      const req: any = {
        url: '/api/sync?status=true',
        headers: {},
      };
      const res = createMockRes();

      await syncHandler(req, res);

      // Must require auth and reject missing token with 401
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.body.detectedKeys).toBeUndefined();
    });

    it('does not reflect arbitrary client Origin into Clerk authorizedParties', async () => {
      process.env.CLERK_SECRET_KEY = 'test_secret_key';
      (verifyToken as any).mockResolvedValueOnce({ sub: 'user_123' });

      const req: any = {
        url: '/api/sync',
        headers: {
          authorization: 'Bearer valid_token',
          origin: 'https://malicious-site.example.com',
        },
      };
      const res = createMockRes();

      await syncHandler(req, res);

      expect(verifyToken).toHaveBeenCalledTimes(1);
      const callOptions = (verifyToken as any).mock.calls[0][1];
      expect(callOptions.authorizedParties).not.toContain('https://malicious-site.example.com');
      expect(callOptions.authorizedParties).toContain('https://asu.codes');
    });
  });

  describe('api/cron-maintenance.ts security', () => {
    it('fails closed when CRON_SECRET is missing in non-test mode', async () => {
      delete process.env.CRON_SECRET;
      (process.env as any).NODE_ENV = 'production';

      const req: any = { headers: {} };
      const res = createMockRes();

      await cronHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.body.error).toContain('CRON_SECRET is not set');
    });

    it('rejects unauthenticated requests with 401 when CRON_SECRET is configured', async () => {
      process.env.CRON_SECRET = 'active-cron-key';
      const req: any = { headers: {} };
      const res = createMockRes();

      await cronHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.body.error).toContain('Invalid or missing cron secret');
    });
  });

  describe('api/presence.ts security', () => {
    it('sanitizes malicious or oversized userId payloads to prevent key flooding', async () => {
      const req: any = {
        method: 'POST',
        headers: {},
        body: {
          userId: 'bad/user/id/with/special/chars/$$$///&&&',
          alias: 'Attacker',
        },
      };
      const res = createMockRes();

      await presenceHandler(req, res);

      expect(recordPresence).toHaveBeenCalledTimes(1);
      const calledArg = (recordPresence as any).mock.calls[0][0];
      // Special characters must be sanitized to fallback 'anonymous'
      expect(calledArg.userId).toBe('anonymous');
    });

    it('accepts valid alphanumeric user IDs', async () => {
      const req: any = {
        method: 'POST',
        headers: {},
        body: {
          userId: 'user_2abcDEF-123',
          alias: 'Legitimate Student',
        },
      };
      const res = createMockRes();

      await presenceHandler(req, res);

      expect(recordPresence).toHaveBeenCalledTimes(1);
      const calledArg = (recordPresence as any).mock.calls[0][0];
      expect(calledArg.userId).toBe('user_2abcDEF-123');
      expect(calledArg.alias).toBe('Legitimate Student');
    });
  });

  describe('server/admin-analytics-service.ts security', () => {
    it('fails closed if CLERK_SECRET_KEY is missing in non-test mode', async () => {
      delete process.env.CLERK_SECRET_KEY;
      (process.env as any).NODE_ENV = 'production';

      await expect(verifyOwner('some_token')).rejects.toThrow(
        'Server misconfigured: CLERK_SECRET_KEY is required.'
      );
    });

    it('does not verify tokens with fallback_test_key', async () => {
      process.env.CLERK_SECRET_KEY = 'real_server_secret';
      (verifyToken as any).mockRejectedValueOnce(new Error('Invalid signature'));

      await expect(verifyOwner('forged_token')).rejects.toThrow(
        'Your session has expired. Please sign in again.'
      );

      const callOptions = (verifyToken as any).mock.calls[0][1];
      expect(callOptions.secretKey).toBe('real_server_secret');
      expect(callOptions.secretKey).not.toBe('fallback_test_key');
    });
  });

  describe('api/hint.ts security', () => {
    it('fails closed with 500 when CLERK_SECRET_KEY is absent in non-test environments', async () => {
      delete process.env.CLERK_SECRET_KEY;
      (process.env as any).NODE_ENV = 'production';
      (process.env as any).VERCEL_ENV = 'preview';

      const req: any = {
        method: 'POST',
        headers: {},
        body: { questionText: 'What is heme breakdown?', previousAttempts: 2 },
      };
      const res = createMockRes();

      await hintHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.body.error).toContain('CLERK_SECRET_KEY is not set');
    });
  });
});
