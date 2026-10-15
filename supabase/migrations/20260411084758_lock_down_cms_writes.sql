
-- site_pages: drop the permissive ALL policy for anon
DROP POLICY IF EXISTS "Anon can read all pages for CMS" ON public.site_pages;

-- site_pages: add service_role write access
CREATE POLICY "Service role can manage pages"
ON public.site_pages
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- site_pages: ensure anon can still read published pages (policy already exists, but let's be safe)
-- "Anyone can read published pages" already exists, no changes needed

-- site_settings: drop permissive ALL policy for anon
DROP POLICY IF EXISTS "Anon can manage settings for CMS" ON public.site_settings;

-- site_settings: add service_role write access
CREATE POLICY "Service role can manage settings"
ON public.site_settings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- booking_clicks: restrict reads to service_role only
DROP POLICY IF EXISTS "Anyone can read booking clicks" ON public.booking_clicks;

CREATE POLICY "Service role can read booking clicks"
ON public.booking_clicks
FOR SELECT
TO service_role
USING (true);
