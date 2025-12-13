import { db } from "../db";

export function getQuotesCountByFatherId(fatherId: string): number {
  const row = db.getFirstSync<{ cnt: number }>(
    "SELECT COUNT(*) as cnt FROM quotes WHERE fatherId = ?",
    [fatherId]
  );
  return row?.cnt ?? 0;
}

