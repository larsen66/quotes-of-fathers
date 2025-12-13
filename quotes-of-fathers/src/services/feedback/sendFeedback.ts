import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import * as Network from "expo-network";
import * as Application from "expo-application";
import { Platform } from "react-native";

import { db } from "../firebase/firebase";

type SendFeedbackInput = {
  message: string;
  contact?: string;
  language: "ka" | "ru";
};

export async function sendFeedback(input: SendFeedbackInput) {
  const net = await Network.getNetworkStateAsync();
  if (!net.isConnected) {
    throw new Error("NO_INTERNET");
  }

  const payload = {
    message: input.message.trim(),
    contact: input.contact?.trim() || null,
    language: input.language,
    platform: Platform.OS,
    appVersion: Application.nativeApplicationVersion ?? Application.applicationVersion ?? "unknown",
    createdAt: serverTimestamp()
  };

  await addDoc(collection(db, "feedback"), payload);
}
