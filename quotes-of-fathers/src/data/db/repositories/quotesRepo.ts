import { db } from "../db";

export type LatestQuoteRow = {
  id: string;
  fatherId: string;
  createdAt: string;

  fatherName_ka: string;
  fatherName_ru: string | null;
  fatherAvatarLocalPath: string;

  text_ka: string;
  text_ru: string | null;
};

export function getLatestQuotes(limit = 30): LatestQuoteRow[] {
  return db.getAllSync<LatestQuoteRow>(
    `
    SELECT
      q.id, q.fatherId, q.createdAt,
      f.name_ka as fatherName_ka,
      f.name_ru as fatherName_ru,
      f.avatarLocalPath as fatherAvatarLocalPath,
      q.text_ka, q.text_ru
    FROM quotes q
    JOIN fathers f ON f.id = q.fatherId
    ORDER BY q.createdAt DESC
    LIMIT ?
    `,
    [limit]
  );
}
