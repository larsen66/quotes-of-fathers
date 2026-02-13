import React from "react";
import { Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { colors, spacing } from "../../ui/theme";

const SECTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export default function PrivacyPolicyScreen() {
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={[colors.background.gradientStart, colors.background.gradientMiddle, colors.background.gradientEnd]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("privacy.title")}</Text>
        <Text style={styles.date}>{t("privacy.lastUpdated")}</Text>
        <Text style={styles.body}>{t("privacy.intro")}</Text>

        {SECTIONS.map((n) => (
          <React.Fragment key={n}>
            <Text style={styles.heading}>{t(`privacy.s${n}Title`)}</Text>
            <Text style={styles.body}>{t(`privacy.s${n}Body`)}</Text>
          </React.Fragment>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.containerPadding,
    paddingBottom: spacing.xxxl * 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text.inverse,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: 13,
    color: colors.gold.light,
    marginBottom: spacing.xl,
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gold.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text.inverse,
  },
});
