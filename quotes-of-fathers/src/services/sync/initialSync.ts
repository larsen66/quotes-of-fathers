import { loadFathers } from "./loadFathers";
import { loadQuotes } from "./loadQuotes";
import { downloadFile } from "./downloadFile";
import { saveFather } from "./saveFathers";
import { db } from "../../data/db/db";
import { setInitialSyncCompleted } from "../../data/db/repositories/syncStateRepo";

function getExtension(url: string): string {
  const match = url.match(/\.(\w+)(?:\?|$)/);
  return match ? match[1] : "png";
}

export async function initialSync() {
  try {
    // 1. Загружаем отцов
    const fathers = await loadFathers();

    for (const father of fathers) {
      let avatarLocalPath = father.avatarUrl;
      let profileLocalPath = father.profileImageUrl || null;

      try {
        const ext = getExtension(father.avatarUrl);
        avatarLocalPath = await downloadFile(father.avatarUrl, `avatar_${father.id}.${ext}`);

        if (father.profileImageUrl) {
          const pExt = getExtension(father.profileImageUrl);
          profileLocalPath = await downloadFile(father.profileImageUrl, `profile_${father.id}.${pExt}`);
        }
      } catch (error) {
        // Если скачивание не удалось — сохраняем URL (загрузятся по сети)
        console.error("Image download failed, using remote URL:", error);
      }

      saveFather({
        ...father,
        avatarLocalPath,
        profileLocalPath
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
