-- Reviews: the administrator can hide a review or feature it first.
-- The import keeps these choices because it only writes the scraped columns.
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "Anyone can read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can read visible reviews" ON public.reviews;
CREATE POLICY "Anyone can read visible reviews"
  ON public.reviews FOR SELECT TO anon, authenticated
  USING (NOT is_hidden);

-- Visitors may read reviews and treatments but never change them.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.reviews, public.treatments FROM anon, authenticated;

-- Click statistics: visitors may only add short, well-formed rows.
-- Row level security already keeps the rows unreadable for visitors.
REVOKE UPDATE, DELETE, TRUNCATE ON public.booking_clicks FROM anon, authenticated;
GRANT INSERT ON public.booking_clicks TO anon, authenticated;

ALTER TABLE public.booking_clicks DROP CONSTRAINT IF EXISTS booking_clicks_source_length;
ALTER TABLE public.booking_clicks DROP CONSTRAINT IF EXISTS booking_clicks_click_type_known;
ALTER TABLE public.booking_clicks DROP CONSTRAINT IF EXISTS booking_clicks_page_url_length;
-- NOT VALID: existing rows stay as they are; new rows are checked.
ALTER TABLE public.booking_clicks
  ADD CONSTRAINT booking_clicks_source_length CHECK (source IS NULL OR char_length(source) <= 80) NOT VALID;
ALTER TABLE public.booking_clicks
  ADD CONSTRAINT booking_clicks_click_type_known CHECK (click_type IN ('booking', 'phone', 'contact')) NOT VALID;
ALTER TABLE public.booking_clicks
  ADD CONSTRAINT booking_clicks_page_url_length CHECK (page_url IS NULL OR char_length(page_url) <= 300) NOT VALID;

CREATE INDEX IF NOT EXISTS booking_clicks_clicked_at_idx ON public.booking_clicks (clicked_at DESC);
