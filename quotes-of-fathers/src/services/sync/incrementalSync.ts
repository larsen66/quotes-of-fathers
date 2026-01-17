import { getLastSyncAt, setLastSyncAt } from "../../data/db/repositories/syncStateRepo";
import { loadFathersIncremental } from "./loadFathersIncremental";
import { loadQuotesIncremental } from "./loadQuotesIncremental";
import { downloadFile } from "./downloadFile";
import { saveFather } from "./saveFathers";
import { db } from "../../data/db/db";

function nowIso() {
  return new Date().toISOString();
}

export async function incrementalSync() {
  const lastSyncAt = getLastSyncAt();
  if (!lastSyncAt) {
    // если нет lastSyncAt, значит sync_state ещё не заполнен — сделай initialSync
    return;
  }

  // 1) Забираем только изменённые записи
  const [fathers, quotes] = await Promise.all([
    loadFathersIncremental(lastSyncAt),
    loadQuotesIncremental(lastSyncAt)
  ]);

  // 2) Применяем изменения по отцам (включая картинки)
  for (const f of fathers) {
    if (f.deleted === true) {
      // удаляем локально
      db.runSync("DELETE FROM fathers WHERE id = ?", [f.id]);
      continue;
    }

    // картинки обновляем только если пришли новые URL (или всегда, если хочешь проще)
    const avatarLocalPath = await downloadFile(f.avatarUrl, `avatar_${f.id}.jpg`);
    const profileLocalPath = f.profileImageUrl
      ? await downloadFile(f.profileImageUrl, `profile_${f.id}.jpg`)
      : null;

    saveFather({ ...f, avatarLocalPath, profileLocalPath });
  }

  // 3) Применяем изменения по цитатам
  for (const q of quotes) {
    if (q.deleted === true || q.isPublished === false) {
      // если удалили или сняли с публикации — удаляем локально
      db.runSync("DELETE FROM quotes WHERE id = ?", [q.id]);
      db.runSync("DELETE FROM favorites WHERE quoteId = ?", [q.id]); // правило: убрать из избранного
      continue;
    }

    db.runSync(
      `INSERT OR REPLACE INTO quotes
       (id, fatherId, text_ka, text_ru, quoteDate, isPublished, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        q.id,
        q.fatherId,
        q.text?.ka ?? "",
        q.text?.ru ?? null,
        q.quoteDate ?? null,
        1,
        q.createdAt,
        q.updatedAt
      ]
    );
  }

  // 4) Фиксируем время sync
  setLastSyncAt(nowIso());
}
