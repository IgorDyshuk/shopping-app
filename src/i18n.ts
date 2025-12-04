import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en/translation.json";
import ukTranslation from "./locales/uk/translation.json";

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      uk: { translation: ukTranslation },
    },
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "uk"],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
