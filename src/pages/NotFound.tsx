import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NotFoundPage() {
  const { t } = useTranslation("notFound");

  return (
    <section className="w-full my-30 sm:my-34 md:my-38">
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-4 px-4 text-center">
        <div className="text-8xl font-semibold text-muted-foreground">404</div>
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground max-w-xl">{t("description")}</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
