-- Apply once before deploying the learning read-budget application.
ALTER TABLE learning_profiles ADD COLUMN xp_reconciled INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS learning_entry_changes (
    revision INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    entry_id TEXT NOT NULL,
    UNIQUE(user_id, entry_id)
);

CREATE INDEX IF NOT EXISTS idx_learning_entry_changes_cursor
ON learning_entry_changes(user_id, revision);

CREATE TRIGGER IF NOT EXISTS learning_entries_sync_insert
AFTER INSERT ON learning_entries
BEGIN
    INSERT INTO learning_entry_changes(user_id, entry_id)
    VALUES (NEW.user_id, NEW.id)
    ON CONFLICT(user_id, entry_id) DO UPDATE SET revision = excluded.revision;
END;

CREATE TRIGGER IF NOT EXISTS learning_entries_sync_update
AFTER UPDATE ON learning_entries
WHEN OLD.user_id IS NOT NEW.user_id OR OLD.id IS NOT NEW.id
  OR OLD.module_code IS NOT NEW.module_code OR OLD.chapter_id IS NOT NEW.chapter_id
  OR OLD.question_id IS NOT NEW.question_id OR OLD.topic IS NOT NEW.topic
  OR OLD.subject IS NOT NEW.subject OR OLD.type IS NOT NEW.type
  OR OLD.correct IS NOT NEW.correct OR OLD.ever_correct IS NOT NEW.ever_correct
  OR OLD.first_correct IS NOT NEW.first_correct OR OLD.created_at IS NOT NEW.created_at
  OR OLD.content_version IS NOT NEW.content_version
BEGIN
    INSERT INTO learning_entry_changes(user_id, entry_id)
    SELECT OLD.user_id, OLD.id WHERE OLD.user_id IS NOT NEW.user_id OR OLD.id IS NOT NEW.id
    ON CONFLICT(user_id, entry_id) DO UPDATE SET revision = excluded.revision;
    INSERT INTO learning_entry_changes(user_id, entry_id)
    VALUES (NEW.user_id, NEW.id)
    ON CONFLICT(user_id, entry_id) DO UPDATE SET revision = excluded.revision;
END;

CREATE TRIGGER IF NOT EXISTS learning_entries_sync_delete
AFTER DELETE ON learning_entries
BEGIN
    INSERT INTO learning_entry_changes(user_id, entry_id)
    VALUES (OLD.user_id, OLD.id)
    ON CONFLICT(user_id, entry_id) DO UPDATE SET revision = excluded.revision;
END;
