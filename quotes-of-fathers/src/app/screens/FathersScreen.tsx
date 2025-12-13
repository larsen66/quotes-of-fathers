import React, { useMemo } from "react";
import { FlatList, Image, Pressable, Text, View, useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import { getAllFathers } from "../../data/db/repositories/fathersRepo";

export default function FathersScreen() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ru" ? "ru" : "ka") as "ka" | "ru";

  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();

  const data = useMemo(() => getAllFathers(), []);

  const GAP = 10;
  const COLS = 3;
  const padding = 12;
  const tileSize = Math.floor((width - padding * 2 - GAP * (COLS - 1)) / COLS);

  return (
    <FlatList
      contentContainerStyle={{ padding }}
      data={data}
      numColumns={COLS}
      columnWrapperStyle={{ gap: GAP, marginBottom: GAP }}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const name = lang === "ru" ? (item.name_ru ?? item.name_ka) : item.name_ka;

        return (
          <Pressable
            onPress={() => navigation.navigate("FatherProfile", { fatherId: item.id })}
            style={{
              width: tileSize,
              borderRadius: 14,
              borderWidth: 1,
              overflow: "hidden",
              paddingBottom: 10
            }}
          >
            <Image
              source={{ uri: item.avatarLocalPath }}
              style={{ width: "100%", height: tileSize, backgroundColor: "rgba(0,0,0,0.05)" }}
              resizeMode="cover"
            />
            <View style={{ paddingHorizontal: 8, paddingTop: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: "600" }} numberOfLines={2}>
                {name}
              </Text>
            </View>
          </Pressable>
        );
      }}
      ListEmptyComponent={
        <View style={{ padding: 24 }}>
          <Text style={{ fontSize: 16 }}>
            {lang === "ru" ? "Нет данных. Выполни синхронизацию." : "მონაცემები არ არის. გააკეთეთ სინქრონიზაცია."}
          </Text>
        </View>
      }
    />
  );
}
