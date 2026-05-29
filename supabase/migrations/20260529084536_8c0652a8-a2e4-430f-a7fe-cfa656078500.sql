
CREATE OR REPLACE FUNCTION public.get_backup_cron_secret()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = app_internal, public
AS $$
  SELECT value FROM app_internal.config WHERE key = 'backup_cron_secret'
$$;
REVOKE ALL ON FUNCTION public.get_backup_cron_secret() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_backup_cron_secret() TO service_role;
