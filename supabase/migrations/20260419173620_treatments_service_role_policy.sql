DROP POLICY IF EXISTS "Service role can manage treatments" ON public.treatments;

CREATE POLICY "Service role can manage treatments"
ON public.treatments FOR ALL
TO service_role
USING (true)
WITH CHECK (true);