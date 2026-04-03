
-- Create rifugi table
CREATE TABLE public.rifugi (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  region text NOT NULL,
  province text NOT NULL DEFAULT '',
  mountain_range text NOT NULL DEFAULT '',
  altitude integer NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  services text[] NOT NULL DEFAULT '{}',
  access text NOT NULL DEFAULT '',
  contacts text NOT NULL DEFAULT '',
  website text NOT NULL DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(name, region)
);

-- Enable RLS
ALTER TABLE public.rifugi ENABLE ROW LEVEL SECURITY;

-- Public can read all rifugi
CREATE POLICY "Anyone can view rifugi" ON public.rifugi
  FOR SELECT TO anon, authenticated
  USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can insert rifugi" ON public.rifugi
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update rifugi" ON public.rifugi
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete rifugi" ON public.rifugi
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_rifugi_updated_at
  BEFORE UPDATE ON public.rifugi
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for XLS uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('rifugi-uploads', 'rifugi-uploads', false);

-- Storage policies: only admins can upload
CREATE POLICY "Admins can upload rifugi files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'rifugi-uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read rifugi files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'rifugi-uploads' AND public.has_role(auth.uid(), 'admin'));
