import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, Switch, Pressable, StyleSheet, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { getSettings, updateLanguage, updateNotificationsEnabled } from "../../data/db/repositories/settingsRepo";
import { AppLanguage, SUPPORTED_LANGS } from "../../i18n/i18n";

export default function SettingsScreen() {
  const { i18n: i18nInstance } = useTranslation();
  const [settings, setSettings] = useState(getSettings());
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    settings?.notificationsEnabled === 1
  );

  useEffect(() => {
    const currentSettings = getSettings();
    setSettings(currentSettings);
    setNotificationsEnabled(currentSettings?.notificationsEnabled === 1);
  }, []);

  const handleLanguageChange = useCallback((lang: AppLanguage) => {
    updateLanguage(lang);
    i18nInstance.changeLanguage(lang);
    const updatedSettings = getSettings();
    setSettings(updatedSettings);
  }, [i18nInstance]);

  const handleNotificationsToggle = useCallback((value: boolean) => {
    updateNotificationsEnabled(value);
    setNotificationsEnabled(value);
    const updatedSettings = getSettings();
    setSettings(updatedSettings);
  }, []);

  const currentLang = (settings?.language ?? "ka") as AppLanguage;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Язык / ენა</Text>
        <View style={styles.optionsContainer}>
          {SUPPORTED_LANGS.map((lang) => (
            <Pressable
              key={lang}
              onPress={() => handleLanguageChange(lang)}
              style={[
                styles.option,
                currentLang === lang && styles.optionSelected,
              ]}
            >
              <Text style={[
                styles.optionText,
                currentLang === lang && styles.optionTextSelected,
              ]}>
                {lang === "ru" ? "Русский" : "ქართული"}
              </Text>
              {currentLang === lang && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Уведомления / შეტყობინებები</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsToggle}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionNote}>
          Другие настройки будут добавлены позже
        </Text>
        <Text style={styles.sectionNote}>
          სხვა პარამეტრები მოგვიანებით დაემატება
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  sectionNote: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
  },
  optionText: {
    fontSize: 16,
  },
  optionTextSelected: {
    fontWeight: "600",
    color: "#2196f3",
  },
  checkmark: {
    fontSize: 18,
    color: "#2196f3",
    fontWeight: "bold",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    flex: 1,
  },
});

