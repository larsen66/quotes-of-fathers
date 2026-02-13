import React, { useMemo, useState } from "react";
import { View, Text, Image, FlatList, Pressable, SafeAreaView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import type { RootStackParamList } from "../navigation/types";
import { getFatherById } from "../../data/db/repositories/fatherDetailRepo";
import { getQuotesByFatherId } from "../../data/db/repositories/fatherQuotesRepo";
import { getQuotesCountByFatherId } from "../../data/db/repositories/fatherQuotesCountRepo";
import { isFavorite, toggleFavorite } from "../../data/db/repositories/favoritesRepo";
import { colors, spacing } from "../../ui/theme";

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
      <SafeAreaView style={styles.safeArea}>
        {/* Back button */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text.inverse} />
            <Text style={styles.backText}>{t('common.back', 'Назад')}</Text>
          </Pressable>
        </View>

        <FlatList
          data={quotes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.headerSection}>
              {/* Father image with gold frame */}
              <View style={styles.imageFrame}>
                <View style={styles.imageFrameInner}>
                  <Image
                    source={{ uri: headerImage }}
                    style={styles.headerImage}
                    resizeMode="cover"
                  />
                </View>
              </View>

              {/* Name */}
              <Text style={styles.fatherName}>{fatherName}</Text>

              {/* Quote count */}
              <Text style={styles.countText}>
                {t('fathers.quotesCount', { count }, `Цитат: ${count}`)}
              </Text>

              {/* Bio */}
              {!!fatherBio && (
                <Text style={styles.bioText}>
                  {fatherBio}
                </Text>
              )}

              {/* Section title */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {t('fathers.allQuotes', 'Все изречения')}
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => {
            const quoteText = lang === "ru" ? (item.text_ru ?? item.text_ka) : item.text_ka;
            const fav = isFavorite(item.id);
            const dateDisplay = formatDate(item.quoteDate || item.createdAt);

            return (
              <Pressable
                onPress={() => navigation.navigate("Quote", { quoteId: item.id })}
                style={styles.quoteItem}
              >
                <View style={styles.quoteRow}>
                  <View style={styles.quoteContent}>
                    <Text style={styles.quoteText} numberOfLines={4}>{quoteText}</Text>
                  </View>

                  <View style={styles.quoteRight}>
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
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {t('fathers.noQuotes', lang === "ru" ? "У этого отца пока нет цитат" : "ამ მამას ჯერ არ აქვს ციტატები")}
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.containerPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingRight: spacing.md,
  },
  backText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.inverse,
    marginLeft: 4,
  },
  listContent: {
    padding: spacing.containerPadding,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  imageFrame: {
    backgroundColor: colors.gold.primary,
    borderRadius: 8,
    padding: 4,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  imageFrameInner: {
    backgroundColor: colors.gold.dark,
    borderRadius: 6,
    padding: 3,
  },
  headerImage: {
    width: 160,
    height: 200,
    borderRadius: 4,
    backgroundColor: colors.surface.tertiary,
  },
  fatherName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.inverse,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  countText: {
    fontSize: 13,
    color: colors.gold.light,
    marginBottom: spacing.md,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text.inverse,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(209, 182, 122, 0.3)',
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  quoteItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
    backgroundColor: 'rgba(243, 234, 220, 0.15)',
    borderRadius: 8,
  },
  quoteRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quoteContent: {
    flex: 1,
  },
  quoteText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text.inverse,
  },
  quoteRight: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  dateText: {
    fontSize: 11,
    color: colors.gold.light,
  },
  heartButton: {
    padding: spacing.xs,
  },
  heartIcon: {
    fontSize: 16,
    color: colors.gold.primary,
  },
  heartIconActive: {
    color: '#e74c3c',
  },
  emptyContainer: {
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.inverse,
    textAlign: 'center',
  },
});
