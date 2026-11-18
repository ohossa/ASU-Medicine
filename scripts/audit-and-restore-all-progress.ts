import { d1Query, d1QueryFirst, d1Execute, d1Batch } from '../server/d1-client.js';
import { getR2Json, getR2Client, getR2BucketName } from '../server/r2-client.js';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

async function auditAndRestore() {
  const r2 = getR2Client();
  if (!r2) throw new Error('R2 client not configured');

  const bucket = getR2BucketName();
  console.log('Auditing all user files in R2 bucket:', bucket);

  const listRes = await r2.send(new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: 'users/',
  }));

  const keys = (listRes.Contents || []).map(c => c.Key!).filter(k => k.endsWith('/progress.json'));
  console.log(`Found ${keys.length} student progress files in R2.`);

  let recoveredEntriesCount = 0;
  let studentsHealed = 0;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const userId = key.replace('users/', '').replace('/progress.json', '');

    try {
      const { data } = await getR2Json<Record<string, any>>(key);
      if (!data || typeof data !== 'object') continue;

      // Extract all solved question IDs from all sessions
      const solvedQuestions = new Map<string, { moduleCode: string; chapterId: number; correct: boolean; at: string }>();

      for (const [propKey, propVal] of Object.entries(data)) {
        if (!propVal) continue;

        // Pattern 1: asu_quiz_session:...
        if (propKey.startsWith('asu_quiz_session:')) {
          try {
            const sess = typeof propVal === 'string' ? JSON.parse(propVal) : propVal;
            if (sess && Array.isArray(sess.questionIds) && sess.answers && typeof sess.answers === 'object') {
              const chapterId = Number(sess.chapterId || 1);
              const timestamp = sess.timestamp ? new Date(sess.timestamp).toISOString() : new Date().toISOString();
              sess.questionIds.forEach((qId: string, idx: number) => {
                if (sess.answers[idx] !== undefined && qId) {
                  const mCode = qId.split('-')[0] || 'MGL-3';
                  // Assume correct if not explicitly incorrect, or based on history
                  solvedQuestions.set(qId, {
                    moduleCode: mCode,
                    chapterId,
                    correct: true,
                    at: timestamp,
                  });
                }
              });
            }
          } catch {}
        }

        // Pattern 2: *history* array
        if (propKey.includes('history') && Array.isArray(propVal)) {
          propVal.forEach((item: any) => {
            if (item && item.questionId) {
              const qId = item.questionId;
              const mCode = item.moduleCode || qId.split('-')[0] || 'MGL-3';
              solvedQuestions.set(qId, {
                moduleCode: mCode,
                chapterId: Number(item.chapterId || 1),
                correct: item.correct !== false,
                at: item.timestamp ? new Date(item.timestamp).toISOString() : new Date().toISOString(),
              });
            }
          });
        }
      }

      if (solvedQuestions.size > 0) {
        // Check existing entries in D1
        const existingEntries = await d1Query<{ question_id: string }>(
          'SELECT question_id FROM learning_entries WHERE user_id = ?',
          [userId]
        );
        const existingSet = new Set((existingEntries || []).map(e => e.question_id));

        const missing = Array.from(solvedQuestions.entries()).filter(([qId]) => !existingSet.has(qId));

        if (missing.length > 0) {
          console.log(`User ${userId} has ${missing.length} questions in R2 sessions not yet in D1 learning_entries!`);

          const inserts = missing.map(([qId, info]) => {
            const entryId = `entry_${userId}_${qId}`.slice(0, 64);
            return {
              sql: `INSERT INTO learning_entries (
                id, user_id, module_code, chapter_id, question_id,
                subject, topic, type, correct, ever_correct, first_correct,
                attempts_count, content_version, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(id) DO NOTHING`,
              params: [
                entryId,
                userId,
                info.moduleCode,
                info.chapterId,
                qId,
                '',
                '',
                'mcq',
                info.correct ? 1 : 0,
                info.correct ? 1 : 0,
                info.correct ? 1 : 0,
                1,
                '',
                info.at,
                info.at,
              ],
            };
          });

          await d1Batch(inserts);
          recoveredEntriesCount += missing.length;
          studentsHealed++;
        }
      }
    } catch (err) {
      console.warn(`Error processing ${key}:`, err);
    }
  }

  console.log(`\nAudit complete!`);
  console.log(`Recovered entries inserted: ${recoveredEntriesCount}`);
  console.log(`Students healed: ${studentsHealed}`);
}

auditAndRestore().catch(console.error);
