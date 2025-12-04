import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6">
      <LanguageSwitcher />
      <h1 className="text-2xl font-semibold">{t("welcome")}</h1>
      <Button>{t("cta")}</Button>
    </div>
  );
}

export default App;
