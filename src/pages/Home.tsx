import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

function Home() {
  const { t: tHome } = useTranslation("home");
  const { t: tCommon } = useTranslation("common");

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-6 px-4 py-12 text-center">
      <h1 className="text-3xl font-semibold">{tHome("welcome")}</h1>
      <Button>{tCommon("cta")}</Button>
    </section>
  );
}

export default Home;
