
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  review_date text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (reviewer_name, review_date)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews" ON public.reviews
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can manage reviews" ON public.reviews
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
