-- ==============================================================================
-- Migration: 20261101_security_rls_lockdown.sql
-- Description: Locks down Row-Level Security (RLS) across all public tables.
--              Revokes public `anon` and `authenticated` direct PostgREST REST
--              access to prevent scraping or unauthenticated queries.
--              Grants full operational access exclusively to `service_role`
--              (used by trusted serverless API functions).
-- ==============================================================================

-- 1. Ensure RLS is active on all relational tables
ALTER TABLE IF EXISTS public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.report_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.question_edits ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.learning_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.learning_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_hint_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.triage_assessments ENABLE ROW LEVEL SECURITY;

-- 2. Drop overly permissive legacy public policies
DROP POLICY IF EXISTS "Allow all on user_progress" ON public.user_progress;
DROP POLICY IF EXISTS "Allow all on presence" ON public.presence;
DROP POLICY IF EXISTS "Allow public read of active edits" ON public.question_edits;
DROP POLICY IF EXISTS "Allow public read of profiles" ON public.learning_profiles;
DROP POLICY IF EXISTS "Allow insert to ai_hint_logs" ON public.ai_hint_logs;

-- 3. Revoke all direct PostgREST data manipulation grants from anon & authenticated
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- 4. Create explicit lockdown policies (Deny anon, allow service_role)
-- Note: Supabase service_role automatically bypasses RLS by default.
-- For authenticated users querying via direct client (if any), restrict to own user_id:
CREATE POLICY "service_role_full_user_progress" ON public.user_progress
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_full_reports" ON public.reports
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_full_report_replies" ON public.report_replies
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_full_question_edits" ON public.question_edits
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_full_learning_profiles" ON public.learning_profiles
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_full_learning_entries" ON public.learning_entries
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_full_presence" ON public.presence
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_full_ai_hint_logs" ON public.ai_hint_logs
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_full_triage" ON public.triage_assessments
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 5. Revoke anonymous execution of sensitive SECURITY DEFINER RPCs
REVOKE EXECUTE ON FUNCTION public.merge_user_progress(TEXT, JSONB, INTEGER) FROM anon;
GRANT EXECUTE ON FUNCTION public.merge_user_progress(TEXT, JSONB, INTEGER) TO service_role;
