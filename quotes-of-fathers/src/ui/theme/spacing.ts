/**
 * TAMARI Design System - Spacing & Layout Constants
 * Consistent spacing for a clean, minimalist aesthetic
 */

export const spacing = {
  // Base spacing unit (4px)
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  // Semantic spacing
  containerPadding: 16,
  cardPadding: 16,
  itemGap: 12,
  sectionGap: 24,

  // Component-specific
  avatarSmall: 44,
  avatarMedium: 60,
  avatarLarge: 120,

  headerHeight: 240,
  tabBarHeight: 56,
};

export const borderRadius = {
  // Consistent rounded corners
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,

  // Component-specific
  card: 14,
  button: 12,
  avatar: 9999,  // Full circle
  input: 12,
  modal: 16,
  image: 16,
};

export const shadows = {
  // Minimal shadows for flat design
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  // Subtle shadow for cards (optional, very minimal)
  subtle: {
    shadowColor: '#0f2240',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  // Medium shadow for elevated elements
  medium: {
    shadowColor: '#0f2240',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
};

// Gold ring styling for portraits
export const avatarRing = {
  borderWidth: 2,
  borderColor: '#d1b67a',  // Matte gold
};

// Card styling with gold outline
export const cardOutline = {
  borderWidth: 1,
  borderColor: 'rgba(209, 182, 122, 0.4)',  // Subtle gold
  borderRadius: borderRadius.card,
};
