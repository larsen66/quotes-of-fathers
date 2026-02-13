/**
 * TAMARI-inspired Color Palette
 * Derived from the royal Georgian aesthetic of the TAMARI logo
 */

export const colors = {
  // Primary colors - Deep Royal Blue
  primary: {
    darkest: '#0f2240',    // Deep navy - text, accents
    dark: '#1a2f55',       // Royal blue - primary backgrounds
    medium: '#2d4a7a',     // Medium blue - subtle accents
    light: '#4a6a9a',      // Light blue - disabled states
  },

  // Surface colors - Soft Ivory/Cream
  surface: {
    primary: '#f3eadc',    // Main cream background
    secondary: '#f8f3eb',  // Lighter cream for cards
    tertiary: '#faf7f2',   // Very light cream for highlights
    white: '#ffffff',      // Pure white for modals
  },

  // Accent colors - Muted Matte Gold
  gold: {
    primary: '#d1b67a',    // Main gold - strokes, highlights
    light: '#e0c999',      // Light gold - hover states
    dark: '#b89d5e',       // Dark gold - pressed states
    muted: '#c4a86a',      // Muted gold - subtle accents
  },

  // Text colors
  text: {
    primary: '#0f2240',    // Deep navy - main text
    secondary: '#2d4a7a',  // Medium blue - secondary text
    muted: '#6b7c94',      // Muted blue-gray - tertiary text
    inverse: '#f3eadc',    // Cream - text on dark backgrounds
    gold: '#d1b67a',       // Gold - accent text, titles
  },

  // Semantic colors
  semantic: {
    error: '#8b3a3a',      // Muted ruby - errors
    success: '#2d5a4a',    // Muted emerald - success
    warning: '#b89d5e',    // Dark gold - warnings
    info: '#2d4a7a',       // Medium blue - info
  },

  // UI element colors
  border: {
    gold: '#d1b67a',       // Gold borders for cards
    light: 'rgba(209, 182, 122, 0.3)',  // Subtle gold borders
    dark: '#1a2f55',       // Dark blue borders
  },

  // Overlay colors
  overlay: {
    light: 'rgba(15, 34, 64, 0.35)',  // Navy overlay
    medium: 'rgba(15, 34, 64, 0.5)',
    dark: 'rgba(15, 34, 64, 0.7)',
  },

  // Background gradients (adapted from original green to TAMARI blue)
  background: {
    primary: '#f3eadc',
    // Main screen gradient (like the original green gradient, but in blue tones)
    gradientStart: '#1a2f55',      // Top - darker blue
    gradientMiddle: '#2d4a7a',     // Middle - medium blue
    gradientEnd: '#4a6a9a',        // Bottom - lighter blue
    // Light gradient for cards area
    lightGradientStart: '#f8f3eb',
    lightGradientEnd: '#f3eadc',
    // Cream surface with subtle warmth
    cream: '#f5edd9',
  },

  // Card frame colors (like the decorative yellow frames in original)
  cardFrame: {
    outer: '#d1b67a',              // Gold outer frame
    inner: '#b89d5e',              // Darker gold inner
    background: '#f8f3eb',         // Cream card background
  },
};

// Shorthand exports for common use
export const TAMARI_BLUE = colors.primary.dark;
export const TAMARI_CREAM = colors.surface.primary;
export const TAMARI_GOLD = colors.gold.primary;
export const TAMARI_NAVY = colors.primary.darkest;
