CREATE TABLE IF NOT EXISTS public.schedule_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE,
  activity_peach_id TEXT,
  activity_title TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  location TEXT,
  price_sek INTEGER,
  booking_url TEXT NOT NULL,
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_schedule_slots_starts_at ON public.schedule_slots(starts_at);

ALTER TABLE public.schedule_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read schedule slots"
ON public.schedule_slots FOR SELECT
USING (true);

CREATE POLICY "Service role can manage schedule slots"
ON public.schedule_slots FOR ALL
TO service_role
USING (true)
WITH CHECK (true);