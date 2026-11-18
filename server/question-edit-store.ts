import { createHash } from 'node:crypto';
import { evalRedis } from './report-store.js';
import { ReportError } from './report-service.js';
import type { EditStore, QuestionEdit } from './question-edit-service.js';
import { d1Query, d1QueryFirst, d1Execute, isD1Configured } from './d1-client.js';

const prefix = 'asu_question_edits:v1:';

export const SAVE_EDIT_LUA = `local old=redis.call('HGET',KEYS[1],ARGV[1]);local revision=0;if old then revision=cjson.decode(old).revision end;if revision~=tonumber(ARGV[2]) then return {409,''} end;local r=cjson.decode(ARGV[3]);r.revision=revision+1;local raw=cjson.encode(r);redis.call('HSET',KEYS[1],ARGV[1],raw);redis.call('LPUSH',KEYS[2],raw);redis.call('SADD',KEYS[3],r.moduleCode);return {200,raw}`;

function decode(raw: string): QuestionEdit {
  const entry = JSON.parse(raw);
  entry.question = typeof entry.question === 'string' ? JSON.parse(entry.question) : entry.question;
  return entry;
}

function rowToEdit(row: any): QuestionEdit {
  const data = typeof row.question_data === 'string' ? JSON.parse(row.question_data) : (row.question_data || {});
  const question = typeof data.question === 'string' ? JSON.parse(data.question) : (data.question || {});
  return {
    moduleCode: row.module_code,
    chapterId: Number(row.chapter_id),
    questionId: String(row.question_id),
    revision: Number(row.revision),
    baseVersion: data.baseVersion || '',
    question,
    updatedBy: row.author_id || 'owner',
    updatedAt: row.updated_at || new Date().toISOString(),
    subjectId: data.subjectId,
    deleted: Boolean(data.deleted),
    targetChapterId: data.targetChapterId !== undefined ? Number(data.targetChapterId) : undefined,
    targetSubjectId: data.targetSubjectId !== undefined ? String(data.targetSubjectId) : undefined,
  };
}

// In-memory fallback cache to guarantee zero downtime and test isolation
const inMemoryEdits = new Map<string, Map<string, QuestionEdit>>();
const inMemoryHistory = new Map<string, QuestionEdit[]>();

function editId(moduleCode: string, chapterId: number, questionId: string): string {
  return createHash('sha256').update(`${moduleCode}:${chapterId}:${questionId}`).digest('hex');
}

export const editStore: EditStore = {
  async list(moduleCode: string): Promise<QuestionEdit[]> {
    if (isD1Configured()) {
      try {
        const data = await d1Query<any>(
          'SELECT * FROM question_edits WHERE module_code = ?',
          [moduleCode]
        );
        if (Array.isArray(data)) {
          return data.map(rowToEdit);
        }
      } catch (err) {
        console.warn('D1 question_edits list failed, falling back:', err);
      }
    }

    try {
      const rows = await evalRedis("return redis.call('HVALS',KEYS[1])", [prefix + moduleCode]);
      if (Array.isArray(rows)) {
        return (rows as string[]).map(decode);
      }
    } catch {
      // Redis unavailable or quota exceeded
    }

    const modMap = inMemoryEdits.get(moduleCode);
    return modMap ? Array.from(modMap.values()) : [];
  },

  async save(edit: Omit<QuestionEdit, 'revision'>, revision: number): Promise<QuestionEdit> {
    const id = editId(edit.moduleCode, edit.chapterId, edit.questionId);
    const now = new Date().toISOString();

    if (isD1Configured()) {
      try {
        let existing = await d1QueryFirst<any>(
          'SELECT id, revision, question_data FROM question_edits WHERE id = ?',
          [id]
        );

        // Fallback: If not found by chapter-specific id, search by module_code and question_id
        // in case the question was moved between chapters
        if (!existing) {
          const byQ = await d1QueryFirst<any>(
            'SELECT id, revision, question_data FROM question_edits WHERE module_code = ? AND question_id = ?',
            [edit.moduleCode, edit.questionId]
          );
          if (byQ) {
            existing = byQ;
            if (byQ.id !== id) {
              await d1Execute('DELETE FROM question_edits WHERE id = ?', [byQ.id]);
            }
          }
        }

        const currentRevision = existing ? Number(existing.revision) : 0;
        if (currentRevision !== Number(revision)) {
          throw new ReportError(409, 'This question was edited in another window. Reload before saving.');
        }

        const nextRevision = currentRevision + 1;
        const nextEdit: QuestionEdit = {
          ...edit,
          revision: nextRevision,
          updatedAt: now,
        };

        const existingData = typeof existing?.question_data === 'string' ? JSON.parse(existing.question_data) : existing?.question_data;
        const existingHistory = Array.isArray(existingData?.history) ? existingData.history : [];
        const history = [nextEdit, ...existingHistory].slice(0, 50);

        await d1Execute(
          `INSERT INTO question_edits (id, module_code, chapter_id, question_id, question_data, revision, author_id, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             module_code = excluded.module_code,
             chapter_id = excluded.chapter_id,
             question_id = excluded.question_id,
             question_data = excluded.question_data,
             revision = excluded.revision,
             author_id = excluded.author_id,
             updated_at = excluded.updated_at`,
          [
            id,
            edit.moduleCode,
            edit.chapterId,
            edit.questionId,
            JSON.stringify({
              baseVersion: edit.baseVersion,
              question: edit.question,
              subjectId: edit.subjectId,
              targetChapterId: edit.targetChapterId,
              targetSubjectId: edit.targetSubjectId,
              deleted: Boolean(edit.deleted),
              history,
            }),
            nextRevision,
            edit.updatedBy,
            now,
          ]
        );

        // Mirror in memory
        if (!inMemoryEdits.has(edit.moduleCode)) {
          inMemoryEdits.set(edit.moduleCode, new Map());
        }
        inMemoryEdits.get(edit.moduleCode)!.set(id, nextEdit);

        const histList = inMemoryHistory.get(edit.moduleCode) || [];
        inMemoryHistory.set(edit.moduleCode, [nextEdit, ...histList].slice(0, 50));

        return nextEdit;
      } catch (err) {
        if (err instanceof ReportError) throw err;
        console.warn('D1 question_edits save failed, falling back:', err);
      }
    }

    try {
      const field = createHash('sha256').update(edit.chapterId + ':' + edit.questionId).digest('hex');
      const response = await evalRedis(
        SAVE_EDIT_LUA,
        [prefix + edit.moduleCode, prefix + 'history:' + edit.moduleCode, prefix + 'modules'],
        [field, String(revision), JSON.stringify({ ...edit, question: JSON.stringify(edit.question) })]
      ) as [number, string];
      if (response[0] !== 200) throw new ReportError(409, 'This question was edited in another window. Reload before saving.');
      return decode(response[1]);
    } catch (err) {
      if (err instanceof ReportError) throw err;
      console.warn('Redis save edit failed, falling back to in-memory store:', err);
    }

    // In-memory fallback
    if (!inMemoryEdits.has(edit.moduleCode)) {
      inMemoryEdits.set(edit.moduleCode, new Map());
    }
    const modMap = inMemoryEdits.get(edit.moduleCode)!;
    const existing = modMap.get(id);
    const currentRev = existing?.revision ?? 0;
    if (currentRev !== revision) {
      throw new ReportError(409, 'This question was edited in another window. Reload before saving.');
    }
    const nextEdit: QuestionEdit = {
      ...edit,
      revision: currentRev + 1,
      updatedAt: now,
    };
    modMap.set(id, nextEdit);
    const histList = inMemoryHistory.get(edit.moduleCode) || [];
    inMemoryHistory.set(edit.moduleCode, [nextEdit, ...histList].slice(0, 50));
    return nextEdit;
  },

  async history(moduleCode: string): Promise<QuestionEdit[]> {
    if (isD1Configured()) {
      try {
        const data = await d1Query<any>(
          'SELECT question_data FROM question_edits WHERE module_code = ?',
          [moduleCode]
        );
        if (Array.isArray(data)) {
          const historyList: QuestionEdit[] = [];
          for (const row of data) {
            const d = typeof row.question_data === 'string' ? JSON.parse(row.question_data) : row.question_data;
            if (Array.isArray(d?.history)) {
              historyList.push(...d.history);
            }
          }
          if (historyList.length > 0) {
            return historyList.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
          }
        }
      } catch (err) {
        console.warn('D1 question_edits history failed, falling back:', err);
      }
    }

    try {
      const rows = await evalRedis("return redis.call('LRANGE',KEYS[1],0,-1)", [prefix + 'history:' + moduleCode]);
      if (Array.isArray(rows)) {
        return (rows as string[]).map(decode);
      }
    } catch {}

    return inMemoryHistory.get(moduleCode) || [];
  },
};

export async function editedModules(): Promise<string[]> {
  if (isD1Configured()) {
    try {
      const data = await d1Query<any>('SELECT DISTINCT module_code FROM question_edits');
      if (Array.isArray(data)) {
        const modules = Array.from(new Set(data.map((r: any) => String(r.module_code))));
        if (modules.length > 0) return modules;
      }
    } catch {}
  }

  try {
    const list = await evalRedis("return redis.call('SMEMBERS',KEYS[1])", [prefix + 'modules']);
    if (Array.isArray(list)) return list as string[];
  } catch {}

  return Array.from(inMemoryEdits.keys());
}
