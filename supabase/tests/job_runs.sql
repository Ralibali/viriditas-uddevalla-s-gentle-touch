-- Run with a privileged connection. Every test mutation rolls back.
BEGIN;
SET LOCAL ROLE service_role;
DO $$
BEGIN
  IF NOT public.cms_claim_job('scrape-reviews', 3600) THEN RAISE EXCEPTION 'the first run was refused'; END IF;
  IF public.cms_claim_job('scrape-reviews', 3600) THEN RAISE EXCEPTION 'a second run within the interval was allowed'; END IF;
  IF NOT public.cms_claim_job('sync-treatments', 3600) THEN RAISE EXCEPTION 'jobs block each other'; END IF;
  PERFORM public.cms_finish_job('scrape-reviews', '{"count": 3}'::jsonb);
  IF (public.cms_job_status()->'scrape-reviews'->'last_result'->>'count')::int <> 3 THEN RAISE EXCEPTION 'job result was not kept'; END IF;
END $$;
RESET ROLE;

UPDATE cms_private.job_runs SET last_started_at = now() - interval '2 hours' WHERE job = 'scrape-reviews';
SET LOCAL ROLE service_role;
DO $$
BEGIN
  IF NOT public.cms_claim_job('scrape-reviews', 3600) THEN RAISE EXCEPTION 'a run after the interval was refused'; END IF;
END $$;
RESET ROLE;

DO $$
BEGIN
  IF has_function_privilege('anon', 'public.cms_claim_job(text,integer)', 'EXECUTE')
     OR has_function_privilege('authenticated', 'public.cms_job_status()', 'EXECUTE') THEN
    RAISE EXCEPTION 'visitors can use job functions';
  END IF;
END $$;
ROLLBACK;
