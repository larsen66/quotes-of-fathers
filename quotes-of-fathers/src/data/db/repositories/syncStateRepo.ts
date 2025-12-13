import { db } from "../db";

export function isInitialSyncCompleted(): boolean {
  try {
    const row = db.getFirstSync<{ initialSyncCompleted: number }>(
      "SELECT initialSyncCompleted FROM sync_state WHERE id = 1"
    );
    return row ? row.initialSyncCompleted === 1 : false;
  } catch (error) {
    console.error("Error checking initial sync status:", error);
    return false;
  }
}

export function setInitialSyncCompleted(value: boolean) {
  try {
    db.runSync("UPDATE sync_state SET initialSyncCompleted = ? WHERE id = 1", [
      value ? 1 : 0
    ]);
  } catch (error) {
    console.error("Error setting initial sync status:", error);
    throw error;
  }
}


export function getLastSyncAt(): string | null {
  const row = db.getFirstSync<{ lastSyncAt: string | null }>(
    "SELECT lastSyncAt FROM sync_state WHERE id = 1"
  );
  return row?.lastSyncAt ?? null;
}

export function setLastSyncAt(iso: string) {
  db.runSync("UPDATE sync_state SET lastSyncAt = ? WHERE id = 1", [iso]);
}
