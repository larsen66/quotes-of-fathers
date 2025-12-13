import { db } from "../db";

export type SettingsRow = {
  id: number;
  language: string;
  notificationsEnabled: number; // SQLite хранит boolean как INTEGER (0/1)
  weekdayTime: string;
  weekendTime: string;
  soundId: string;
  updatedAt: string | null;
};

export function getSettings(): SettingsRow | null {
  return db.getFirstSync<SettingsRow>(
    `
    SELECT *
    FROM settings
    WHERE id = 1
    `
  );
}

export function updateLanguage(language: "ka" | "ru"): void {
  db.runSync(
    `
    UPDATE settings
    SET language = ?, updatedAt = datetime('now')
    WHERE id = 1
    `,
    [language]
  );
}

export function updateNotificationsEnabled(enabled: boolean): void {
  db.runSync(
    `
    UPDATE settings
    SET notificationsEnabled = ?, updatedAt = datetime('now')
    WHERE id = 1
    `,
    [enabled ? 1 : 0]
  );
}

export function updateWeekdayTime(time: string): void {
  db.runSync(
    `
    UPDATE settings
    SET weekdayTime = ?, updatedAt = datetime('now')
    WHERE id = 1
    `,
    [time]
  );
}

export function updateWeekendTime(time: string): void {
  db.runSync(
    `
    UPDATE settings
    SET weekendTime = ?, updatedAt = datetime('now')
    WHERE id = 1
    `,
    [time]
  );
}

export function updateSoundId(soundId: string): void {
  db.runSync(
    `
    UPDATE settings
    SET soundId = ?, updatedAt = datetime('now')
    WHERE id = 1
    `,
    [soundId]
  );
}

