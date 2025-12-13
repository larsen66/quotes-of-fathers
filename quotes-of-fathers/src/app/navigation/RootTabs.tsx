import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";

// Временный компонент - будет заменён на реальные экраны
const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>{name}</Text>
  </View>
);

const Tab = createBottomTabNavigator();

export default function RootTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={() => <PlaceholderScreen name="Home" />} />
    </Tab.Navigator>
  );
}
