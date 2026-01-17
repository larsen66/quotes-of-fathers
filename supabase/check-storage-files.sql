-- Проверить какие файлы уже загружены в Supabase Storage
-- Выполните в Supabase SQL Editor

-- =============================================
-- Проверить файлы в bucket 'fathers'
-- =============================================

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
-- Результат покажет:
-- =============================================
-- Если таблица ПУСТАЯ:
--   ❌ Файлы НЕ загружены
--   → Загрузите через admin/upload-images.html
--
-- Если видите father-1.png, father-2.png и т.д.:
--   ✅ Файлы загружены
--   → Скопируйте public_url и обновите таблицу fathers
--
-- Если видите другие имена файлов:
--   ⚠️ Файлы с другими именами
--   → Используйте эти URL для обновления таблицы fathers
