import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getFavoriteQuotes } from "../../data/db/repositories/favoritesListRepo";
import { toggleFavorite } from "../../data/db/repositories/favoritesRepo";
import { colors, spacing, avatarRing } from "../../ui/theme";

export default function FavoritesScreen() {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language === "ru" ? "ru" : "ka") as "ka" | "ru";
  const navigation = useNavigation<any>();

  const [version, setVersion] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setVersion(v => v + 1);
    }, [])
  );

  const data = useMemo(() => getFavoriteQuotes(200), [version]);

  const onRemove = useCallback((quoteId: string) => {
    toggleFavorite(quoteId);
    setVersion(v => v + 1);
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(lang === "ru" ? "ru-RU" : "ka-GE", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <LinearGradient
      colors={[colors.background.gradientStart, colors.background.gradientMiddle, colors.background.gradientEnd]}
      style={styles.container}
    >
      <FlatList
        contentContainerStyle={styles.listContent}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const fatherName =
            lang === "ru" ? (item.fatherName_ru ?? item.fatherName_ka) : item.fatherName_ka;
          const quoteText =
            lang === "ru" ? (item.text_ru ?? item.text_ka) : item.text_ka;
          const dateDisplay = formatDate(item.createdAt);

          return (
            <Pressable
              onPress={() => navigation.navigate("Quote", { quoteId: item.id })}
              style={styles.quoteCard}
            >
              {/* Header row */}
              <View style={styles.cardHeader}>
                <Image
                  source={{ uri: item.fatherAvatarLocalPath }}
                  style={styles.avatar}
                />
                <View style={styles.headerInfo}>
                  <Text style={styles.fatherName} numberOfLines={1}>
                    {fatherName}
                  </Text>
                </View>
                {dateDisplay ? (
                  <Text style={styles.dateText}>{dateDisplay}</Text>
                ) : null}
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                  }}
                  style={styles.heartButton}
                >
                  <Text style={styles.heartIconActive}>♥</Text>
                </Pressable>
              </View>

              {/* Quote text */}
              <Text style={styles.quoteText} numberOfLines={5}>
                {quoteText}
              </Text>

              {/* Separator */}
              <View style={styles.separator} />
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {t('favorites.empty', lang === "ru" ? "Избранного пока нет" : "რჩეულები ჯერ არ არის")}
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
  listContent: {
    padding: spacing.containerPadding,
    paddingTop: spacing.sm,
  },
  quoteCard: {
    backgroundColor: 'rgba(243, 234, 220, 0.15)',
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    marginBottom: spacing.xs,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  avatar: {
    width: spacing.avatarSmall,
    height: spacing.avatarSmall,
    borderRadius: spacing.avatarSmall / 2,
    backgroundColor: colors.surface.tertiary,
    ...avatarRing,
  },
  headerInfo: {
    flex: 1,
  },
  fatherName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.inverse,
  },
  dateText: {
    fontSize: 12,
    color: colors.gold.light,
    marginRight: spacing.sm,
  },
  heartButton: {
    padding: spacing.xs,
  },
  heartIconActive: {
    fontSize: 18,
    color: '#e74c3c',
  },
  quoteText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.text.inverse,
    marginBottom: spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(209, 182, 122, 0.3)',
    marginBottom: spacing.xs,
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
