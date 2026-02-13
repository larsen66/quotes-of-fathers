/**
 * TAMARI-inspired Typography
 * Modern serif style with Georgian medieval influence
 * Clean, readable, with moderate contrast
 */

import { TextStyle, Platform } from 'react-native';
import { colors } from './colors';

// Font family - using system fonts that work well with Georgian script
// For a more authentic look, consider adding a custom Georgian-style font
const fontFamily = Platform.select({
  ios: 'Georgia',      // Elegant serif on iOS
  android: 'serif',    // System serif on Android
  default: 'serif',
});

const fontFamilyRegular = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Display - Large titles
  displayLarge: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: 0.5,
    color: colors.text.primary,
  } as TextStyle,

  displayMedium: {
    fontFamily,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: 0.3,
    color: colors.text.primary,
  } as TextStyle,

  displaySmall: {
    fontFamily,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: 0.2,
    color: colors.text.primary,
  } as TextStyle,

  // Headlines
  headlineLarge: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: colors.text.primary,
  } as TextStyle,

  headlineMedium: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    color: colors.text.primary,
  } as TextStyle,

  headlineSmall: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.text.primary,
  } as TextStyle,

  // Body text
  bodyLarge: {
    fontFamily: fontFamilyRegular,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 26,
    color: colors.text.primary,
  } as TextStyle,

  bodyMedium: {
    fontFamily: fontFamilyRegular,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.text.primary,
  } as TextStyle,

  bodySmall: {
    fontFamily: fontFamilyRegular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.text.secondary,
  } as TextStyle,

  // Labels
  labelLarge: {
    fontFamily: fontFamilyRegular,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    color: colors.text.primary,
  } as TextStyle,

  labelMedium: {
    fontFamily: fontFamilyRegular,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: colors.text.primary,
  } as TextStyle,

  labelSmall: {
    fontFamily: fontFamilyRegular,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: colors.text.muted,
  } as TextStyle,

  // Special styles
  quote: {
    fontFamily,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 28,
    fontStyle: 'normal',
    color: colors.text.primary,
  } as TextStyle,

  authorName: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: colors.text.primary,
  } as TextStyle,

  goldTitle: {
    fontFamily,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    color: colors.gold.primary,
  } as TextStyle,

  navyTitle: {
    fontFamily,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    color: colors.primary.darkest,
  } as TextStyle,
};
