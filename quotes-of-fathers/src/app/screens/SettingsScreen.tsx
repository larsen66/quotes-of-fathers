import React, { useMemo, useState } from "react";
import { View, Text, Pressable, Alert, ScrollView, Switch, Modal, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getSettings, updateSettings } from "../../data/db/repositories/settingsRepo";
import { seedDemoData } from "../../data/db/seedTestData";
import * as Notifications from "expo-notifications";
import {
  cancelAllScheduled,
  requestNotificationPermission,
  scheduleOpenAppNotifications
} from "../../services/notifications/notifications";

function hhmmToDate(hhmm: string) {
  const [h, m] = hhmm.split(":").map(n => parseInt(n, 10));
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}

function dateToHHMM(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

const SOUND_OPTIONS = [
  { id: "default", labelRu: "Стандартный", labelKa: "სტანდარტული" },
  { id: "bell", labelRu: "Афонское било", labelKa: "ათონის ზარი" },
  { id: "soft", labelRu: "Тихий", labelKa: "მშვიდი" }
];


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

  const [soundPickerOpen, setSoundPickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState<"weekday" | "weekend" | null>(null);
  const [tempTimeValue, setTempTimeValue] = useState<Date | null>(null);

  const selectedSoundLabel = useMemo(() => {
    const option = SOUND_OPTIONS.find(opt => opt.id === soundId);
    return option ? (lang === "ru" ? option.labelRu : option.labelKa) : "";
  }, [soundId, lang]);

  const handleTimePickerOpen = (type: "weekday" | "weekend") => {
    if (!notificationsEnabled) return;
    const currentTime = type === "weekday" ? weekdayTime : weekendTime;
    setTempTimeValue(hhmmToDate(currentTime));
    setTimePickerOpen(type);
  };

  const handleTimeChange = (selectedDate: Date | undefined) => {
    if (!selectedDate || !timePickerOpen) return;
    
    if (Platform.OS === "android") {
      const newTime = dateToHHMM(selectedDate);
      if (timePickerOpen === "weekday") {
        setWeekdayTime(newTime);
      } else {
        setWeekendTime(newTime);
      }
      setTimePickerOpen(null);
    } else {
      setTempTimeValue(selectedDate);
    }
  };

  const handleTimeConfirm = () => {
    if (!tempTimeValue || !timePickerOpen) return;
    const newTime = dateToHHMM(tempTimeValue);
    if (timePickerOpen === "weekday") {
      setWeekdayTime(newTime);
    } else {
      setWeekendTime(newTime);
    }
    setTimePickerOpen(null);
    setTempTimeValue(null);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ paddingTop: 20, paddingBottom: 16, alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>
          {lang === "ru" ? "Настройки" : "პარამეტრები"}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {/* Settings List */}
        <View style={{ marginTop: 8 }}>
          {/* Включить рассылку */}
          <View style={{ 
            flexDirection: "row", 
            justifyContent: "space-between", 
            alignItems: "center",
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#E0E0E0"
          }}>
            <Text style={{ fontSize: 16 }}>
              {lang === "ru" ? "Включить рассылку" : "გამოწერის ჩართვა"}
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>

          {/* Оповещения в будни */}
          <Pressable
            onPress={() => handleTimePickerOpen("weekday")}
            disabled={!notificationsEnabled}
            style={{ 
              flexDirection: "row", 
              justifyContent: "space-between", 
              alignItems: "center",
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#E0E0E0",
              opacity: notificationsEnabled ? 1 : 0.5
            }}
          >
            <Text style={{ fontSize: 16 }}>
              {lang === "ru" ? "Оповещения в будни" : "შეტყობინებები სამუშაო დღეებში"}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 16 }}>{weekdayTime}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </Pressable>

          {/* Оповещения в выходные */}
          <Pressable
            onPress={() => handleTimePickerOpen("weekend")}
            disabled={!notificationsEnabled}
            style={{ 
              flexDirection: "row", 
              justifyContent: "space-between", 
              alignItems: "center",
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#E0E0E0",
              opacity: notificationsEnabled ? 1 : 0.5
            }}
          >
            <Text style={{ fontSize: 16 }}>
              {lang === "ru" ? "Оповещения в выходные" : "შეტყობინებები შაბათ-კვირას"}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 16 }}>{weekendTime}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </Pressable>

          {/* Мелодия */}
          <Pressable
            onPress={() => notificationsEnabled && setSoundPickerOpen(true)}
            disabled={!notificationsEnabled}
            style={{ 
              flexDirection: "row", 
              justifyContent: "space-between", 
              alignItems: "center",
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#E0E0E0",
              opacity: notificationsEnabled ? 1 : 0.5
            }}
          >
            <Text style={{ fontSize: 16 }}>
              {lang === "ru" ? "Мелодия" : "მელოდია"}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 16 }}>{selectedSoundLabel}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </Pressable>
        </View>

        {/* Сохранить */}
        <View style={{ marginTop: 32, marginBottom: 20, alignItems: "center" }}>
          <Pressable
            onPress={onSave}
            style={{ 
              paddingVertical: 14, 
              paddingHorizontal: 48,
              borderRadius: 8, 
              backgroundColor: "#E0E0E0",
              minWidth: 200,
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {lang === "ru" ? "Сохранить" : "შენახვა"}
            </Text>
          </Pressable>
        </View>

        {/* Язык (скрыто внизу) */}
        <View style={{ marginTop: 20, marginBottom: 20, opacity: 0.7 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}>
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
        </View>

        {/* Обновить демо-данные (скрыто внизу) */}
        <View style={{ marginTop: 20, marginBottom: 40, opacity: 0.7 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}>
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

      {/* Time Picker Modal */}
      {timePickerOpen && (
        Platform.OS === "android" ? (
          tempTimeValue && (
            <DateTimePicker
              value={tempTimeValue}
              mode="time"
              display="default"
              onChange={(_, selected) => {
                handleTimeChange(selected);
              }}
            />
          )
        ) : (
          tempTimeValue && (
            <Modal
              visible={true}
              transparent
              animationType="slide"
              onRequestClose={() => {
                setTimePickerOpen(null);
                setTempTimeValue(null);
              }}
            >
              <Pressable
                style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}
                onPress={() => {
                  setTimePickerOpen(null);
                  setTempTimeValue(null);
                }}
              >
                <Pressable
                  style={{ backgroundColor: "white", padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                  onPress={(e) => e.stopPropagation()}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: "600" }}>
                      {timePickerOpen === "weekday"
                        ? (lang === "ru" ? "Оповещения в будни" : "შეტყობინებები სამუშაო დღეებში")
                        : (lang === "ru" ? "Оповещения в выходные" : "შეტყობინებები შაბათ-კვირას")}
                    </Text>
                    <Pressable onPress={handleTimeConfirm} style={{ padding: 8 }}>
                      <Text style={{ fontSize: 16, fontWeight: "600" }}>
                        {lang === "ru" ? "Готово" : "მზადაა"}
                      </Text>
                    </Pressable>
                  </View>
                  <DateTimePicker
                    value={tempTimeValue}
                    mode="time"
                    display="spinner"
                    onChange={(_, selected) => {
                      handleTimeChange(selected);
                    }}
                  />
                </Pressable>
              </Pressable>
            </Modal>
          )
        )
      )}

      {/* Sound Picker Modal */}
      <Modal
        visible={soundPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSoundPickerOpen(false)}
      >
        <Pressable
          style={{ 
            flex: 1, 
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={() => setSoundPickerOpen(false)}
        >
          <Pressable
            style={{ 
              backgroundColor: "white", 
              borderRadius: 16, 
              padding: 20, 
              minWidth: 280,
              maxWidth: "90%"
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16, textAlign: "center" }}>
              {lang === "ru" ? "Выберите мелодию" : "აირჩიეთ მელოდია"}
            </Text>
            {SOUND_OPTIONS.map(opt => {
              const label = lang === "ru" ? opt.labelRu : opt.labelKa;
              const active = soundId === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => {
                    setSoundId(opt.id);
                    setSoundPickerOpen(false);
                  }}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: active ? "#E0E0E0" : "transparent",
                    marginBottom: 8
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: active ? "600" : "400" }}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => setSoundPickerOpen(false)}
              style={{ marginTop: 12, paddingVertical: 12, alignItems: "center" }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {lang === "ru" ? "Отмена" : "გაუქმება"}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
