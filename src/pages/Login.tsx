import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { LoginForm } from "@/components/login-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  return (
    <section className="flex flex-col w-full items-center my-18 xl:my-19">
      <Breadcrumb className="flex justify-center">
        <BreadcrumbList className="flex justify-center items-center gap-2 text-center">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">{t("breadcrumb.home", { ns: "common" })}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/login">
                {t("auth.authorization", {
                  ns: "common",
                  defaultValue: "Authorization",
                })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full max-w-xl px-0 sm:px-4 mt-1 sm:mt-3 xl:mt-4">
        <LoginForm onSwitchToSignup={() => navigate("/signup")} isPage />
      </div>
    </section>
  );
}

export default LoginPage;
