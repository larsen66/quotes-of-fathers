import { db } from "../db";
import { randomUUID } from "expo-crypto";

export type OutboxItem = {
  id: string;
  message: string;
  contact: string | null;
  language: "ka" | "ru";
  createdAt: string;
  status: "pending" | "sent" | "failed";
  lastError: string | null;
};

export function enqueueFeedback(params: {
  message: string;
  contact?: string;
  language: "ka" | "ru";
}): string {
  const id = randomUUID();
  db.runSync(
    `INSERT INTO feedback_outbox (id, message, contact, language, createdAt, status)
     VALUES (?, ?, ?, ?, ?, 'pending')`,
    [
      id,
      params.message.trim(),
      params.contact?.trim() || null,
      params.language,
      new Date().toISOString()
    ]
  );
  return id;
}

export function getPendingOutbox(limit = 20): OutboxItem[] {
  return db.getAllSync<OutboxItem>(
    `SELECT id, message, contact, language, createdAt, status, lastError
     FROM feedback_outbox
     WHERE status = 'pending'
     ORDER BY createdAt ASC
     LIMIT ?`,
    [limit]
  );
}

export function markSent(id: string) {
  db.runSync(
    `UPDATE feedback_outbox SET status = 'sent', lastError = NULL WHERE id = ?`,
    [id]
  );
}

export function markFailed(id: string, error: string) {
  db.runSync(
    `UPDATE feedback_outbox SET status = 'failed', lastError = ? WHERE id = ?`,
    [error, id]
  );
}

export function retryFailedToPending() {
  db.runSync(`UPDATE feedback_outbox SET status = 'pending' WHERE status = 'failed'`);
}

