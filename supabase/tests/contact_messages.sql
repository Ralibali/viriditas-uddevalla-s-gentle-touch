-- Run with a privileged connection. Every test mutation rolls back.
BEGIN;
INSERT INTO cms_private.contact_messages(kind, name, email, message, created_at)
VALUES ('question', 'Gammal', 'gammal@example.se', 'Från förra året', now() - interval '13 months');

SET LOCAL ROLE service_role;
DO $$
DECLARE result jsonb; i integer; messages jsonb; counts jsonb;
BEGIN
  result := public.cms_submit_message('client-a', 'question', 'Anna', 'anna@example.se', '', 'Har du tider på lördagar?', '{}'::jsonb, '/');
  IF result->>'id' IS NULL THEN RAISE EXCEPTION 'question was not stored: %', result; END IF;
  IF EXISTS (SELECT 1 FROM cms_private.contact_messages WHERE name = 'Gammal') THEN RAISE EXCEPTION 'messages older than twelve months were kept'; END IF;

  result := public.cms_submit_message('client-a', 'gift_card', 'Bo', 'bo@example.se', '0701234567', NULL, '{"amount": "720 kr"}'::jsonb, '/');
  IF result->>'id' IS NULL THEN RAISE EXCEPTION 'gift card request was not stored'; END IF;

  counts := public.cms_message_counts();
  IF (counts->>'new')::int <> 2 OR (counts->>'gift_cards_new')::int <> 1 THEN RAISE EXCEPTION 'unexpected counts: %', counts; END IF;

  FOR i IN 1..3 LOOP
    result := public.cms_submit_message('client-a', 'question', 'Anna', 'anna@example.se', NULL, 'Hej', NULL, NULL);
  END LOOP;
  result := public.cms_submit_message('client-a', 'question', 'Anna', 'anna@example.se', NULL, 'Hej igen', NULL, NULL);
  IF result->>'status' <> '429' THEN RAISE EXCEPTION 'a sixth message within the hour was accepted: %', result; END IF;

  result := public.cms_submit_message('client-b', 'question', 'Cia', 'cia@example.se', NULL, 'Hej', NULL, NULL);
  IF result->>'id' IS NULL THEN RAISE EXCEPTION 'another visitor was blocked by the first visitor''s limit'; END IF;

  messages := public.cms_list_messages('new');
  IF jsonb_array_length(messages) <> 6 THEN RAISE EXCEPTION 'expected 6 new messages, got %', jsonb_array_length(messages); END IF;
  IF messages->0->>'name' <> 'Cia' THEN RAISE EXCEPTION 'newest message is not first'; END IF;

  result := public.cms_update_message((messages->0->>'id')::uuid, 'handled');
  IF result->>'success' IS NULL THEN RAISE EXCEPTION 'marking as handled failed: %', result; END IF;
  IF jsonb_array_length(public.cms_list_messages('handled')) <> 1 THEN RAISE EXCEPTION 'handled filter is wrong'; END IF;
  IF (public.cms_list_messages('handled')->0->>'handled_at') IS NULL THEN RAISE EXCEPTION 'handled time missing'; END IF;

  result := public.cms_update_message((messages->0->>'id')::uuid, 'archived');
  IF result->>'status' <> '400' THEN RAISE EXCEPTION 'an unknown status was accepted'; END IF;

  PERFORM public.cms_delete_message((messages->0->>'id')::uuid);
  IF jsonb_array_length(public.cms_list_messages(NULL)) <> 5 THEN RAISE EXCEPTION 'deleting a message failed'; END IF;
END $$;
RESET ROLE;

DO $$
BEGIN
  IF has_function_privilege('anon', 'public.cms_submit_message(text,text,text,text,text,text,jsonb,text)', 'EXECUTE')
     OR has_function_privilege('authenticated', 'public.cms_submit_message(text,text,text,text,text,text,jsonb,text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'visitors can bypass the form function';
  END IF;
  IF has_function_privilege('anon', 'public.cms_list_messages(text)', 'EXECUTE')
     OR has_function_privilege('authenticated', 'public.cms_list_messages(text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'visitors can read messages';
  END IF;
  IF has_table_privilege('anon', 'cms_private.contact_messages', 'SELECT')
     OR has_schema_privilege('anon', 'cms_private', 'USAGE') THEN
    RAISE EXCEPTION 'the message table is exposed';
  END IF;
END $$;
ROLLBACK;
