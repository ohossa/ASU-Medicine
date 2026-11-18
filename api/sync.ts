import { verifyToken } from '@clerk/backend';
import { Redis as UpstashRedis } from '@upstash/redis';
import { Redis as ioredis } from 'ioredis';
import { mergeHistory, newerValue, SYNC_CAS_LUA } from '../shared/cloud-merge.js';
import { getR2Client, getR2Json, putR2Json } from '../server/r2-client.js';
import { d1QueryFirst, d1Execute, isD1Configured } from '../server/d1-client.js';
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
  for (let attempt = 0; attempt < 12; attempt++) {
    const raw = await dbClient.get(key);
    const previous = typeof raw === 'string' ? raw : raw == null ? '' : JSON.stringify(raw);
    const text = previous ? decompress(previous) : null;
    const current = text ? JSON.parse(text) : null;
    const value = history ? mergeHistory(incoming, current) : newerValue(current, incoming);
    const next = compress(JSON.stringify(value));
    const saved = tcpClient
      ? await tcpClient.eval(SYNC_CAS_LUA, 1, key, previous, next)
      : await restClient!.eval(SYNC_CAS_LUA, [key], [previous, next]);
    if (Number(saved) === 1) return;
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
        ...(process.env.REPORT_ALLOWED_ORIGINS ? process.env.REPORT_ALLOWED_ORIGINS.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
        ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : [])
      ])).filter(Boolean);

      verified = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY || 'test_clerk_secret_key',
        authorizedParties: allowedParties,
      });
    } catch (err: any) {
      if (!process.env.CLERK_SECRET_KEY && process.env.NODE_ENV !== 'test') {
        const parts = token.split('.');
        if (parts.length === 3) {
          try {
            verified = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          } catch {}
        }
      }
      if (!verified?.sub) {
        return res.status(401).json({ error: 'Unauthorized: Clerk verification failed', details: err.message });
      }
    }

    const userId = verified.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token claims' });
    }

    const hasR2 = !!getR2Client();
    const hasD1 = isD1Configured();
    const supabase = getSupabase();
    const hasRedis = !!(redisUrl || (kvUrl && kvToken));

    if (!hasR2 && !hasD1 && !supabase && !hasRedis) {
      return res.status(503).json({ error: 'Cloud sync storage is not configured.' });
    }

    const keyPrefix = `asu_data:${userId}:`;
    const userR2Key = `users/${userId}/progress.json`;
    const yearKey = `asu_preferences:${userId}:academic-year`;

    const urlObj = new URL(req.url || '', 'http://localhost');
    const isYearOnly = req.query?.field === 'year' || req.query?.yearOnly === 'true' || urlObj.searchParams.get('field') === 'year' || urlObj.searchParams.get('yearOnly') === 'true';

    // 3. Handle GET Request
    if (req.method === 'GET') {
      const getStartTime = Date.now();

      // --- Cloudflare R2 GET Path (Zero Egress) ---
      if (hasR2) {
        try {
          const clientEtag = req.headers['if-none-match'];

          if (isYearOnly) {
            let resolvedYear: number | undefined;

            if (hasD1) {
              try {
                const prof = await d1QueryFirst<{ year: number }>('SELECT year FROM learning_profiles WHERE user_id = ?', [userId]);
                if (prof?.year) resolvedYear = prof.year;
              } catch {}
            }

            if (!resolvedYear) {
              const r2Res = await getR2Json<Record<string, any>>(userR2Key);
              const data = r2Res?.data || {};
              const explicitPref = data[yearKey]?.year;
              const portalYear = Number(data['asu_portal_year']);
              if (Number.isInteger(explicitPref) && explicitPref >= 1 && explicitPref <= 5) {
                resolvedYear = explicitPref;
              } else if (Number.isInteger(portalYear) && portalYear >= 1 && portalYear <= 5) {
                resolvedYear = portalYear;
              }
            }

            const safeYear = Number.isInteger(resolvedYear) && resolvedYear! >= 1 && resolvedYear! <= 5 ? resolvedYear! : 1;
            res.setHeader('Server-Timing', `r2;dur=${Date.now() - getStartTime}`);
            return res.status(200).json({
              year: safeYear,
              data: {
                [yearKey]: { year: safeYear, version: 1, timestamp: Date.now() },
                asu_portal_year: safeYear,
              }
            });
          }

          const r2Res = await getR2Json<Record<string, unknown>>(userR2Key, clientEtag);

          if (r2Res.notModified) {
            if (r2Res.etag) res.setHeader('ETag', r2Res.etag);
            res.setHeader('Server-Timing', `r2-etag;dur=${Date.now() - getStartTime}`);
            return res.status(304).end();
          }

          if (r2Res.data) {
            if (r2Res.etag) res.setHeader('ETag', r2Res.etag);
            const resultData = { ...r2Res.data };

            const explicitPref = (resultData[yearKey] as any)?.year;
            const portalYear = Number(resultData['asu_portal_year']);
            let resolvedYear: number | undefined;

            if (Number.isInteger(explicitPref) && explicitPref >= 1 && explicitPref <= 5) {
              resolvedYear = explicitPref;
            } else if (Number.isInteger(portalYear) && portalYear >= 1 && portalYear <= 5) {
              resolvedYear = portalYear;
            }

            if (!resultData[yearKey] && resolvedYear) {
              resultData[yearKey] = { year: resolvedYear, version: 1, timestamp: Date.now() };
            }
            res.setHeader('Server-Timing', `r2;dur=${Date.now() - getStartTime}`);
            return res.status(200).json({ data: resultData });
          }
        } catch (err) {
          console.warn('Cloudflare R2 sync GET error, attempting fallbacks:', err);
        }
      }

      // --- Supabase Fallback Path (if R2 did not return or is not primary) ---
      if (supabase) {
        try {
          if (isYearOnly) {
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
            res.setHeader('Server-Timing', `db;dur=${Date.now() - getStartTime}`);
            return res.status(200).json({
              year: safeYear,
              data: {
                [yearKey]: { year: safeYear, version: 1, timestamp: Date.now() },
                asu_portal_year: safeYear,
              }
            });
          }

          const clientEtag = req.headers['if-none-match'];
          if (clientEtag) {
            const { data: meta } = await supabase
              .from('user_progress')
              .select('updated_at')
              .eq('user_id', userId)
              .maybeSingle();

            const serverEtag = `W/"${meta?.updated_at || '0'}"`;
            const cleanClient = clientEtag.replace(/^W\//, '');
            const cleanServer = serverEtag.replace(/^W\//, '');
            if (meta && cleanClient === cleanServer) {
              res.setHeader('ETag', serverEtag);
              res.setHeader('Server-Timing', `etag;dur=${Date.now() - getStartTime}`);
              return res.status(304).end();
            }
          }

          const { data: row, error } = await supabase
            .from('user_progress')
            .select('data, academic_year, updated_at')
            .eq('user_id', userId)
            .maybeSingle();

          if (!error && row) {
            const etag = `W/"${row.updated_at || '0'}"`;
            res.setHeader('ETag', etag);
            if (clientEtag && clientEtag.replace(/^W\//, '') === etag.replace(/^W\//, '')) {
              res.setHeader('Server-Timing', `db;dur=${Date.now() - getStartTime}`);
              return res.status(304).end();
            }

            const resultData = (typeof row.data === 'object' && row.data !== null) ? { ...(row.data as Record<string, unknown>) } : {};
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
            res.setHeader('Server-Timing', `db;dur=${Date.now() - getStartTime}`);
            return res.status(200).json({ data: resultData });
          }

          if (!error && !row) {
            const { data: prof } = await supabase
              .from('learning_profiles')
              .select('year')
              .eq('user_id', userId)
              .maybeSingle();

            const resultData: Record<string, unknown> = {};
            if (prof?.year) {
              resultData[yearKey] = { year: prof.year, version: 1, timestamp: Date.now() };
            }
            res.setHeader('Server-Timing', `db;dur=${Date.now() - getStartTime}`);
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
        return res.status(200).json({ data: result });
      } catch (err: unknown) {
        console.warn('Redis GET fallback failed, returning empty data:', err);
        return res.status(200).json({ data: {} });
      }
    }

    // 4. Handle POST Request
    if (req.method === 'POST') {
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
        const yearValue = body[yearKey];
        if (yearValue !== undefined && yearValue !== null && (
          typeof yearValue !== 'object' || yearValue.version !== 1 ||
          !Number.isInteger(yearValue.year) || yearValue.year < 1 || yearValue.year > 5 ||
          !Number.isFinite(yearValue.timestamp)
        )) return res.status(400).json({ error: 'Invalid academic year preference.' });

        let resolvedYear: number | undefined;
        if (body[yearKey]?.year) {
          resolvedYear = body[yearKey].year;
        } else if (body['asu_portal_year'] && Number.isInteger(Number(body['asu_portal_year']))) {
          resolvedYear = Number(body['asu_portal_year']);
        }

        // --- 1. Cloudflare R2 Primary Storage (Zero Egress, High Performance) ---
        let r2SaveSucceeded = false;
        if (hasR2) {
          try {
            const existingRes = await getR2Json<Record<string, unknown>>(userR2Key);
            const current = existingRes?.data || {};
            const next: Record<string, unknown> = { ...current };

            for (const [key, val] of Object.entries(body)) {
              if (val === null) {
                delete next[key];
              } else if (key === 'endocrine_essay_quiz_history' || key.startsWith(`asu_quiz_session:${userId}:`)) {
                next[key] = mergeHistory(current[key], val, key === 'endocrine_essay_quiz_history');
              } else {
                next[key] = val;
              }
            }

            if (!resolvedYear || resolvedYear === 1) {
              const prefInNext = (next[yearKey] as any)?.year;
              const portalInNext = Number(next['asu_portal_year']);
              if (Number.isInteger(prefInNext) && prefInNext >= 1 && prefInNext <= 5) {
                resolvedYear = prefInNext;
              } else if (Number.isInteger(portalInNext) && portalInNext >= 1 && portalInNext <= 5) {
                resolvedYear = portalInNext;
              }
            }

            if (resolvedYear) {
              next['asu_portal_year'] = resolvedYear;
              if (!next[yearKey]) {
                next[yearKey] = { year: resolvedYear, version: 1, timestamp: Date.now() };
              }
            }

            const putRes = await putR2Json(userR2Key, next);
            if (putRes?.etag) {
              res.setHeader('ETag', putRes.etag);
            }
            r2SaveSucceeded = true;
          } catch (r2Err) {
            console.error('R2 sync POST error:', r2Err);
            if (!hasD1 && !supabase && !hasRedis) {
              return res.status(500).json({ error: 'Failed to save to Cloudflare R2 storage.', details: String(r2Err) });
            }
          }
        }

        // --- 2. Cloudflare D1 Academic Year & Learning Profile Sync ---
        if (hasD1 && resolvedYear) {
          try {
            await d1Execute(
              `INSERT INTO learning_profiles (user_id, year, xp, competitive_xp, level, streak, best_streak, alias, opt_in, banner, title, updated_at)
               VALUES (?, ?, 0, 0, 1, 0, 0, 'Student', 0, 'default', 'student', CURRENT_TIMESTAMP)
               ON CONFLICT(user_id) DO UPDATE SET year = excluded.year, updated_at = CURRENT_TIMESTAMP`,
              [userId, resolvedYear]
            );
          } catch (d1Err) {
            console.warn('D1 profile year sync warning:', d1Err);
          }
        }

        // --- 3. Optional Supabase Persistence (Graceful Fallback / Dual-Write) ---
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

            let sbYear = existingRow?.academic_year;
            if (resolvedYear) {
              sbYear = resolvedYear;
            } else if (!sbYear || sbYear === 1) {
              const prefInNext = (next[yearKey] as any)?.year;
              const portalInNext = Number(next['asu_portal_year']);
              if (Number.isInteger(prefInNext) && prefInNext >= 1 && prefInNext <= 5) {
                sbYear = prefInNext;
              } else if (Number.isInteger(portalInNext) && portalInNext >= 1 && portalInNext <= 5) {
                sbYear = portalInNext;
              }
            }

            if (resolvedYear) {
              const { data: existingProf } = await supabase
                .from('learning_profiles')
                .select('user_id')
                .eq('user_id', userId)
                .maybeSingle();

              if (existingProf) {
                await supabase.from('learning_profiles').update({
                  year: sbYear || 1,
                  updated_at: new Date().toISOString(),
                }).eq('user_id', userId);
              } else {
                await supabase.from('learning_profiles').insert({
                  user_id: userId,
                  year: sbYear || 1,
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

            const isIdentical = existingRow &&
              existingRow.academic_year === sbYear &&
              JSON.stringify(existingRow.data || {}) === JSON.stringify(next);

            if (!isIdentical) {
              await supabase.from('user_progress').upsert({
                user_id: userId,
                data: next,
                academic_year: sbYear || 1,
                updated_at: new Date().toISOString(),
              }, { onConflict: 'user_id' });
            }
          } catch (sbErr: any) {
            console.warn('Supabase sync POST failed (graceful degradation):', sbErr?.message || sbErr);
            if (!r2SaveSucceeded && !hasRedis) {
              return res.status(500).json({ error: 'Failed to save to cloud storage.', details: sbErr?.message || String(sbErr) });
            }
          }
        }

        // --- 4. Redis Fallback (Only if neither R2 nor Supabase active) ---
        if (!hasR2 && !supabase && hasRedis) {
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
              if (strippedKey === 'endocrine_essay_quiz_history' || strippedKey.startsWith(`asu_quiz_session:${userId}:`)) {
                await mergeAccountValue(fullKey, value, strippedKey === 'endocrine_essay_quiz_history');
                continue;
              }
              const compressed = compress(JSON.stringify(value));
              if (compressed) {
                if (strippedKey === `asu_preferences:${userId}:shuffle` || strippedKey === yearKey || strippedKey.startsWith(`asu_study_tracker:${userId}:`)) {
                  await dbClient.set(fullKey, compressed);
                } else {
                  await setWithTTL(fullKey, compressed);
                }
              }
            }
          } catch (redisErr) {
            throw redisErr;
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
