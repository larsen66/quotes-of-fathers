Отлично, тогда **обновляем Data Model** и **формально закладываем поддержку двух языков**:
**Грузинский (основной)** + **Русский**.
Ниже — **чистая модель данных**, уже готовая для Firestore + офлайн SQLite, без философии.

---

# DATA MODEL (с поддержкой двух языков)

## Проект: «Цитаты Отцов»

---

## 1. Общий принцип локализации (фиксируем)

### DM-LANG-1. Поддерживаемые языки

* `ka` — грузинский (**основной язык по умолчанию**)
* `ru` — русский

### DM-LANG-2. Принцип хранения

* **Все текстовые поля, видимые пользователю, хранятся в виде словаря по языкам**
* UI выбирает язык:

  * по настройке пользователя
  * если перевода нет → fallback на `ka`

---

## 2. Father (Отец)

### 2.1 Серверная модель (Firestore)

```ts
Father {
  id: string,

  name: {
    ka: string,   // обязательное
    ru?: string
  },

  bio?: {
    ka: string,
    ru?: string
  },

  avatarUrl: string,
  profileImageUrl?: string,

  order?: number,

  createdAt: string,   // ISO
  updatedAt: string,   // ISO
  deleted?: boolean
}
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

### 3.1 Серверная модель (Firestore)

```ts
Quote {
  id: string,

  fatherId: string,

  text: {
    ka: string,   // обязательное
    ru?: string
  },

  quoteDate?: string,   // YYYY-MM-DD или ISO
  source?: {
    ka?: string,
    ru?: string
  },

  tags?: string[],

  isPublished: boolean,

  createdAt: string,   // дата добавления (для "последних")
  updatedAt: string,

  deleted?: boolean
}
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

## 6. SubscriberCount (Счётчик подписчиков)

### 6.1 Сервер

```ts
SubscriberCount {
  count: number,
  updatedAt: string
}
```

### 6.2 Локальный кэш (опционально)

```ts
SubscriberCountCache {
  count: number,
  cachedAt: string
}
```

---

## 7. FeedbackMessage (Обратная связь)

### 7.1 Отправка на сервер

```ts
FeedbackMessage {
  message: string,
  contact?: string,

  language: "ka" | "ru",

  appVersion?: string,
  platform?: "ios" | "android",

  createdAt?: string
}
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
function getLocalizedText(field, language) {
  return field[language] ?? field["ka"]
}
```

### DM-UI-2. Обязательность переводов

* Грузинский (`ka`) — **обязателен**
* Русский (`ru`) — **опционален**
* Админка **должна разрешать** сохранять объект без `ru`

---

## 10. Требования к админ-панели (дополнение к FT)

* Все текстовые поля (имя, биография, цитата, источник):

  * вводятся отдельно для **грузинского** и **русского**
* UI админки должен явно показывать:

  * какой язык обязателен
  * какой опционален
* Если `ru` пусто → мобильное приложение автоматически использует `ka`

---

## 11. Definition of Done (Data Model)

Модель считается корректной, если:

* приложение полностью работает офлайн на **двух языках**;
* язык можно переключить без перезагрузки приложения;
* отсутствие перевода **никогда не ломает UI**;
* админка позволяет управлять переводами явно и безопасно.

---