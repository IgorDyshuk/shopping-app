import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SECTION_KEYS = [
  "intro",
  "accounts",
  "listings",
  "payments",
  "content",
  "prohibited",
  "liability",
  "termination",
  "changes",
  "contact",
] as const;

function TermsPage() {
  const { t } = useTranslation("terms");

  return (
    <section className="w-full my-16 sm:my-20 md:my-24">
      <div className="mx-auto w-full max-w-[960px] space-y-8">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{t("updated")}</p>
          <h1 className="text-3xl font-semibold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("intro")}</p>
        </div>

        <div className="space-y-6">
          {SECTION_KEYS.map((key) => (
            <div key={key} className="space-y-2">
              <h2 className="text-xl font-semibold">
                {t(`sections.${key}.title`)}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t(`sections.${key}.body`)}
              </p>
            </div>
          ))}
        </div>

        <div className="border rounded-lg p-4 bg-card/60 space-y-2">
          <h3 className="text-lg font-semibold">{t("help.title")}</h3>
          <p className="text-muted-foreground">{t("help.body")}</p>
          <Link to="/support" className="text-primary hover:underline">
            {t("help.link")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TermsPage;
