import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

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
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
});

