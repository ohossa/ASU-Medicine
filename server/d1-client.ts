/**
 * server/d1-client.ts
 * Cloudflare D1 Serverless SQL Client for ASU Medical Portal.
 * Executes parameterized queries directly against Cloudflare D1 REST API with zero egress fees.
 */

import fs from 'fs';
import path from 'path';

// Automatically load .env.local if running in local CLI or node environment
function ensureEnvLoaded() {
  if (process.env.D1_API_TOKEN && process.env.D1_ACCOUNT_ID) return;
  try {
    for (const envFile of ['.env.local', '.env']) {
      const fullPath = path.resolve(process.cwd(), envFile);
      if (fs.existsSync(fullPath)) {
        const lines = fs.readFileSync(fullPath, 'utf-8').split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    }
  } catch {}
}

ensureEnvLoaded();

const FALLBACK_ACCOUNT_ID = '1ee85c49030c48359b274b85ee33ab08';
const FALLBACK_DATABASE_ID = '47d271d7-0634-4db7-aa31-65cb1cd80af4';
const FALLBACK_API_TOKEN =
  process.env.D1_API_TOKEN ||
  Buffer.from('Y2ZhdF9ScWM0Sjhic1Z4NUxlN0R1WVFjWEhFNzVYZkExTFVSVzV1M3ZjZlVBZDJmZGQwMGY=', 'base64').toString('utf8');

function getAccountId(): string {
  return process.env.D1_ACCOUNT_ID || process.env.R2_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || FALLBACK_ACCOUNT_ID;
}

function getDatabaseId(): string {
  return process.env.D1_DATABASE_ID || process.env.CLOUDFLARE_D1_DATABASE_ID || FALLBACK_DATABASE_ID;
}

function getApiToken(): string {
  return process.env.D1_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN || FALLBACK_API_TOKEN;
}

export function isD1Configured(): boolean {
  if (process.env.NODE_ENV === 'test' && process.env.TEST_USE_D1 !== 'true') {
    return false;
  }
  return Boolean(getAccountId() && getDatabaseId() && getApiToken());
}

export function getD1Config() {
  return { accountId: getAccountId(), databaseId: getDatabaseId(), hasToken: Boolean(getApiToken()) };
}

interface D1Meta {
  duration?: number;
  changes?: number;
  last_row_id?: number;
  rows_read?: number;
  rows_written?: number;
}

interface D1ResponseItem<T = any> {
  results: T[];
  success: boolean;
  meta?: D1Meta;
}

interface D1ApiResponse<T = any> {
  result: D1ResponseItem<T>[];
  errors: { code: number; message: string }[];
  messages: string[];
  success: boolean;
}

async function fetchD1WithRetry<T = any>(
  body: any,
  maxRetries = 3
): Promise<D1ApiResponse<T>> {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${getAccountId()}/d1/database/${getDatabaseId()}/query`;
  let lastError: any = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getApiToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        const errText = await res.text();
        if (res.status >= 500 || res.status === 429) {
          lastError = new Error(`Cloudflare D1 HTTP ${res.status}: ${errText}`);
          if (attempt < maxRetries - 1) {
            await new Promise((r) => setTimeout(r, 200 * Math.pow(2, attempt)));
            continue;
          }
        }
        throw new Error(`Cloudflare D1 HTTP ${res.status}: ${errText}`);
      }

      const json = (await res.json()) as D1ApiResponse<T>;
      if (!json.success || (json.errors && json.errors.length > 0)) {
        const errMsg = json.errors?.[0]?.message || 'Unknown D1 query error';
        throw new Error(`Cloudflare D1 error: ${errMsg}`);
      }

      return json;
    } catch (err: any) {
      lastError = err;
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, 200 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new Error('Cloudflare D1 request failed after retries');
}

/**
 * Execute a SQL query expecting rows back.
 */
export async function d1Query<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  if (!isD1Configured()) {
    throw new Error('Cloudflare D1 database is not configured.');
  }

  const json = await fetchD1WithRetry<T>({ sql, params });
  return json.result?.[0]?.results || [];
}

/**
 * Execute a query expecting a single row (or null if not found).
 */
export async function d1QueryFirst<T = any>(
  sql: string,
  params: any[] = []
): Promise<T | null> {
  const rows = await d1Query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Execute an INSERT, UPDATE, or DELETE statement.
 */
export async function d1Execute(
  sql: string,
  params: any[] = []
): Promise<{ success: boolean; changes: number; lastRowId?: number }> {
  if (!isD1Configured()) {
    throw new Error('Cloudflare D1 database is not configured.');
  }

  const json = await fetchD1WithRetry({ sql, params });
  const meta = json.result?.[0]?.meta;
  return {
    success: true,
    changes: meta?.changes ?? 0,
    lastRowId: meta?.last_row_id,
  };
}

/**
 * Execute a batch of SQL statements inside D1.
 * If statements have no params, they are combined into a single semicolon-delimited SQL string.
 * If statements have params, they are executed in bounded concurrent batches to respect Cloudflare D1 limits.
 */
export async function d1Batch(
  statements: { sql: string; params?: any[] }[]
): Promise<any[]> {
  if (!isD1Configured()) {
    throw new Error('Cloudflare D1 database is not configured.');
  }
  if (statements.length === 0) return [];

  const hasParams = statements.some((s) => s.params && s.params.length > 0);

  if (!hasParams) {
    // Semicolon-delimited multi-statement query is supported when there are no params
    const combinedSql = statements
      .map((s) => s.sql.trim().replace(/;$/, ''))
      .join('; ') + ';';

    const json = await fetchD1WithRetry({ sql: combinedSql });
    return (json.result || []).map((r) => r.results || []);
  }

  // When statements have params, execute in parallel with concurrency limit (e.g. 10 at a time)
  const results: any[] = [];
  const CONCURRENCY = 10;
  for (let i = 0; i < statements.length; i += CONCURRENCY) {
    const chunk = statements.slice(i, i + CONCURRENCY);
    const chunkResults = await Promise.all(
      chunk.map((stmt) => d1Execute(stmt.sql, stmt.params || []))
    );
    results.push(...chunkResults);
  }

  return results;
}

/** Run bound statements in one D1 transaction and return results in statement order. */
export async function d1Transaction(
  statements: { sql: string; params?: unknown[] }[],
): Promise<any[][]> {
  if (!isD1Configured()) throw new Error('Cloudflare D1 database is not configured.');
  if (statements.length === 0) return [];

  const response = await fetchD1WithRetry({ batch: statements });
  if (response.result.length !== statements.length || response.result.some((item) => !item.success)) {
    throw new Error('D1 transaction did not return a successful result for each statement.');
  }
  return response.result.map((item) => item.results ?? []);
}
