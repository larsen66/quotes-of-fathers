import React, { useMemo, useState } from "react";
import { View, Text, Pressable, Alert, ScrollView, Switch, Modal, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getSettings, updateSettings } from "../../data/db/repositories/settingsRepo";
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
  { id: "default", translationKey: "settings.soundDefault" },
  { id: "bell", translationKey: "settings.soundBell" },
  { id: "soft", translationKey: "settings.soundSoft" }
];


export default function SettingsScreen() {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language === "ru" ? "ru" : "ka") as "ka" | "ru";

  const initial = useMemo(() => getSettings(), []);
  const [notificationsEnabled, setNotificationsEnabled] = useState(!!initial.notificationsEnabled);
  const [weekdayTime, setWeekdayTime] = useState(initial.weekdayTime);
  const [weekendTime, setWeekendTime] = useState(initial.weekendTime);
  const [soundId, setSoundId] = useState(initial.soundId);
  const [language, setLanguage] = useState<"ka" | "ru">(initial.language);

  // Мгновенная смена языка при выборе
  const handleLanguageChange = async (newLanguage: "ka" | "ru") => {
    setLanguage(newLanguage);
    await i18n.changeLanguage(newLanguage);
    // Сохраняем в базу данных сразу
    updateSettings({ language: newLanguage });
  };

  async function onSave() {
    try {
      console.log("Save button pressed");
      
      if (notificationsEnabled) {
        const granted = await requestNotificationPermission();
        if (!granted) {
          Alert.alert(
            t('settings.permission'),
            t('settings.permissionMessage')
          );
          return;
        }
      }

      // 1) сохраняем настройки уведомлений в SQLite (язык уже сохранен при выборе)
      updateSettings({
        notificationsEnabled: notificationsEnabled ? 1 : 0,
        weekdayTime,
        weekendTime,
        soundId
      });

      // 2) обновляем расписание уведомлений
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
            t('settings.warning'),
            t('settings.notificationsNotScheduled')
          );
        } else {
          Alert.alert(
            t('common.done'),
            t('settings.settingsSavedWithCount', { count: scheduled.length })
          );
        }
      } else {
        Alert.alert(t('common.done'), t('settings.settingsSaved'));
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert(
        t('common.error'),
        t('settings.saveError', { error: error instanceof Error ? error.message : String(error) })
      );
    }
  }


  const [soundPickerOpen, setSoundPickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState<"weekday" | "weekend" | null>(null);
  const [tempTimeValue, setTempTimeValue] = useState<Date | null>(null);

  const selectedSoundLabel = useMemo(() => {
    const option = SOUND_OPTIONS.find(opt => opt.id === soundId);
    return option ? t(option.translationKey) : "";
  }, [soundId, t]);

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
          {t('settings.title')}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {/* Settings List */}
        <View style={{ marginTop: 8 }}>
          {/* Язык приложения */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: "600", 
              marginBottom: 12,
              color: "#666",
              paddingHorizontal: 4
            }}>
              {t('settings.language')}
            </Text>
            <View style={{ 
              flexDirection: "row", 
              gap: 12,
              backgroundColor: "#F5F5F5",
              padding: 4,
              borderRadius: 12
            }}>
              <Pressable
                onPress={() => handleLanguageChange("ka")}
                style={{ 
                  flex: 1,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                  backgroundColor: language === "ka" ? "white" : "transparent",
                  alignItems: "center",
                  shadowColor: language === "ka" ? "#000" : "transparent",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: language === "ka" ? 0.1 : 0,
                  shadowRadius: 4,
                  elevation: language === "ka" ? 2 : 0
                }}
              >
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: language === "ka" ? "600" : "400",
                  color: language === "ka" ? "#000" : "#666"
                }}>
                  🇬🇪 ქართული
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleLanguageChange("ru")}
                style={{ 
                  flex: 1,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                  backgroundColor: language === "ru" ? "white" : "transparent",
                  alignItems: "center",
                  shadowColor: language === "ru" ? "#000" : "transparent",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: language === "ru" ? 0.1 : 0,
                  shadowRadius: 4,
                  elevation: language === "ru" ? 2 : 0
                }}
              >
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: language === "ru" ? "600" : "400",
                  color: language === "ru" ? "#000" : "#666"
                }}>
                  🇷🇺 Русский
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Уведомления */}
          <Text style={{ 
            fontSize: 14, 
            fontWeight: "600", 
            marginBottom: 12,
            color: "#666",
            paddingHorizontal: 4
          }}>
            {t('settings.notifications')}
          </Text>

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
              {t('settings.enableNotifications')}
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
              {t('settings.weekdayTime')}
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
              {t('settings.weekendTime')}
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
              {t('settings.sound')}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 16 }}>{selectedSoundLabel}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </Pressable>
        </View>

        {/* Сохранить */}
        <View style={{ marginTop: 32, marginBottom: 40, alignItems: "center" }}>
          <Pressable
            onPress={onSave}
            style={{ 
              paddingVertical: 16, 
              paddingHorizontal: 48,
              borderRadius: 12, 
              backgroundColor: "#4CAF50",
              minWidth: 200,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
              {t('settings.save')}
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
                        ? t('settings.weekdayTime')
                        : t('settings.weekendTime')}
                    </Text>
                    <Pressable onPress={handleTimeConfirm} style={{ padding: 8 }}>
                      <Text style={{ fontSize: 16, fontWeight: "600" }}>
                        {t('common.done')}
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
              {t('settings.selectSound')}
            </Text>
            {SOUND_OPTIONS.map(opt => {
              const label = t(opt.translationKey);
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
                {t('common.cancel')}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
