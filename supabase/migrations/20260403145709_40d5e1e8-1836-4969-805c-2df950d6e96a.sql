
-- Make bucket public so anyone can view images
UPDATE storage.buckets SET public = true WHERE id = 'rifugi-uploads';

-- Add public read policy for anyone
CREATE POLICY "Anyone can view rifugi images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'rifugi-uploads');
