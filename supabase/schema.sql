-- =========================================================================
-- ASU Medical Portal — Supabase Complete Production Database Schema
-- Project Ref: rtgmzxhaayyrxvcqtnxl
-- =========================================================================

-- 1. QUESTION REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY,
    request_hash TEXT NOT NULL,
    reporter_id TEXT NOT NULL,
    reporter JSONB DEFAULT '{}'::jsonb,
    category TEXT NOT NULL,
    explanation TEXT NOT NULL DEFAULT '',
    module_code TEXT NOT NULL,
    chapter_id INTEGER NOT NULL DEFAULT 1,
    question_id TEXT NOT NULL,
    sub_question_id TEXT,
    snapshot JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    notes TEXT NOT NULL DEFAULT '',
    revision INTEGER NOT NULL DEFAULT 1,
    notification JSONB DEFAULT '{"state":"pending"}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_module ON public.reports(module_code);
CREATE INDEX IF NOT EXISTS idx_reports_question ON public.reports(question_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert to reports" ON public.reports FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public select on reports" ON public.reports FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public update on reports" ON public.reports FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.reports TO anon, authenticated;


-- 2. REPORT REPLIES TABLE (Drafts & Sent Conversations)
CREATE TABLE IF NOT EXISTS public.report_replies (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'draft',
    revision INTEGER NOT NULL DEFAULT 1,
    created_by TEXT NOT NULL DEFAULT 'owner',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_replies_report_id ON public.report_replies(report_id);
ALTER TABLE public.report_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on report_replies" ON public.report_replies FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.report_replies TO anon, authenticated;


-- 3. USER CLOUD SYNC & PROGRESS TABLE (1 Row / Student)
CREATE TABLE IF NOT EXISTS public.user_progress (
    user_id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    academic_year INTEGER DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_progress_updated ON public.user_progress(updated_at DESC);
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on user_progress" ON public.user_progress FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.user_progress TO anon, authenticated;


-- 4. REAL-TIME PRESENCE TABLE
CREATE TABLE IF NOT EXISTS public.presence (
    user_id TEXT PRIMARY KEY,
    alias TEXT NOT NULL DEFAULT 'Student',
    module_code TEXT NOT NULL DEFAULT '',
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_presence_last_seen ON public.presence(last_seen DESC);
ALTER TABLE public.presence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on presence" ON public.presence FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.presence TO anon, authenticated;


-- 5. LIVE QUESTION EDITS & AUDIT TRAIL
CREATE TABLE IF NOT EXISTS public.question_edits (
    id TEXT PRIMARY KEY, -- sha256(module_code:chapter_id:question_id)
    module_code TEXT NOT NULL,
    chapter_id INTEGER NOT NULL,
    question_id TEXT NOT NULL,
    question_data JSONB NOT NULL,
    revision INTEGER NOT NULL DEFAULT 1,
    author_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_question_edits_module ON public.question_edits(module_code);
ALTER TABLE public.question_edits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on question_edits" ON public.question_edits FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.question_edits TO anon, authenticated;


-- 6. LEARNING & GAMIFICATION PROFILES
CREATE TABLE IF NOT EXISTS public.learning_profiles (
    user_id TEXT PRIMARY KEY,
    year INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    competitive_xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    streak INTEGER NOT NULL DEFAULT 0,
    best_streak INTEGER NOT NULL DEFAULT 0,
    last_day TEXT NOT NULL DEFAULT '',
    alias TEXT NOT NULL DEFAULT 'Student',
    opt_in BOOLEAN NOT NULL DEFAULT false,
    banner TEXT NOT NULL DEFAULT 'default',
    title TEXT NOT NULL DEFAULT 'student',
    weekly_xp INTEGER NOT NULL DEFAULT 0,
    current_week TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_profiles_leaderboard 
ON public.learning_profiles(year, opt_in, competitive_xp DESC);

CREATE INDEX IF NOT EXISTS idx_learning_profiles_weekly
ON public.learning_profiles(year, opt_in, weekly_xp DESC);

ALTER TABLE public.learning_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on learning_profiles" ON public.learning_profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.learning_profiles TO anon, authenticated;


-- 7. QUESTION ATTEMPT ENTRIES (Gamification Rewards & History)
CREATE TABLE IF NOT EXISTS public.learning_entries (
    id TEXT PRIMARY KEY, -- sha256(user_id:module_code:question_id)
    user_id TEXT NOT NULL REFERENCES public.learning_profiles(user_id) ON DELETE CASCADE,
    module_code TEXT NOT NULL,
    chapter_id INTEGER NOT NULL DEFAULT 1,
    question_id TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT '',
    topic TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL DEFAULT 'mcq',
    correct BOOLEAN NOT NULL DEFAULT false,
    ever_correct BOOLEAN NOT NULL DEFAULT false,
    first_correct BOOLEAN NOT NULL DEFAULT false,
    attempts_count INTEGER NOT NULL DEFAULT 1,
    content_version TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_entries_user ON public.learning_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_entries_module ON public.learning_entries(module_code);
CREATE INDEX IF NOT EXISTS idx_learning_entries_question ON public.learning_entries(question_id);

ALTER TABLE public.learning_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on learning_entries" ON public.learning_entries FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.learning_entries TO anon, authenticated;


-- 8. AI HINT & TUTOR TELEMETRY
CREATE TABLE IF NOT EXISTS public.ai_hint_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    module_code TEXT NOT NULL,
    question_id TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'nvidia',
    model TEXT NOT NULL DEFAULT '',
    tokens_prompt INTEGER DEFAULT 0,
    tokens_completion INTEGER DEFAULT 0,
    latency_ms INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'success',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_hint_rate_check ON public.ai_hint_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_hint_question ON public.ai_hint_logs(module_code, question_id);

ALTER TABLE public.ai_hint_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on ai_hint_logs" ON public.ai_hint_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.ai_hint_logs TO anon, authenticated;


-- 9. AI TRIAGE ASSESSMENTS CACHE
CREATE TABLE IF NOT EXISTS public.triage_assessments (
    fingerprint TEXT PRIMARY KEY,
    assessment JSONB NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium',
    confidence NUMERIC(4,3) DEFAULT 0.000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_triage_priority ON public.triage_assessments(priority);

ALTER TABLE public.triage_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on triage_assessments" ON public.triage_assessments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON public.triage_assessments TO anon, authenticated;


-- 10. SEED THE RECOVERED QUESTION REPORT (MGL3-CH5-PATH-0847 -> MOVED TO MICROBIOLOGY)
INSERT INTO public.reports (
    id, request_hash, reporter_id, reporter, category, explanation,
    module_code, chapter_id, question_id, snapshot, status, notes, revision, notification, created_at, updated_at
) VALUES (
    'r_dc185985f0cd0a26eb08483e566d837219cb0e4c',
    'recovered_r_dc185985f0cd0a26eb08483e566d837219cb0e4c',
    'user_student_recovered',
    '{"name": "Medical Student", "username": "student", "email": "student@asu.codes", "emailVerified": true, "systemRecovered": true}'::jsonb,
    'formatting',
    'Bro this is micro',
    'MGL-3',
    7,
    'MGL3-CH5-PATH-0847',
    '{"moduleCode":"MGL-3","chapterId":7,"chapterTitle":"Microbiology","subjectName":"Microbiology","topicName":"Viral hepatitis","version":"97453f5ae1f99603d0260f586922ac8af1b9e57f8f0d158f2e218dcf947456c1","question":{"id":"MGL3-CH5-PATH-0847","type":"mcq","text":"4- Which of the following hepatic viruses can cause fatal fulminant hepatitis in pregnant\\nwomen:","explanation":"HEV can cause severe or fulminant hepatitis during pregnancy, particularly in endemic regions.","options":["HBV","HCV","HDV","HEV"],"correctIndex":3,"lecture":2}}'::jsonb,
    'fixed', 'Moved from Pathology (Ch 5) to Microbiology (Ch 7, Viral hepatitis) per student feedback.', 1, '{"state": "sent"}'::jsonb, NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET 
    chapter_id = 7,
    snapshot = '{"moduleCode":"MGL-3","chapterId":7,"chapterTitle":"Microbiology","subjectName":"Microbiology","topicName":"Viral hepatitis","version":"97453f5ae1f99603d0260f586922ac8af1b9e57f8f0d158f2e218dcf947456c1","question":{"id":"MGL3-CH5-PATH-0847","type":"mcq","text":"4- Which of the following hepatic viruses can cause fatal fulminant hepatitis in pregnant\\nwomen:","explanation":"HEV can cause severe or fulminant hepatitis during pregnancy, particularly in endemic regions.","options":["HBV","HCV","HDV","HEV"],"correctIndex":3,"lecture":2}}'::jsonb,
    status = 'fixed',
    notes = 'Moved from Pathology (Ch 5) to Microbiology (Ch 7, Viral hepatitis) per student feedback.',
    reporter = '{"name": "Medical Student", "username": "student", "email": "student@asu.codes", "emailVerified": true, "systemRecovered": true}'::jsonb;
