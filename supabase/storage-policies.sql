-- Storage Policies for "fathers" bucket
-- Run this in Supabase SQL Editor

-- =============================================
-- 1. Create bucket (if not exists)
-- =============================================
-- Note: Buckets are usually created via Dashboard
-- This is for reference only

-- =============================================
-- 2. Enable public access for reading images
-- =============================================

-- Allow anyone (including unauthenticated users) to read/view images
CREATE POLICY IF NOT EXISTS "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'fathers');

-- =============================================
-- 3. Authenticated write access (for admin panel)
-- =============================================

-- Allow authenticated users to insert new images
CREATE POLICY IF NOT EXISTS "Authenticated insert access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'fathers');

-- Allow authenticated users to update existing images
CREATE POLICY IF NOT EXISTS "Authenticated update access"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'fathers');

-- Allow authenticated users to delete images
CREATE POLICY IF NOT EXISTS "Authenticated delete access"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'fathers');

-- =============================================
-- Verify policies
-- =============================================
SELECT 
  policyname,
  cmd as operation,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';
