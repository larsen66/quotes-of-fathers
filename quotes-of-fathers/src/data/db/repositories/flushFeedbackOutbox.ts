import * as Network from "expo-network";
import { getPendingOutbox, markFailed, markSent } from "./feedbackOutboxRepo";
import { sendFeedback } from "../../../services/feedback/sendFeedback";

export async function flushFeedbackOutbox() {
  const net = await Network.getNetworkStateAsync();
  if (!net.isConnected) return { sent: 0, skipped: true };

  const pending = getPendingOutbox(20);
  let sent = 0;

  for (const item of pending) {
    try {
      await sendFeedback({
        message: item.message,
        contact: item.contact ?? undefined,
        language: item.language
      });
      markSent(item.id);
      sent += 1;
    } catch (e: any) {
      markFailed(item.id, e?.message ?? "UNKNOWN_ERROR");
      // не прерываем — пробуем отправить остальные
    }
  }

  return { sent, skipped: false };
}
