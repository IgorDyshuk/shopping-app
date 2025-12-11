import { useTranslation } from "react-i18next";

const footerLinks = {
  marketplace: [
    { labelKey: "footer.links.drops", href: "#drops" },
    { labelKey: "footer.links.catalog", href: "#catalog" },
    { labelKey: "footer.links.creators", href: "#creators" },
  ],
  support: [
    { labelKey: "footer.links.faq", href: "#faq" },
    { labelKey: "footer.links.help", href: "#support" },
    { labelKey: "footer.links.returns", href: "#returns" },
  ],
  company: [
    { labelKey: "footer.links.about", href: "#about" },
    { labelKey: "footer.links.terms", href: "#terms" },
    { labelKey: "footer.links.privacy", href: "#privacy" },
  ],
};

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10">
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
            <FooterColumn
              title={t("footer.company")}
              links={footerLinks.company}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {t("footer.brand")}. {t(
              "footer.rights"
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}

type FooterColumnProps = {
  title: string;
  links: { labelKey: string; href: string }[];
};

function FooterColumn({ title, links }: FooterColumnProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.labelKey}>
            <a
              href={link.href}
              className="text-sm text-foreground/80 hover:text-foreground"
            >
              {t(link.labelKey)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
