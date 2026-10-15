ALTER TABLE public.treatments RENAME COLUMN peach_id TO service_ref;
DROP TABLE IF EXISTS public.schedule_slots;
SELECT cron.unschedule('sync-schedule-twice-daily');