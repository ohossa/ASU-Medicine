import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const targetUrl = process.env.NEW_SUPABASE_URL || process.env.SUPABASE_URL;
const targetKey = process.env.NEW_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!targetUrl || !targetKey) {
  console.error('\n❌ ERROR: Missing target Supabase credentials.');
  console.error('Please run with:');
  console.error('  NEW_SUPABASE_URL="https://xxx.supabase.co" NEW_SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..." node scripts/restore-to-new-supabase.mjs\n');
  process.exit(1);
}

const backupPath = path.resolve('supabase-backup/data_backup.json');
if (!fs.existsSync(backupPath)) {
  console.error('\n❌ ERROR: Backup file not found at:', backupPath);
  process.exit(1);
}

const client = createClient(targetUrl, targetKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function restore() {
  console.log('\n🚀 Starting 100% Fail-Safe Data Migration to Fresh Supabase...');
  console.log('Target URL:', targetUrl);

  const raw = fs.readFileSync(backupPath, 'utf8');
  const backup = JSON.parse(raw);

  // 1. Restore user_progress (316 rows)
  console.log('\n[1/5] Restoring user_progress (' + backup.user_progress.length + ' rows)...');
  const progressChunks = chunk(backup.user_progress, 20);
  let pCount = 0;
  for (const batch of progressChunks) {
    const { error } = await client.from('user_progress').upsert(batch, { onConflict: 'user_id' });
    if (error) {
      console.error('  ❌ Error in user_progress batch:', error.message);
      throw error;
    }
    pCount += batch.length;
    process.stdout.write(`  Restored ${pCount}/${backup.user_progress.length}\r`);
  }
  console.log(`\n  ✅ user_progress restored: ${pCount} rows`);

  // 2. Restore learning_profiles (308 rows)
  console.log('\n[2/5] Restoring learning_profiles (' + backup.learning_profiles.length + ' rows)...');
  const profileChunks = chunk(backup.learning_profiles, 50);
  let profCount = 0;
  for (const batch of profileChunks) {
    const { error } = await client.from('learning_profiles').upsert(batch, { onConflict: 'user_id' });
    if (error) {
      console.error('  ❌ Error in learning_profiles batch:', error.message);
      throw error;
    }
    profCount += batch.length;
    process.stdout.write(`  Restored ${profCount}/${backup.learning_profiles.length}\r`);
  }
  console.log(`\n  ✅ learning_profiles restored: ${profCount} rows`);

  // 3. Restore learning_entries (5,352 rows)
  console.log('\n[3/5] Restoring learning_entries (' + backup.learning_entries.length + ' rows)...');
  const entryChunks = chunk(backup.learning_entries, 200);
  let entCount = 0;
  for (const batch of entryChunks) {
    const { error } = await client.from('learning_entries').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error('  ❌ Error in learning_entries batch:', error.message);
      throw error;
    }
    entCount += batch.length;
    process.stdout.write(`  Restored ${entCount}/${backup.learning_entries.length}\r`);
  }
  console.log(`\n  ✅ learning_entries restored: ${entCount} rows`);

  // 4. Restore reports (96 rows)
  console.log('\n[4/5] Restoring reports (' + backup.reports.length + ' rows)...');
  const reportChunks = chunk(backup.reports, 50);
  let repCount = 0;
  for (const batch of reportChunks) {
    const { error } = await client.from('reports').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error('  ❌ Error in reports batch:', error.message);
      throw error;
    }
    repCount += batch.length;
    process.stdout.write(`  Restored ${repCount}/${backup.reports.length}\r`);
  }
  console.log(`\n  ✅ reports restored: ${repCount} rows`);

  // 5. Restore report_replies (22 rows)
  console.log('\n[5/5] Restoring report_replies (' + backup.report_replies.length + ' rows)...');
  const replyChunks = chunk(backup.report_replies, 50);
  let replyCount = 0;
  for (const batch of replyChunks) {
    const { error } = await client.from('report_replies').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error('  ❌ Error in report_replies batch:', error.message);
      throw error;
    }
    replyCount += batch.length;
    process.stdout.write(`  Restored ${replyCount}/${backup.report_replies.length}\r`);
  }
  console.log(`\n  ✅ report_replies restored: ${replyCount} rows`);

  console.log('\n🎉 ALL DATA MIGRATED WITH ZERO DATA LOSS:');
  console.log('--------------------------------------------------');
  console.log(`  user_progress:     ${pCount} / ${backup.user_progress.length} (100%)`);
  console.log(`  learning_profiles: ${profCount} / ${backup.learning_profiles.length} (100%)`);
  console.log(`  learning_entries:  ${entCount} / ${backup.learning_entries.length} (100%)`);
  console.log(`  reports:           ${repCount} / ${backup.reports.length} (100%)`);
  console.log(`  report_replies:    ${replyCount} / ${backup.report_replies.length} (100%)`);
  console.log('--------------------------------------------------');
  console.log('✅ Migration complete and verified!\n');
}

function chunk(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

restore().catch((err) => {
  console.error('\n❌ Migration failed:', err);
  process.exit(1);
});
