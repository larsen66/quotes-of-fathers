import React, { useMemo, useState } from "react";
import { View, Text, Image, FlatList, Pressable, SafeAreaView } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { RootStackParamList } from "../navigation/RootNavigator";
import { getFatherById } from "../../data/db/repositories/fatherDetailRepo";
import { getQuotesByFatherId } from "../../data/db/repositories/fatherQuotesRepo";
import { getQuotesCountByFatherId } from "../../data/db/repositories/fatherQuotesCountRepo";
import { isFavorite, toggleFavorite } from "../../data/db/repositories/favoritesRepo";

type RouteProps = RouteProp<RootStackParamList, "FatherProfile">;

export default function FatherProfileScreen() {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language === "ru" ? "ru" : "ka") as "ka" | "ru";

  const route = useRoute<RouteProps>();
  const navigation = useNavigation<any>();
  const { fatherId } = route.params;

  const [version, setVersion] = useState(0);

  const father = useMemo(() => getFatherById(fatherId), [fatherId, version]);
  const quotes = useMemo(() => getQuotesByFatherId(fatherId, 300), [fatherId, version]);
  const count = useMemo(() => getQuotesCountByFatherId(fatherId), [fatherId, version]);

  if (!father) return null;

  const fatherName = lang === "ru" ? (father.name_ru ?? father.name_ka) : father.name_ka;
  const fatherBio = lang === "ru" ? (father.bio_ru ?? father.bio_ka) : father.bio_ka;

  const headerImage = father.profileLocalPath ?? father.avatarLocalPath;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Кнопка назад */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ alignSelf: "flex-start", paddingVertical: 8, paddingHorizontal: 12 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500" }}>← {t('common.back')}</Text>
        </Pressable>
      </View>

      <FlatList
        data={quotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
        <View style={{ marginBottom: 16 }}>
          <Image
            source={{ uri: headerImage }}
            style={{ width: "100%", height: 240, borderRadius: 16, marginBottom: 12 }}
          />
          <Text style={{ fontSize: 22, fontWeight: "700" }}>{fatherName}</Text>

          <Text style={{ marginTop: 6, fontSize: 14, opacity: 0.7 }}>
            {t('fathers.quotesCount', { count })}
          </Text>

          {!!fatherBio && (
            <Text style={{ marginTop: 10, fontSize: 15, lineHeight: 22, opacity: 0.9 }}>
              {fatherBio}
            </Text>
          )}

          <View style={{ height: 1, opacity: 0.15, backgroundColor: "black", marginTop: 16 }} />
        </View>
      }
      renderItem={({ item }) => {
        const quoteText = lang === "ru" ? (item.text_ru ?? item.text_ka) : item.text_ka;
        const fav = isFavorite(item.id);

        return (
          <Pressable
            onPress={() => navigation.navigate("Quote", { quoteId: item.id })}
            style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.12)" }}
          >
            <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, lineHeight: 22 }}>{quoteText}</Text>

                {/* если нужна дата — показываем quoteDate или createdAt */}
                {!!item.quoteDate && (
                  <Text style={{ marginTop: 6, fontSize: 12, opacity: 0.6 }}>
                    {item.quoteDate}
                  </Text>
                )}
              </View>

              <Pressable
                onPress={() => {
                  toggleFavorite(item.id);
                  setVersion(v => v + 1);
                }}
                style={{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1 }}
              >
                <Text style={{ fontSize: 14 }}>{fav ? "♥" : "♡"}</Text>
              </Pressable>
            </View>
          </Pressable>
        );
      }}
      ListEmptyComponent={
        <View style={{ paddingVertical: 24 }}>
          <Text style={{ fontSize: 16 }}>
            {lang === "ru" ? "У этого отца пока нет цитат" : "ამ მამას ჯერ არ აქვს ციტატები"}
          </Text>
        </View>
      }
      />
    </SafeAreaView>
  );
}
