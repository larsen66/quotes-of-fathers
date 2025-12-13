import "react-native-gesture-handler";
import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import "./src/i18n/i18n";
import RootNavigator from "./src/app/navigation/RootNavigator";

// Настройка поведения уведомлений
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Настройка канала для Android
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "default",
      }).catch(err => console.error("Error setting notification channel:", err));
    }

    // Обработчик получения уведомления (когда приложение открыто)
    const notificationSubscription = Notifications.addNotificationReceivedListener((notification: Notifications.Notification) => {
      console.log("Notification received:", notification);
    });
    notificationListener.current = notificationSubscription;

    // Обработчик нажатия на уведомление
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
      console.log("Notification response:", response);
    });
    responseListener.current = responseSubscription;

    return () => {
      try {
        if (notificationSubscription && typeof notificationSubscription.remove === "function") {
          notificationSubscription.remove();
        }
      } catch (err) {
        console.error("Error removing notification listener:", err);
      }
      try {
        if (responseSubscription && typeof responseSubscription.remove === "function") {
          responseSubscription.remove();
        }
      } catch (err) {
        console.error("Error removing response listener:", err);
      }
    };
  }, []);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
