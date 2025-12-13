import React, { useMemo, useState } from "react";
import { View, Text, Image, Pressable, ScrollView, Share } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { RootStackParamList } from "../navigation/RootNavigator";
import { getQuoteById } from "../../data/db/repositories/quoteDetailsRepo";
import { isFavorite, toggleFavorite } from "../../data/db/repositories/favoritesRepo";

type RouteProps = RouteProp<RootStackParamList, "Quote">;

export default function QuoteScreen() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ru" ? "ru" : "ka") as "ka" | "ru";

  const route = useRoute<RouteProps>();
  const { quoteId } = route.params;

  const [version, setVersion] = useState(0);

  const data = useMemo(() => getQuoteById(quoteId), [quoteId, version]);
  if (!data) return null;

  const isFav = isFavorite(quoteId);

  const fatherName =
    lang === "ru" ? (data.fatherName_ru ?? data.fatherName_ka) : data.fatherName_ka;

  const quoteText =
    lang === "ru" ? (data.text_ru ?? data.text_ka) : data.text_ka;

  const source =
    lang === "ru" ? data.source_ru ?? data.source_ka : data.source_ka;

  async function onShare() {
    await Share.share({
      message: `${quoteText}\n\n— ${fatherName}`
    });
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {/* Фото отца */}
      {data.fatherProfileLocalPath ? (
        <Image
          source={{ uri: data.fatherProfileLocalPath }}
          style={{ width: "100%", height: 240, borderRadius: 16, marginBottom: 16 }}
        />
      ) : (
        <Image
          source={{ uri: data.fatherAvatarLocalPath }}
          style={{ width: 120, height: 120, borderRadius: 60, alignSelf: "center", marginBottom: 16 }}
        />
      )}

      {/* Имя */}
      <Text style={{ fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 12 }}>
        {fatherName}
      </Text>

      {/* Текст цитаты */}
      <Text style={{ fontSize: 17, lineHeight: 26, marginBottom: 20 }}>
        {quoteText}
      </Text>

      {/* Источник */}
      {source && (
        <Text style={{ fontSize: 14, opacity: 0.6, marginBottom: 20 }}>
          {source}
        </Text>
      )}

      {/* Кнопки */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Pressable
          onPress={() => {
            toggleFavorite(quoteId);
            setVersion(v => v + 1);
          }}
          style={{ flex: 1, padding: 12, borderRadius: 12, borderWidth: 1 }}
        >
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            {isFav ? "♥ Убрать из избранного" : "♡ В избранное"}
          </Text>
        </Pressable>

        <Pressable
          onPress={onShare}
          style={{ flex: 1, padding: 12, borderRadius: 12, borderWidth: 1 }}
        >
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            Поделиться
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
