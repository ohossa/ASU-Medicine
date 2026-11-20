import fs from 'fs';
import path from 'path';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  type GetObjectCommandOutput,
} from '@aws-sdk/client-s3';

function ensureEnvLoaded() {
  if (process.env.R2_SECRET_ACCESS_KEY && process.env.R2_ACCESS_KEY_ID) return;
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
const FALLBACK_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const FALLBACK_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const FALLBACK_BUCKET_NAME = 'a-plus-storage';

function getAccountId() {
  return process.env.R2_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || FALLBACK_ACCOUNT_ID;
}

function getAccessKeyId() {
  return process.env.R2_ACCESS_KEY_ID || process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || FALLBACK_ACCESS_KEY_ID;
}

function getSecretAccessKey() {
  return process.env.R2_SECRET_ACCESS_KEY || process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || FALLBACK_SECRET_ACCESS_KEY;
}

function getBucketName() {
  return process.env.R2_BUCKET_NAME || process.env.CLOUDFLARE_R2_BUCKET || FALLBACK_BUCKET_NAME;
}

let client: S3Client | null = null;

export function getR2BucketName(): string {
  return getBucketName();
}

export function getR2Client(): S3Client | null {
  if (process.env.NODE_ENV === 'test' && process.env.TEST_USE_R2 !== 'true') {
    return null;
  }
  const accId = getAccountId();
  const accKey = getAccessKeyId();
  const secKey = getSecretAccessKey();

  if (!client && accId && accKey && secKey) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${accId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accKey,
        secretAccessKey: secKey,
      },
    });
  }
  return client;
}

export interface R2GetResult<T = any> {
  data: T | null;
  etag?: string;
  notModified: boolean;
}

/**
 * Fetch a JSON object from Cloudflare R2 with automatic ETag support.
 * If clientEtag matches the R2 object ETag, returns { data: null, notModified: true }.
 */
export async function getR2Json<T = any>(
  key: string,
  clientEtag?: string
): Promise<R2GetResult<T>> {
  const r2 = getR2Client();
  if (!r2) {
    return { data: null, notModified: false };
  }

  try {
    const command = new GetObjectCommand({
      Bucket: getBucketName(),
      Key: key,
      IfNoneMatch: clientEtag || undefined,
    });

    const response: GetObjectCommandOutput = await r2.send(command);
    const etag = response.ETag;

    if (!response.Body) {
      return { data: null, etag, notModified: false };
    }

    const bodyString = await response.Body.transformToString();
    if (!bodyString) {
      return { data: null, etag, notModified: false };
    }

    try {
      const parsed = JSON.parse(bodyString);
      return { data: parsed, etag, notModified: false };
    } catch {
      return { data: bodyString as unknown as T, etag, notModified: false };
    }
  } catch (err: any) {
    // 304 Not Modified when ETag matches
    if (err?.$metadata?.httpStatusCode === 304 || err?.name === '304' || err?.name === 'NotModified') {
      return { data: null, etag: clientEtag, notModified: true };
    }
    // 404 Not Found if key does not exist yet
    if (err?.$metadata?.httpStatusCode === 404 || err?.name === 'NoSuchKey' || err?.Code === 'NoSuchKey') {
      return { data: null, notModified: false };
    }
    throw err;
  }
}

/**
 * Put a JSON object to Cloudflare R2 with zero egress fees.
 */
export async function putR2Json(
  key: string,
  data: any
): Promise<{ etag?: string }> {
  const r2 = getR2Client();
  if (!r2) {
    throw new Error('Cloudflare R2 client is not configured.');
  }

  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  const command = new PutObjectCommand({
    Bucket: getBucketName(),
    Key: key,
    Body: payload,
    ContentType: 'application/json',
  });

  const res = await r2.send(command);
  return { etag: res.ETag };
}

/**
 * Delete a key from Cloudflare R2.
 */
export async function deleteR2Key(key: string): Promise<void> {
  const r2 = getR2Client();
  if (!r2) return;

  const command = new DeleteObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });
  await r2.send(command);
}
