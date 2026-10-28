-- =========================================================================
-- ASU Medical Portal — Supabase Production Database Schema
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

CREATE POLICY "Allow public insert to reports" ON public.reports
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public select on reports" ON public.reports
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public update on reports" ON public.reports
    FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);

GRANT ALL ON public.reports TO anon, authenticated;


-- 2. USER CLOUD SYNC & PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.user_progress (
    user_id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    academic_year INTEGER DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_progress_updated ON public.user_progress(updated_at DESC);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on user_progress" ON public.user_progress
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

GRANT ALL ON public.user_progress TO anon, authenticated;


-- 3. REAL-TIME PRESENCE TABLE
CREATE TABLE IF NOT EXISTS public.presence (
    user_id TEXT PRIMARY KEY,
    alias TEXT NOT NULL DEFAULT 'Student',
    module_code TEXT NOT NULL DEFAULT '',
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_presence_last_seen ON public.presence(last_seen DESC);

ALTER TABLE public.presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on presence" ON public.presence
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

GRANT ALL ON public.presence TO anon, authenticated;


-- 4. SEED THE RECOVERED QUESTION REPORT (MGL3-CH5-PATH-0847)
INSERT INTO public.reports (
    id, request_hash, reporter_id, reporter, category, explanation,
    module_code, chapter_id, question_id, snapshot, status, notes, revision, notification, created_at, updated_at
) VALUES (
    'r_dc185985f0cd0a26eb08483e566d837219cb0e4c',
    'recovered_r_dc185985f0cd0a26eb08483e566d837219cb0e4c',
    'user_student_recovered',
    '{"name": "Medical Student", "username": "student", "email": "student@asu.codes", "emailVerified": true}'::jsonb,
    'formatting',
    'Bro this is micro',
    'MGL-3',
    5,
    'MGL3-CH5-PATH-0847',
    '{"moduleCode":"MGL-3","chapterId":5,"chapterTitle":"Pathology","subjectName":"Pathology","topicName":"Hepatitis","version":"97453f5ae1f99603d0260f586922ac8af1b9e57f8f0d158f2e218dcf947456c1","question":{"id":"MGL3-CH5-PATH-0847","type":"mcq","text":"4- Which of the following hepatic viruses can cause fatal fulminant hepatitis in pregnant\\nwomen:","explanation":"HEV can cause severe or fulminant hepatitis during pregnancy, particularly in endemic regions.","options":["HBV","HCV","HDV","HEV"],"correctIndex":3,"lecture":17}}'::jsonb,
    'new', '', 1, '{"state": "sent"}'::jsonb, NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;
