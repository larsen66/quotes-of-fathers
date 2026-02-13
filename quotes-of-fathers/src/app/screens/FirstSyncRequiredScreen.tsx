import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { initialSync } from "../../services/sync/initialSync";
import { colors, spacing } from "../../ui/theme";

export default function FirstSyncRequiredScreen() {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleSync();
  }, []);

  const handleSync = async () => {
    try {
      await initialSync();
    } catch (error) {
      console.error("Sync error:", error);
      const errorMessage = t(
        "common.syncError",
        "Не удалось выполнить синхронизацию. Проверьте подключение к интернету."
      );
      setError(errorMessage);

      Alert.alert(
        t("common.error", "Ошибка"),
        errorMessage,
        [
          {
            text: t("common.retry", "Повторить"),
            onPress: () => {
              setError(null);
              handleSync();
            }
          }
        ]
      );
    }
  };

  return (
    <LinearGradient
      colors={[colors.background.gradientStart, colors.background.gradientMiddle, colors.background.gradientEnd]}
      style={styles.container}
    >
      <ActivityIndicator size="large" color={colors.gold.primary} />

      <Text style={styles.title}>
        {error
          ? t("common.syncFailed", "Синхронизация не удалась")
          : t("common.syncing", "Синхронизация данных...")}
      </Text>

      {!error && (
        <Text style={styles.subtitle}>
          {t("common.pleaseWait", "Пожалуйста, подождите")}
        </Text>
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
    textAlign: "center",
    color: colors.text.inverse,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: colors.gold.light,
    marginTop: spacing.sm,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    color: '#e74c3c',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
});
