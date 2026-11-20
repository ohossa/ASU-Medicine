/**
 * ASU Medical Portal — Supabase Data Ingestion CLI
 * 
 * Imports CSV or JSON exports from Supabase Table Editor directly into Cloudflare D1.
 * Supports:
 *  - learning_profiles (Student XP, Streaks, Leaderboard)
 *  - learning_entries (Question attempts and mastery)
 *  - reports (Question feedback, bug reports)
 *  - report_replies (Admin replies)
 *  - question_edits (Live module question modifications)
 *  - triage_assessments (AI triage cached judgments)
 *  - presence (Student presence)
 * 
 * Usage:
 *   npx tsx scripts/import-supabase-export.ts --file ./exports/learning_profiles.csv
 *   npx tsx scripts/import-supabase-export.ts --dir ./supabase-exports/
 *   npx tsx scripts/import-supabase-export.ts --file ./data.json --table reports --dry-run
 */

import fs from 'fs';
import path from 'path';
import { d1Batch, isD1Configured } from '../server/d1-client.js';

// Table schema column definitions & type coercion
const TABLE_COLUMNS: Record<string, string[]> = {
  learning_profiles: [
    'user_id', 'year', 'xp', 'competitive_xp', 'level', 'streak', 'best_streak',
    'last_day', 'alias', 'opt_in', 'banner', 'title', 'weekly_xp', 'current_week',
    'created_at', 'updated_at'
  ],
  learning_entries: [
    'id', 'user_id', 'module_code', 'chapter_id', 'question_id', 'subject', 'topic',
    'type', 'correct', 'ever_correct', 'first_correct', 'attempts_count',
    'content_version', 'created_at', 'updated_at'
  ],
  reports: [
    'id', 'request_hash', 'reporter_id', 'reporter', 'category', 'explanation',
    'module_code', 'chapter_id', 'question_id', 'sub_question_id', 'snapshot',
    'status', 'notes', 'revision', 'notification', 'created_at', 'updated_at'
  ],
  report_replies: [
    'id', 'report_id', 'subject', 'body', 'state', 'revision', 'created_by',
    'created_at', 'updated_at'
  ],
  question_edits: [
    'id', 'module_code', 'chapter_id', 'question_id', 'question_data', 'revision',
    'author_id', 'created_at', 'updated_at'
  ],
  presence: [
    'user_id', 'alias', 'module_code', 'last_seen'
  ],
  triage_assessments: [
    'fingerprint', 'assessment', 'priority', 'confidence', 'created_at', 'updated_at'
  ],
};

const INTEGER_COLUMNS = new Set([
  'year', 'xp', 'competitive_xp', 'level', 'streak', 'best_streak', 'weekly_xp',
  'opt_in', 'chapter_id', 'correct', 'ever_correct', 'first_correct', 'attempts_count',
  'revision'
]);

const FLOAT_COLUMNS = new Set(['confidence']);

/**
 * Robust CSV parser that correctly handles quoted cells, commas, and newlines.
 */
export function parseCsv(content: string): Array<Record<string, any>> {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuote = false;
  let i = 0;

  // Normalize CRLF to LF
  const text = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  while (i < text.length) {
    const char = text[i];

    if (char === '"') {
      if (insideQuote && text[i + 1] === '"') {
        // Escaped quote: ""
        currentCell += '"';
        i += 2;
        continue;
      }
      insideQuote = !insideQuote;
      i++;
      continue;
    }

    if (char === ',' && !insideQuote) {
      currentRow.push(currentCell.trim());
      currentCell = '';
      i++;
      continue;
    }

    if (char === '\n' && !insideQuote) {
      currentRow.push(currentCell.trim());
      if (currentRow.length > 0 && currentRow.some((c) => c !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
      i++;
      continue;
    }

    currentCell += char;
    i++;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c !== '')) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.replace(/^["']|["']$/g, '').trim());
  const data: Array<Record<string, any>> = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const record: Record<string, any> = {};
    for (let c = 0; c < headers.length; c++) {
      const header = headers[c];
      const val = row[c] ?? '';
      record[header] = val;
    }
    data.push(record);
  }

  return data;
}

/**
 * Coerce a raw string/unknown value to match Cloudflare D1 column types.
 */
export function coerceValue(column: string, val: any): any {
  if (val === null || val === undefined || val === '' || val === 'NULL' || val === 'null') {
    if (INTEGER_COLUMNS.has(column)) return 0;
    if (FLOAT_COLUMNS.has(column)) return 0.0;
    return null;
  }

  if (typeof val === 'boolean') {
    return val ? 1 : 0;
  }

  if (INTEGER_COLUMNS.has(column)) {
    if (typeof val === 'string') {
      const lower = val.toLowerCase().trim();
      if (lower === 'true' || lower === 't') return 1;
      if (lower === 'false' || lower === 'f') return 0;
    }
    const num = parseInt(String(val), 10);
    return isNaN(num) ? 0 : num;
  }

  if (FLOAT_COLUMNS.has(column)) {
    const num = parseFloat(String(val));
    return isNaN(num) ? 0.0 : num;
  }

  if (typeof val === 'object') {
    return JSON.stringify(val);
  }

  return String(val);
}

/**
 * Ingest records into a specific D1 table using batched INSERT OR REPLACE.
 */
export async function importRecordsToD1(
  table: string,
  records: Array<Record<string, any>>,
  options: { dryRun?: boolean; batchSize?: number } = {}
): Promise<{ inserted: number; errors: number }> {
  const allowedColumns = TABLE_COLUMNS[table];
  if (!allowedColumns) {
    throw new Error(`Unknown target table: "${table}". Supported tables: ${Object.keys(TABLE_COLUMNS).join(', ')}`);
  }

  const batchSize = options.batchSize || 50;
  let totalInserted = 0;
  let totalErrors = 0;

  console.log(`\n📦 Importing ${records.length} records into "${table}" (batch size: ${batchSize})...`);

  // Filter columns to only those present in the target schema
  const statements: Array<{ sql: string; params: any[] }> = [];

  for (const record of records) {
    const cols: string[] = [];
    const values: any[] = [];
    const placeholders: string[] = [];

    for (const col of allowedColumns) {
      if (col in record) {
        cols.push(col);
        placeholders.push('?');
        values.push(coerceValue(col, record[col]));
      }
    }

    if (cols.length === 0) continue;

    const sql = `INSERT OR REPLACE INTO ${table} (${cols.join(', ')}) VALUES (${placeholders.join(', ')})`;
    statements.push({ sql, params: values });
  }

  if (options.dryRun) {
    console.log(`🔍 [DRY RUN] Generated ${statements.length} valid SQL statements for table "${table}". No changes made.`);
    return { inserted: statements.length, errors: 0 };
  }

  // Execute in batches
  for (let i = 0; i < statements.length; i += batchSize) {
    const chunk = statements.slice(i, i + batchSize);
    try {
      await d1Batch(chunk);
      totalInserted += chunk.length;
      process.stdout.write(`  ↳ Processed ${totalInserted} / ${statements.length} rows...\r`);
    } catch (err: any) {
      console.error(`\n❌ Error executing batch [${i}..${i + chunk.length}]:`, err?.message || err);
      totalErrors += chunk.length;
    }
  }

  console.log(`\n✅ Completed "${table}": ${totalInserted} inserted/replaced, ${totalErrors} errors.`);
  return { inserted: totalInserted, errors: totalErrors };
}

/**
 * Auto-detect target table name from file basename.
 */
export function detectTableFromFilename(filename: string): string | null {
  const base = path.basename(filename, path.extname(filename)).toLowerCase();
  for (const table of Object.keys(TABLE_COLUMNS)) {
    if (base === table || base.includes(table)) {
      return table;
    }
  }
  return null;
}

/**
 * Process a single export file (CSV or JSON).
 */
export async function processFile(filePath: string, targetTable?: string, dryRun = false) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const ext = path.extname(filePath).toLowerCase();
  const table = targetTable || detectTableFromFilename(filePath);

  if (!table) {
    throw new Error(`Could not determine target table for file "${filePath}". Please specify --table.`);
  }

  console.log(`\n📄 Reading: ${filePath} -> Target table: [${table}]`);
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  let records: Array<Record<string, any>> = [];

  if (ext === '.csv') {
    records = parseCsv(rawContent);
  } else if (ext === '.json') {
    const parsed = JSON.parse(rawContent);
    records = Array.isArray(parsed) ? parsed : parsed.data || [];
  } else {
    throw new Error(`Unsupported file extension "${ext}". Supported: .csv, .json`);
  }

  return await importRecordsToD1(table, records, { dryRun });
}

// CLI Execution entrypoint
async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag: string) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
  };
  const hasFlag = (flag: string) => args.includes(flag);

  const filePath = getArg('--file');
  const dirPath = getArg('--dir');
  const tableName = getArg('--table');
  const dryRun = hasFlag('--dry-run');

  console.log('========================================================');
  console.log(' 🚀 ASU Medical Portal — Supabase to Cloudflare D1 Ingestion');
  console.log('========================================================');

  if (!dryRun) {
    if (!isD1Configured()) {
      console.error('❌ Cloudflare D1 environment variables are not configured in environment or .env.local!');
      process.exit(1);
    }
  }

  if (filePath) {
    await processFile(filePath, tableName || undefined, dryRun);
  } else if (dirPath) {
    if (!fs.existsSync(dirPath)) {
      console.error(`❌ Directory not found: ${dirPath}`);
      process.exit(1);
    }
    const files = fs.readdirSync(dirPath);
    let totalFiles = 0;
    for (const f of files) {
      const ext = path.extname(f).toLowerCase();
      if (ext === '.csv' || ext === '.json') {
        const fullPath = path.join(dirPath, f);
        try {
          await processFile(fullPath, undefined, dryRun);
          totalFiles++;
        } catch (err: any) {
          console.error(`⚠️ Skipping ${f}: ${err.message}`);
        }
      }
    }
    console.log(`\n🎉 Processed ${totalFiles} export files successfully.`);
  } else {
    console.log(`
Usage:
  npx tsx scripts/import-supabase-export.ts --file <path-to-file.csv|json> [--table <tableName>] [--dry-run]
  npx tsx scripts/import-supabase-export.ts --dir <path-to-exports-dir> [--dry-run]

Supported Tables:
  ${Object.keys(TABLE_COLUMNS).map((t) => `• ${t}`).join('\n  ')}
`);
  }
}

// Only run main if invoked directly
if (process.argv[1]?.endsWith('import-supabase-export.ts')) {
  main().catch((err) => {
    console.error('Fatal CLI Error:', err);
    process.exit(1);
  });
}
