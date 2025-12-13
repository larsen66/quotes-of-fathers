import { db } from "../db";

export function isFavorite(quoteId: string): boolean {
  const row = db.getFirstSync<{ quoteId: string }>(
    "SELECT quoteId FROM favorites WHERE quoteId = ? LIMIT 1",
    [quoteId]
  );
  return !!row;
}

export function addFavorite(quoteId: string) {
  db.runSync(
    "INSERT OR REPLACE INTO favorites (quoteId, addedAt) VALUES (?, ?)",
    [quoteId, new Date().toISOString()]
  );
}

export function removeFavorite(quoteId: string) {
  db.runSync("DELETE FROM favorites WHERE quoteId = ?", [quoteId]);
}

export function toggleFavorite(quoteId: string): boolean {
  const fav = isFavorite(quoteId);
  if (fav) {
    removeFavorite(quoteId);
    return false;
  } else {
    addFavorite(quoteId);
    return true;
  }
}


export function getFavoriteIds(): Set<string> {
  const rows = db.getAllSync<{ quoteId: string }>("SELECT quoteId FROM favorites");
  return new Set(rows.map(r => r.quoteId));
}
