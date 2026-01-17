# Настройка Supabase для проекта «Цитаты Отцов»

## 1. Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Запишите:
   - **Project URL**: `https://YOUR_PROJECT_REF.supabase.co`
   - **Anon Key**: Публичный ключ для клиентских приложений

## 2. Настройка базы данных

### 2.1 Выполните SQL схему

Откройте **SQL Editor** в Supabase Dashboard и выполните содержимое файла:

```
supabase/schema.sql
```

Это создаст:
- Таблицы: `fathers`, `quotes`, `feedback`, `app_settings`
- Индексы для оптимизации запросов
- Триггеры для автоматического обновления `updated_at`
- Row Level Security (RLS) политики

### 2.2 Проверьте таблицы

После выполнения SQL проверьте в **Table Editor**, что созданы все таблицы.

## 3. Настройка Storage

### 3.1 Создайте bucket

1. Перейдите в **Storage** в Supabase Dashboard
2. Создайте новый bucket с именем `fathers`
3. Установите **Public bucket** = ON (для публичного доступа к изображениям)

### 3.2 Настройте Storage Policies

В **Storage** → **Policies** для bucket `fathers`:

**Политика чтения (публичная):**
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'fathers');
```

**Политика записи (только для авторизованных):**
```sql
CREATE POLICY "Authenticated upload access"
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

## 4. Настройка аутентификации

### 4.1 Создайте администратора

1. Перейдите в **Authentication** → **Users**
2. Нажмите **Add user** → **Create new user**
3. Введите email и пароль для администратора
4. Подтвердите email (опционально отключите в Settings)

### 4.2 Настройки Auth

В **Authentication** → **Settings**:
- Отключите **Enable email confirmations** для упрощения (для dev)
- Или настройте SMTP для отправки подтверждений

## 5. Конфигурация приложений

### 5.1 Мобильное приложение

Отредактируйте файл:
```
quotes-of-fathers/src/services/supabase/supabase.ts
```

Замените:
```typescript
const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```

### 5.2 Админ-панель

Создайте/отредактируйте файл `admin/.env`:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 6. Структура Storage

Рекомендуемая структура для bucket `fathers`:

```
fathers/
├── avatars/
│   ├── {timestamp}-{random}.jpg
│   └── ...
└── profiles/
    ├── {timestamp}-{random}.jpg
    └── ...
```

## 7. Миграция данных с Firebase (если применимо)

### 7.1 Экспорт из Firestore

Используйте Firebase Admin SDK или Firebase Console для экспорта данных.

### 7.2 Преобразование формата

Firebase (вложенные объекты):
```json
{
  "name": { "ka": "...", "ru": "..." }
}
```

Supabase (плоская структура):
```json
{
  "name_ka": "...",
  "name_ru": "..."
}
```

### 7.3 Импорт в Supabase

Используйте SQL Editor или Supabase CLI для импорта данных.

## 8. Деплой админ-панели

### 8.1 Vercel (рекомендуется)

```bash
cd admin
npm run build
npx vercel deploy
```

Добавьте переменные окружения в Vercel Dashboard.

### 8.2 Netlify

```bash
cd admin
npm run build
npx netlify deploy --prod
```

### 8.3 Supabase Hosting (если доступно)

Supabase пока не предоставляет хостинг для статических сайтов.

## 9. Тестирование

### 9.1 Проверьте подключение

```typescript
// В консоли браузера или в приложении
const { data, error } = await supabase.from('fathers').select('*');
console.log(data, error);
```

### 9.2 Проверьте аутентификацию

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@example.com',
  password: 'your-password'
});
console.log(data, error);
```

### 9.3 Проверьте Storage

```typescript
const { data, error } = await supabase.storage
  .from('fathers')
  .list('avatars');
console.log(data, error);
```

## 10. Troubleshooting

### Ошибка: "new row violates row-level security policy"

Проверьте, что пользователь авторизован и RLS политики настроены правильно.

### Ошибка: "relation does not exist"

Убедитесь, что SQL схема выполнена полностью.

### Изображения не загружаются

1. Проверьте, что bucket `fathers` создан
2. Проверьте Storage policies
3. Проверьте, что bucket публичный

## 11. Полезные ссылки

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)
