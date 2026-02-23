import { loadFathers } from "./loadFathers";
import { loadQuotes } from "./loadQuotes";
import { saveFather } from "./saveFathers";
import { db } from "../../data/db/db";
import { setInitialSyncCompleted } from "../../data/db/repositories/syncStateRepo";

export async function initialSync() {
  try {
    // 1. Загружаем отцов
    const fathers = await loadFathers();

    for (const father of fathers) {
      // Сохраняем URL напрямую — expo-image кеширует на диск автоматически
      saveFather({
        ...father,
        avatarLocalPath: father.avatarUrl,
        profileLocalPath: father.profileImageUrl || null
      });
    }

    // 2. Загружаем цитаты
    const quotes = await loadQuotes();

    for (const q of quotes) {
      db.runSync(
        `INSERT OR REPLACE INTO quotes
         (id, fatherId, text_ka, text_ru, quoteDate, isPublished, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          q.id,
          q.fatherId,
          q.text.ka,
          q.text.ru ?? null,
          q.quoteDate ?? null,
          1,
          q.createdAt,
          q.updatedAt
        ]
      );
    }

    // 3. Фиксируем: первая синхронизация завершена
    setInitialSyncCompleted(true);
  } catch (error) {
    console.error("Initial sync failed:", error);
    throw error;
  }
}
