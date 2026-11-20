import { verifyOwner } from '../server/admin-analytics-service.js';
import { createCloudflareBackup, getBackupStatus } from '../server/cloudflare-backup-service.js';
import { getR2Json } from '../server/r2-client.js';

interface Req {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
  url?: string;
}

interface Res {
  setHeader: (n: string, v: string) => void;
  status: (n: number) => Res;
  json: (v: unknown) => unknown;
  send: (v: string | Buffer) => unknown;
}

export default async function handler(req: Req, res: Res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  // 1. Authenticate owner (omarhmaged@gmail.com) or cron secret
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = typeof authHeader === 'string' ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';

  const cronSecret = process.env.CRON_SECRET;
  const isCronAuth = cronSecret && token === cronSecret;

  if (!isCronAuth) {
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Missing owner token.' });
    }

    try {
      await verifyOwner(token);
    } catch (err: any) {
      const status = err?.status || 401;
      return res.status(status).json({ error: err.message || 'Unauthorized: Authentication failed.' });
    }
  }

  const urlObj = new URL(req.url || '', 'http://localhost');
  const action = req.query?.action || urlObj.searchParams.get('action') || 'status';

  // 2. Action: Download Latest Snapshot as JSON File
  if (action === 'download') {
    try {
      const latest = await getR2Json<any>('backups/latest.json');
      if (!latest?.data) {
        // If not in R2 yet, generate one on the fly
        const fresh = await createCloudflareBackup({ storeInR2: true });
        const jsonStr = JSON.stringify(fresh.snapshot, null, 2);
        const filename = `asu-portal-backup-${fresh.snapshot.metadata.timestamp.slice(0, 10)}.json`;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.send(jsonStr);
      }

      const jsonStr = JSON.stringify(latest.data, null, 2);
      const filename = `asu-portal-backup-${latest.data.metadata?.timestamp?.slice(0, 10) || 'latest'}.json`;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(jsonStr);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to generate download backup.', details: err.message });
    }
  }

  // 3. Action: Create Snapshot
  if (action === 'create' || req.method === 'POST') {
    try {
      const result = await createCloudflareBackup({ storeInR2: true });
      return res.status(200).json({
        ok: true,
        message: 'Point-in-time backup snapshot created and saved to Cloudflare R2 vault.',
        metadata: result.snapshot.metadata,
        r2Key: result.r2Key,
        durationMs: result.durationMs,
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to create backup snapshot.', details: err.message });
    }
  }

  // 4. Action: Status
  try {
    const status = await getBackupStatus();
    return res.status(200).json({
      ok: true,
      status,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve backup vault status.', details: err.message });
  }
}
