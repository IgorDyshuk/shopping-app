import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enCatalog from "./locales/en/catalog.json";
import enCategory from "./locales/en/category.json";
import enProduct from "./locales/en/product.json";
import ukCommon from "./locales/uk/common.json";
import ukHome from "./locales/uk/home.json";
import ukCatalog from "./locales/uk/catalog.json";
import ukCategory from "./locales/uk/category.json";
import ukProduct from "./locales/uk/product.json";

void i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon, home: enHome, catalog: enCatalog, category: enCategory, product: enProduct },
    uk: { common: ukCommon, home: ukHome, catalog: ukCatalog, category: ukCategory, product: ukProduct },
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
