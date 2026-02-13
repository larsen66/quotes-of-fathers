import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { colors, borderRadius, spacing, avatarRing } from "../theme";

export type FatherTileProps = {
  id: string;
  name: string;
  avatarLocalPath: string;
  onPress: (fatherId: string) => void;
};

export default function FatherTile({
  id,
  name,
  avatarLocalPath,
  onPress,
}: FatherTileProps) {
  return (
    <Pressable
      onPress={() => onPress(id)}
      style={styles.container}
    >
      <Image
        source={{ uri: avatarLocalPath }}
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.surface.secondary,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  avatar: {
    width: spacing.avatarMedium,
    height: spacing.avatarMedium,
    borderRadius: spacing.avatarMedium / 2,
    backgroundColor: colors.surface.tertiary,
    ...avatarRing,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  },
});
