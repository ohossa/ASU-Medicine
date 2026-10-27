import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { evalRedis } from '../server/report-store.js';

interface Req {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface Res {
  setHeader: (n: string, v: string) => void;
  status: (n: number) => Res;
  json: (v: unknown) => unknown;
}

export default async function handler(req: Req, res: Res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // 1. Authenticate with CRON_SECRET
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    if (process.env.NODE_ENV !== 'test') {
      return res.status(500).json({ error: 'Server misconfigured: CRON_SECRET is not set' });
    }
  } else {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = typeof authHeader === 'string' ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';
    if (token !== cronSecret) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or missing cron secret' });
    }
  }

  const startTime = Date.now();
  const checks: Record<string, unknown> = {};

  // 2. Redis Connection & Stale Lock/Rate-Limit Cleanup
  try {
    const pingResult = await evalRedis("return redis.call('PING')", []);
    const prunedCount = await evalRedis(`
      local expired = 0
      local rateKeys = redis.call('KEYS', 'hint_rate:*')
      for _, k in ipairs(rateKeys) do
        local ttl = redis.call('TTL', k)
        if ttl == -1 then
          redis.call('EXPIRE', k, 3600)
          expired = expired + 1
        end
      end
      return expired
    `, []);

    checks.redis = {
      status: 'healthy',
      ping: pingResult,
      prunedKeys: Number(prunedCount) || 0,
    };
  } catch (err: unknown) {
    checks.redis = {
      status: 'unavailable',
      message: err instanceof Error ? err.message : String(err),
    };
  }

  // 3. Question Banks Catalog Verification
  try {
    const manifestPath = join(process.cwd(), 'src/app/generated/bankManifest.json');
    const raw = await readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(raw);
    const bankEntries = Object.entries(manifest as Record<string, { totalCount?: number; mcqCount?: number; essayCount?: number }>);
    let totalQuestions = 0;
    for (const [, bank] of bankEntries) {
      totalQuestions += (bank.totalCount ?? (bank.mcqCount ?? 0) + (bank.essayCount ?? 0));
    }

    checks.banksCatalog = {
      status: 'verified',
      totalBanks: bankEntries.length,
      totalQuestions,
    };
  } catch (err: unknown) {
    checks.banksCatalog = {
      status: 'degraded',
      message: err instanceof Error ? err.message : String(err),
    };
  }

  // 4. Return complete maintenance status
  const durationMs = Date.now() - startTime;
  return res.status(200).json({
    ok: true,
    timestamp: new Date().toISOString(),
    durationMs,
    checks,
  });
}
