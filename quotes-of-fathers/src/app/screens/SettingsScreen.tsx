import React, { useMemo, useState } from "react";
import { View, Text, Pressable, Alert, ScrollView, Switch, Modal, Platform, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, spacing, borderRadius } from "../../ui/theme";
import type { RootStackParamList } from "../navigation/types";

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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const lang = (i18n.language === "ru" ? "ru" : "ka") as "ka" | "ru";

  const initial = useMemo(() => getSettings(), []);
  const [notificationsEnabled, setNotificationsEnabled] = useState(!!initial.notificationsEnabled);
  const [weekdayTime, setWeekdayTime] = useState(initial.weekdayTime);
  const [weekendTime, setWeekendTime] = useState(initial.weekendTime);
  const [soundId, setSoundId] = useState(initial.soundId);
  const [language, setLanguage] = useState<"ka" | "ru">(initial.language);

  const handleLanguageChange = async (newLanguage: "ka" | "ru") => {
    setLanguage(newLanguage);
    await i18n.changeLanguage(newLanguage);
    updateSettings({ language: newLanguage });
  };

  async function onSave() {
    try {
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

      updateSettings({
        notificationsEnabled: notificationsEnabled ? 1 : 0,
        weekdayTime,
        weekendTime,
        soundId
      });

      await cancelAllScheduled();
      if (notificationsEnabled) {
        await scheduleOpenAppNotifications({
          weekdayTime,
          weekendTime,
          soundId
        });

        const scheduled = await Notifications.getAllScheduledNotificationsAsync();

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
    <LinearGradient
      colors={[colors.background.gradientStart, colors.background.gradientMiddle, colors.background.gradientEnd]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {t('settings.language')}
          </Text>
          <View style={styles.languageToggle}>
            <Pressable
              onPress={() => handleLanguageChange("ka")}
              style={[
                styles.languageButton,
                language === "ka" && styles.languageButtonActive
              ]}
            >
              <Text style={[
                styles.languageButtonText,
                language === "ka" && styles.languageButtonTextActive
              ]}>
                ქართული
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleLanguageChange("ru")}
              style={[
                styles.languageButton,
                language === "ru" && styles.languageButtonActive
              ]}
            >
              <Text style={[
                styles.languageButtonText,
                language === "ru" && styles.languageButtonTextActive
              ]}>
                Русский
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Notifications Section */}
        <Text style={styles.sectionLabel}>
          {t('settings.notifications')}
        </Text>

        {/* Enable notifications */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>
            {t('settings.enableNotifications')}
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: colors.surface.tertiary, true: colors.gold.light }}
            thumbColor={notificationsEnabled ? colors.gold.primary : colors.surface.white}
          />
        </View>

        {/* Weekday time */}
        <Pressable
          onPress={() => handleTimePickerOpen("weekday")}
          disabled={!notificationsEnabled}
          style={[styles.settingRow, !notificationsEnabled && styles.settingRowDisabled]}
        >
          <Text style={styles.settingLabel}>
            {t('settings.weekdayTime')}
          </Text>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>{weekdayTime}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.gold.light} />
          </View>
        </Pressable>

        {/* Weekend time */}
        <Pressable
          onPress={() => handleTimePickerOpen("weekend")}
          disabled={!notificationsEnabled}
          style={[styles.settingRow, !notificationsEnabled && styles.settingRowDisabled]}
        >
          <Text style={styles.settingLabel}>
            {t('settings.weekendTime')}
          </Text>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>{weekendTime}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.gold.light} />
          </View>
        </Pressable>

        {/* Sound */}
        <Pressable
          onPress={() => notificationsEnabled && setSoundPickerOpen(true)}
          disabled={!notificationsEnabled}
          style={[styles.settingRow, !notificationsEnabled && styles.settingRowDisabled]}
        >
          <Text style={styles.settingLabel}>
            {t('settings.sound')}
          </Text>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>{selectedSoundLabel}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.gold.light} />
          </View>
        </Pressable>

        {/* Save Button */}
        <View style={styles.saveButtonContainer}>
          <Pressable onPress={onSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>
              {t('settings.save')}
            </Text>
          </Pressable>
        </View>

        {/* Privacy Policy */}
        <Pressable
          onPress={() => navigation.navigate("PrivacyPolicy")}
          style={styles.privacyRow}
        >
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.gold.light} />
          <Text style={styles.privacyText}>
            {t('settings.privacyPolicy')}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.gold.light} />
        </Pressable>
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
                style={styles.modalOverlay}
                onPress={() => {
                  setTimePickerOpen(null);
                  setTempTimeValue(null);
                }}
              >
                <Pressable
                  style={styles.timePickerModal}
                  onPress={(e) => e.stopPropagation()}
                >
                  <View style={styles.timePickerHeader}>
                    <Text style={styles.timePickerTitle}>
                      {timePickerOpen === "weekday"
                        ? t('settings.weekdayTime')
                        : t('settings.weekendTime')}
                    </Text>
                    <Pressable onPress={handleTimeConfirm} style={styles.timePickerDone}>
                      <Text style={styles.timePickerDoneText}>
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
          style={styles.modalOverlayCentered}
          onPress={() => setSoundPickerOpen(false)}
        >
          <Pressable
            style={styles.soundPickerModal}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.soundPickerTitle}>
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
                  style={[
                    styles.soundOption,
                    active && styles.soundOptionActive
                  ]}
                >
                  <Text style={[
                    styles.soundOptionText,
                    active && styles.soundOptionTextActive
                  ]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => setSoundPickerOpen(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>
                {t('common.cancel')}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.containerPadding,
    paddingTop: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.md,
    color: colors.gold.light,
    paddingHorizontal: 4,
  },
  languageToggle: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: 'rgba(243, 234, 220, 0.15)',
    padding: 4,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: borderRadius.sm,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: colors.gold.primary,
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.inverse,
  },
  languageButtonTextActive: {
    fontWeight: '600',
    color: colors.primary.darkest,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(209, 182, 122, 0.3)',
  },
  settingRowDisabled: {
    opacity: 0.5,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text.inverse,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingValueText: {
    fontSize: 16,
    color: colors.gold.light,
  },
  saveButtonContainer: {
    marginTop: spacing.xxxl,
    marginBottom: spacing.xxxl,
    alignItems: 'center',
  },
  saveButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: borderRadius.button,
    backgroundColor: colors.gold.primary,
    minWidth: 200,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary.darkest,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay.medium,
    justifyContent: 'flex-end',
  },
  timePickerModal: {
    backgroundColor: colors.surface.white,
    padding: spacing.xl,
    borderTopLeftRadius: borderRadius.modal,
    borderTopRightRadius: borderRadius.modal,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  timePickerDone: {
    padding: spacing.sm,
  },
  timePickerDoneText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gold.primary,
  },
  modalOverlayCentered: {
    flex: 1,
    backgroundColor: colors.overlay.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundPickerModal: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius.modal,
    padding: spacing.xl,
    minWidth: 280,
    maxWidth: '90%',
  },
  soundPickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.lg,
    textAlign: 'center',
    color: colors.text.primary,
  },
  soundOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    backgroundColor: 'transparent',
    marginBottom: spacing.sm,
  },
  soundOptionActive: {
    backgroundColor: colors.gold.light,
  },
  soundOptionText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.primary,
  },
  soundOptionTextActive: {
    fontWeight: '600',
    color: colors.primary.darkest,
  },
  cancelButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.muted,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  privacyText: {
    fontSize: 14,
    color: colors.gold.light,
  },
});
