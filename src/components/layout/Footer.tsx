import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useLanguageStore } from "@/stores/use-language";

const footerLinks = {
  marketplace: [
    { labelKey: "footer.links.home", to: "/" },
    { labelKey: "footer.links.catalog", to: "/catalog" },
    { labelKey: "footer.links.bloggers", to: "/bloggers" },
  ],
  support: [
    { labelKey: "footer.links.faq", to: "/faq" },
    { labelKey: "footer.links.help", to: "/support" },
    { labelKey: "footer.links.terms", to: "/terms" },
    { labelKey: "footer.links.privacy", to: "/privacy" },
  ],
};

type FooterProps = {
  showLanguage?: boolean;
};

export function Footer({ showLanguage = true }: FooterProps) {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-black text-white">
      <div className="mx-auto flex w-full max-w-[1464px] flex-col gap-8 px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm space-y-3">
            <div className="text-xl font-semibold">{t("footer.brand")}</div>
            <p className="text-sm text-muted-foreground">
              {t("footer.description")}
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-6 md:grid-cols-3 justify-end">
            <FooterColumn
              title={t("footer.marketplace")}
              links={footerLinks.marketplace}
            />
            <FooterColumn
              title={t("footer.support")}
              links={footerLinks.support}
            />
            {showLanguage ? <FooterLanguage /> : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {t("footer.brand")}.{" "}
            {t("footer.rights")}
          </span>
        </div>
      </div>
    </footer>
  );
}

type FooterColumnProps = {
  title: string;
  links: { labelKey: string; to: string }[];
};

function FooterColumn({ title, links }: FooterColumnProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.labelKey}>
            <Link
              to={link.to}
              className="text-sm transition-colors duration-150 text-muted-foreground hover:text-white "
            >
              {t(link.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterLanguage() {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  const active = language || i18n.language || i18n.resolvedLanguage || "en";
  const languages = [
    { value: "en", labelKey: "languages.en" },
    { value: "uk", labelKey: "languages.uk" },
  ] as const;

  const handleChange = (value: string) => {
    if (value === active) return;
    setLanguage(value);
    void i18n.changeLanguage(value);
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
        {t("language.label")}
      </h3>
      <ul className="space-y-2">
        {languages.map((lang) => (
          <li key={lang.value}>
            <button
              onClick={() => handleChange(lang.value)}
              className={`text-sm transition-colors duration-150 hover:cursor-pointer hover:text-white ${
                active === lang.value
                  ? "font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {t(lang.labelKey)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
