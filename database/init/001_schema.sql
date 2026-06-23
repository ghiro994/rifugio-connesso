CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE announcement_status AS ENUM ('bozza', 'in_attesa', 'pubblicato', 'rifiutato');
CREATE TYPE announcement_type AS ENUM ('cerco', 'offro');
CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type announcement_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  region TEXT NOT NULL,
  season TEXT NOT NULL,
  status announcement_status NOT NULL DEFAULT 'in_attesa',
  rifugio_name TEXT,
  role_sought TEXT,
  website TEXT,
  desired_role TEXT,
  experience TEXT,
  preferred_area TEXT,
  availability TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE rifugi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  province TEXT NOT NULL DEFAULT '',
  mountain_range TEXT NOT NULL DEFAULT '',
  altitude INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  services TEXT[] NOT NULL DEFAULT '{}',
  access TEXT NOT NULL DEFAULT '',
  contacts TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  images TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (name, region)
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER rifugi_updated_at
  BEFORE UPDATE ON rifugi
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
