import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enCatalog from "./locales/en/catalog.json";
import enCategory from "./locales/en/category.json";
import enProduct from "./locales/en/product.json";
import enBlogger from "./locales/en/blogger.json";
import enProfile from "./locales/en/profile.json";
import ukCommon from "./locales/uk/common.json";
import ukHome from "./locales/uk/home.json";
import ukCatalog from "./locales/uk/catalog.json";
import ukCategory from "./locales/uk/category.json";
import ukProduct from "./locales/uk/product.json";
import ukBlogger from "./locales/uk/blogger.json";
import ukCart from "./locales/uk/cart.json";
import enCart from "./locales/en/cart.json";
import enCheckout from "./locales/en/checkout.json";
import ukCheckout from "./locales/uk/checkout.json";
import ukProfile from "./locales/uk/profile.json";
import enTerms from "./locales/en/terms.json";
import ukTerms from "./locales/uk/terms.json";
import enPrivacy from "./locales/en/privacy.json";
import ukPrivacy from "./locales/uk/privacy.json";
import enFaq from "./locales/en/faq.json";
import ukFaq from "./locales/uk/faq.json";
import { LANGUAGE_STORAGE_KEY } from "@/stores/use-language";

let initialLanguage = "en";
if (typeof window !== "undefined") {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      initialLanguage =
        parsed?.state?.language || parsed?.language || initialLanguage;
    } catch {
      // ignore parse errors
    }
  }
}

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      home: enHome,
      catalog: enCatalog,
      category: enCategory,
      product: enProduct,
      blogger: enBlogger,
      cart: enCart,
      checkout: enCheckout,
      profile: enProfile,
      terms: enTerms,
      privacy: enPrivacy,
      faq: enFaq,
    },
    uk: {
      common: ukCommon,
      home: ukHome,
      catalog: ukCatalog,
      category: ukCategory,
      product: ukProduct,
      blogger: ukBlogger,
      cart: ukCart,
      checkout: ukCheckout,
      profile: ukProfile,
      terms: ukTerms,
      privacy: ukPrivacy,
      faq: ukFaq,
    },
  },
  lng: initialLanguage,
  fallbackLng: initialLanguage,
  defaultNS: "common",
  supportedLngs: ["en", "uk"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
