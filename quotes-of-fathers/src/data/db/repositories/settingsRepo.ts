import { db } from "../db";

export type SettingsRow = {
  language: "ka" | "ru";
  notificationsEnabled: number; // 0/1
  weekdayTime: string;          // "HH:MM"
  weekendTime: string;          // "HH:MM"
  soundId: string;              // "default" | "bell" | "soft" ...
};

export function getSettings(): SettingsRow {
  const row = db.getFirstSync<SettingsRow>(
    `SELECT language, notificationsEnabled, weekdayTime, weekendTime, soundId
     FROM settings WHERE id = 1`
  );
  // гарантируем значения по умолчанию
  return (
    row ?? {
      language: "ka",
      notificationsEnabled: 0,
      weekdayTime: "10:00",
      weekendTime: "11:00",
      soundId: "default"
    }
  );
}

export function updateSettings(patch: Partial<SettingsRow>) {
    const cur = getSettings();
    const next = { ...cur, ...patch };
  
    db.runSync(
      `UPDATE settings
       SET language = ?, notificationsEnabled = ?, weekdayTime = ?, weekendTime = ?, soundId = ?, updatedAt = ?
       WHERE id = 1`,
      [
        next.language,
        next.notificationsEnabled,
        next.weekdayTime,
        next.weekendTime,
        next.soundId,
        new Date().toISOString()
      ]
    );
  
    return next;
  }
  