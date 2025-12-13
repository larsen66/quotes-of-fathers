import { db } from "../db";

export type FatherListRow = {
  id: string;
  name_ka: string;
  name_ru: string | null;
  avatarLocalPath: string;
  order: number | null;
};

export function getAllFathers(): FatherListRow[] {
  // Сортируем: сначала по order (если задан), иначе по name_ka
  return db.getAllSync<FatherListRow>(
    `
    SELECT id, name_ka, name_ru, avatarLocalPath, "order"
    FROM fathers
    ORDER BY
      CASE WHEN "order" IS NULL THEN 1 ELSE 0 END,
      "order" ASC,
      name_ka ASC
    `
  );
}
