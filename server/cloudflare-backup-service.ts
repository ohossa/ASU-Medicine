import crypto from 'node:crypto';
import { d1Query, isD1Configured } from './d1-client.js';
import { getR2Client, getR2BucketName, putR2Json, getR2Json } from './r2-client.js';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

export const BACKUP_TABLES = [
  'learning_profiles',
  'learning_entries',
  'reports',
  'report_replies',
  'question_edits',
  'presence',
  'ai_hint_logs',
  'triage_assessments',
] as const;

export interface BackupMetadata {
  version: number;
  timestamp: string;
  source: string;
  totalTables: number;
  totalRecords: number;
  tableCounts: Record<string, number>;
  sha256: string;
  durationMs: number;
}

export interface CloudflareBackupSnapshot {
  metadata: BackupMetadata;
  tables: Record<string, any[]>;
}

export interface BackupStatus {
  isConfigured: boolean;
  totalLiveRecords: number;
  tableCounts: Record<string, number>;
  lastBackup?: {
    timestamp: string;
    totalRecords: number;
    key: string;
    sha256: string;
  };
  availableSnapshots: Array<{
    key: string;
    sizeBytes?: number;
    lastModified?: string;
  }>;
}

/**
 * Creates a comprehensive point-in-time backup snapshot of all Cloudflare D1 tables
 * and persists it to Cloudflare R2 backup vault.
 *
 * Uses chunked pagination (10,000 rows/page) to prevent D1 row limits and ensure
 * 100% complete data preservation without truncation.
 */
export async function createCloudflareBackup(options: { storeInR2?: boolean } = { storeInR2: true }): Promise<{
  snapshot: CloudflareBackupSnapshot;
  r2Key?: string;
  durationMs: number;
}> {
  const startTime = Date.now();
  if (!isD1Configured()) {
    throw new Error('Cloudflare D1 is not configured. Cannot perform backup.');
  }

  const tablesData: Record<string, any[]> = {};
  const tableCounts: Record<string, number> = {};
  let totalRecords = 0;
  const PAGE_SIZE = 10000;

  for (const tableName of BACKUP_TABLES) {
    let offset = 0;
    const rows: any[] = [];

    try {
      while (true) {
        const page = await d1Query<any>(
          `SELECT * FROM ${tableName} LIMIT ? OFFSET ?`,
          [PAGE_SIZE, offset]
        );

        if (!Array.isArray(page)) throw new Error("Invalid backup page.");
        if (page.length === 0) break;
        rows.push(...page);
        offset += page.length;
        if (page.length < PAGE_SIZE) break;
      }
    } catch (err) {
      throw new Error(`Backup failed while reading ${tableName}; the previous snapshot is still available.`, { cause: err });
    }

    tablesData[tableName] = rows;
    tableCounts[tableName] = rows.length;
    totalRecords += rows.length;
  }

  const durationMs = Date.now() - startTime;
  const timestamp = new Date().toISOString();

  // Compute cryptographic checksum over entire table dataset
  const serializedTables = JSON.stringify(tablesData);
  const sha256 = crypto.createHash('sha256').update(serializedTables).digest('hex');

  const metadata: BackupMetadata = {
    version: 1,
    timestamp,
    source: 'cloudflare-d1:a-plus-medical-portal',
    totalTables: Object.keys(tablesData).length,
    totalRecords,
    tableCounts,
    sha256,
    durationMs,
  };

  const snapshot: CloudflareBackupSnapshot = {
    metadata,
    tables: tablesData,
  };

  let r2Key: string | undefined;

  if (options.storeInR2) {
    if (!getR2Client()) throw new Error("R2 backup storage is not configured.");
    const dateStr = timestamp.slice(0, 10);
    const timeStr = timestamp.slice(11, 19).replace(/:/g, '-');
    r2Key = `backups/snapshots/snapshot-${dateStr}-${timeStr}.json`;
    const latestKey = 'backups/latest.json';

    // Publish latest only after the dated snapshot is durable.
    await putR2Json(r2Key, snapshot);
    await putR2Json(latestKey, snapshot);
  }

  return { snapshot, r2Key, durationMs };
}

/**
 * Retrieves the status of Cloudflare D1 and R2 backup vault.
 */
export async function getBackupStatus(): Promise<BackupStatus> {
  const isConfigured = isD1Configured();
  const tableCounts: Record<string, number> = {};
  let totalLiveRecords = 0;

  if (isConfigured) {
    for (const tableName of BACKUP_TABLES) {
      try {
        const res = await d1Query<any>(`SELECT count(*) as count FROM ${tableName}`);
        const count = Number(res?.[0]?.count || 0);
        tableCounts[tableName] = count;
        totalLiveRecords += count;
      } catch {
        tableCounts[tableName] = 0;
      }
    }
  }

  let lastBackup: BackupStatus['lastBackup'];
  const availableSnapshots: BackupStatus['availableSnapshots'] = [];

  const r2 = getR2Client();
  if (r2) {
    try {
      const latest = await getR2Json<CloudflareBackupSnapshot>('backups/latest.json');
      if (latest?.data?.metadata) {
        lastBackup = {
          timestamp: latest.data.metadata.timestamp,
          totalRecords: latest.data.metadata.totalRecords,
          key: 'backups/latest.json',
          sha256: latest.data.metadata.sha256,
        };
      }

      const listCmd = new ListObjectsV2Command({
        Bucket: getR2BucketName(),
        Prefix: 'backups/snapshots/',
        MaxKeys: 30,
      });

      const listRes = await r2.send(listCmd);
      if (Array.isArray(listRes.Contents)) {
        for (const item of listRes.Contents) {
          if (item.Key) {
            availableSnapshots.push({
              key: item.Key,
              sizeBytes: item.Size,
              lastModified: item.LastModified?.toISOString(),
            });
          }
        }
      }
      availableSnapshots.sort((a, b) => (b.key.localeCompare(a.key)));
    } catch (err) {
      console.warn('Backup: Failed to list R2 snapshots:', err);
    }
  }

  return {
    isConfigured,
    totalLiveRecords,
    tableCounts,
    lastBackup,
    availableSnapshots,
  };
}
