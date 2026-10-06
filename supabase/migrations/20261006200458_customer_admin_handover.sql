-- Passwords and sessions are private. No default password is committed.
CREATE SCHEMA IF NOT EXISTS cms_private;
REVOKE ALL ON SCHEMA cms_private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA cms_private TO service_role;

CREATE TABLE IF NOT EXISTS cms_private.credentials (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  password_hash text NOT NULL,
  version integer NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS cms_private.sessions (
  token_hash text PRIMARY KEY,
  version integer NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS cms_private.login_limits (
  client_key text PRIMARY KEY,
  attempts integer NOT NULL DEFAULT 0,
  window_start timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE cms_private.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_private.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_private.login_limits ENABLE ROW LEVEL SECURITY;
GRANT ALL ON ALL TABLES IN SCHEMA cms_private TO service_role;

CREATE OR REPLACE FUNCTION public.cms_login(p_password text, p_client text)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE credentials cms_private.credentials%ROWTYPE; token text; expiry timestamptz;
BEGIN
  SELECT * INTO credentials FROM cms_private.credentials WHERE singleton = true FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('error','Admininloggningen är inte konfigurerad.','status',503); END IF;
  IF p_password IS NULL OR octet_length(p_password) > 72 THEN RETURN jsonb_build_object('error','Fel lösenord.','status',401); END IF;
  -- Global and client limits are serialized by the credential row lock.
  INSERT INTO cms_private.login_limits(client_key) VALUES ('global'), (p_client) ON CONFLICT DO NOTHING;
  UPDATE cms_private.login_limits SET attempts = 0, window_start = now()
    WHERE client_key IN ('global',p_client) AND window_start < now() - interval '15 minutes';
  IF EXISTS (SELECT 1 FROM cms_private.login_limits WHERE (client_key = p_client AND attempts >= 8) OR (client_key = 'global' AND attempts >= 60)) THEN
    RETURN jsonb_build_object('error','För många försök. Vänta 15 minuter och försök igen.','status',429);
  END IF;
  IF credentials.password_hash <> extensions.crypt(p_password, credentials.password_hash) THEN
    UPDATE cms_private.login_limits SET attempts = attempts + 1 WHERE client_key IN ('global',p_client);
    RETURN jsonb_build_object('error','Fel lösenord.','status',401);
  END IF;
  DELETE FROM cms_private.sessions WHERE expires_at <= now();
  DELETE FROM cms_private.login_limits WHERE window_start < now() - interval '1 day';
  UPDATE cms_private.login_limits SET attempts = 0 WHERE client_key = p_client;
  token := encode(extensions.gen_random_bytes(32),'hex');
  expiry := now() + interval '8 hours';
  INSERT INTO cms_private.sessions(token_hash,version,expires_at)
    VALUES (encode(extensions.digest(token,'sha256'),'hex'),credentials.version,expiry);
  RETURN jsonb_build_object('token',token,'expires_at',expiry);
END;
$$;

CREATE OR REPLACE FUNCTION public.cms_validate_session(p_token text)
RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
  SELECT jsonb_build_object('expires_at',s.expires_at) FROM cms_private.sessions s
  JOIN cms_private.credentials c ON c.version = s.version
  WHERE s.token_hash = encode(extensions.digest(p_token,'sha256'),'hex') AND s.expires_at > now();
$$;

CREATE OR REPLACE FUNCTION public.cms_change_password(p_token text,p_current text,p_new text)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE credentials cms_private.credentials%ROWTYPE; token text; expiry timestamptz;
BEGIN
  SELECT * INTO credentials FROM cms_private.credentials WHERE singleton = true FOR UPDATE;
  IF NOT EXISTS (SELECT 1 FROM cms_private.sessions WHERE token_hash = encode(extensions.digest(p_token,'sha256'),'hex') AND expires_at > now() AND version = credentials.version) THEN
    RETURN jsonb_build_object('error','Logga in för att fortsätta.','status',401);
  END IF;
  IF p_current IS NULL OR octet_length(p_current)>72 OR credentials.password_hash <> extensions.crypt(p_current,credentials.password_hash) THEN
    RETURN jsonb_build_object('error','Nuvarande lösenord stämmer inte.','status',400);
  END IF;
  IF p_new IS NULL OR length(p_new)<8 THEN RETURN jsonb_build_object('error','Det nya lösenordet behöver innehålla minst 8 tecken.','status',400); END IF;
  IF octet_length(p_new)>72 THEN RETURN jsonb_build_object('error','Det nya lösenordet är för långt. Korta ned det.','status',400); END IF;
  IF p_new = p_current THEN RETURN jsonb_build_object('error','Välj ett annat lösenord än ditt nuvarande.','status',400); END IF;
  UPDATE cms_private.credentials SET password_hash = extensions.crypt(p_new,extensions.gen_salt('bf',10)),version = version + 1 WHERE singleton = true;
  DELETE FROM cms_private.sessions;
  DELETE FROM cms_private.login_limits;
  token := encode(extensions.gen_random_bytes(32),'hex'); expiry := now() + interval '8 hours';
  INSERT INTO cms_private.sessions(token_hash,version,expires_at)
    VALUES (encode(extensions.digest(token,'sha256'),'hex'),credentials.version + 1,expiry);
  RETURN jsonb_build_object('token',token,'expires_at',expiry);
END;
$$;

CREATE OR REPLACE FUNCTION public.cms_logout(p_token text)
RETURNS void LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
  DELETE FROM cms_private.sessions WHERE token_hash = encode(extensions.digest(p_token,'sha256'),'hex');
$$;

REVOKE ALL ON FUNCTION public.cms_login(text,text), public.cms_validate_session(text), public.cms_change_password(text,text,text), public.cms_logout(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cms_login(text,text), public.cms_validate_session(text), public.cms_change_password(text,text,text), public.cms_logout(text) TO service_role;

-- Visitors can only read published site content.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.site_pages, public.site_settings FROM anon, authenticated;
GRANT SELECT ON public.site_pages, public.site_settings TO anon, authenticated;

INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES ('site-media','site-media',true,5242880,ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT(id) DO UPDATE SET public = EXCLUDED.public, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;
