import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SignupForm({
  className,
  onSwitchToLogin,
  ...props
}: React.ComponentProps<"div"> & { onSwitchToLogin?: () => void }) {
  const { t } = useTranslation();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {t("authForm.signup.title")}
          </CardTitle>
          <CardDescription>{t("authForm.signup.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">
                  {t("authForm.fields.name")}
                </FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder={t("authForm.fields.namePlaceholder")}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">
                  {t("authForm.fields.email")}
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("authForm.fields.emailPlaceholder")}
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">
                      {t("authForm.signup.password")}
                    </FieldLabel>
                    <Input id="password" type="password" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      {t("authForm.signup.confirmPassword")}
                    </FieldLabel>
                    <Input id="confirm-password" type="password" required />
                  </Field>
                </Field>
                <FieldDescription>
                  {t("authForm.signup.helper")}
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit">{t("authForm.signup.submit")}</Button>
                <FieldDescription className="text-center">
                  {t("authForm.signup.footer")}{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onSwitchToLogin?.();
                    }}
                  >
                    {t("authForm.signup.footerLink")}
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
