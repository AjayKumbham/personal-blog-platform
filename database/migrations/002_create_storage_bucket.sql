-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true);

-- Set up RLS policies for the uploads bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their uploads" ON storage.objects FOR UPDATE 
USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete their uploads" ON storage.objects FOR DELETE 
USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');