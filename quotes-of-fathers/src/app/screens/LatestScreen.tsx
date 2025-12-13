import React, { useCallback, useMemo, useState } from "react";
import { View, Text, FlatList, Image, RefreshControl, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { getLatestQuotes } from "../../data/db/repositories/quotesRepo";
import { incrementalSync } from "../../services/sync/incrementalSync";
import { getFavoriteIds, isFavorite, toggleFavorite } from "../../data/db/repositories/favoritesRepo";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LatestScreen() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ru" ? "ru" : "ka") as "ka" | "ru";
  const [refreshing, setRefreshing] = useState(false);
  const [version, setVersion] = useState(0); // простой триггер перерендера после синка
  const favoriteIds = useMemo(() => getFavoriteIds(), [version]);
  const navigation = useNavigation<NavigationProp>();

  const data = useMemo(() => {
    // читаем прямо из SQLite
    return getLatestQuotes(50);
  }, [version]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await incrementalSync();
      setVersion(v => v + 1); // обновили базу → перечитать
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <FlatList
      contentContainerStyle={{ padding: 12 }}
      data={data}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => {
        const fav = favoriteIds.has(item.id);
        const fatherName = lang === "ru" ? (item.fatherName_ru ?? item.fatherName_ka) : item.fatherName_ka;
        const quoteText = lang === "ru" ? (item.text_ru ?? item.text_ka) : item.text_ka;
        
        // Логируем для отладки
        if (!item.fatherAvatarLocalPath) {
          console.warn("Missing avatar path for quote:", item.id, "father:", item.fatherId);
        }

        return (
          <Pressable
            onPress={() => {
              navigation.navigate("Quote", { quoteId: item.id });
            }}
            style={{ padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 12 }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <View style={{ flexDirection: "row", gap: 12, alignItems: "center", flex: 1 }}>
                {item.fatherAvatarLocalPath ? (
                  <Image
                    source={{ uri: item.fatherAvatarLocalPath }}
                    style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#e0e0e0" }}
                    onError={(e) => {
                      console.warn("Failed to load avatar:", item.fatherAvatarLocalPath, "for father:", item.fatherId);
                    }}
                    onLoad={() => {
                      console.log("Successfully loaded avatar:", item.fatherAvatarLocalPath);
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#e0e0e0", justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 20 }}>👤</Text>
                  </View>
                )}
                <Text style={{ fontSize: 16, fontWeight: "600", flex: 1 }}>
                  {fatherName}
                </Text>
              </View>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.id);
                  setVersion(v => v + 1);
                }}
                style={{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1 }}
              >
                <Text style={{ fontSize: 14 }}>{fav ? "♥" : "♡"}</Text>
              </Pressable>
            </View>

            <Text style={{ fontSize: 15, lineHeight: 20 }}>
              {quoteText}
            </Text>
          </Pressable>
        );
      }}
      ListEmptyComponent={
        <View style={{ padding: 24 }}>
          <Text style={{ fontSize: 16 }}>Нет данных. Сделай первую загрузку.</Text>
        </View>
      }
    />
  );
}
