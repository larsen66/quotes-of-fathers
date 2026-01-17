# Настройка Supabase Storage для изображений

## Проблема
Фотографии из Supabase не отображаются в приложении.

## Причина
В `initialSync.ts` изображения не скачивались локально, а использовались URL-ы напрямую. Это было исправлено, но нужно убедиться, что:
1. Bucket `fathers` существует и настроен правильно
2. Файлы загружены в Storage
3. Настроены публичные политики доступа

## Шаги для проверки и настройки

### 1. Проверьте существование bucket

Перейдите в Supabase Dashboard:
- Storage → Buckets
- Убедитесь, что существует bucket с именем `fathers`

### 2. Настройте публичный доступ к bucket

Если bucket не публичный:
- Откройте bucket `fathers`
- Configuration → Public bucket: **включите**

### 3. Настройте Storage Policies

Перейдите в Storage → Policies для bucket `fathers`:

**Для публичного чтения (обязательно):**
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'fathers');
```

**Для аутентифицированной записи (для админ-панели):**
```sql
CREATE POLICY "Authenticated write access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'fathers');

CREATE POLICY "Authenticated update access"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'fathers');

CREATE POLICY "Authenticated delete access"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'fathers');
```

### 4. Загрузите тестовые изображения

Файлы уже есть в проекте:
- `quotes-of-fathers/assets/father-1.png`
- `quotes-of-fathers/assets/father-2.png`
- `quotes-of-fathers/assets/father-3.png`
- `quotes-of-fathers/assets/father-4.png`

**Способ 1: Через Dashboard**
1. Storage → fathers bucket
2. Загрузите файлы в папку `fathers/`:
   - `father-1.png`
   - `father-2.png`
   - `father-3.png`
   - `father-4.png`

**Способ 2: Через admin панель**
1. Запустите admin панель: `cd admin && npm run dev`
2. Войдите в систему
3. Перейдите в Fathers
4. Для каждого отца загрузите соответствующее изображение

### 5. Проверьте URL-ы в базе данных

URL должны быть в формате:
```
https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-1.png
```

Проверьте через SQL Editor:
```sql
SELECT id, name_ka, avatar_url, profile_image_url 
FROM fathers 
WHERE deleted = false;
```

### 6. Проверьте доступность URL

Откройте в браузере один из URL-ов, например:
```
https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-1.png
```

Если изображение не открывается:
- Файл не загружен в Storage
- Bucket не настроен как публичный
- Неправильный путь к файлу

### 7. Обновите seed данные (если нужно)

Если файлы загружены с другими именами, обновите `seed-test-data-fixed.sql`:
```sql
UPDATE fathers 
SET 
  avatar_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/[правильное_имя_файла]',
  profile_image_url = 'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/[правильное_имя_файла]'
WHERE id = 'f1111111-1111-1111-1111-111111111111';
```

## Что было исправлено в коде

### Файл: `quotes-of-fathers/src/services/sync/initialSync.ts`

**Было (неправильно):**
```typescript
const avatarLocalPath = father.avatarUrl;
const profileLocalPath = father.profileImageUrl || null;
```

**Стало (правильно):**
```typescript
const avatarLocalPath = await downloadFile(father.avatarUrl, `avatar_${father.id}.jpg`);
const profileLocalPath = father.profileImageUrl
  ? await downloadFile(father.profileImageUrl, `profile_${father.id}.jpg`)
  : null;
```

Теперь изображения скачиваются локально на устройство при первой синхронизации.

## Тестирование после настройки

1. Удалите приложение с устройства/эмулятора
2. Переустановите приложение
3. Запустите первую синхронизацию
4. Проверьте, что изображения отображаются на экране "Все отцы"

## Логи для отладки

При синхронизации должны появиться логи:
```
📥 Downloading avatar from: https://...
✅ Avatar downloaded to: file://...
✅ Profile image downloaded to: file://...
✅ Saved [имя отца] to local DB
```

Если видите ошибки:
```
❌ Failed to download images for [имя отца]: [ошибка]
```

Значит проблема с доступом к Storage или файл не существует.
