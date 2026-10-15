-- Server jobs that fetch reviews and treatments from Bokadirekt cost money per
-- run. Each job may start at most once per interval, whoever calls it, and the
-- last result is kept so the administration can show when data was refreshed.

CREATE TABLE IF NOT EXISTS cms_private.job_runs (
  job text PRIMARY KEY CHECK (job ~ '^[a-z0-9-]{1,40}$'),
  last_started_at timestamptz,
  last_finished_at timestamptz,
  last_result jsonb
);
ALTER TABLE cms_private.job_runs ENABLE ROW LEVEL SECURITY;
GRANT ALL ON cms_private.job_runs TO service_role;

-- Returns true when the caller may run the job now, and records the start.
CREATE OR REPLACE FUNCTION public.cms_claim_job(p_job text, p_min_interval_seconds integer)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  INSERT INTO cms_private.job_runs(job) VALUES (p_job) ON CONFLICT DO NOTHING;
  UPDATE cms_private.job_runs
  SET last_started_at = now()
  WHERE job = p_job
    AND (last_started_at IS NULL OR last_started_at < now() - make_interval(secs => GREATEST(p_min_interval_seconds, 0)));
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.cms_finish_job(p_job text, p_result jsonb)
RETURNS void LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
  UPDATE cms_private.job_runs SET last_finished_at = now(), last_result = p_result WHERE job = p_job;
$$;

CREATE OR REPLACE FUNCTION public.cms_job_status()
RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
  SELECT COALESCE(
    jsonb_object_agg(job, jsonb_build_object(
      'last_started_at', last_started_at,
      'last_finished_at', last_finished_at,
      'last_result', last_result
    )),
    '{}'::jsonb
  )
  FROM cms_private.job_runs;
$$;

REVOKE ALL ON FUNCTION public.cms_claim_job(text, integer), public.cms_finish_job(text, jsonb), public.cms_job_status()
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cms_claim_job(text, integer), public.cms_finish_job(text, jsonb), public.cms_job_status()
  TO service_role;
