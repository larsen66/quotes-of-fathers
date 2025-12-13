import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LatestScreen from "../screens/LatestScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import FathersScreen from "../screens/FathersScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AboutScreen from "../screens/AboutScreen";

const Tab = createBottomTabNavigator();

export default function RootTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={LatestScreen} options={{ title: "Home" }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: "Favorites" }} />
      <Tab.Screen name="Fathers" component={FathersScreen} options={{ title: "Fathers" }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
      <Tab.Screen name="About" component={AboutScreen} options={{ title: "About" }} />
    </Tab.Navigator>
  );
}
