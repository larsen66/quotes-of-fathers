import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { enqueueFeedback } from "../../data/db/repositories/feedbackOutboxRepo";
import { flushFeedbackOutbox } from "../../data/db/repositories/flushFeedbackOutbox";


export default function AboutScreen() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ru" ? "ru" : "ka") as "ka" | "ru";

  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [sending, setSending] = useState(false);

  async function onSend() {
    const msg = message.trim();
    if (!msg) {
      Alert.alert(
        lang === "ru" ? "Ошибка" : "შეცდომა",
        lang === "ru" ? "Введите сообщение" : "შეიყვანეთ შეტყობინება"
      );
      return;
    }

    setSending(true);
    try {
      enqueueFeedback({ message: msg, contact, language: lang });

      const res = await flushFeedbackOutbox();

      Alert.alert(
        lang === "ru" ? "Готово" : "მზადაა",
        res.skipped
          ? (lang === "ru"
              ? "Сообщение сохранено и будет отправлено при появлении интернета."
              : "შეტყობინება შენახულია და გაიგზავნება ინტერნეტის გამოჩენისას.")
          : (lang === "ru"
              ? "Сообщение отправлено."
              : "შეტყობინება გაიგზავნა.")
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
        {lang === "ru" ? "О нас" : "ჩვენს შესახებ"}
      </Text>

      <Text style={{ fontSize: 15, lineHeight: 22, opacity: 0.9 }}>
        {lang === "ru"
          ? "Приложение для чтения духовных цитат святых отцов. Работает офлайн после первой загрузки."
          : "სულიერი ციტატების წასაკითხად შექმნილი აპლიკაცია. პირველადი ჩამოტვირთვის შემდეგ მუშაობს ოფლაინ."}
      </Text>

      <View style={{ height: 1, backgroundColor: "rgba(0,0,0,0.12)", marginVertical: 8 }} />

      <Text style={{ fontSize: 18, fontWeight: "700" }}>
        {lang === "ru" ? "Обратная связь" : "უკუკავშირი"}
      </Text>

      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder={lang === "ru" ? "Ваше сообщение..." : "თქვენი შეტყობინება..."}
        multiline
        style={{ borderWidth: 1, borderRadius: 12, padding: 12, minHeight: 120, textAlignVertical: "top" }}
      />

      <TextInput
        value={contact}
        onChangeText={setContact}
        placeholder={lang === "ru" ? "Контакт (email или телефон) — необязательно" : "კონტაქტი (email ან ტელ.) — სურვილისამებრ"}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />

      <Pressable
        onPress={onSend}
        disabled={sending}
        style={{ padding: 14, borderRadius: 12, backgroundColor: "black", opacity: sending ? 0.6 : 1 }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
          {sending
            ? (lang === "ru" ? "Отправка..." : "იგზავნება...")
            : (lang === "ru" ? "Отправить" : "გაგზავნა")}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
