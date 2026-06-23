
-- Remove the SECURITY DEFINER view; switch to column-level grants
DROP VIEW IF EXISTS public.announcements_public;

-- Anon can read published rows but only non-PII columns
CREATE POLICY "Anon can view published announcements"
  ON public.announcements FOR SELECT TO anon
  USING (status = 'pubblicato'::public.announcement_status);

-- Column-level grants: anon never sees email/phone
REVOKE SELECT ON public.announcements FROM anon;
GRANT SELECT (
  id, type, title, description, contact_name, region, season, status,
  rifugio_name, role_sought, website, desired_role, experience,
  preferred_area, availability, created_at, updated_at
) ON public.announcements TO anon;
