-- Run with a privileged connection. Every test mutation rolls back.
-- What a visitor (anon) may read and write in the public schema.
BEGIN;
INSERT INTO public.reviews(reviewer_name, rating, review_text, review_date, is_hidden)
VALUES ('Synlig', 5, 'Mycket bra', 'fre 2 jan', false), ('Dold', 1, 'Reklam', 'fre 2 jan', true);
INSERT INTO public.site_pages(slug, title, is_published) VALUES ('utkast-test', 'Utkast', false);

SET LOCAL ROLE anon;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.reviews WHERE reviewer_name = 'Dold') THEN RAISE EXCEPTION 'a hidden review is visible'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.reviews WHERE reviewer_name = 'Synlig') THEN RAISE EXCEPTION 'a visible review is missing'; END IF;
  IF EXISTS (SELECT 1 FROM public.site_pages WHERE slug = 'utkast-test') THEN RAISE EXCEPTION 'a draft page is visible'; END IF;
  IF EXISTS (SELECT 1 FROM public.booking_clicks) THEN RAISE EXCEPTION 'click statistics are readable'; END IF;

  INSERT INTO public.booking_clicks(source, click_type, page_url) VALUES ('hero', 'booking', 'https://viriditasmassage.se/');
  BEGIN
    INSERT INTO public.booking_clicks(source, click_type) VALUES (repeat('x', 200), 'booking');
    RAISE EXCEPTION 'an oversized click source was accepted';
  EXCEPTION WHEN check_violation THEN NULL;
  END;
  BEGIN
    INSERT INTO public.booking_clicks(source, click_type) VALUES ('hero', 'unknown');
    RAISE EXCEPTION 'an unknown click type was accepted';
  EXCEPTION WHEN check_violation THEN NULL;
  END;
END $$;
RESET ROLE;

DO $$
BEGIN
  IF has_table_privilege('anon', 'public.reviews', 'INSERT') OR has_table_privilege('anon', 'public.reviews', 'UPDATE')
     OR has_table_privilege('anon', 'public.treatments', 'DELETE') THEN
    RAISE EXCEPTION 'visitors may change reviews or treatments';
  END IF;
  IF has_table_privilege('anon', 'public.site_settings', 'UPDATE') OR has_table_privilege('anon', 'public.site_pages', 'INSERT') THEN
    RAISE EXCEPTION 'visitors may change site content';
  END IF;
  IF has_table_privilege('anon', 'public.booking_clicks', 'DELETE') THEN RAISE EXCEPTION 'visitors may delete statistics'; END IF;
END $$;
ROLLBACK;
