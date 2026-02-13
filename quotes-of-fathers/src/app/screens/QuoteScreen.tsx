import React, { useMemo, useState } from "react";
import { View, Text, Image, Pressable, ScrollView, SafeAreaView, Share, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import type { RootStackParamList } from "../navigation/types";
import { getQuoteById } from "../../data/db/repositories/quoteDetailsRepo";
import { isFavorite, toggleFavorite } from "../../data/db/repositories/favoritesRepo";
import { colors, spacing, borderRadius } from "../../ui/theme";

type RouteProps = RouteProp<RootStackParamList, "Quote">;

export default function QuoteScreen() {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language === "ru" ? "ru" : "ka") as "ka" | "ru";

  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { quoteId } = route.params;

  const [version, setVersion] = useState(0);

  const data = useMemo(() => getQuoteById(quoteId), [quoteId, version]);
  if (!data) return null;

  const isFav = useMemo(() => isFavorite(quoteId), [quoteId, version]);

  const fatherName =
    lang === "ru" ? (data.fatherName_ru ?? data.fatherName_ka) : data.fatherName_ka;

  const quoteText =
    lang === "ru" ? (data.text_ru ?? data.text_ka) : data.text_ka;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(lang === "ru" ? "ru-RU" : "ka-GE", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  const dateDisplay = formatDate(data.quoteDate || data.createdAt);

  async function onShare(text: string, author: string) {
    await Share.share({
      message: `${text}\n\n— ${author}`,
    });
  }

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

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Father image with gold frame */}
          <View style={styles.imageFrame}>
            <View style={styles.imageFrameInner}>
              <Image
                source={{ uri: data.fatherProfileLocalPath || data.fatherAvatarLocalPath }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Name */}
          <Text style={styles.fatherName}>
            {fatherName}
          </Text>

          {/* Date */}
          {dateDisplay ? (
            <Text style={styles.dateText}>{dateDisplay}</Text>
          ) : null}

          {/* Quote text */}
          <Text style={styles.quoteText}>
            {quoteText}
          </Text>

          {/* Action buttons */}
          <View style={styles.buttonRow}>
            <Pressable
              onPress={() => {
                toggleFavorite(quoteId);
                setVersion(v => v + 1);
              }}
              style={[styles.actionButton, isFav && styles.actionButtonActive]}
            >
              <Ionicons
                name={isFav ? "heart" : "heart-outline"}
                size={20}
                color={isFav ? '#e74c3c' : colors.gold.primary}
              />
            </Pressable>

            <Pressable
              onPress={() => onShare(quoteText, fatherName)}
              style={styles.actionButton}
            >
              <Ionicons name="share-outline" size={20} color={colors.gold.primary} />
            </Pressable>
          </View>
        </ScrollView>
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
  scrollContent: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  imageFrame: {
    backgroundColor: colors.gold.primary,
    borderRadius: 8,
    padding: 4,
    marginBottom: spacing.lg,
    // Shadow for depth
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
  profileImage: {
    width: 180,
    height: 220,
    borderRadius: 4,
    backgroundColor: colors.surface.tertiary,
  },
  fatherName: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: colors.text.inverse,
  },
  dateText: {
    fontSize: 13,
    color: colors.gold.light,
    marginBottom: spacing.lg,
  },
  quoteText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text.inverse,
    textAlign: 'left',
    marginBottom: spacing.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(209, 182, 122, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gold.primary,
  },
  actionButtonActive: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderColor: '#e74c3c',
  },
});
