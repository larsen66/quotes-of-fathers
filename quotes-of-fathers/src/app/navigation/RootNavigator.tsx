import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RootTabs from "./RootTabs";
import FirstSyncRequiredScreen from "../screens/FirstSyncRequiredScreen";
import { initDb } from "../../data/db/schema";
import { isInitialSyncCompleted } from "../../data/db/repositories/syncStateRepo";

export type RootStackParamList = {
  FirstSync: undefined;
  Tabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      initDb();
      const syncCompleted = isInitialSyncCompleted();
      setDone(syncCompleted);
    } catch (error) {
      console.error("Error initializing app:", error);
      // В случае ошибки показываем экран первой синхронизации
      setDone(false);
    } finally {
      setReady(true);
    }
  }, []);

  if (!ready) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {done ? (
        <Stack.Screen name="Tabs" component={RootTabs} />
      ) : (
        <Stack.Screen name="FirstSync" component={FirstSyncRequiredScreen} />
      )}
    </Stack.Navigator>
  );
}
