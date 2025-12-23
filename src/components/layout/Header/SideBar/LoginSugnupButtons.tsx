import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function LogIN_SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className={
          "flex-1 min-w-0 justify-center rounded-full border border-input bg-white px-4 text-foreground shadow-none hover:bg-accent hover:text-foreground"
        }
        onClick={() => navigate("/login")}
      >
        {t("auth.login")}
      </Button>
      <Button
        variant="default"
        size="sm"
        type="submit"
        className="rounded-full px-4 flex-1 min-w-0 justify-center"
        onClick={() => navigate("/signup")}
      >
        {t("auth.signup")}
      </Button>
    </div>
  );
}
