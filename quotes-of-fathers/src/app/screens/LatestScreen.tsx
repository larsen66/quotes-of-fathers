import React, { useCallback, useMemo, useState } from "react";
import { View, Text, FlatList, Image, RefreshControl, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { getLatestQuotes } from "../../data/db/repositories/quotesRepo";
import { incrementalSync } from "../../services/sync/incrementalSync";
import { getFavoriteIds, toggleFavorite } from "../../data/db/repositories/favoritesRepo";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { colors, spacing, borderRadius, avatarRing } from "../../ui/theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LatestScreen() {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language === "ru" ? "ru" : "ka") as "ka" | "ru";
  const [refreshing, setRefreshing] = useState(false);
  const [version, setVersion] = useState(0);
  const favoriteIds = useMemo(() => getFavoriteIds(), [version]);
  const navigation = useNavigation<NavigationProp>();

  const data = useMemo(() => {
    return getLatestQuotes(50);
  }, [version]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await incrementalSync();
      setVersion(v => v + 1);
    } finally {
      setRefreshing(false);
    }
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.gold.primary}
            colors={[colors.gold.primary]}
          />
        }
        renderItem={({ item }) => {
          const fav = favoriteIds.has(item.id);
          const fatherName = lang === "ru" ? (item.fatherName_ru ?? item.fatherName_ka) : item.fatherName_ka;
          const quoteText = lang === "ru" ? (item.text_ru ?? item.text_ka) : item.text_ka;
          const dateDisplay = formatDate(item.quoteDate || item.createdAt);

          return (
            <Pressable
              onPress={() => navigation.navigate("Quote", { quoteId: item.id })}
              style={styles.quoteCard}
            >
              {/* Header row: avatar, name, date, heart */}
              <View style={styles.cardHeader}>
                <View style={styles.avatarContainer}>
                  {item.fatherAvatarLocalPath ? (
                    <Image
                      source={{ uri: item.fatherAvatarLocalPath }}
                      style={styles.avatar}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                      <Text style={styles.avatarPlaceholderText}>?</Text>
                    </View>
                  )}
                </View>
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
                    toggleFavorite(item.id);
                    setVersion(v => v + 1);
                  }}
                  style={styles.heartButton}
                >
                  <Text style={[styles.heartIcon, fav && styles.heartIconActive]}>
                    {fav ? "♥" : "♡"}
                  </Text>
                </Pressable>
              </View>

              {/* Quote text */}
              <Text style={styles.quoteText} numberOfLines={5}>
                {quoteText}
              </Text>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => (
          <View style={styles.separatorContainer}>
            <Image
              source={require("../../../assets/divider_cropped.png")}
              style={styles.dividerImage}
              resizeMode="contain"
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {t('common.noData', 'Нет данных. Потяните вниз для загрузки.')}
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
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  avatarContainer: {
    // Gold ring around avatar
  },
  avatar: {
    width: spacing.avatarSmall,
    height: spacing.avatarSmall,
    borderRadius: spacing.avatarSmall / 2,
    backgroundColor: colors.surface.tertiary,
    ...avatarRing,
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholderText: {
    fontSize: 18,
    color: colors.text.muted,
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
  heartIcon: {
    fontSize: 18,
    color: colors.gold.primary,
  },
  heartIconActive: {
    color: '#e74c3c',
  },
  quoteText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.text.inverse,
  },
  separatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  dividerImage: {
    width: '68%',
    height: 30,
    tintColor: colors.gold.primary,
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
