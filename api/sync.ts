import { verifyToken } from '@clerk/backend';
import { Redis } from '@upstash/redis';

// Support Vercel KV variables, standard Upstash variables, or parse REDIS_URL directly
let redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
let redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

if (!redisUrl && process.env.REDIS_URL) {
  try {
    const rawUrl = process.env.REDIS_URL;
    if (rawUrl.startsWith('redis://') || rawUrl.startsWith('rediss://')) {
      const parsed = new URL(rawUrl);
      redisUrl = `https://${parsed.hostname}`;
      redisToken = parsed.password;
    } else if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      redisUrl = rawUrl;
    }
  } catch (e) {
    console.error("Failed to parse REDIS_URL:", e);
  }
}

const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

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
      redisConfigured: !!redisUrl,
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

    const verified = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const userId = verified.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const redisKey = `user_data:${userId}`;

    // 3. Handle GET Request
    if (req.method === 'GET') {
      if (!redisUrl) {
        return res.status(200).json({ data: null, message: "Redis/KV not configured yet" });
      }
      const data = await redis.get(redisKey);
      return res.status(200).json({ data: data || null });
    }

    // 4. Handle POST Request
    if (req.method === 'POST') {
      if (!redisUrl) {
        return res.status(200).json({ success: true, message: "Redis/KV not configured yet, skipped save" });
      }
      
      const body = req.body;
      if (!body) {
        return res.status(400).json({ error: 'Bad Request: Missing JSON body' });
      }

      await redis.set(redisKey, body);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
