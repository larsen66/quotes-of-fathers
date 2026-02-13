import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

type GradientBackgroundProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'dark' | 'light';
};

export default function GradientBackground({
  children,
  style,
  variant = 'dark'
}: GradientBackgroundProps) {
  const gradientColors = variant === 'dark'
    ? [colors.background.gradientStart, colors.background.gradientMiddle, colors.background.gradientEnd]
    : [colors.background.lightGradientStart, colors.background.lightGradientEnd];

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.gradient, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
