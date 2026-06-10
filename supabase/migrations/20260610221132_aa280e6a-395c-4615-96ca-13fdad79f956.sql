ALTER TABLE public.booking_clicks
  ADD COLUMN IF NOT EXISTS click_type text NOT NULL DEFAULT 'booking';