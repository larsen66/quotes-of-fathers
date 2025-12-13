import { db } from "./db";

export function initDb() {
  try {
    db.execSync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS sync_state (
        id INTEGER PRIMARY KEY NOT NULL,
        initialSyncCompleted INTEGER NOT NULL DEFAULT 0,
        lastSyncAt TEXT,
        schemaVersion INTEGER NOT NULL DEFAULT 1
      );

      INSERT OR IGNORE INTO sync_state (id, initialSyncCompleted, schemaVersion)
      VALUES (1, 0, 1);

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY NOT NULL,
      language TEXT NOT NULL DEFAULT 'ka',
      notificationsEnabled INTEGER NOT NULL DEFAULT 0,
      weekdayTime TEXT NOT NULL DEFAULT '10:00',
      weekendTime TEXT NOT NULL DEFAULT '11:00',
      soundId TEXT NOT NULL DEFAULT 'default',
      updatedAt TEXT
    );

    INSERT OR IGNORE INTO settings (id, language)
    VALUES (1, 'ka');

    CREATE TABLE IF NOT EXISTS fathers (
      id TEXT PRIMARY KEY NOT NULL,
      name_ka TEXT NOT NULL,
      name_ru TEXT,
      bio_ka TEXT,
      bio_ru TEXT,
      avatarLocalPath TEXT NOT NULL,
      profileLocalPath TEXT,
      "order" INTEGER,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY NOT NULL,
      fatherId TEXT NOT NULL,
      text_ka TEXT NOT NULL,
      text_ru TEXT,
      source_ka TEXT,
      source_ru TEXT,
      quoteDate TEXT,
      isPublished INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_quotes_createdAt ON quotes(createdAt);
    CREATE INDEX IF NOT EXISTS idx_quotes_fatherId ON quotes(fatherId);

    CREATE TABLE IF NOT EXISTS favorites (
      quoteId TEXT PRIMARY KEY NOT NULL,
      addedAt TEXT NOT NULL
    );
    `);
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}
