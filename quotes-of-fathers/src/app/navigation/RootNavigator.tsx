import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import RootTabs from "./RootTabs";
import FirstSyncRequiredScreen from "../screens/FirstSyncRequiredScreen";
import QuoteScreen from "../screens/QuoteScreen";
import SupabaseTestScreen from "../screens/SupabaseTestScreen";
import { initDb } from "../../data/db/schema";
import { isInitialSyncCompleted } from "../../data/db/repositories/syncStateRepo";
import FatherProfileScreen from "../screens/FatherProfileScreen";
import { flushFeedbackOutbox } from "../../data/db/repositories/flushFeedbackOutbox"; 

// TEMPORARY: Set to true to test Supabase connection
const TESTING_MODE = false;

export type RootStackParamList = {
    Tabs: undefined;
    Quote: { quoteId: string };
    FatherProfile: { fatherId: string };
    FirstSync: undefined;
    SupabaseTest: undefined;
  };
  

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  const checkSyncStatus = () => {
    try {
      const syncCompleted = isInitialSyncCompleted();
      setDone(syncCompleted);
    } catch (error) {
      console.error("Error checking sync status:", error);
      setDone(false);
    }
  };

  useEffect(() => {
    try {
      initDb();
      flushFeedbackOutbox();
      checkSyncStatus();
    } catch (error) {
      console.error("Error initializing app:", error);
      // В случае ошибки показываем экран первой синхронизации
      setDone(false);
    } finally {
      setReady(true);
    }
  }, []);

  // Проверяем статус синхронизации при фокусе на FirstSync экране
  useFocusEffect(
    React.useCallback(() => {
      if (ready && !done) {
        checkSyncStatus();
      }
    }, [ready, done])
  );

  if (!ready) return null;

  // Show test screen in testing mode
  if (TESTING_MODE) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen 
          name="SupabaseTest" 
          component={SupabaseTestScreen}
          options={{ title: 'Supabase Connection Test' }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {done ? (
        <>
          <Stack.Screen name="Tabs" component={RootTabs} />
          <Stack.Screen name="FatherProfile" component={FatherProfileScreen} />
          <Stack.Screen name="Quote" component={QuoteScreen} />
         
        </>
      ) : (
        <Stack.Screen name="FirstSync" component={FirstSyncRequiredScreen} />
      )}
    </Stack.Navigator>
  );
}
