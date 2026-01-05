import { useState } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useRegister } from "@/hooks/api-hooks/useAuth";
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
import { useNavigate } from "react-router-dom";

export function SignupForm({
  className,
  onSwitchToLogin,
  onSuccess,
  ...props
}: React.ComponentProps<"div"> & {
  onSwitchToLogin?: () => void;
  onSuccess?: () => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate, isPending } = useRegister();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    mutate(
      { username: username.trim(), email: email.trim(), password },
      {
        onSuccess: () => {
          toast.message("Account created");
          onSuccess?.();
          navigate("/");
        },
        onError: () => {
          toast.error("Signup failed. Please try again.");
        },
      }
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">
            {t("authForm.signup.title")}
          </CardTitle>
          <CardDescription>{t("authForm.signup.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">
                  {t("authForm.fields.username")}
                </FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder={t("authForm.fields.usernamePlaceholder")}
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isPending}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isPending}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">
                  {t("authForm.signup.password")}
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isPending}
                />
                <FieldDescription>
                  {t("authForm.signup.helper")}
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  {t("authForm.signup.confirmPassword")}
                </FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isPending}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending
                    ? t("search.loading")
                    : t("authForm.signup.submit")}
                </Button>
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
