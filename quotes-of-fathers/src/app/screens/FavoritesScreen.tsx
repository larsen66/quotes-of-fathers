import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { getFavoriteQuotes } from "../../data/db/repositories/favoritesListRepo";
import { toggleFavorite } from "../../data/db/repositories/favoritesRepo";

export default function FavoritesScreen() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ru" ? "ru" : "ka") as "ka" | "ru";

  const [version, setVersion] = useState(0);

  const data = useMemo(() => getFavoriteQuotes(200), [version]);

  const onRemove = useCallback((quoteId: string) => {
    toggleFavorite(quoteId); // удалит, потому что в избранном
    setVersion(v => v + 1);  // перечитать SQLite
  }, []);

  return (
    <FlatList
      contentContainerStyle={{ padding: 12 }}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const fatherName =
          lang === "ru" ? (item.fatherName_ru ?? item.fatherName_ka) : item.fatherName_ka;
        const quoteText =
          lang === "ru" ? (item.text_ru ?? item.text_ka) : item.text_ka;

        return (
          <View style={{ padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Image
                source={{ uri: item.fatherAvatarLocalPath }}
                style={{ width: 44, height: 44, borderRadius: 22 }}
              />

              <Text style={{ fontSize: 16, fontWeight: "600", flex: 1 }}>
                {fatherName}
              </Text>

              {/* Сердце: в этом экране логика = удалить из избранного */}
              <Pressable
                onPress={() => onRemove(item.id)}
                style={{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1 }}
              >
                <Text style={{ fontSize: 14 }}>♥</Text>
              </Pressable>
            </View>

            <Text style={{ marginTop: 10, fontSize: 15, lineHeight: 20 }}>
              {quoteText}
            </Text>
          </View>
        );
      }}
      ListEmptyComponent={
        <View style={{ padding: 24 }}>
          <Text style={{ fontSize: 16 }}>
            {lang === "ru" ? "Избранного пока нет" : "რჩეულები ჯერ არ არის"}
          </Text>
        </View>
      }
    />
  );
}
