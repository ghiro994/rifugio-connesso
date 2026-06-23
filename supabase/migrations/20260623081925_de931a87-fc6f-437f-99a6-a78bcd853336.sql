
-- =====================================================
-- 1. Move has_role into app_internal (off the API surface)
-- =====================================================
CREATE SCHEMA IF NOT EXISTS app_internal;

CREATE OR REPLACE FUNCTION app_internal.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION app_internal.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_internal.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Repoint policies to app_internal.has_role
ALTER POLICY "Admins can delete announcements" ON public.announcements
  USING (app_internal.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can update announcements" ON public.announcements
  USING (app_internal.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can view all announcements" ON public.announcements
  USING (app_internal.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can delete rifugi" ON public.rifugi
  USING (app_internal.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can insert rifugi" ON public.rifugi
  WITH CHECK (app_internal.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can update rifugi" ON public.rifugi
  USING (app_internal.has_role(auth.uid(), 'admin'::public.app_role));

-- Storage policies (recreate to use app_internal.has_role)
DROP POLICY IF EXISTS "Admins can read rifugi files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload rifugi files" ON storage.objects;

CREATE POLICY "Admins can read rifugi files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'rifugi-uploads' AND app_internal.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can upload rifugi files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'rifugi-uploads' AND app_internal.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update rifugi files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'rifugi-uploads' AND app_internal.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (bucket_id = 'rifugi-uploads' AND app_internal.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete rifugi files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'rifugi-uploads' AND app_internal.has_role(auth.uid(), 'admin'::public.app_role));

-- Remove broad listing policy on the public bucket. Direct public CDN
-- URLs continue to serve files because the bucket is marked public.
DROP POLICY IF EXISTS "Anyone can view rifugi images" ON storage.objects;

DROP FUNCTION public.has_role(uuid, public.app_role);

-- =====================================================
-- 2. Lock down pgmq wrapper functions and pin search_path
-- =====================================================
CREATE OR REPLACE FUNCTION public.enqueue_email(queue_name text, payload jsonb)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  RETURN pgmq.send(queue_name, payload);
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN pgmq.send(queue_name, payload);
END;
$function$;

CREATE OR REPLACE FUNCTION public.read_email_batch(queue_name text, batch_size integer, vt integer)
RETURNS TABLE(msg_id bigint, read_ct integer, message jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  RETURN QUERY SELECT r.msg_id, r.read_ct, r.message FROM pgmq.read(queue_name, vt, batch_size) r;
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN;
END;
$function$;

CREATE OR REPLACE FUNCTION public.delete_email(queue_name text, message_id bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  RETURN pgmq.delete(queue_name, message_id);
EXCEPTION WHEN undefined_table THEN
  RETURN FALSE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.move_to_dlq(source_queue text, dlq_name text, message_id bigint, payload jsonb)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE new_id BIGINT;
BEGIN
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  PERFORM pgmq.delete(source_queue, message_id);
  RETURN new_id;
EXCEPTION WHEN undefined_table THEN
  BEGIN
    PERFORM pgmq.create(dlq_name);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  BEGIN
    PERFORM pgmq.delete(source_queue, message_id);
  EXCEPTION WHEN undefined_table THEN
    NULL;
  END;
  RETURN new_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;

-- =====================================================
-- 3. Hide announcement contact details from anon
-- =====================================================
-- Tighten INSERT: anonymous submissions must land as pending review
DROP POLICY "Anyone can submit announcements" ON public.announcements;
CREATE POLICY "Anyone can submit pending announcements"
  ON public.announcements FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'in_attesa'::public.announcement_status);

-- Drop public read of full row; expose a curated view instead
DROP POLICY "Public can view published announcements" ON public.announcements;

CREATE OR REPLACE VIEW public.announcements_public
WITH (security_invoker = false) AS
SELECT
  id, type, title, description, contact_name, region, season, status,
  rifugio_name, role_sought, website, desired_role, experience,
  preferred_area, availability, created_at, updated_at
FROM public.announcements
WHERE status = 'pubblicato'::public.announcement_status;

REVOKE ALL ON public.announcements_public FROM PUBLIC;
GRANT SELECT ON public.announcements_public TO anon, authenticated;
