-- Update fathers with real image URLs
-- Replace YOUR_PROJECT_REF with your actual Supabase project reference (kprqbfxzbclouateifeh)

UPDATE fathers
SET 
  avatar_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/avatars/father-1.jpg',
  profile_image_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/avatars/father-1.jpg',
  updated_at = NOW()
WHERE id = 'f1111111-1111-1111-1111-111111111111';

UPDATE fathers
SET 
  avatar_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/avatars/father-2.jpg',
  profile_image_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/avatars/father-2.jpg',
  updated_at = NOW()
WHERE id = 'f2222222-2222-2222-2222-222222222222';

UPDATE fathers
SET 
  avatar_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/avatars/father-3.jpg',
  profile_image_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/avatars/father-3.jpg',
  updated_at = NOW()
WHERE id = 'f3333333-3333-3333-3333-333333333333';

-- If you have a 4th father, add:
-- UPDATE fathers
-- SET 
--   avatar_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/avatars/father-4.jpg',
--   profile_image_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/avatars/father-4.jpg',
--   updated_at = NOW()
-- WHERE id = 'f4444444-4444-4444-4444-444444444444';

-- Verify the update
SELECT id, name_ka, name_ru, avatar_url FROM fathers WHERE deleted = false ORDER BY "order";
