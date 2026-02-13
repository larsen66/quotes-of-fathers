/**
 * TAMARI Design System
 * Minimalist, elegant, royal aesthetic inspired by Georgian heritage
 */

export { colors, TAMARI_BLUE, TAMARI_CREAM, TAMARI_GOLD, TAMARI_NAVY } from './colors';
export { typography } from './typography';
export { spacing, borderRadius, shadows, avatarRing, cardOutline } from './spacing';

// Common style helpers
import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { borderRadius, spacing, avatarRing } from './spacing';

export const commonStyles = StyleSheet.create({
  // Screen container with dark blue background
  screenContainer: {
    flex: 1,
    backgroundColor: colors.primary.dark,
  },

  // Card with gold outline
  card: {
    backgroundColor: colors.surface.secondary,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border.light,
    padding: spacing.cardPadding,
  },

  // Card with darker blue outline (alternative)
  cardDark: {
    backgroundColor: colors.surface.secondary,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.primary.dark,
    padding: spacing.cardPadding,
  },

  // Avatar with gold ring
  avatarSmall: {
    width: spacing.avatarSmall,
    height: spacing.avatarSmall,
    borderRadius: spacing.avatarSmall / 2,
    ...avatarRing,
  },

  avatarMedium: {
    width: spacing.avatarMedium,
    height: spacing.avatarMedium,
    borderRadius: spacing.avatarMedium / 2,
    ...avatarRing,
  },

  avatarLarge: {
    width: spacing.avatarLarge,
    height: spacing.avatarLarge,
    borderRadius: spacing.avatarLarge / 2,
    ...avatarRing,
  },

  // Primary button (gold background)
  buttonPrimary: {
    backgroundColor: colors.gold.primary,
    borderRadius: borderRadius.button,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center' as const,
  },

  buttonPrimaryText: {
    color: colors.primary.darkest,
    fontSize: 16,
    fontWeight: '600' as const,
  },

  // Secondary button (outlined)
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.gold.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center' as const,
  },

  buttonSecondaryText: {
    color: colors.primary.darkest,
    fontSize: 16,
    fontWeight: '500' as const,
  },

  // Dark button (navy background)
  buttonDark: {
    backgroundColor: colors.primary.dark,
    borderRadius: borderRadius.button,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center' as const,
  },

  buttonDarkText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600' as const,
  },

  // Input field
  input: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius.input,
    borderWidth: 1,
    borderColor: colors.border.light,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.lg,
  },

  // Heart/Favorite button
  heartButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gold.primary,
  },
});
