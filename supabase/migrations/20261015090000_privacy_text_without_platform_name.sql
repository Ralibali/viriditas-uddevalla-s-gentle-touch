-- The privacy page named the hosting platform as "Lovable Cloud/Supabase".
-- The default text now says "Supabase"; saved copies of the old wording follow.
UPDATE public.site_settings
SET setting_value = replace(setting_value, 'Lovable Cloud/Supabase', 'Supabase')
WHERE setting_value LIKE '%Lovable Cloud/Supabase%';
