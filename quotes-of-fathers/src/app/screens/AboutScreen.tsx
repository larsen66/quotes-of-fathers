import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { enqueueFeedback } from "../../data/db/repositories/feedbackOutboxRepo";
import { flushFeedbackOutbox } from "../../data/db/repositories/flushFeedbackOutbox";
import { colors, spacing, borderRadius } from "../../ui/theme";


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
    <LinearGradient
      colors={[colors.background.gradientStart, colors.background.gradientMiddle, colors.background.gradientEnd]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {t('about.title')}
        </Text>

        <Text style={styles.description}>
          {t('about.description')}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.feedbackTitle}>
          {t('about.feedback')}
        </Text>

        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder={t('about.messagePlaceholder')}
          placeholderTextColor={colors.text.muted}
          multiline
          style={styles.messageInput}
        />

        <TextInput
          value={contact}
          onChangeText={setContact}
          placeholder={t('about.contactPlaceholder')}
          placeholderTextColor={colors.text.muted}
          style={styles.contactInput}
        />

        <Pressable
          onPress={onSend}
          disabled={sending}
          style={[styles.sendButton, sending && styles.sendButtonDisabled]}
        >
          <Text style={styles.sendButtonText}>
            {sending ? t('about.sending') : t('about.send')}
          </Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.containerPadding,
    gap: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text.inverse,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(209, 182, 122, 0.3)',
    marginVertical: spacing.sm,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.input,
    padding: spacing.md,
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: colors.surface.white,
    color: colors.text.primary,
    fontSize: 16,
  },
  contactInput: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.input,
    padding: spacing.md,
    backgroundColor: colors.surface.white,
    color: colors.text.primary,
    fontSize: 16,
  },
  sendButton: {
    padding: spacing.lg,
    borderRadius: borderRadius.button,
    backgroundColor: colors.primary.dark,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: colors.text.inverse,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
