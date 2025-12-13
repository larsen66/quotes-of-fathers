import { db } from "../db";

export type FatherRow = {
  id: string;
  name_ka: string;
  name_ru: string | null;
  bio_ka: string | null;
  bio_ru: string | null;
  avatarLocalPath: string;
  profileLocalPath: string | null;
};

export function getFatherById(fatherId: string): FatherRow | null {
  return db.getFirstSync<FatherRow>(
    `
    SELECT id, name_ka, name_ru, bio_ka, bio_ru, avatarLocalPath, profileLocalPath
    FROM fathers
    WHERE id = ?
    LIMIT 1
    `,
    [fatherId]
  );
}
