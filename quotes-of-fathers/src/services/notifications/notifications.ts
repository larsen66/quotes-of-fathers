import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

type ScheduleParams = {
  weekdayTime: string; // "HH:MM"
  weekendTime: string; // "HH:MM"
  soundId: string;     // "default" | "bell" | ...
};

function parseTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(n => parseInt(n, 10));
  return { hour: h, minute: m };
}

export async function requestNotificationPermission() {
  const perms = await Notifications.getPermissionsAsync();
  if (perms.status === "granted") return true;

  const req = await Notifications.requestPermissionsAsync();
  return req.status === "granted";
}

export async function cancelAllScheduled() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleOpenAppNotifications(params: ScheduleParams) {
  const { weekdayTime, weekendTime, soundId } = params;

  const w = parseTime(weekdayTime);
  const we = parseTime(weekendTime);

  // Будни: Пн-Пт = 2..6 (в Expo: 1=Sunday, 2=Monday ... 7=Saturday)
  const weekdayTriggers = [2, 3, 4, 5, 6];
  // Выходные: Сб-Вс = 7,1
  const weekendTriggers = [7, 1];

  const contentBase: Notifications.NotificationContentInput = {
    title: "Откройте приложение",
    body: "Время для духовного чтения",
    sound: soundId === "default" ? true : soundId,
    ...(Platform.OS === "android" && {
      channelId: "default",
    }),
  };

  const scheduledIds: string[] = [];

  for (const weekday of weekdayTriggers) {
    const id = await Notifications.scheduleNotificationAsync({
      content: contentBase,
      trigger: {
        type: "calendar" as const,
        weekday,
        hour: w.hour,
        minute: w.minute,
        repeats: true,
      },
    });
    scheduledIds.push(id);
    console.log(`Scheduled weekday notification for day ${weekday} at ${weekdayTime}, ID: ${id}`);
  }

  for (const weekday of weekendTriggers) {
    const id = await Notifications.scheduleNotificationAsync({
      content: contentBase,
      trigger: {
        type: "calendar" as const,
        weekday,
        hour: we.hour,
        minute: we.minute,
        repeats: true,
      },
    });
    scheduledIds.push(id);
    console.log(`Scheduled weekend notification for day ${weekday} at ${weekendTime}, ID: ${id}`);
  }

  // Проверяем, что уведомления действительно запланированы
  const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
  console.log(`Total scheduled notifications: ${allScheduled.length}`);
  console.log(`Scheduled IDs: ${scheduledIds.join(", ")}`);

  return scheduledIds;
}
  