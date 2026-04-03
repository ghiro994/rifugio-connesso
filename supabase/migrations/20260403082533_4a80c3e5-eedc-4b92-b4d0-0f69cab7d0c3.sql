
-- Create announcement status enum
CREATE TYPE public.announcement_status AS ENUM ('bozza', 'in_attesa', 'pubblicato', 'rifiutato');

-- Create announcement type enum
CREATE TYPE public.announcement_type AS ENUM ('cerco', 'offro');

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
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
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form submission)
CREATE POLICY "Anyone can submit announcements"
ON public.announcements
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Public can only see published announcements
CREATE POLICY "Public can view published announcements"
ON public.announcements
FOR SELECT
TO anon, authenticated
USING (status = 'pubblicato');

-- Authenticated users can view all (for admin)
CREATE POLICY "Authenticated can view all announcements"
ON public.announcements
FOR SELECT
TO authenticated
USING (true);

-- Authenticated can update (for admin moderation)
CREATE POLICY "Authenticated can update announcements"
ON public.announcements
FOR UPDATE
TO authenticated
USING (true);

-- Authenticated can delete
CREATE POLICY "Authenticated can delete announcements"
ON public.announcements
FOR DELETE
TO authenticated
USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
