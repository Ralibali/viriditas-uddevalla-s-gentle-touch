-- Questions and gift card requests sent from the website.
--
-- Personal data lives in the private schema, which the public API never exposes.
-- Visitors submit only through the contact-form edge function and the
-- administrator reads messages only through cms-admin. Both run as service_role.

CREATE SCHEMA IF NOT EXISTS cms_private;
REVOKE ALL ON SCHEMA cms_private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA cms_private TO service_role;

CREATE TABLE IF NOT EXISTS cms_private.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('question', 'gift_card')),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 40),
  message text CHECK (message IS NULL OR char_length(message) <= 4000),
  details jsonb NOT NULL DEFAULT '{}'::jsonb
    CHECK (jsonb_typeof(details) = 'object' AND octet_length(details::text) <= 4000),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'handled')),
  page_path text CHECK (page_path IS NULL OR char_length(page_path) <= 200),
  notified boolean NOT NULL DEFAULT false,
  -- clock_timestamp keeps the order exact even for messages stored in one transaction.
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  handled_at timestamptz
);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON cms_private.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS contact_messages_status_idx ON cms_private.contact_messages (status, created_at DESC);

CREATE TABLE IF NOT EXISTS cms_private.form_limits (
  client_key text PRIMARY KEY,
  attempts integer NOT NULL DEFAULT 0,
  window_start timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cms_private.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_private.form_limits ENABLE ROW LEVEL SECURITY;
GRANT ALL ON cms_private.contact_messages, cms_private.form_limits TO service_role;

-- Store one message. Limits: 5 per visitor and 60 in total per hour.
-- Messages older than twelve months are removed as new ones arrive.
CREATE OR REPLACE FUNCTION public.cms_submit_message(
  p_client text, p_kind text, p_name text, p_email text, p_phone text,
  p_message text, p_details jsonb, p_page text
)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE new_id uuid;
BEGIN
  DELETE FROM cms_private.contact_messages WHERE created_at < now() - interval '12 months';
  DELETE FROM cms_private.form_limits WHERE window_start < now() - interval '1 day' AND client_key <> 'global';

  INSERT INTO cms_private.form_limits(client_key) VALUES ('global'), (p_client) ON CONFLICT DO NOTHING;
  -- Serialize concurrent submissions on the global counter.
  PERFORM 1 FROM cms_private.form_limits WHERE client_key = 'global' FOR UPDATE;
  UPDATE cms_private.form_limits SET attempts = 0, window_start = now()
    WHERE client_key IN ('global', p_client) AND window_start < now() - interval '1 hour';
  IF EXISTS (
    SELECT 1 FROM cms_private.form_limits
    WHERE (client_key = p_client AND attempts >= 5) OR (client_key = 'global' AND attempts >= 60)
  ) THEN
    RETURN jsonb_build_object('error', 'Många meddelanden har skickats på kort tid. Vänta en stund och försök igen, eller mejla direkt.', 'status', 429);
  END IF;
  UPDATE cms_private.form_limits SET attempts = attempts + 1 WHERE client_key IN ('global', p_client);

  INSERT INTO cms_private.contact_messages(kind, name, email, phone, message, details, page_path)
  VALUES (
    p_kind, p_name, p_email, NULLIF(btrim(p_phone), ''), NULLIF(btrim(p_message), ''),
    COALESCE(p_details, '{}'::jsonb), NULLIF(p_page, '')
  )
  RETURNING id INTO new_id;
  RETURN jsonb_build_object('id', new_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.cms_mark_message_notified(p_id uuid)
RETURNS void LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
  UPDATE cms_private.contact_messages SET notified = true WHERE id = p_id;
$$;

CREATE OR REPLACE FUNCTION public.cms_list_messages(p_status text DEFAULT NULL)
RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
  SELECT COALESCE(jsonb_agg(to_jsonb(m) ORDER BY m.created_at DESC), '[]'::jsonb)
  FROM (
    SELECT id, kind, name, email, phone, message, details, status, page_path, notified, created_at, handled_at
    FROM cms_private.contact_messages
    WHERE p_status IS NULL OR status = p_status
    ORDER BY created_at DESC
    LIMIT 500
  ) m;
$$;

CREATE OR REPLACE FUNCTION public.cms_update_message(p_id uuid, p_status text)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF p_status NOT IN ('new', 'handled') THEN
    RETURN jsonb_build_object('error', 'Ogiltig status.', 'status', 400);
  END IF;
  UPDATE cms_private.contact_messages
  SET status = p_status, handled_at = CASE WHEN p_status = 'handled' THEN now() ELSE NULL END
  WHERE id = p_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'Meddelandet finns inte längre.', 'status', 404); END IF;
  RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.cms_delete_message(p_id uuid)
RETURNS void LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
  DELETE FROM cms_private.contact_messages WHERE id = p_id;
$$;

CREATE OR REPLACE FUNCTION public.cms_message_counts()
RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
  SELECT jsonb_build_object(
    'new', count(*) FILTER (WHERE status = 'new'),
    'total', count(*),
    'gift_cards_new', count(*) FILTER (WHERE status = 'new' AND kind = 'gift_card')
  )
  FROM cms_private.contact_messages;
$$;

REVOKE ALL ON FUNCTION
  public.cms_submit_message(text, text, text, text, text, text, jsonb, text),
  public.cms_mark_message_notified(uuid),
  public.cms_list_messages(text),
  public.cms_update_message(uuid, text),
  public.cms_delete_message(uuid),
  public.cms_message_counts()
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
  public.cms_submit_message(text, text, text, text, text, text, jsonb, text),
  public.cms_mark_message_notified(uuid),
  public.cms_list_messages(text),
  public.cms_update_message(uuid, text),
  public.cms_delete_message(uuid),
  public.cms_message_counts()
TO service_role;
