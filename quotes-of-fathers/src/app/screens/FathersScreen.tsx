import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View, useWindowDimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { getAllFathers } from "../../data/db/repositories/fathersRepo";
import { colors, spacing, borderRadius } from "../../ui/theme";

export default function FathersScreen() {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language === "ru" ? "ru" : "ka") as "ka" | "ru";

  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const [version, setVersion] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setVersion(v => v + 1);
    }, [])
  );

  const data = useMemo(() => getAllFathers(), [version]);

  // 4 columns like original design
  const GAP = 8;
  const COLS = 4;
  const padding = 12;
  const tileSize = Math.floor((width - padding * 2 - GAP * (COLS - 1)) / COLS);
  const imageSize = tileSize - 8; // Leave space for gold frame

  return (
    <LinearGradient
      colors={[colors.background.gradientStart, colors.background.gradientMiddle, colors.background.gradientEnd]}
      style={styles.container}
    >
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
              style={[styles.tile, { width: tileSize }]}
            >
              {/* Gold decorative frame */}
              <View style={[styles.frameOuter, { width: tileSize - 4, height: tileSize - 4 }]}>
                <View style={[styles.frameInner, { width: imageSize, height: imageSize }]}>
                  <Image
                    source={{ uri: item.avatarLocalPath }}
                    style={[styles.tileImage, { width: imageSize - 4, height: imageSize - 4 }]}
                    resizeMode="cover"
                  />
                </View>
              </View>
              <Text style={styles.tileName} numberOfLines={2}>
                {name}
              </Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {t('common.noData', lang === "ru" ? "Нет данных. Выполни синхронизацию." : "მონაცემები არ არის.")}
            </Text>
          </View>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tile: {
    alignItems: 'center',
    paddingTop: 2,
  },
  frameOuter: {
    backgroundColor: colors.gold.primary,
    borderRadius: 4,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  frameInner: {
    backgroundColor: colors.gold.dark,
    borderRadius: 3,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileImage: {
    backgroundColor: colors.surface.tertiary,
    borderRadius: 2,
  },
  tileName: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.text.inverse,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 2,
    lineHeight: 13,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.inverse,
    textAlign: "center",
  },
});
