import { verifyToken } from '@clerk/backend';
import { Redis as UpstashRedis } from '@upstash/redis';
import { Redis as ioredis } from 'ioredis';
import {mergeHistory,newerValue,SYNC_CAS_LUA} from '../shared/cloud-merge.js';
import { getSupabase } from '../server/supabase-client.js';
import LZString from 'lz-string';
const { compress, decompress } = LZString;

// Support Vercel KV variables, standard Upstash variables, or parse REDIS_URL directly
const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const redisUrl = process.env.REDIS_URL || '';

// Declare clients at module scope to avoid ReferenceError
let tcpClient: ioredis | null = null;
let restClient: UpstashRedis | null = null;

interface DbClient {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any, opts?: { EX?: number }) => Promise<any>;
  scanKeys: (pattern: string) => Promise<string[]>;
  del: (key: string) => Promise<void>;
}

let dbClient: DbClient;

if (redisUrl) {
  // Use standard TCP Redis client
  tcpClient = new ioredis(redisUrl);
  dbClient = {
    get: async (key: string) => {
      const val = await tcpClient!.get(key);
      if (!val) return null;
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    },
    set: async (key: string, value: any, opts?: { EX?: number }) => {
      const valStr = typeof value === 'string' ? value : JSON.stringify(value);
      if (opts?.EX) {
        await tcpClient!.set(key, valStr, 'EX', opts.EX);
      } else {
        await tcpClient!.set(key, valStr);
      }
    },
    scanKeys: async (pattern: string) => {
      const keys: string[] = [];
      let cursor = '0';
      do {
        const [nextCursor, batch] = await tcpClient!.scan(cursor, 'MATCH', pattern, 'COUNT', 500);
        cursor = nextCursor;
        keys.push(...batch);
      } while (cursor !== '0');
      return keys;
    },
    del: async (key: string) => {
      await tcpClient!.del(key);
    }
  };
} else if (kvUrl && kvToken) {
  // Use Upstash REST Redis client
  restClient = new UpstashRedis({ url: kvUrl, token: kvToken });
  dbClient = {
    get: async (key: string) => {
      return await restClient!.get(key);
    },
    set: async (key: string, value: any, opts?: { EX?: number }) => {
      if (opts?.EX) {
        await restClient!.set(key, value, { ex: opts.EX });
      } else {
        await restClient!.set(key, value);
      }
    },
    scanKeys: async (pattern: string) => {
      const keys: string[] = [];
      let cursor = 0;
      do {
        const result = await restClient!.scan(cursor, { match: pattern, count: 500 });
        cursor = Number(result[0]);
        keys.push(...(result[1] as string[]));
      } while (cursor !== 0);
      return keys;
    },
    del: async (key: string) => {
      await restClient!.del(key);
    }
  };
} else {
  // Fallback dummy client
  dbClient = {
    get: async () => null,
    set: async () => {},
    scanKeys: async () => [],
    del: async () => {}
  };
}

const TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

const setWithTTL = async (key: string, value: string) => {
  await dbClient.set(key, value, { EX: TTL_SECONDS });
};

// Compare-and-set the compressed legacy value: concurrent devices retry against
// the latest value rather than performing a read/merge/write that loses updates.
async function mergeAccountValue(key: string, incoming: unknown, history: boolean) {
  for (let attempt=0;attempt<12;attempt++) {
    const raw = await dbClient.get(key);
    const previous = typeof raw==='string' ? raw : raw==null ? '' : JSON.stringify(raw);
    const text = previous ? decompress(previous) : null;
    const current = text ? JSON.parse(text) : null;
    const value = history ? mergeHistory(incoming,current) : newerValue(current,incoming);
    const next = compress(JSON.stringify(value));
    const saved = tcpClient
      ? await tcpClient.eval(SYNC_CAS_LUA,1,key,previous,next)
      : await restClient!.eval(SYNC_CAS_LUA,[key],[previous,next]);
    if (Number(saved)===1) return;
  }
  throw new Error('Cloud data changed repeatedly. Please retry sync.');
}

export default async function handler(req: any, res: any) {
  // Set CORS / security headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store');

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
      const allowedParties = Array.from(new Set([
        'https://asu.codes',
        'https://www.asu.codes',
        'https://asu-medicine.vercel.app',
        ...(process.env.REPORT_ALLOWED_ORIGINS ? process.env.REPORT_ALLOWED_ORIGINS.split(',').map((s: string)=>s.trim()).filter(Boolean) : []),
        ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : [])
      ])).filter(Boolean);

      verified = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
        authorizedParties: allowedParties,
      });
    } catch (err: any) {
      return res.status(401).json({ error: 'Unauthorized: Clerk verification failed', details: err.message });
    }

    const userId = verified.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token claims' });
    }

    const supabase = getSupabase();
    if (!redisUrl && !(kvUrl && kvToken) && !supabase) return res.status(503).json({error:'Cloud sync storage is not configured.'});
    const keyPrefix = `asu_data:${userId}:`;

    const urlObj = new URL(req.url || '', 'http://localhost');
    const isYearOnly = req.query?.field === 'year' || req.query?.yearOnly === 'true' || urlObj.searchParams.get('field') === 'year' || urlObj.searchParams.get('yearOnly') === 'true';

    // 3. Handle GET Request
    if (req.method === 'GET') {
      if (supabase) {
        try {
          if (isYearOnly) {
            // High-efficiency year-only check: transfers ~30 bytes instead of 500KB JSON (99.99% egress reduction)
            const { data: row } = await supabase
              .from('user_progress')
              .select('academic_year')
              .eq('user_id', userId)
              .maybeSingle();

            let resolvedYear = row?.academic_year;
            if (!resolvedYear || resolvedYear === 1) {
              const { data: prof } = await supabase
                .from('learning_profiles')
                .select('year')
                .eq('user_id', userId)
                .maybeSingle();
              if (prof?.year) resolvedYear = prof.year;
            }

            const safeYear = Number.isInteger(resolvedYear) && resolvedYear! >= 1 && resolvedYear! <= 5 ? resolvedYear! : 1;
            const yearKey = `asu_preferences:${userId}:academic-year`;
            return res.status(200).json({
              year: safeYear,
              data: {
                [yearKey]: { year: safeYear, version: 1, timestamp: Date.now() },
                asu_portal_year: safeYear,
              }
            });
          }

          const { data: row, error } = await supabase
            .from('user_progress')
            .select('data, academic_year')
            .eq('user_id', userId)
            .maybeSingle();

          if (!error && row) {
            const resultData = (typeof row.data === 'object' && row.data !== null) ? { ...(row.data as Record<string, unknown>) } : {};
            const yearKey = `asu_preferences:${userId}:academic-year`;

            // Detect accurate year: explicit preference or portal year takes precedence over default 1
            const explicitPref = (resultData[yearKey] as any)?.year;
            const portalYear = Number(resultData['asu_portal_year']);
            let resolvedYear = row.academic_year;

            if (Number.isInteger(explicitPref) && explicitPref >= 1 && explicitPref <= 5) {
              resolvedYear = explicitPref;
            } else if (Number.isInteger(portalYear) && portalYear >= 1 && portalYear <= 5) {
              resolvedYear = portalYear;
            }

            if (!resultData[yearKey] && resolvedYear) {
              resultData[yearKey] = { year: resolvedYear, version: 1, timestamp: Date.now() };
            }
            return res.status(200).json({ data: resultData });
          }

          if (!error && !row) {
            // New user without user_progress row yet; check learning_profiles as secondary
            const { data: prof } = await supabase
              .from('learning_profiles')
              .select('year')
              .eq('user_id', userId)
              .maybeSingle();

            const resultData: Record<string, unknown> = {};
            if (prof?.year) {
              const yearKey = `asu_preferences:${userId}:academic-year`;
              resultData[yearKey] = { year: prof.year, version: 1, timestamp: Date.now() };
            }
            return res.status(200).json({ data: resultData });
          }
        } catch (err) {
          console.warn('Supabase sync GET error, checking Redis fallback:', err);
        }
      }

      if (!redisUrl && (!kvUrl || !kvToken)) {
        return res.status(200).json({ data: {}, message: "Storage not configured yet" });
      }
      try {
        const keys = await dbClient.scanKeys(`${keyPrefix}*`);
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
        // Auto-seed Supabase in background if Supabase is active
        if (supabase && Object.keys(result).length > 0) {
          supabase.from('user_progress').upsert({
            user_id: userId,
            data: result,
            academic_year: (result[`asu_preferences:${userId}:academic-year`] as any)?.year || 1,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' }).then(() => {}, () => {});
        }
        return res.status(200).json({ data: result });
      } catch (err: unknown) {
        console.warn('Redis GET fallback failed, returning empty data:', err);
        return res.status(200).json({ data: {} });
      }
    }

    // 4. Handle POST Request
    if (req.method === 'POST') {
      if (!redisUrl && (!kvUrl || !kvToken) && !supabase) {
        return res.status(200).json({ success: true, message: "Storage not configured yet, skipped save" });
      }

      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e: any) {
          return res.status(400).json({ error: 'Bad Request: Malformed JSON body string', details: e.message });
        }
      }

      if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length === 0) {
        return res.status(400).json({ error: 'Bad Request: Missing or empty JSON body', bodyType: typeof body });
      }

      // Enforce 2MB limit on total body
      const bodyStr = JSON.stringify(body);
      if (bodyStr.length > 1024 * 1024 * 2) {
        return res.status(413).json({ error: 'Payload Too Large: Maximum size is 2MB' });
      }

      try {
        const yearKey = `asu_preferences:${userId}:academic-year`;
        const yearValue = body[yearKey];
        if (yearValue !== undefined && yearValue !== null && (
          typeof yearValue !== 'object' || yearValue.version !== 1 ||
          !Number.isInteger(yearValue.year) || yearValue.year < 1 || yearValue.year > 5 ||
          !Number.isFinite(yearValue.timestamp)
        )) return res.status(400).json({ error: 'Invalid academic year preference.' });

        // 1. Save to Supabase (Single row, O(1), no SCAN, 500 MB capacity)
        if (supabase) {
          try {
            const { data: existingRow } = await supabase
              .from('user_progress')
              .select('data, academic_year')
              .eq('user_id', userId)
              .maybeSingle();
            const current = (existingRow?.data as Record<string, unknown>) || {};
            const next = { ...current };

            for (const [key, val] of Object.entries(body)) {
              if (val === null) {
                delete next[key];
              } else if (key === 'endocrine_essay_quiz_history' || key.startsWith(`asu_quiz_session:${userId}:`)) {
                next[key] = mergeHistory(current[key], val, key === 'endocrine_essay_quiz_history');
              } else {
                next[key] = val;
              }
            }

            // Resolve accurate academic year:
            // 1. Explicit preference sent in payload
            // 2. Portal year sent in payload
            // 3. Existing academic year if > 1
            // 4. Stored preference in next/current
            // 5. Stored year in learning_profiles
            let year = existingRow?.academic_year;
            if (body[yearKey]?.year) {
              year = body[yearKey].year;
            } else if (body['asu_portal_year'] && Number.isInteger(Number(body['asu_portal_year']))) {
              year = Number(body['asu_portal_year']);
            } else if (!year || year === 1) {
              const prefInNext = (next[yearKey] as any)?.year;
              const portalInNext = Number(next['asu_portal_year']);
              if (Number.isInteger(prefInNext) && prefInNext >= 1 && prefInNext <= 5) {
                year = prefInNext;
              } else if (Number.isInteger(portalInNext) && portalInNext >= 1 && portalInNext <= 5) {
                year = portalInNext;
              } else {
                const { data: prof } = await supabase
                  .from('learning_profiles')
                  .select('year')
                  .eq('user_id', userId)
                  .maybeSingle();
                if (prof?.year && prof.year >= 1 && prof.year <= 5) {
                  year = prof.year;
                } else {
                  year = existingRow?.academic_year || 1;
                }
              }
            }

            if (body[yearKey]?.year) {
              // Synchronize year with learning_profiles table without resetting XP
              const { data: existingProf } = await supabase
                .from('learning_profiles')
                .select('user_id')
                .eq('user_id', userId)
                .maybeSingle();

              if (existingProf) {
                await supabase.from('learning_profiles').update({
                  year,
                  updated_at: new Date().toISOString(),
                }).eq('user_id', userId);
              } else {
                await supabase.from('learning_profiles').insert({
                  user_id: userId,
                  year,
                  xp: 0,
                  competitive_xp: 0,
                  level: 1,
                  streak: 0,
                  best_streak: 0,
                  alias: 'Student',
                  opt_in: false,
                  banner: 'default',
                  title: 'student',
                  updated_at: new Date().toISOString(),
                });
              }
            }

            // TOAST & Disk IO Guard: Skip heavy PostgreSQL write if data and year haven't changed
            const isIdentical = existingRow &&
              existingRow.academic_year === year &&
              JSON.stringify(existingRow.data || {}) === JSON.stringify(next);

            if (!isIdentical) {
              const { error: upsertErr } = await supabase.from('user_progress').upsert({
                user_id: userId,
                data: next,
                academic_year: year,
                updated_at: new Date().toISOString(),
              }, { onConflict: 'user_id' });

              if (upsertErr) {
                console.error('Supabase user_progress upsert error:', upsertErr);
                throw new Error(upsertErr.message);
              }
            }
          } catch (err: any) {
            console.error('Supabase sync POST error:', err);
            if (!redisUrl && (!kvUrl || !kvToken)) {
              return res.status(500).json({ error: 'Failed to save to cloud storage.', details: err?.message || String(err) });
            }
          }
        }

        // 2. Only write to Redis if Supabase is not configured (prevents Upstash bandwidth exhaustion when Supabase is primary)
        if (!supabase && (redisUrl || (kvUrl && kvToken))) {
          try {
            for (const [strippedKey, value] of Object.entries(body)) {
              if (strippedKey.startsWith('asu_preferences:') && strippedKey !== `asu_preferences:${userId}:shuffle` && strippedKey !== yearKey) continue;
              if (strippedKey.startsWith('asu_study_tracker:') && !strippedKey.startsWith(`asu_study_tracker:${userId}:`)) continue;
              if (strippedKey.startsWith('asu_quiz_session:') && !strippedKey.startsWith(`asu_quiz_session:${userId}:`)) continue;
              const fullKey = `${keyPrefix}${strippedKey}`;
              if (value === null) {
                await dbClient.del(fullKey);
                continue;
              }
              if (strippedKey==='endocrine_essay_quiz_history' || strippedKey.startsWith(`asu_quiz_session:${userId}:`)) {
                await mergeAccountValue(fullKey,value,strippedKey==='endocrine_essay_quiz_history');
                continue;
              }
              const compressed = compress(JSON.stringify(value));
              if (compressed) {
                if (strippedKey === `asu_preferences:${userId}:shuffle` || strippedKey === yearKey || strippedKey.startsWith(`asu_study_tracker:${userId}:`)) await dbClient.set(fullKey, compressed);
                else await setWithTTL(fullKey, compressed);
              }
            }
          } catch (err) {
            // Ignore Redis mirror failure if Supabase succeeded
            if (!supabase) throw err;
          }
        }

        return res.status(200).json({ success: true });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Sync POST error:', err);
        return res.status(500).json({ error: 'Failed to store data', details: msg });
      }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: 'Please try again later.' });
  }
}