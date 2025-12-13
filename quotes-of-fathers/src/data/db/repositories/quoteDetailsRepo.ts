import { db } from "../db";

export type QuoteDetailsRow = {
  id: string;
  fatherId: string;

  fatherName_ka: string;
  fatherName_ru: string | null;
  fatherAvatarLocalPath: string;
  fatherProfileLocalPath: string | null;

  text_ka: string;
  text_ru: string | null;

  source_ka: string | null;
  source_ru: string | null;

  quoteDate: string | null;
};

export function getQuoteById(quoteId: string): QuoteDetailsRow | null {
  return db.getFirstSync<QuoteDetailsRow>(
    `
    SELECT
      q.id,
      q.fatherId,
      f.name_ka as fatherName_ka,
      f.name_ru as fatherName_ru,
      f.avatarLocalPath as fatherAvatarLocalPath,
      f.profileLocalPath as fatherProfileLocalPath,
      q.text_ka,
      q.text_ru,
      q.source_ka,
      q.source_ru,
      q.quoteDate
    FROM quotes q
    JOIN fathers f ON f.id = q.fatherId
    WHERE q.id = ?
    LIMIT 1
    `,
    [quoteId]
  );
}
