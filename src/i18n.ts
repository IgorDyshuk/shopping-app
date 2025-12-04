import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import ukCommon from "./locales/uk/common.json";
import ukHome from "./locales/uk/home.json";

void i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon, home: enHome },
    uk: { common: ukCommon, home: ukHome },
  },
  lng: "en",
  fallbackLng: "en",
  defaultNS: "common",
  supportedLngs: ["en", "uk"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
