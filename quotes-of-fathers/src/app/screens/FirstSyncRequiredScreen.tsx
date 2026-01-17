import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { initialSync } from "../../services/sync/initialSync";

export default function FirstSyncRequiredScreen() {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Автоматически запускаем синхронизацию при входе
    handleSync();
  }, []);

  const handleSync = async () => {
    try {
      await initialSync();
      // RootNavigator автоматически переключится на Tabs
      // после успешной синхронизации
    } catch (error) {
      console.error("Sync error:", error);
      const errorMessage = t(
        "common.syncError", 
        "Не удалось выполнить синхронизацию. Проверьте подключение к интернету."
      );
      setError(errorMessage);
      
      // Показываем алерт с возможностью повторить
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
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    color: "#FF3B30",
    marginTop: 16,
    paddingHorizontal: 20,
  },
});
