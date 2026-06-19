import { verifyToken } from '@clerk/backend';
import { Redis as UpstashRedis } from '@upstash/redis';
import ioredis from 'ioredis';

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

const setWithTTL = async (key: string, value: unknown) => {
  if (redisUrl) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (tcpClient as any).set(key, typeof value === 'string' ? value : JSON.stringify(value), 'EX', 60 * 60 * 24 * 30);
  } else if (kvUrl && kvToken) {
    await restClient.set(key, value, { EX: 60 * 60 * 24 * 30 });
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

    const redisKey = `user_data:${userId}`;

    // 3. Handle GET Request
    if (req.method === 'GET') {
      if (!redisUrl && (!kvUrl || !kvToken)) {
        return res.status(200).json({ data: null, message: "Redis/KV not configured yet" });
      }
      const data = await dbClient.get(redisKey);
      return res.status(200).json({ data: data || null });
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

      await setWithTTL(redisKey, body);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message, stack: error.stack });
  }
}
