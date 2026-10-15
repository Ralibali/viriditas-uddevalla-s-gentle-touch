UPDATE public.site_settings SET setting_value = 'Välkommen önskar jag, Andreas.', updated_at = now() WHERE setting_key = 'cta2_title';
DELETE FROM public.site_settings WHERE setting_key IN ('about_text_goliat') OR setting_value ILIKE '%goliat%';
UPDATE public.site_settings SET setting_value = 'Om Andreas' WHERE setting_key = 'about_title' AND setting_value ILIKE '%goliat%';