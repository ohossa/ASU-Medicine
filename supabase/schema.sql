-- =========================================================================
-- ASU Medical Portal — Supabase Production Database Schema
-- Project Ref: rtgmzxhaayyrxvcqtnxl
-- =========================================================================

-- 1. QUESTION REPORTS TABLE
-- Stores student-reported question feedback, formatting bugs, and answers
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY,                           -- Unique deterministic ID (e.g. r_dc185985f0cd0a26eb08483e566d837219cb0e4c)
    request_hash TEXT NOT NULL,                    -- Idempotency hash
    reporter_id TEXT NOT NULL,                     -- Clerk user ID
    reporter JSONB DEFAULT '{}'::jsonb,            -- Reporter profile: name, username, email, emailVerified
    category TEXT NOT NULL,                        -- wrong_answer, unclear_wording, missing_image, duplicate, formatting, other
    explanation TEXT NOT NULL DEFAULT '',          -- Student description / note
    module_code TEXT NOT NULL,                     -- Module identifier (e.g. MGL-3, GIT-1)
    chapter_id INTEGER NOT NULL DEFAULT 1,         -- Chapter ID (e.g. 5)
    question_id TEXT NOT NULL,                     -- Question ID (e.g. MGL3-CH5-PATH-0847)
    sub_question_id TEXT,                          -- Optional sub-question ID
    snapshot JSONB NOT NULL,                       -- Full question snapshot (stem, options, correctIndex, explanation)
    status TEXT NOT NULL DEFAULT 'new',            -- new, reviewing, resolved, dismissed
    notes TEXT NOT NULL DEFAULT '',                -- Admin internal review notes
    revision INTEGER NOT NULL DEFAULT 1,           -- Optimistic locking revision counter
    notification JSONB DEFAULT '{"state":"pending"}'::jsonb, -- Email notification delivery status
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast lookup indexes for admin filtering and searching
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_module ON public.reports(module_code);
CREATE INDEX IF NOT EXISTS idx_reports_question ON public.reports(question_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 2. USER CLOUD SYNC & PROGRESS TABLE
-- Replaces tens of thousands of fragmented Redis keys with a single clean row per user
CREATE TABLE IF NOT EXISTS public.user_progress (
    user_id TEXT PRIMARY KEY,                      -- Clerk user ID
    data JSONB NOT NULL DEFAULT '{}'::jsonb,       -- Full user state (quiz sessions, flags, tracker, etc.)
    academic_year INTEGER DEFAULT 1,               -- Selected academic year (1 to 5)
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_progress_updated ON public.user_progress(updated_at DESC);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 3. REAL-TIME PRESENCE TABLE
-- Lightweight active student tracker (heartbeats)
CREATE TABLE IF NOT EXISTS public.presence (
    user_id TEXT PRIMARY KEY,
    alias TEXT NOT NULL DEFAULT 'Student',
    module_code TEXT NOT NULL DEFAULT '',
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_presence_last_seen ON public.presence(last_seen DESC);

ALTER TABLE public.presence ENABLE ROW LEVEL SECURITY;

-- 4. INSERT RECOVERED QUESTION REPORT
-- Seeds the reported question MGL3-CH5-PATH-0847 so it is immediately active
INSERT INTO public.reports (
    id,
    request_hash,
    reporter_id,
    reporter,
    category,
    explanation,
    module_code,
    chapter_id,
    question_id,
    snapshot,
    status,
    notes,
    revision,
    notification,
    created_at,
    updated_at
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
    '{
        "moduleCode": "MGL-3",
        "chapterId": 5,
        "chapterTitle": "Pathology",
        "subjectName": "Pathology",
        "topicName": "Hepatitis",
        "version": "97453f5ae1f99603d0260f586922ac8af1b9e57f8f0d158f2e218dcf947456c1",
        "question": {
            "id": "MGL3-CH5-PATH-0847",
            "type": "mcq",
            "text": "4- Which of the following hepatic viruses can cause fatal fulminant hepatitis in pregnant\\nwomen:",
            "explanation": "HEV can cause severe or fulminant hepatitis during pregnancy, particularly in endemic regions.",
            "options": ["HBV", "HCV", "HDV", "HEV"],
            "correctIndex": 3,
            "lecture": 17
        }
    }'::jsonb,
    'new',
    '',
    1,
    '{"state": "sent"}'::jsonb,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;
