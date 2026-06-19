import { verifyToken } from '@clerk/backend';
import { Redis as UpstashRedis } from '@upstash/redis';
import ioredis from 'ioredis';
import { compress, decompress } from 'lz-string';

// Support Vercel KV variables, standard Upstash variables, or parse REDIS_URL directly
const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const redisUrl = process.env.REDIS_URL || '';

// Initialize connection client dynamically
let dbClient: {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any) => Promise<any>;
};

if (redisUrl) {
  // Use standard TCP Redis client
  const tcpClient = new ioredis(redisUrl);
  dbClient = {
    get: async (key: string) => {
      const val = await tcpClient.get(key);
      if (!val) return null;
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    },
    set: async (key: string, value: any) => {
      const valStr = typeof value === 'string' ? value : JSON.stringify(value);
      await tcpClient.set(key, valStr);
    }
  };
} else if (kvUrl && kvToken) {
  // Use Upstash REST Redis client
  const restClient = new UpstashRedis({ url: kvUrl, token: kvToken });
  dbClient = {
    get: async (key: string) => {
      return await restClient.get(key);
    },
    set: async (key: string, value: any) => {
      await restClient.set(key, value);
    }
  };
} else {
  // Fallback dummy client
  dbClient = {
    get: async () => null,
    set: async () => {}
  };
}

const TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

const setWithTTL = async (key: string, value: string) => {
  if (redisUrl) {
    await (tcpClient as unknown as { set: (k: string, v: string, ex: string, ttl: number) => Promise<unknown> }).set(key, value, 'EX', TTL_SECONDS);
  } else if (kvUrl && kvToken) {
    await restClient.set(key, value, { EX: TTL_SECONDS });
  }
};

export default async function handler(req: any, res: any) {
  // Set CORS / security headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  // Diagnostic Status Check
  const url = req.url || '';
  if (url.includes('status=true') || url.includes('debug=true')) {
    return res.status(200).json({
      status: "ok",
      redisConfigured: !!redisUrl || (!!kvUrl && !!kvToken),
      clerkConfigured: !!process.env.CLERK_SECRET_KEY,
      detectedKeys: Object.keys(process.env).filter(k => k.includes('REDIS') || k.includes('KV') || k.includes('CLERK'))
    });
  }

  try {
    // 1. Limit Payload Size (2MB)
    const contentLength = req.headers['content-length'];
    if (contentLength && parseInt(contentLength, 10) > 1024 * 1024 * 2) {
      return res.status(413).json({ error: 'Payload Too Large: Maximum size is 2MB' });
    }

    // 2. Authenticate with Clerk
    const authHeader = req.headers['authorization'];
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    let verified;
    try {
      verified = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
    } catch (err: any) {
      return res.status(401).json({ error: 'Unauthorized: Clerk verification failed', details: err.message });
    }

    const userId = verified.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token claims' });
    }

    const keyPrefix = `asu_data:${userId}:`;

    // 3. Handle GET Request
    if (req.method === 'GET') {
      if (!redisUrl && (!kvUrl || !kvToken)) {
        return res.status(200).json({ data: null, message: "Redis/KV not configured yet" });
      }
      try {
        let keys: string[] = [];
        if (redisUrl) {
          keys = await (tcpClient as unknown as { keys: (pattern: string) => Promise<string[]> }).keys(`${keyPrefix}*`);
        } else {
          // Upstash does not support KEYS; fall back to a known set of keys from body
          // For Upstash, GET returns null unless we track keys separately — return null for safety
          return res.status(200).json({ data: null, message: "Redis/KV not configured for key enumeration" });
        }
        const result: Record<string, unknown> = {};
        for (const fullKey of keys) {
          const strippedKey = fullKey.slice(keyPrefix.length);
          const raw = await dbClient.get(fullKey);
          if (raw != null) {
            const decompressed = decompress(typeof raw === 'string' ? raw : JSON.stringify(raw));
            if (decompressed) {
              try {
                result[strippedKey] = JSON.parse(decompressed);
              } catch {
                result[strippedKey] = decompressed;
              }
            }
          }
        }
        return res.status(200).json({ data: result });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Redis GET error:', err);
        return res.status(500).json({ error: 'Failed to retrieve data', details: msg });
      }
    }

    // 4. Handle POST Request
    if (req.method === 'POST') {
      if (!redisUrl && (!kvUrl || !kvToken)) {
        return res.status(200).json({ success: true, message: "Redis/KV not configured yet, skipped save" });
      }

      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e: any) {
          return res.status(400).json({ error: 'Bad Request: Malformed JSON body string', details: e.message });
        }
      }

      if (!body || (typeof body === 'object' && Object.keys(body).length === 0)) {
        return res.status(400).json({ error: 'Bad Request: Missing or empty JSON body', bodyType: typeof body });
      }

      // Enforce 2MB limit on total body
      const bodyStr = JSON.stringify(body);
      if (bodyStr.length > 1024 * 1024 * 2) {
        return res.status(413).json({ error: 'Payload Too Large: Maximum size is 2MB' });
      }

      try {
        // Collect existing keys for this user
        let existingKeys: string[] = [];
        if (redisUrl) {
          existingKeys = await (tcpClient as unknown as { keys: (pattern: string) => Promise<string[]> }).keys(`${keyPrefix}*`);
        }

        const incomingKeys = Object.keys(body);

        // Delete keys that exist in Redis but are NOT in the incoming body
        for (const fullKey of existingKeys) {
          const strippedKey = fullKey.slice(keyPrefix.length);
          if (!incomingKeys.includes(strippedKey)) {
            if (redisUrl) {
              await tcpClient.del(fullKey);
            }
          }
        }

        // Upsert each incoming key with compression and 30-day TTL
        for (const [strippedKey, value] of Object.entries(body)) {
          const fullKey = `${keyPrefix}${strippedKey}`;
          const jsonStr = JSON.stringify(value);
          const compressed = compress(jsonStr);
          if (compressed) {
            await setWithTTL(fullKey, compressed);
          }
        }

        return res.status(200).json({ success: true });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Redis POST error:', err);
        return res.status(500).json({ error: 'Failed to store data', details: msg });
      }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message, stack: error.stack });
  }
}
