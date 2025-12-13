import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { setInitialSyncCompleted } from "../../data/db/repositories/syncStateRepo";
import { initialSync } from "../../services/sync/initialSync";
export default function FirstSyncRequiredScreen() {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>
        {t("common.needInternetFirstSync")}
      </Text>

<Pressable onPress={() => initialSync()}>
    </Pressable>

    </View>
  );
}
