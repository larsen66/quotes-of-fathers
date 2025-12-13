import { loadFathers } from "./loadFathers";
import { loadQuotes } from "./loadQuotes";
import { downloadFile } from "./downloadFile";
import { saveFather } from "./saveFathers";
import { db } from "../../data/db/db";
import { setInitialSyncCompleted } from "../../data/db/repositories/syncStateRepo";

export async function initialSync() {
  // 1. Загружаем отцов
  const fathers = await loadFathers();

  for (const father of fathers) {
    // 2. Скачиваем картинки
    const avatarLocalPath = await downloadFile(
      father.avatarUrl,
      `avatar_${father.id}.jpg`
    );

    const profileLocalPath = father.profileImageUrl
      ? await downloadFile(
          father.profileImageUrl,
          `profile_${father.id}.jpg`
        )
      : null;

    // 3. Сохраняем отца локально
    saveFather({
      ...father,
      avatarLocalPath,
      profileLocalPath
    });
  }

  // 4. Загружаем цитаты
  const quotes = await loadQuotes();

  for (const q of quotes) {
    db.runSync(
      `INSERT OR REPLACE INTO quotes
       (id, fatherId, text_ka, text_ru, source_ka, source_ru,
        quoteDate, isPublished, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        q.id,
        q.fatherId,
        q.text.ka,
        q.text.ru ?? null,
        q.source?.ka ?? null,
        q.source?.ru ?? null,
        q.quoteDate ?? null,
        1,
        q.createdAt,
        q.updatedAt
      ]
    );
  }

  // 5. Фиксируем: первая синхронизация завершена
  setInitialSyncCompleted(true);
}
