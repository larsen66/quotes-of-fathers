import { db } from "../../data/db/db";

export function saveFather(father: any) {
  db.runSync(
    `INSERT OR REPLACE INTO fathers
     (id, name_ka, name_ru, bio_ka, bio_ru, avatarLocalPath, profileLocalPath, "order", updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      father.id,
      father.name.ka,
      father.name.ru ?? null,
      father.bio?.ka ?? null,
      father.bio?.ru ?? null,
      father.avatarLocalPath,
      father.profileLocalPath ?? null,
      father.order ?? null,
      father.updatedAt
    ]
  );
}
