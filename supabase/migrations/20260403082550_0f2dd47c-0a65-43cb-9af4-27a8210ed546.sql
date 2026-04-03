
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can view roles
CREATE POLICY "Roles are viewable by authenticated users"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Security definer function to check roles without recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Drop overly permissive policies
DROP POLICY "Authenticated can view all announcements" ON public.announcements;
DROP POLICY "Authenticated can update announcements" ON public.announcements;
DROP POLICY "Authenticated can delete announcements" ON public.announcements;

-- Recreate with admin role check
CREATE POLICY "Admins can view all announcements"
ON public.announcements
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update announcements"
ON public.announcements
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete announcements"
ON public.announcements
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
