import { db } from "../db";

export type FatherQuoteRow = {
  id: string;          // quoteId
  fatherId: string;
  text_ka: string;
  text_ru: string | null;
  createdAt: string;
  quoteDate: string | null;
};

export function getQuotesByFatherId(fatherId: string, limit = 300): FatherQuoteRow[] {
  return db.getAllSync<FatherQuoteRow>(
    `
    SELECT id, fatherId, text_ka, text_ru, createdAt, quoteDate
    FROM quotes
    WHERE fatherId = ?
    ORDER BY createdAt DESC
    LIMIT ?
    `,
    [fatherId, limit]
  );
}
