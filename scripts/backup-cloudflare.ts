#!/usr/bin/env npx tsx
/**
 * CLI Tool: Cloudflare D1 & R2 Complete Disaster Recovery Backup
 *
 * Usage:
 *   npx tsx scripts/backup-cloudflare.ts
 *
 * Saves a full timestamped JSON snapshot to ./backups/ and optionally syncs to R2.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createCloudflareBackup, getBackupStatus } from '../server/cloudflare-backup-service.js';

async function main() {
  console.log('🚀 Starting Cloudflare D1 & R2 Enterprise Backup...');
  const t0 = Date.now();

  const status = await getBackupStatus();
  console.log('📊 Current Live Records in D1:');
  for (const [table, count] of Object.entries(status.tableCounts)) {
    console.log(`   - ${table}: ${count.toLocaleString()} rows`);
  }
  console.log(`   TOTAL: ${status.totalLiveRecords.toLocaleString()} live records`);

  console.log('\n📦 Extracting full point-in-time snapshot with chunked pagination...');
  const { snapshot, r2Key, durationMs } = await createCloudflareBackup({ storeInR2: true });

  const backupDir = path.resolve(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const filename = `asu-portal-d1-backup-${snapshot.metadata.timestamp.slice(0, 10)}-${Date.now()}.json`;
  const filePath = path.join(backupDir, filename);

  fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), 'utf8');

  console.log(`\n✅ Backup successfully generated and verified!`);
  console.log(`   📁 Local File: ${filePath}`);
  console.log(`   ☁️ Cloudflare R2 Vault Key: ${r2Key || 'Saved locally only'}`);
  console.log(`   🔒 SHA256 Checksum: ${snapshot.metadata.sha256}`);
  console.log(`   ⏱️ Elapsed Time: ${(durationMs / 1000).toFixed(2)}s`);
  console.log(`   📑 Total Records Saved: ${snapshot.metadata.totalRecords.toLocaleString()}`);
}

main().catch((err) => {
  console.error('❌ Backup failed:', err);
  process.exit(1);
});
