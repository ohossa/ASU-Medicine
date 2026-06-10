import { verifyToken } from '@clerk/backend';
import { Redis } from '@upstash/redis';

export const config = {
  runtime: 'edge',
};

// Initialize Upstash Redis with Vercel KV environment variables
const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

export default async function handler(req: Request) {
  try {
    // 1. Authenticate with Clerk
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing token' }), { status: 401 });
    }

    const verified = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const userId = verified.sub;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), { status: 401 });
    }

    const redisKey = `user_data:${userId}`;

    // 2. Handle GET Request (Fetch Data)
    if (req.method === 'GET') {
      if (!process.env.KV_REST_API_URL) {
        return new Response(JSON.stringify({ data: null, message: "KV not configured yet" }), { status: 200 });
      }
      
      const data = await redis.get(redisKey);
      return new Response(JSON.stringify({ data: data || null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Handle POST Request (Save Data)
    if (req.method === 'POST') {
      if (!process.env.KV_REST_API_URL) {
        return new Response(JSON.stringify({ success: true, message: "KV not configured yet, skipped save" }), { status: 200 });
      }

      const body = await req.json();
      // Store the JSON payload
      await redis.set(redisKey, body);
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
