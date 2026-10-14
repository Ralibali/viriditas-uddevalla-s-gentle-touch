
-- Table to track booking link clicks
CREATE TABLE public.booking_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source TEXT, -- which button was clicked (hero, treatment, footer etc)
  page_url TEXT
);

-- Enable RLS
ALTER TABLE public.booking_clicks ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (no auth needed for tracking)
CREATE POLICY "Anyone can insert booking clicks"
  ON public.booking_clicks
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only allow reading via service role (not public)
-- No SELECT policy = no public reads
