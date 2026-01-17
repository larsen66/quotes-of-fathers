import * as Network from "expo-network";
import * as Application from "expo-application";
import { Platform } from "react-native";

import { supabase } from "../supabase/supabase";

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

  const { error } = await supabase.from("feedback").insert({
    message: input.message.trim(),
    contact: input.contact?.trim() || null,
    language: input.language,
    platform: Platform.OS as "ios" | "android",
    app_version:
      Application.nativeApplicationVersion ??
      Application.applicationVersion ??
      "unknown",
  });

  if (error) {
    console.error("Error sending feedback:", error);
    throw error;
  }
}
