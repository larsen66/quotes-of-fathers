import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

export default function AboutScreen() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "ru" ? "ru" : "ka") as "ka" | "ru";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {lang === "ru" ? "О приложении" : "აპლიკაციის შესახებ"}
        </Text>
        
        <Text style={styles.description}>
          {lang === "ru" 
            ? "Приложение «Цитаты Отцов» содержит коллекцию цитат и биографий отцов церкви."
            : "აპლიკაცია «მამათა ციტატები» შეიცავს ეკლესიის მამების ციტატებისა და ბიოგრაფიების კოლექციას."}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {lang === "ru" ? "Версия" : "ვერსია"}
          </Text>
          <Text style={styles.sectionText}>1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    color: "#333",
  },
  section: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: "#666",
  },
});

