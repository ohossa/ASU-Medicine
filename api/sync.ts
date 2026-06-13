import { verifyToken } from '@clerk/backend';
import { Redis } from '@upstash/redis';

// Support both Vercel KV environment variables and standard Upstash Redis variables
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

export default async function handler(req: Request) {
  const securityHeaders = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };

  // Safe status check diagnostics endpoint
  if (req.url.includes('status=true') || req.url.includes('debug=true')) {
    return new Response(JSON.stringify({
      status: "ok",
      redisConfigured: !!redisUrl,
      clerkConfigured: !!process.env.CLERK_SECRET_KEY,
      detectedKeys: Object.keys(process.env).filter(k => k.includes('REDIS') || k.includes('KV') || k.includes('CLERK'))
    }), {
      status: 200,
      headers: securityHeaders
    });
  }

  try {
    // 1. Limit Payload Size (2MB)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 1024 * 1024 * 2) {
      return new Response(JSON.stringify({ error: 'Payload Too Large: Maximum size is 2MB' }), {
        status: 413,
        headers: securityHeaders
      });
    }

    // 2. Authenticate with Clerk
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing token' }), {
        status: 401,
        headers: securityHeaders
      });
    }

    const verified = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const userId = verified.sub;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        status: 401,
        headers: securityHeaders
      });
    }

    const redisKey = `user_data:${userId}`;

    // 3. Handle GET Request (Fetch Data)
    if (req.method === 'GET') {
      if (!redisUrl) {
        return new Response(JSON.stringify({ data: null, message: "Redis/KV not configured yet" }), {
          status: 200,
          headers: securityHeaders
        });
      }
      
      const data = await redis.get(redisKey);
      return new Response(JSON.stringify({ data: data || null }), {
        status: 200,
        headers: securityHeaders,
      });
    }

    // 4. Handle POST Request (Save Data)
    if (req.method === 'POST') {
      if (!redisUrl) {
        return new Response(JSON.stringify({ success: true, message: "Redis/KV not configured yet, skipped save" }), {
          status: 200,
          headers: securityHeaders
        });
      }

      let body: any;
      try {
        body = await req.json();
      } catch {
        return new Response(JSON.stringify({ error: 'Bad Request: Malformed JSON body' }), {
          status: 400,
          headers: securityHeaders
        });
      }

      // Store the JSON payload
      await redis.set(redisKey, body);
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: securityHeaders,
      });
    }

    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: securityHeaders
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: securityHeaders
    });
  }
}
