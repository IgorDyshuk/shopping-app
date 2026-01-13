import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function FAQPage() {
  const { t } = useTranslation("faq");
  const items = t("items", { returnObjects: true }) as {
    q: string;
    a: string;
  }[];

  return (
    <section className="w-full my-18 sm:my-20 md:my-24">
      <div className="mx-auto w-full max-w-[960px] space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("intro")}</p>
        </div>

        <div className="space-y-4">
          {items?.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border bg-card/60 p-4 space-y-2"
            >
              <h2 className="text-lg font-semibold">{item.q}</h2>
              <p className="text-muted-foreground leading-relaxed">{item.a}</p>
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

export default FAQPage;
