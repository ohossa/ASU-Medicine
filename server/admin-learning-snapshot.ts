import { d1Transaction, isD1Configured } from "./d1-client.js";
import { getR2Json, putR2Json } from "./r2-client.js";

const KEY = "backups/operational/admin-learning-aggregates-v1.json";

export const ADMIN_LEARNING_QUERIES = [
  { sql: 'SELECT count(*) as total_attempts, sum(case when correct = 1 then 1 else 0 end) as total_correct FROM learning_entries' },
  { sql: 'SELECT user_id, count(*) as attempts, sum(case when correct = 1 then 1 else 0 end) as correct FROM learning_entries GROUP BY user_id' },
  { sql: 'SELECT user_id, module_code, count(*) as attempts, sum(case when correct = 1 then 1 else 0 end) as correct FROM learning_entries GROUP BY user_id, module_code' },
  { sql: 'SELECT module_code, count(*) as attempts, sum(case when correct = 1 then 1 else 0 end) as correct, count(distinct user_id) as unique_students FROM learning_entries GROUP BY module_code' },
  { sql: 'SELECT module_code, chapter_id, question_id, count(*) as attempts, sum(case when correct = 0 then 1 else 0 end) as failures FROM learning_entries GROUP BY module_code, chapter_id, question_id HAVING failures > 0 ORDER BY failures DESC LIMIT 50' },
  { sql: 'SELECT user_id, module_code, question_id, correct, created_at FROM learning_entries ORDER BY created_at DESC LIMIT 50' },
];

export async function refreshAdminLearningSnapshot() {
  if (!isD1Configured()) return null;

  const results = await d1Transaction(ADMIN_LEARNING_QUERIES);
  return publishAdminLearningSnapshot(results, new Date().toISOString());
}

export async function publishAdminLearningSnapshot(
  [overallKpis, studentTotals, studentBreakdowns, moduleAggs, topFailures, recentEvents]: unknown[][],
  generatedAt: string,
) {
  const snapshot = {
    generatedAt,
    overallKpis, studentTotals, studentBreakdowns, moduleAggs, topFailures, recentEvents,
  };
  await putR2Json(KEY, snapshot);
  return snapshot.generatedAt;
}

interface AdminLearningSnapshot {
  generatedAt: string;
  overallKpis: any[];
  studentTotals: any[];
  studentBreakdowns: any[];
  moduleAggs: any[];
  topFailures: any[];
  recentEvents: any[];
}

export async function readAdminLearningSnapshot() {
  const { data } = await getR2Json<AdminLearningSnapshot>(KEY);
  if (!data || !Number.isFinite(Date.parse(data.generatedAt)) ||
    ![data.overallKpis, data.studentTotals, data.studentBreakdowns, data.moduleAggs,
      data.topFailures, data.recentEvents].every(Array.isArray)) {
    throw new Error("Admin learning snapshot is unavailable.");
  }
  return data;
}
