import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { enqueueFeedback } from "../../data/db/repositories/feedbackOutboxRepo";
import { flushFeedbackOutbox } from "../../data/db/repositories/flushFeedbackOutbox";


export default function AboutScreen() {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language === "ru" ? "ru" : "ka") as "ka" | "ru";

  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [sending, setSending] = useState(false);

  async function onSend() {
    const msg = message.trim();
    if (!msg) {
      Alert.alert(
        t('about.errorTitle'),
        t('about.errorMessage')
      );
      return;
    }

    setSending(true);
    try {
      enqueueFeedback({ message: msg, contact, language: lang });

      const res = await flushFeedbackOutbox();

      Alert.alert(
        t('about.doneTitle'),
        res.skipped
          ? t('about.messageSaved')
          : t('about.messageSent')
      );

      setMessage("");
      setContact("");
    } finally {
      setSending(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>
        {t('about.title')}
      </Text>

      <Text style={{ fontSize: 15, lineHeight: 22, opacity: 0.9 }}>
        {t('about.description')}
      </Text>

      <View style={{ height: 1, backgroundColor: "rgba(0,0,0,0.12)", marginVertical: 8 }} />

      <Text style={{ fontSize: 18, fontWeight: "700" }}>
        {t('about.feedback')}
      </Text>

      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder={t('about.messagePlaceholder')}
        multiline
        style={{ borderWidth: 1, borderRadius: 12, padding: 12, minHeight: 120, textAlignVertical: "top" }}
      />

      <TextInput
        value={contact}
        onChangeText={setContact}
        placeholder={t('about.contactPlaceholder')}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />

      <Pressable
        onPress={onSend}
        disabled={sending}
        style={{ padding: 14, borderRadius: 12, backgroundColor: "black", opacity: sending ? 0.6 : 1 }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
          {sending ? t('about.sending') : t('about.send')}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
