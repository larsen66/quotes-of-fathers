import { db } from "../db";

export type FavoriteQuoteRow = {
  id: string; // quote id
  fatherId: string;

  fatherName_ka: string;
  fatherName_ru: string | null;
  fatherAvatarLocalPath: string;

  text_ka: string;
  text_ru: string | null;

  createdAt: string;
  addedAt: string;
};

export function getFavoriteQuotes(limit = 200): FavoriteQuoteRow[] {
  return db.getAllSync<FavoriteQuoteRow>(
    `
    SELECT
      q.id,
      q.fatherId,
      f.name_ka as fatherName_ka,
      f.name_ru as fatherName_ru,
      f.avatarLocalPath as fatherAvatarLocalPath,
      q.text_ka,
      q.text_ru,
      q.createdAt,
      fav.addedAt
    FROM favorites fav
    JOIN quotes q ON q.id = fav.quoteId
    JOIN fathers f ON f.id = q.fatherId
    ORDER BY fav.addedAt DESC
    LIMIT ?
    `,
    [limit]
  );
}
