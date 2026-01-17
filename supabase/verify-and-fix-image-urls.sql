-- Verify and Fix Image URLs in fathers table
-- Run this after uploading images to Storage

-- =============================================
-- 1. Check current state
-- =============================================

-- Show current fathers with their image URLs
SELECT 
  id,
  name_ka,
  name_ru,
  avatar_url,
  profile_image_url,
  updated_at
FROM fathers
WHERE deleted = false
ORDER BY "order";

-- Show what's in Storage
SELECT 
  name as filename,
  bucket_id,
  created_at,
  CONCAT(
    'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/',
    bucket_id,
    '/',
    name
  ) as public_url
FROM storage.objects
WHERE bucket_id = 'fathers'
ORDER BY name;

-- =============================================
-- 2. Check if URLs are accessible
-- =============================================

-- This query shows which URLs might be broken
-- (You'll need to manually test them in browser)
SELECT 
  id,
  name_ka,
  CASE 
    WHEN avatar_url LIKE 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/%' 
    THEN '✅ URL format correct'
    ELSE '❌ URL format wrong'
  END as avatar_status,
  avatar_url
FROM fathers
WHERE deleted = false
ORDER BY "order";

-- =============================================
-- 3. Fix URLs (uncomment and adjust if needed)
-- =============================================

-- Option A: If files are named exactly father-1.png, father-2.png, etc.
/*
UPDATE fathers 
SET 
  avatar_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-1.png',
  profile_image_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-1.png',
  updated_at = NOW()
WHERE id = 'f1111111-1111-1111-1111-111111111111';

UPDATE fathers 
SET 
  avatar_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-2.png',
  profile_image_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-2.png',
  updated_at = NOW()
WHERE id = 'f2222222-2222-2222-2222-222222222222';

UPDATE fathers 
SET 
  avatar_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-3.png',
  profile_image_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-3.png',
  updated_at = NOW()
WHERE id = 'f3333333-3333-3333-3333-333333333333';

UPDATE fathers 
SET 
  avatar_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-4.png',
  profile_image_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-4.png',
  updated_at = NOW()
WHERE id = 'f4444444-4444-4444-4444-444444444444';
*/

-- Option B: If files are in avatars/ subdirectory
/*
UPDATE fathers 
SET 
  avatar_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/avatars/father-1.png',
  profile_image_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/avatars/father-1.png',
  updated_at = NOW()
WHERE id = 'f1111111-1111-1111-1111-111111111111';

-- (repeat for other fathers)
*/

-- =============================================
-- 4. Verify fix
-- =============================================

-- After updating, check results
SELECT 
  id,
  name_ka,
  avatar_url,
  updated_at
FROM fathers
WHERE deleted = false
ORDER BY "order";

-- =============================================
-- 5. Test URLs manually
-- =============================================

-- Copy these URLs and open in browser to verify they work:
-- https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-1.png
-- https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-2.png
-- https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-3.png
-- https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-4.png

-- If you get 404 or 403 errors:
-- 1. Check that files are uploaded to Storage
-- 2. Check that bucket 'fathers' is PUBLIC
-- 3. Check that storage policies allow public SELECT
