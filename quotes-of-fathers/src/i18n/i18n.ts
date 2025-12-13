import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import ka from "./locales/ka.json";
import ru from "./locales/ru.json";

export const SUPPORTED_LANGS = ["ka", "ru"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGS)[number];

const deviceLang = Localization.getLocales()?.[0]?.languageCode;
const initialLang: AppLanguage = deviceLang === "ru" ? "ru" : "ka";

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v4",
    resources: { ka: { translation: ka }, ru: { translation: ru } },
    lng: initialLang,
    fallbackLng: "ka",
    interpolation: { escapeValue: false }
  });

export default i18n;
