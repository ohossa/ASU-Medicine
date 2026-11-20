import fs from 'fs';
import path from 'path';
import { d1Execute, d1Query } from '../server/d1-client.js';

function sqlLiteral(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? '1' : '0';
  const str = String(val).replace(/'/g, "''");
  return `'${str}'`;
}

async function fastMigrateEntries() {
  console.log('================================================================');
  console.log('⚡ High-Performance Multi-Row Ingestion: 59,146 Entries -> D1');
  console.log('================================================================');

  const rawPath = path.resolve(process.cwd(), 'supabase-backup/raw_live_entries.json');
  if (!fs.existsSync(rawPath)) {
    throw new Error(`File not found: ${rawPath}`);
  }

  const entries: any[] = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
  console.log(`Loaded ${entries.length} question attempts from local disk archive.`);

  // Check how many are currently in D1
  const existingCount = await d1Query<{ count: number }>('SELECT count(*) as count FROM learning_entries');
  console.log(`Currently in D1: ${existingCount[0].count} entries.`);

  const ROWS_PER_QUERY = 50; // 50 rows per single SQL statement (0 parameters)
  const CONCURRENCY = 6;     // 6 parallel queries to balance speed & Cloudflare stability

  const queries: string[] = [];

  for (let i = 0; i < entries.length; i += ROWS_PER_QUERY) {
    const chunk = entries.slice(i, i + ROWS_PER_QUERY);
    const rowStrings = chunk.map((e) => {
      return `(
        ${sqlLiteral(e.id)},
        ${sqlLiteral(e.user_id)},
        ${sqlLiteral(e.module_code)},
        ${e.chapter_id || 1},
        ${sqlLiteral(e.question_id)},
        ${sqlLiteral(e.subject || '')},
        ${sqlLiteral(e.topic || '')},
        ${sqlLiteral(e.type || 'mcq')},
        ${e.correct ? 1 : 0},
        ${e.ever_correct ? 1 : 0},
        ${e.first_correct ? 1 : 0},
        ${e.attempts_count || 1},
        ${sqlLiteral(e.content_version || '')},
        ${sqlLiteral(e.created_at || new Date().toISOString())},
        ${sqlLiteral(e.updated_at || new Date().toISOString())}
      )`;
    });

    const sql = `INSERT INTO learning_entries (
      id, user_id, module_code, chapter_id, question_id, subject, topic,
      type, correct, ever_correct, first_correct, attempts_count,
      content_version, created_at, updated_at
    ) VALUES ${rowStrings.join(', ')}
    ON CONFLICT(id) DO UPDATE SET
      correct = excluded.correct,
      ever_correct = excluded.ever_correct,
      first_correct = excluded.first_correct,
      attempts_count = excluded.attempts_count,
      content_version = excluded.content_version,
      updated_at = excluded.updated_at`;

    queries.push(sql);
  }

  console.log(`Prepared ${queries.length} multi-row queries (${ROWS_PER_QUERY} rows each).`);
  console.log(`Ingesting with concurrency pool of ${CONCURRENCY}...\n`);

  let executed = 0;
  let rowsInserted = 0;
  const startTime = Date.now();

  for (let i = 0; i < queries.length; i += CONCURRENCY) {
    const batch = queries.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (sql) => {
        await d1Execute(sql, []);
      })
    );
    executed += batch.length;
    rowsInserted = Math.min(executed * ROWS_PER_QUERY, entries.length);

    if (executed % 20 === 0 || executed === queries.length) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const pct = ((rowsInserted / entries.length) * 100).toFixed(1);
      process.stdout.write(`  ↳ [${pct}%] ${rowsInserted} / ${entries.length} entries transferred (${elapsed}s elapsed)...\r`);
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\n✅ Transferred all ${entries.length} entries in ${totalTime}s!`);

  // Final D1 verification audit
  const finalCounts = await Promise.all([
    d1Query<{ count: number }>('SELECT count(*) as count FROM learning_profiles'),
    d1Query<{ count: number }>('SELECT count(*) as count FROM learning_entries'),
    d1Query<{ count: number }>('SELECT count(*) as count FROM reports'),
    d1Query<{ count: number }>('SELECT count(*) as count FROM report_replies'),
    d1Query<any>('SELECT user_id, alias, xp, level, streak FROM learning_profiles ORDER BY xp DESC LIMIT 10'),
    d1Query<any>('SELECT * FROM learning_profiles WHERE user_id = ?', ['user_3F58BCV7wXpNBuZ2jkfQNVrl5Jj']),
  ]);

  console.log('\n================================================================');
  console.log('🏆 FINAL PRODUCTION CLOUDFLARE D1 AUDIT');
  console.log('================================================================');
  console.log(`  • Learning Profiles: ${finalCounts[0][0].count}`);
  console.log(`  • Learning Entries:  ${finalCounts[1][0].count}`);
  console.log(`  • Reports:           ${finalCounts[2][0].count}`);
  console.log(`  • Report Replies:    ${finalCounts[3][0].count}`);

  console.log('\n📊 Top 10 Student Leaderboard:');
  finalCounts[4].forEach((p: any, idx: number) => {
    console.log(`  ${idx + 1}. [Level ${p.level}] ${p.alias || 'Student'} (${p.user_id}): ${Number(p.xp).toLocaleString()} XP (Streak: ${p.streak})`);
  });

  const o = finalCounts[5]?.[0];
  if (o) {
    console.log(`\n👤 Omar Profile: Level ${o.level}, ${Number(o.xp).toLocaleString()} XP, Streak ${o.streak}, Year ${o.year}, Alias "${o.alias}"`);
  }

  console.log('\n🎉 ALL LIVE STUDENT DATA SUCCESSFULLY RESTORED TO CLOUDFLARE!\n');
}

fastMigrateEntries().catch((err) => {
  console.error('\n❌ Fast migration failed:', err);
  process.exit(1);
});
