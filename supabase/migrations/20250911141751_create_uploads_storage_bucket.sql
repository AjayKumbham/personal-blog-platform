/*
  # Create uploads storage bucket for file uploads
  
  This migration creates the uploads bucket for general file uploads
  including resumes, documents, and other assets.
*/

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the uploads bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT 
USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update their uploads" ON storage.objects FOR UPDATE 
USING (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete their uploads" ON storage.objects FOR DELETE 
USING (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);