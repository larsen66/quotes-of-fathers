# DATA MODEL (с поддержкой двух языков)

## Проект: «Цитаты Отцов»

**Backend: Supabase (PostgreSQL)**

---

## 1. Общий принцип локализации (фиксируем)

### DM-LANG-1. Поддерживаемые языки

* `ka` — грузинский (**основной язык по умолчанию**)
* `ru` — русский

### DM-LANG-2. Принцип хранения

* **Все текстовые поля, видимые пользователю, хранятся в виде отдельных колонок с суффиксом языка**
* Supabase использует плоскую структуру: `name_ka`, `name_ru` вместо вложенных объектов
* UI выбирает язык:

  * по настройке пользователя
  * если перевода нет → fallback на `ka`

---

## 2. Father (Отец)

### 2.1 Серверная модель (Supabase/PostgreSQL)

```sql
CREATE TABLE fathers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  name_ka TEXT NOT NULL,      -- обязательное
  name_ru TEXT,               -- опциональное
  
  bio_ka TEXT,                -- опциональное
  bio_ru TEXT,                -- опциональное
  
  avatar_url TEXT NOT NULL,   -- URL в Supabase Storage
  profile_image_url TEXT,     -- опциональное
  
  "order" INTEGER,
  
  deleted BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Локальная модель (SQLite)

```ts
Father {
  id: string PRIMARY KEY,

  name_ka: string,
  name_ru?: string,

  bio_ka?: string,
  bio_ru?: string,

  avatarLocalPath: string,
  profileLocalPath?: string,

  order?: number,

  updatedAt: string
}
```

---

## 3. Quote (Цитата)

### 3.1 Серверная модель (Supabase/PostgreSQL)

```sql
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  father_id UUID NOT NULL REFERENCES fathers(id) ON DELETE CASCADE,
  
  text_ka TEXT NOT NULL,      -- обязательное
  text_ru TEXT,               -- опциональное
  
  source_ka TEXT,             -- опциональное
  source_ru TEXT,             -- опциональное
  
  quote_date DATE,            -- YYYY-MM-DD
  
  tags TEXT[] DEFAULT '{}',
  
  is_published BOOLEAN DEFAULT TRUE,
  
  deleted BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 Локальная модель (SQLite)

```ts
Quote {
  id: string PRIMARY KEY,

  fatherId: string,

  text_ka: string,
  text_ru?: string,

  source_ka?: string,
  source_ru?: string,

  quoteDate?: string,

  isPublished: boolean,

  createdAt: string,
  updatedAt: string
}
```

---

## 4. Favorite (Избранное)

### 4.1 Локальная модель

```ts
Favorite {
  quoteId: string PRIMARY KEY,
  addedAt: string
}
```

> Язык **не хранится** в избранном — текст берётся из Quote по текущему языку UI.

---

## 5. Settings (Настройки пользователя)

### 5.1 Локальная модель

```ts
Settings {
  id: number PRIMARY KEY, // всегда 1

  language: "ka" | "ru",

  notificationsEnabled: boolean,

  weekdayTime: string,   // "HH:MM"
  weekendTime: string,   // "HH:MM"

  soundId: string,

  updatedAt: string
}
```

### 5.2 Правила языка

* Язык по умолчанию: `ka`
* Пользователь может изменить язык в настройках
* Изменение языка **не требует интернета**

---

## 6. AppSettings (Глобальные настройки приложения)

### 6.1 Сервер (Supabase)

```sql
CREATE TABLE app_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  subscriber_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.2 Локальный кэш (опционально)

```ts
SubscriberCountCache {
  count: number,
  cachedAt: string
}
```

---

## 7. Feedback (Обратная связь)

### 7.1 Серверная модель (Supabase)

```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  message TEXT NOT NULL,
  contact TEXT,
  
  language TEXT NOT NULL CHECK (language IN ('ka', 'ru')),
  
  platform TEXT CHECK (platform IN ('ios', 'android')),
  app_version TEXT,
  
  is_read BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 8. SyncState (Состояние синхронизации)

### 8.1 Локальная модель

```ts
SyncState {
  id: number PRIMARY KEY, // всегда 1

  lastSyncAt?: string,

  initialSyncCompleted: boolean,

  schemaVersion: number
}
```

---

## 9. Правила отображения текста (обязательно для реализации)

### DM-UI-1. Выбор текста

```ts
function getLocalizedText(
  text_ka: string,
  text_ru: string | null | undefined,
  language: "ka" | "ru"
): string {
  if (language === "ru" && text_ru) {
    return text_ru;
  }
  return text_ka; // fallback на ka
}
```

### DM-UI-2. Обязательность переводов

* Грузинский (`ka`) — **обязателен**
* Русский (`ru`) — **опционален**
* Админка **должна разрешать** сохранять объект без `ru`

---

## 10. Требования к админ-панели (дополнение к FT)

* **DM-ADMIN-1:** Админ-панель создана на React с использованием Supabase JS Client.
* **DM-ADMIN-2:** Все текстовые поля (имя, биография, цитата, источник) вводятся отдельно для **грузинского** и **русского**.
* **DM-ADMIN-3:** UI админки должен явно показывать:
  * какой язык обязателен (`ka` - всегда обязателен)
  * какой опционален (`ru` - опционален)
* **DM-ADMIN-4:** Если `ru` пусто → мобильное приложение автоматически использует `ka`.
* **DM-ADMIN-5:** Supabase таблицы:
  * `fathers` - таблица отцов
  * `quotes` - таблица цитат
  * `feedback` - таблица сообщений обратной связи
  * `app_settings` - глобальные настройки (subscriber_count и т.д.)

---

## 11. Интеграция с React Admin панелью

### DM-INT-1. Supabase операции

При работе с Supabase из React админ-панели используется следующий подход:

**Создание Father:**
```typescript
import { supabase } from './services/supabase';

const father = {
  name_ka: "სერაფიმე სარავალი",
  name_ru: "Серафим Саровский",
  bio_ka: "...",
  bio_ru: "...",
  avatar_url: "https://xxx.supabase.co/storage/v1/object/public/fathers/avatars/...",
  profile_image_url: "https://xxx.supabase.co/storage/v1/object/public/fathers/profiles/...",
  order: 1
};

const { data, error } = await supabase
  .from('fathers')
  .insert(father)
  .select()
  .single();
```

**Создание Quote:**
```typescript
const quote = {
  father_id: "father_uuid_123",
  text_ka: "ეს არის ციტატა",
  text_ru: "Это цитата",
  source_ka: "წყარო",
  source_ru: "Источник",
  quote_date: "2024-01-15",
  tags: ["faith", "love"],
  is_published: true
};

const { data, error } = await supabase
  .from('quotes')
  .insert(quote)
  .select()
  .single();
```

### DM-INT-2. Синхронизация с мобильным приложением

* **DM-INT-2.1:** Мобильное приложение загружает данные из Supabase.
* **DM-INT-2.2:** Данные уже в плоском формате, минимальная трансформация:
  * Supabase: `father_id` 
  * SQLite: `fatherId`
* **DM-INT-2.3:** URL изображений скачиваются и сохраняются локально:
  * Supabase: `avatar_url: "https://..."`
  * SQLite: `avatarLocalPath: "file:///..."`

### DM-INT-3. Удаление данных

* **DM-INT-3.1:** Мягкое удаление (рекомендуется):
  ```typescript
  await supabase
    .from('fathers')
    .update({ deleted: true })
    .eq('id', id);
  ```
* **DM-INT-3.2:** Физическое удаление (опционально):
  ```typescript
  await supabase
    .from('fathers')
    .delete()
    .eq('id', id);
  ```
* **DM-INT-3.3:** Мобильное приложение при синхронизации проверяет:
  * Если `deleted: true` - удаляет из SQLite

---

## 12. Supabase Storage

### DM-STORAGE-1. Структура bucket

```
fathers/                    # bucket name
├── avatars/
│   ├── {timestamp}-{random}.jpg
│   └── ...
└── profiles/
    ├── {timestamp}-{random}.jpg
    └── ...
```

### DM-STORAGE-2. Получение публичного URL

```typescript
const { data } = supabase.storage
  .from('fathers')
  .getPublicUrl('avatars/image.jpg');

// data.publicUrl = "https://xxx.supabase.co/storage/v1/object/public/fathers/avatars/image.jpg"
```

---

## 13. Definition of Done (Data Model)

Модель считается корректной, если:

* **Мобильное приложение:**
  * приложение полностью работает офлайн на **двух языках**
  * язык можно переключить без перезагрузки приложения
  * отсутствие перевода **никогда не ломает UI**
  * все данные корректно синхронизируются с Supabase

* **Админ-панель:**
  * админка позволяет управлять переводами явно и безопасно
  * все CRUD операции корректно работают с Supabase
  * изображения успешно загружаются в Supabase Storage
  * изменения в админке мгновенно отражаются в базе
  * мобильное приложение получает обновления при следующей синхронизации

* **Интеграция:**
  * структура данных в Supabase и SQLite корректно трансформируется
  * удаление в админке корректно обрабатывается мобильным приложением
  * синхронизация работает инкрементально по полю `updated_at`

---
