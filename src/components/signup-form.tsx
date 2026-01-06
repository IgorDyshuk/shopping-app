import { useMemo, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useRegister } from "@/hooks/api-hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import countryCodes from "@/constants/CountriesCode.json";
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
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Eye, EyeOff } from "lucide-react";

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
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+380");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const selectedCountry = useMemo(() => {
    return (
      (
        countryCodes as {
          dial_code: string;
          emoji?: string;
          code: string;
          name: string;
        }[]
      ).find((c) => c.dial_code === countryCode) ?? {
        dial_code: countryCode,
        emoji: "",
        code: "",
        name: "",
      }
    );
  }, [countryCode]);

  const formatLocalPhone = (digits: string) => {
    const clean = digits.replace(/\D/g, "");
    const parts: string[] = [];
    if (clean.length > 0) parts.push(clean.slice(0, 2));
    if (clean.length > 2) parts.push(clean.slice(2, 5));
    if (clean.length > 5) parts.push(clean.slice(5, 7));
    if (clean.length > 7) parts.push(clean.slice(7, 9));
    return parts.join(" ");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    mutate(
      {
        username: username.trim(),
        email: email.trim(),
        phone: `${countryCode} ${phoneNumber.trim()}`,
        country: selectedCountry.code || selectedCountry.dial_code,
        role,
        password,
        name: {
          firstname: firstName.trim(),
          lastname: lastName.trim(),
        },
      },
      {
        onSuccess: () => {
          toast.message("Account created");
          onSuccess?.();
          navigate("/profile");
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
        <CardContent className="px-3 sm:px-6">
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="first-name">
                  {t("authForm.fields.firstName", {
                    defaultValue: "First name",
                  })}
                </FieldLabel>
                <Input
                  id="first-name"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isPending}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="last-name">
                  {t("authForm.fields.lastName", {
                    defaultValue: "Last name",
                  })}
                </FieldLabel>
                <Input
                  id="last-name"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isPending}
                />
              </Field>
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
                <FieldLabel htmlFor="phone">
                  {t("authForm.fields.phone", { defaultValue: "Phone" })}
                </FieldLabel>
                <div className="border flex rounded-lg focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition">
                  <div className="relative min-w-[70px]">
                    <NativeSelect
                      value={countryCode}
                      onChange={(e) => {
                        setCountryCode(e.target.value);
                        phoneInputRef.current?.focus();
                      }}
                      aria-label="Country code"
                      className="text-transparent w-[70px] bg-muted border-none rounded-none rounded-l-lg"
                    >
                      {(
                        countryCodes as {
                          code: string;
                          dial_code: string;
                          name: string;
                          emoji?: string;
                        }[]
                      ).map((country) => (
                        <NativeSelectOption
                          key={country.code}
                          value={country.dial_code}
                          className="hover:cursor-pointer"
                        >
                          <div className="hover:cursor-pointer">
                            {country.emoji ?? ""} {country.name}{" "}
                            {country.dial_code}
                          </div>
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                    <div className="pointer-events-none absolute inset-0 flex items-center gap-2 px-3 text-sm">
                      <span className="text-lg leading-none">
                        {selectedCountry.emoji}
                      </span>
                    </div>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t("authForm.fields.phonePlaceholder", {
                      defaultValue: "00 000 00 00",
                    })}
                    ref={phoneInputRef}
                    required
                    value={`${countryCode} ${formatLocalPhone(phoneNumber)}`}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const stripped = raw.startsWith(countryCode)
                        ? raw.slice(countryCode.length).trimStart()
                        : raw.replace(/^\+?\d+\s*/, "");
                      const digits = stripped.replace(/\D/g, "");
                      setPhoneNumber(digits);
                    }}
                    disabled={isPending}
                    className="flex-1 rounded-none border-none rounded-r-lg"
                  />
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="role">
                  {t("authForm.fields.role", { defaultValue: "Role" })}
                </FieldLabel>
                <NativeSelect
                  id="role"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "buyer" | "seller")
                  }
                  className="w-full"
                >
                  <NativeSelectOption value="buyer">
                    {t("authForm.fields.roles.buyer", {
                      defaultValue: "Buyer",
                    })}
                  </NativeSelectOption>
                  <NativeSelectOption value="seller">
                    {t("authForm.fields.roles.seller", {
                      defaultValue: "Seller",
                    })}
                  </NativeSelectOption>
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">
                  {t("authForm.signup.password")}
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                <FieldDescription>
                  {t("authForm.signup.helper")}
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  {t("authForm.signup.confirmPassword")}
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
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
