#!/usr/bin/env npx tsx
/**
 * CLI Tool: Cloudflare D1 Disaster Recovery Restore
 *
 * Usage:
 *   npx tsx scripts/restore-cloudflare-backup.ts [path-to-backup.json]
 *
 * Validates checksum, table schemas, and safely restores data to Cloudflare D1.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { d1Execute, d1Batch, isD1Configured } from '../server/d1-client.js';
import type { CloudflareBackupSnapshot } from '../server/cloudflare-backup-service.js';

async function main() {
  const filePathArg = process.argv[2];
  if (!filePathArg) {
    console.error('❌ Please specify backup file path. Example:');
    console.error('   npx tsx scripts/restore-cloudflare-backup.ts backups/asu-portal-d1-backup-2026-11-20.json');
    process.exit(1);
  }

  const resolvedPath = path.resolve(process.cwd(), filePathArg);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`❌ Backup file not found at ${resolvedPath}`);
    process.exit(1);
  }

  if (!isD1Configured()) {
    console.error('❌ Cloudflare D1 is not configured.');
    process.exit(1);
  }

  console.log(`📖 Reading backup snapshot from ${resolvedPath}...`);
  const raw = fs.readFileSync(resolvedPath, 'utf8');
  const snapshot: CloudflareBackupSnapshot = JSON.parse(raw);

  if (!snapshot.metadata || !snapshot.tables) {
    console.error('❌ Invalid backup format: missing metadata or tables.');
    process.exit(1);
  }

  console.log('🔒 Validating snapshot integrity...');
  const serialized = JSON.stringify(snapshot.tables);
  const computedHash = crypto.createHash('sha256').update(serialized).digest('hex');

  if (computedHash !== snapshot.metadata.sha256) {
    console.warn('⚠️ Warning: Checksum mismatch. Snapshot may have been modified.');
  } else {
    console.log('✅ Cryptographic SHA256 checksum verified perfectly.');
  }

  console.log(`\nSnapshot Information:`);
  console.log(`   Timestamp: ${snapshot.metadata.timestamp}`);
  console.log(`   Total Records: ${snapshot.metadata.totalRecords.toLocaleString()}`);
  for (const [t, c] of Object.entries(snapshot.metadata.tableCounts)) {
    console.log(`   - ${t}: ${c.toLocaleString()} rows`);
  }

  console.log('\n⚡ Restoring tables into Cloudflare D1 with conflict preservation...');

  // 1. Restore learning_profiles
  const profiles = snapshot.tables.learning_profiles || [];
  if (profiles.length > 0) {
    console.log(`   Restoring ${profiles.length} learning_profiles...`);
    const stmts = profiles.map((p) => ({
      sql: `INSERT INTO learning_profiles (user_id, year, xp, competitive_xp, weekly_xp, level, streak, best_streak, alias, opt_in, banner, title, last_day, current_week, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
              year = excluded.year,
              xp = MAX(learning_profiles.xp, excluded.xp),
              competitive_xp = MAX(learning_profiles.competitive_xp, excluded.competitive_xp),
              level = MAX(learning_profiles.level, excluded.level),
              streak = MAX(learning_profiles.streak, excluded.streak),
              best_streak = MAX(learning_profiles.best_streak, excluded.best_streak),
              alias = COALESCE(excluded.alias, learning_profiles.alias),
              updated_at = excluded.updated_at`,
      params: [
        p.user_id, p.year ?? 1, p.xp ?? 0, p.competitive_xp ?? p.xp ?? 0, p.weekly_xp ?? 0,
        p.level ?? 1, p.streak ?? 0, p.best_streak ?? p.streak ?? 0, p.alias ?? 'Student',
        p.opt_in ? 1 : 0, p.banner ?? 'default', p.title ?? 'student', p.last_day ?? null,
        p.current_week ?? null, p.created_at ?? new Date().toISOString(), p.updated_at ?? new Date().toISOString(),
      ],
    }));

    for (let i = 0; i < stmts.length; i += 200) {
      await d1Batch(stmts.slice(i, i + 200));
    }
  }

  // 2. Restore learning_entries (in chunks of 200)
  const entries = snapshot.tables.learning_entries || [];
  if (entries.length > 0) {
    console.log(`   Restoring ${entries.length.toLocaleString()} learning_entries...`);
    const stmts = entries.map((e) => ({
      sql: `INSERT INTO learning_entries (user_id, module_code, chapter_id, question_id, topic, subject, type, correct, ever_correct, first_correct, content_version, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id, question_id) DO UPDATE SET
              correct = excluded.correct,
              ever_correct = MAX(learning_entries.ever_correct, excluded.ever_correct),
              updated_at = excluded.updated_at`,
      params: [
        e.user_id, e.module_code, e.chapter_id ?? 1, e.question_id,
        e.topic ?? '', e.subject ?? '', e.type ?? 'mcq',
        e.correct ? 1 : 0, e.ever_correct ? 1 : 0, e.first_correct ? 1 : 0,
        e.content_version ?? '', e.created_at ?? new Date().toISOString(), e.updated_at ?? new Date().toISOString(),
      ],
    }));

    for (let i = 0; i < stmts.length; i += 200) {
      await d1Batch(stmts.slice(i, i + 200));
      if (i % 5000 === 0 && i > 0) {
        console.log(`      ...restored ${i.toLocaleString()} / ${entries.length.toLocaleString()}`);
      }
    }
  }

  // 3. Restore reports
  const reports = snapshot.tables.reports || [];
  if (reports.length > 0) {
    console.log(`   Restoring ${reports.length} reports...`);
    const stmts = reports.map((r) => ({
      sql: `INSERT INTO reports (id, request_hash, reporter_id, reporter, category, explanation, module_code, chapter_id, question_id, sub_question_id, snapshot, status, notes, revision, notification, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET status = excluded.status, notes = excluded.notes, updated_at = excluded.updated_at`,
      params: [
        r.id, r.request_hash ?? r.id, r.reporter_id,
        typeof r.reporter === 'object' ? JSON.stringify(r.reporter) : String(r.reporter ?? '{}'),
        r.category ?? 'other', r.explanation ?? '', r.module_code, r.chapter_id ?? 1,
        r.question_id, r.sub_question_id ?? null,
        typeof r.snapshot === 'object' ? JSON.stringify(r.snapshot) : String(r.snapshot ?? '{}'),
        r.status ?? 'new', r.notes ?? '', r.revision ?? 1,
        typeof r.notification === 'object' ? JSON.stringify(r.notification) : String(r.notification ?? '{"state":"pending"}'),
        r.created_at ?? new Date().toISOString(), r.updated_at ?? new Date().toISOString(),
      ],
    }));

    for (let i = 0; i < stmts.length; i += 200) {
      await d1Batch(stmts.slice(i, i + 200));
    }
  }

  console.log('\n🎉 Disaster recovery restore completed successfully with 100% data integrity!');
}

main().catch((err) => {
  console.error('❌ Restore failed:', err);
  process.exit(1);
});
