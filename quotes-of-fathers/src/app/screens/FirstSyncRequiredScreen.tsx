import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { setInitialSyncCompleted } from "../../data/db/repositories/syncStateRepo";

export default function FirstSyncRequiredScreen() {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>
        {t("common.needInternetFirstSync")}
      </Text>

      {/* временно: кнопка “симулировать первую синхронизацию”
         потом заменим на реальный sync из Firebase */}
      <Pressable
        onPress={() => setInitialSyncCompleted(true)}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 10,
          backgroundColor: "black"
        }}
      >
        <Text style={{ color: "white" }}>{t("common.retry")}</Text>
      </Pressable>
    </View>
  );
}
