-- ⚡ БЫСТРОЕ ИСПРАВЛЕНИЕ: Обновить URL-ы изображений
-- Замена placeholder URL-ов на реальные URL-ы из Supabase Storage
-- Выполните этот скрипт в Supabase SQL Editor

-- =============================================
-- Шаг 1: Проверить текущее состояние
-- =============================================

SELECT 
  id,
  name_ka,
  name_ru,
  avatar_url,
  profile_image_url
FROM fathers
WHERE deleted = false
ORDER BY "order";

-- =============================================
-- Шаг 2: Обновить URL-ы на правильные из Storage
-- =============================================

-- Father 1: წმინდა ანტონი დიდი (Антоний Великий)
UPDATE fathers 
SET 
  avatar_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-1.png',
  profile_image_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-1.png',
  updated_at = NOW()
WHERE id = 'f1111111-1111-1111-1111-111111111111';

-- Father 2: წმინდა სერაფიმე სარავალი (Серафим Саровский)
UPDATE fathers 
SET 
  avatar_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-2.png',
  profile_image_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-2.png',
  updated_at = NOW()
WHERE id = 'f2222222-2222-2222-2222-222222222222';

-- Father 3: წმინდა იოანე ოქროპირი (Иоанн Златоуст)
UPDATE fathers 
SET 
  avatar_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-3.png',
  profile_image_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-3.png',
  updated_at = NOW()
WHERE id = 'f3333333-3333-3333-3333-333333333333';

-- Father 4: ღვთისმშობელი მარიამი (Пресвятая Богородица)
UPDATE fathers 
SET 
  avatar_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-4.png',
  profile_image_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-4.png',
  updated_at = NOW()
WHERE id = 'f4444444-4444-4444-4444-444444444444';

-- =============================================
-- Шаг 3: Проверить результат
-- =============================================

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

-- =============================================
-- Шаг 4: Проверить что изображения доступны
-- =============================================

-- Скопируйте эти URL и откройте в браузере:
-- https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-1.png
-- https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-2.png
-- https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-3.png
-- https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-4.png

-- ✅ Если изображения открываются - всё готово!
-- ❌ Если получаете 404 - нужно загрузить файлы в Storage (см. admin/upload-images.html)
-- ❌ Если получаете 403 - нужно сделать bucket публичным
