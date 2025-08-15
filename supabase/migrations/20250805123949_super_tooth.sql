/*
  # Create storage bucket for blog cover images

  1. Storage Setup
    - Create 'blog-covers' bucket for storing cover images
    - Set bucket to public for easy access
    - Configure RLS policies for upload permissions

  2. Security
    - Allow public read access to images
    - Allow authenticated users to upload images
    - Restrict file types to images only
*/

-- Create storage bucket for blog cover images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-covers',
  'blog-covers',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public read access
CREATE POLICY "Public can view blog cover images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-covers');

-- Create policy to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload blog covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-covers');

-- Create policy to allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update blog covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-covers');

-- Create policy to allow authenticated users to delete
CREATE POLICY "Authenticated users can delete blog covers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-covers');