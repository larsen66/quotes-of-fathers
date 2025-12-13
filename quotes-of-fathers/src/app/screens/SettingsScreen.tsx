import React, { useMemo, useState } from "react";
import { View, Text, Pressable, TextInput, Alert, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

import { getSettings, updateSettings } from "../../data/db/repositories/settingsRepo";
import { seedDemoData } from "../../data/db/seedTestData";
import * as Notifications from "expo-notifications";
import {
  cancelAllScheduled,
  requestNotificationPermission,
  scheduleOpenAppNotifications
} from "../../services/notifications/notifications";

const SOUND_OPTIONS = [
  { id: "default", labelRu: "Стандартный", labelKa: "სტანდარტული" },
  { id: "bell", labelRu: "Колокол", labelKa: "ზარი" },
  { id: "soft", labelRu: "Тихий", labelKa: "მშვიდი" }
];

function isValidTime(hhmm: string) {
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hhmm);
  return !!m;
}

export default function SettingsScreen() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ru" ? "ru" : "ka") as "ka" | "ru";

  const initial = useMemo(() => getSettings(), []);
  const [notificationsEnabled, setNotificationsEnabled] = useState(!!initial.notificationsEnabled);
  const [weekdayTime, setWeekdayTime] = useState(initial.weekdayTime);
  const [weekendTime, setWeekendTime] = useState(initial.weekendTime);
  const [soundId, setSoundId] = useState(initial.soundId);
  const [language, setLanguage] = useState<"ka" | "ru">(initial.language);
  const [isResettingData, setIsResettingData] = useState(false);

  async function onSave() {
    try {
      console.log("Save button pressed");
      
      if (notificationsEnabled) {
        if (!isValidTime(weekdayTime) || !isValidTime(weekendTime)) {
          Alert.alert(lang === "ru" ? "Ошибка" : "შეცდომა", lang === "ru" ? "Время должно быть HH:MM" : "დრო უნდა იყოს HH:MM");
          return;
        }

        const granted = await requestNotificationPermission();
        if (!granted) {
          Alert.alert(
            lang === "ru" ? "Разрешение" : "ნებართვა",
            lang === "ru"
              ? "Разреши уведомления в настройках телефона"
              : "ჩართე შეტყობინებები ტელეფონის პარამეტრებში"
          );
          return;
        }
      }

      // 1) сохраняем в SQLite
      const next = updateSettings({
        language,
        notificationsEnabled: notificationsEnabled ? 1 : 0,
        weekdayTime,
        weekendTime,
        soundId
      });

      // 2) применяем язык сразу
      await i18n.changeLanguage(next.language);

      // 3) обновляем расписание уведомлений
      await cancelAllScheduled();
      if (notificationsEnabled) {
        await scheduleOpenAppNotifications({
          weekdayTime,
          weekendTime,
          soundId
        });
        
        // Проверяем, что уведомления запланированы
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        console.log(`Scheduled ${scheduled.length} notifications`);
        
        if (scheduled.length === 0) {
          Alert.alert(
            lang === "ru" ? "Предупреждение" : "გაფრთხილება",
            lang === "ru" 
              ? "Уведомления не были запланированы. Проверьте разрешения и настройки устройства."
              : "შეტყობინებები არ დაგეგმილა. შეამოწმეთ ნებართვები და მოწყობილობის პარამეტრები."
          );
        } else {
          Alert.alert(
            lang === "ru" ? "Готово" : "მზადაა", 
            lang === "ru" 
              ? `Настройки сохранены. Запланировано ${scheduled.length} уведомлений.`
              : `პარამეტრები შენახულია. დაგეგმილია ${scheduled.length} შეტყობინება.`
          );
        }
      } else {
        Alert.alert(lang === "ru" ? "Готово" : "მზადაა", lang === "ru" ? "Настройки сохранены" : "პარამეტრები შენახულია");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert(
        lang === "ru" ? "Ошибка" : "შეცდომა",
        lang === "ru" 
          ? `Ошибка при сохранении: ${error instanceof Error ? error.message : String(error)}`
          : `შენახვის შეცდომა: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async function onResetDemoData() {
    Alert.alert(
      lang === "ru" ? "Обновить данные" : "მონაცემების განახლება",
      lang === "ru" 
        ? "Это пересоздаст демо-данные с новыми изображениями. Продолжить?"
        : "ეს გადააქმნის დემო-მონაცემებს ახალი სურათებით. გავაგრძელოთ?",
      [
        {
          text: lang === "ru" ? "Отмена" : "გაუქმება",
          style: "cancel"
        },
        {
          text: lang === "ru" ? "Обновить" : "განახლება",
          style: "destructive",
          onPress: async () => {
            setIsResettingData(true);
            try {
              await seedDemoData();
              Alert.alert(
                lang === "ru" ? "Готово" : "მზადაა",
                lang === "ru" 
                  ? "Данные обновлены. Перезапустите приложение или перейдите на другую вкладку и вернитесь обратно."
                  : "მონაცემები განახლებულია. გადატვირთეთ აპლიკაცია ან გადადით სხვა ჩანართზე და დაბრუნდით."
              );
            } catch (error) {
              console.error("Error resetting demo data:", error);
              Alert.alert(
                lang === "ru" ? "Ошибка" : "შეცდომა",
                lang === "ru" 
                  ? `Ошибка при обновлении данных: ${error instanceof Error ? error.message : String(error)}`
                  : `მონაცემების განახლების შეცდომა: ${error instanceof Error ? error.message : String(error)}`
              );
            } finally {
              setIsResettingData(false);
            }
          }
        }
      ]
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      {/* Язык */}
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>
        {lang === "ru" ? "Язык" : "ენა"}
      </Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          onPress={() => setLanguage("ka")}
          style={{ padding: 10, borderRadius: 10, borderWidth: 1, flex: 1, opacity: language === "ka" ? 1 : 0.5 }}
        >
          <Text style={{ textAlign: "center" }}>ქართული</Text>
        </Pressable>
        <Pressable
          onPress={() => setLanguage("ru")}
          style={{ padding: 10, borderRadius: 10, borderWidth: 1, flex: 1, opacity: language === "ru" ? 1 : 0.5 }}
        >
          <Text style={{ textAlign: "center" }}>Русский</Text>
        </Pressable>
      </View>

      {/* Уведомления */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>
          {lang === "ru" ? "Уведомления" : "შეტყობინებები"}
        </Text>

        <Pressable
          onPress={() => setNotificationsEnabled(v => !v)}
          style={{ marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1 }}
        >
          <Text style={{ textAlign: "center" }}>
            {notificationsEnabled
              ? (lang === "ru" ? "Включены" : "ჩართულია")
              : (lang === "ru" ? "Выключены" : "გამორთულია")}
          </Text>
        </Pressable>
      </View>

      {/* Время */}
      <View style={{ opacity: notificationsEnabled ? 1 : 0.5 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 6 }}>
          {lang === "ru" ? "Будни (Пн–Пт)" : "სამუშაო დღეები (ორშ–პარ)"}
        </Text>
        <TextInput
          editable={notificationsEnabled}
          value={weekdayTime}
          onChangeText={setWeekdayTime}
          placeholder="HH:MM"
          style={{ borderWidth: 1, borderRadius: 10, padding: 10, marginTop: 8 }}
        />

        <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 12 }}>
          {lang === "ru" ? "Выходные (Сб–Вс)" : "შაბ-კვ (შაბ–კვ)"}
        </Text>
        <TextInput
          editable={notificationsEnabled}
          value={weekendTime}
          onChangeText={setWeekendTime}
          placeholder="HH:MM"
          style={{ borderWidth: 1, borderRadius: 10, padding: 10, marginTop: 8 }}
        />
      </View>

      {/* Звук */}
      <View style={{ opacity: notificationsEnabled ? 1 : 0.5, marginTop: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 6 }}>
          {lang === "ru" ? "Звук" : "ხმა"}
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
          {SOUND_OPTIONS.map(opt => {
            const label = lang === "ru" ? opt.labelRu : opt.labelKa;
            const active = soundId === opt.id;

            return (
              <Pressable
                key={opt.id}
                disabled={!notificationsEnabled}
                onPress={() => setSoundId(opt.id)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  opacity: active ? 1 : 0.6
                }}
              >
                <Text>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Сохранить */}
      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <Pressable
          onPress={onSave}
          style={{ 
            padding: 14, 
            borderRadius: 12, 
            backgroundColor: "black",
            minHeight: 50,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={{ color: "white", textAlign: "center", fontSize: 16, fontWeight: "600" }}>
            {lang === "ru" ? "Сохранить" : "შენახვა"}
          </Text>
        </Pressable>
      </View>

      {/* Обновить демо-данные */}
      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>
          {lang === "ru" ? "Разработка" : "განვითარება"}
        </Text>
        <Pressable
          onPress={onResetDemoData}
          disabled={isResettingData}
          style={{ 
            padding: 14, 
            borderRadius: 12, 
            backgroundColor: isResettingData ? "#999" : "#4CAF50",
            minHeight: 50,
            justifyContent: "center",
            alignItems: "center",
            opacity: isResettingData ? 0.6 : 1
          }}
        >
          <Text style={{ color: "white", textAlign: "center", fontSize: 16, fontWeight: "600" }}>
            {isResettingData 
              ? (lang === "ru" ? "Обновление..." : "განახლება...")
              : (lang === "ru" ? "Обновить демо-данные" : "დემო-მონაცემების განახლება")}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
