-- Run with a privileged connection. Every test mutation rolls back.
BEGIN;
UPDATE cms_private.credentials SET password_hash = extensions.crypt('isolated-test-password',extensions.gen_salt('bf',10)), version = version + 1 WHERE singleton = true;
DO $$
DECLARE login jsonb; changed jsonb; attempt jsonb; i integer;
BEGIN
  login := public.cms_login('isolated-test-password','isolated-test-client');
  IF login->>'token' IS NULL THEN RAISE EXCEPTION 'login failed'; END IF;
  IF public.cms_validate_session(login->>'token') IS NULL THEN RAISE EXCEPTION 'valid session rejected'; END IF;
  IF public.cms_validate_session(repeat('0',64)) IS NOT NULL THEN RAISE EXCEPTION 'forged session accepted'; END IF;
  changed := public.cms_change_password(login->>'token','wrong-current','rotated-test-password');
  IF changed->>'status' <> '400' THEN RAISE EXCEPTION 'wrong current password accepted'; END IF;
  changed := public.cms_change_password(login->>'token','isolated-test-password',repeat('å',37));
  IF changed->>'status' <> '400' THEN RAISE EXCEPTION 'oversized Unicode password accepted'; END IF;
  IF public.cms_validate_session(login->>'token') IS NULL THEN RAISE EXCEPTION 'rejected password change revoked session'; END IF;
  changed := public.cms_change_password(login->>'token','isolated-test-password','rotated-test-password');
  IF changed->>'token' IS NULL THEN RAISE EXCEPTION 'password rotation failed'; END IF;
  IF public.cms_validate_session(login->>'token') IS NOT NULL THEN RAISE EXCEPTION 'old session not revoked'; END IF;
  IF public.cms_validate_session(changed->>'token') IS NULL THEN RAISE EXCEPTION 'new session rejected'; END IF;
  attempt := public.cms_login('isolated-test-password','isolated-test-client');
  IF attempt->>'status' <> '401' THEN RAISE EXCEPTION 'old password still accepted'; END IF;
  PERFORM public.cms_logout(changed->>'token');
  IF public.cms_validate_session(changed->>'token') IS NOT NULL THEN RAISE EXCEPTION 'logout failed'; END IF;
  FOR i IN 1..9 LOOP attempt := public.cms_login('wrong','isolated-rate-client'); END LOOP;
  IF attempt->>'status' <> '429' THEN RAISE EXCEPTION 'rate limit failed'; END IF;
  UPDATE cms_private.credentials SET password_hash = extensions.crypt(repeat('a',72),extensions.gen_salt('bf',10)), version = version + 1 WHERE singleton = true;
  login := public.cms_login(repeat('a',72),'isolated-byte-client');
  IF login->>'token' IS NULL THEN RAISE EXCEPTION '72 byte password rejected'; END IF;
  attempt := public.cms_login(repeat('a',72)||'suffix','isolated-byte-client');
  IF attempt->>'status' <> '401' THEN RAISE EXCEPTION 'truncated password accepted for login'; END IF;
  changed := public.cms_change_password(login->>'token',repeat('a',72)||'suffix','rotated-test-password');
  IF changed->>'status' <> '400' THEN RAISE EXCEPTION 'truncated current password accepted'; END IF;
  IF has_function_privilege('anon','public.cms_login(text,text)','EXECUTE') OR has_function_privilege('authenticated','public.cms_login(text,text)','EXECUTE') THEN RAISE EXCEPTION 'internal login function is public'; END IF;
  IF has_schema_privilege('anon','cms_private','USAGE') OR has_schema_privilege('authenticated','cms_private','USAGE') THEN RAISE EXCEPTION 'private credentials are exposed'; END IF;
END $$;
ROLLBACK;
