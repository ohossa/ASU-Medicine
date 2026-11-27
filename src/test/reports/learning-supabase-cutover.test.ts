import { readFileSync } from "node:fs";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { award, dashboard, getProfile, saveProfile } from "../../../server/learning-store";
import { cairoDay } from "../../../server/learning-policy";
import * as d1 from "../../../server/d1-client";

describe("D1 learning transaction and cursor", () => {
  let db: DatabaseSync;
  const id = "student";
  const reward = (questionId: string, correct = true) => ({
    questionId, correct, moduleCode: "MGL-3", chapterId: 1,
    personal: 30, competitive: 30, contentVersion: "v1",
  });
  const all = (sql: string, params: unknown[] = []) =>
    db.prepare(sql).all(...params as SQLInputValue[]);

  beforeEach(() => {
    db = new DatabaseSync(":memory:");
    db.exec(readFileSync("server/d1-schema.sql", "utf8"));
    vi.spyOn(d1, "isD1Configured").mockReturnValue(true);
    vi.spyOn(d1, "d1Query").mockImplementation(async (sql, params) => all(sql, params) as never[]);
    vi.spyOn(d1, "d1QueryFirst").mockImplementation(async (sql, params) => (all(sql, params)[0] ?? null) as never);
    vi.spyOn(d1, "d1Execute").mockImplementation(async (sql, params) => {
      const changes = db.prepare(sql).run(...params ?? []).changes;
      return { success: true, changes: Number(changes) };
    });
    vi.spyOn(d1, "d1Transaction").mockImplementation(async (statements) => {
      db.exec("BEGIN");
      try {
        const result = statements.map(({ sql, params }) => all(sql, params));
        db.exec("COMMIT");
        return result;
      } catch (err) {
        db.exec("ROLLBACK");
        throw err;
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    db.close();
  });

  it("commits awards once across overlapping batches, levels up, and preserves streak and XP on settings updates", async () => {
    const yesterday = new Date(cairoDay() + "T12:00:00Z");
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    all("INSERT INTO learning_profiles (user_id, year, xp, competitive_xp, level, streak, best_streak, last_day, xp_reconciled) VALUES (?, 3, 2450, 2450, 5, 4, 4, ?, 1)",
      [id, yesterday.toISOString().slice(0, 10)]);

    const results = await Promise.all([
      award(id, 3, [reward("q1"), reward("q2")]),
      award(id, 3, [reward("q1"), reward("q3")]),
      saveProfile(id, 3, { alias: "Amina" }),
    ]);
    expect(results.slice(0, 2)).toEqual([
      { personal: 60, competitive: 60 },
      { personal: 30, competitive: 30 },
    ]);
    expect(await award(id, 3, [reward("q2")])).toEqual({ personal: 0, competitive: 0 });
    expect(await getProfile(id, 3)).toMatchObject({
      xp: 2540, competitiveXp: 2540, level: 6, streak: 5, bestStreak: 5, alias: "Amina",
    });
    expect(all("SELECT * FROM learning_entries")).toHaveLength(3);
    expect(d1.d1Query).not.toHaveBeenCalled();
  });

  it("rolls back XP if the entry write fails and allows a successful retry", async () => {
    db.exec(`CREATE TRIGGER fail_entry BEFORE INSERT ON learning_entries
      BEGIN SELECT RAISE(ABORT, 'failed'); END;`);
    await expect(award(id, 3, [reward("q1")])).rejects.toMatchObject({ status: 503 });
    expect((await getProfile(id, 3)).xp).toBe(0);
    db.exec("DROP TRIGGER fail_entry");
    expect(await award(id, 3, [reward("q1")])).toEqual({ personal: 30, competitive: 30 });
  });

  it("returns complete legacy history, then only changed entries and deletions to cursor clients", async () => {
    await award(id, 3, [reward("q1"), reward("q2")]);
    await award("another", 3, [reward("q3")]);
    const legacy = await dashboard(id, 3);
    expect(legacy.entries).toHaveLength(2);
    expect(legacy.entriesCursor).toBeUndefined();
    const full = await dashboard(id, 3, "weekly", "full");
    expect(full.entries).toHaveLength(2);
    expect(full.deletedEntryIds).toBeUndefined();
    const saved = full.entriesCursor!;
    const deleted = full.entries.find((entry) => entry.questionId === "q2")!.entryId;

    await award(id, 3, [reward("q1")]);
    expect(await dashboard(id, 3, "weekly", saved)).toMatchObject({
      entries: [], deletedEntryIds: [], entriesCursor: saved,
    });

    await award(id, 3, [reward("q1", false)]);
    await award("another", 3, [reward("q4")]);
    all("DELETE FROM learning_entries WHERE user_id = ? AND question_id = 'q2'", [id]);
    const delta = await dashboard(id, 3, "weekly", saved);
    expect(delta.entries).toEqual([expect.objectContaining({ questionId: "q1", correct: false, everCorrect: true })]);
    expect(delta.deletedEntryIds).toEqual([deleted]);
    expect(delta.entriesCursor).not.toBe(saved);
    expect(all("SELECT * FROM learning_entry_changes WHERE user_id = ?", [id])).toHaveLength(2);

    const reset = await dashboard(id, 3, "weekly", "v1:999999");
    expect(reset.entries).toHaveLength(1);
    expect(reset.deletedEntryIds).toBeUndefined();
  });
});
