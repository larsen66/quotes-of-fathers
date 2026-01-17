import { loadFathers } from "./loadFathers";
import { loadQuotes } from "./loadQuotes";
import { downloadFile } from "./downloadFile";
import { saveFather } from "./saveFathers";
import { db } from "../../data/db/db";
import { setInitialSyncCompleted } from "../../data/db/repositories/syncStateRepo";

export async function initialSync() {
  console.log("🔄 Starting initial sync...");
  
  try {
    // 1. Загружаем отцов
    console.log("📥 Loading fathers from Supabase...");
    const fathers = await loadFathers();
    console.log(`✅ Loaded ${fathers.length} fathers`);

    for (const father of fathers) {
      console.log(`Processing father: ${father.name.ka}`);
      
      // 2. Скачиваем изображения из Supabase Storage
      try {
        console.log(`📥 Downloading avatar from: ${father.avatarUrl}`);
        const avatarLocalPath = await downloadFile(father.avatarUrl, `avatar_${father.id}.jpg`);
        console.log(`✅ Avatar downloaded to: ${avatarLocalPath}`);
        
        const profileLocalPath = father.profileImageUrl
          ? await downloadFile(father.profileImageUrl, `profile_${father.id}.jpg`)
          : null;
        
        if (profileLocalPath) {
          console.log(`✅ Profile image downloaded to: ${profileLocalPath}`);
        }

        // 3. Сохраняем отца локально
        saveFather({
          ...father,
          avatarLocalPath,
          profileLocalPath
        });
        console.log(`✅ Saved ${father.name.ka} to local DB`);
      } catch (error) {
        console.error(`❌ Failed to download images for ${father.name.ka}:`, error);
        // Сохраняем с URL-ами в случае ошибки скачивания
        saveFather({
          ...father,
          avatarLocalPath: father.avatarUrl,
          profileLocalPath: father.profileImageUrl || null
        });
      }
    }

    // 4. Загружаем цитаты
    console.log("📥 Loading quotes from Supabase...");
    const quotes = await loadQuotes();
    console.log(`✅ Loaded ${quotes.length} quotes`);

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
    console.log(`✅ Saved ${quotes.length} quotes to local DB`);

    // 5. Фиксируем: первая синхронизация завершена
    setInitialSyncCompleted(true);
    console.log("✅ Initial sync completed successfully!");
  } catch (error) {
    console.error("❌ Initial sync failed:", error);
    throw error;
  }
}
