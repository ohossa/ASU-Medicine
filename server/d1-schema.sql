-- =========================================================================
-- ASU Medical Portal — Cloudflare D1 Complete Production Database Schema
-- Database Name: a-plus-db
-- UUID: 47d271d7-0634-4db7-aa31-65cb1cd80af4
-- Account: 1ee85c49030c48359b274b85ee33ab08
-- =========================================================================

-- 1. LEARNING & GAMIFICATION PROFILES
CREATE TABLE IF NOT EXISTS learning_profiles (
    user_id TEXT PRIMARY KEY,
    year INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    competitive_xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    streak INTEGER NOT NULL DEFAULT 0,
    best_streak INTEGER NOT NULL DEFAULT 0,
    last_day TEXT NOT NULL DEFAULT '',
    alias TEXT NOT NULL DEFAULT 'Student',
    opt_in INTEGER NOT NULL DEFAULT 0,
    banner TEXT NOT NULL DEFAULT 'default',
    title TEXT NOT NULL DEFAULT 'student',
    weekly_xp INTEGER NOT NULL DEFAULT 0,
    current_week TEXT NOT NULL DEFAULT '',
    xp_reconciled INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_learning_profiles_leaderboard 
ON learning_profiles(year, opt_in, competitive_xp DESC);

CREATE INDEX IF NOT EXISTS idx_learning_profiles_weekly
ON learning_profiles(year, opt_in, weekly_xp DESC);

-- 2. QUESTION ATTEMPT REWARDS & HISTORY
CREATE TABLE IF NOT EXISTS learning_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    module_code TEXT NOT NULL,
    chapter_id INTEGER NOT NULL DEFAULT 1,
    question_id TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT '',
    topic TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL DEFAULT 'mcq',
    correct INTEGER NOT NULL DEFAULT 0,
    ever_correct INTEGER NOT NULL DEFAULT 0,
    first_correct INTEGER NOT NULL DEFAULT 0,
    attempts_count INTEGER NOT NULL DEFAULT 1,
    content_version TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_learning_entries_user ON learning_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_entries_module ON learning_entries(module_code);
CREATE INDEX IF NOT EXISTS idx_learning_entries_question ON learning_entries(question_id);

-- Entry change feed for incremental learning sync.
CREATE INDEX IF NOT EXISTS idx_learning_entries_user_question
ON learning_entries(user_id, question_id);

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

-- 3. QUESTION BUG & TYPO REPORTS
CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    request_hash TEXT NOT NULL,
    reporter_id TEXT NOT NULL,
    reporter TEXT DEFAULT '{}',
    category TEXT NOT NULL,
    explanation TEXT NOT NULL DEFAULT '',
    module_code TEXT NOT NULL,
    chapter_id INTEGER NOT NULL DEFAULT 1,
    question_id TEXT NOT NULL,
    sub_question_id TEXT,
    snapshot TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    notes TEXT NOT NULL DEFAULT '',
    revision INTEGER NOT NULL DEFAULT 1,
    notification TEXT DEFAULT '{"state":"pending"}',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_module ON reports(module_code);
CREATE INDEX IF NOT EXISTS idx_reports_question ON reports(question_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- 4. REPORT REPLIES (Admin Conversations)
CREATE TABLE IF NOT EXISTS report_replies (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'draft',
    revision INTEGER NOT NULL DEFAULT 1,
    created_by TEXT NOT NULL DEFAULT 'owner',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_replies_report_id ON report_replies(report_id);

-- 5. LIVE QUESTION EDITS & AUDIT TRAIL
CREATE TABLE IF NOT EXISTS question_edits (
    id TEXT PRIMARY KEY,
    module_code TEXT NOT NULL,
    chapter_id INTEGER NOT NULL,
    question_id TEXT NOT NULL,
    question_data TEXT NOT NULL,
    revision INTEGER NOT NULL DEFAULT 1,
    author_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_question_edits_module ON question_edits(module_code);

-- 6. REAL-TIME PRESENCE TABLE
CREATE TABLE IF NOT EXISTS presence (
    user_id TEXT PRIMARY KEY,
    alias TEXT NOT NULL DEFAULT 'Student',
    module_code TEXT NOT NULL DEFAULT '',
    last_seen TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_presence_last_seen ON presence(last_seen DESC);

-- 7. AI HINT LOGS & TELEMETRY
CREATE TABLE IF NOT EXISTS ai_hint_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    module_code TEXT NOT NULL,
    question_id TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'nvidia',
    model TEXT NOT NULL DEFAULT '',
    tokens_prompt INTEGER DEFAULT 0,
    tokens_completion INTEGER DEFAULT 0,
    latency_ms INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'success',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ai_hint_rate_check ON ai_hint_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_hint_question ON ai_hint_logs(module_code, question_id);

-- 8. AI TRIAGE ASSESSMENTS CACHE
CREATE TABLE IF NOT EXISTS triage_assessments (
    fingerprint TEXT PRIMARY KEY,
    assessment TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium',
    confidence REAL DEFAULT 0.000,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_triage_priority ON triage_assessments(priority);
