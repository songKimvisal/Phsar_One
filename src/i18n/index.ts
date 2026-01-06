import en from "@src/i18n/locales/en.json";
import kh from "@src/i18n/locales/kh.json";
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    kh: { translation: kh },
  },
  lng: getLocales()[0].languageCode ?? "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});
export default i18n;
