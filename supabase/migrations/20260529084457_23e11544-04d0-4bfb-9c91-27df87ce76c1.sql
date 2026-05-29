
CREATE SCHEMA IF NOT EXISTS app_internal;

CREATE TABLE IF NOT EXISTS app_internal.config (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

REVOKE ALL ON SCHEMA app_internal FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA app_internal FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA app_internal TO service_role;
GRANT ALL ON app_internal.config TO service_role;

INSERT INTO app_internal.config(key, value)
VALUES ('backup_cron_secret', encode(gen_random_bytes(32), 'hex'))
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION app_internal.get_backup_cron_secret()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = app_internal
AS $$
  SELECT value FROM app_internal.config WHERE key = 'backup_cron_secret'
$$;
REVOKE ALL ON FUNCTION app_internal.get_backup_cron_secret() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION app_internal.get_backup_cron_secret() TO service_role;
