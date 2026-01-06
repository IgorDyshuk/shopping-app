import type { MutableRefObject } from "react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import countryCodes from "@/constants/CountriesCode.json";

type ContactDetailsCardProps = {
  countryCode: string;
  selectedCountry: { emoji?: string };
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  formatLocalPhone: (digits: string) => string;
  onCountryChange: (code: string) => void;
  onPhoneChange: (digits: string) => void;
  onEmailChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  phoneInputRef: MutableRefObject<HTMLInputElement | null>;
};

export function ContactDetailsCard({
  countryCode,
  selectedCountry,
  phoneNumber,
  email,
  firstName,
  lastName,
  formatLocalPhone,
  onCountryChange,
  onPhoneChange,
  onEmailChange,
  onFirstNameChange,
  onLastNameChange,
  phoneInputRef,
}: ContactDetailsCardProps) {
  const { t } = useTranslation(["checkout"]);

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-xl">
          {t("contact.title", { ns: "checkout" })}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {t("contact.phone", { ns: "checkout" })}
          </p>
          <div className="border flex rounded-lg focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition">
            <div className="relative min-w-[70px]">
              <NativeSelect
                value={countryCode}
                onChange={(e) => {
                  onCountryChange(e.target.value);
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
                      {country.emoji ?? ""} {country.name} {country.dial_code}
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
              ref={phoneInputRef}
              value={`${countryCode} ${formatLocalPhone(phoneNumber)}`}
              onChange={(e) => {
                const raw = e.target.value;
                const stripped = raw.startsWith(countryCode)
                  ? raw.slice(countryCode.length).trimStart()
                  : raw.replace(/^\+?\d+\s*/, "");
                onPhoneChange(stripped.replace(/\D/g, ""));
              }}
              placeholder={t("contact.phonePlaceholder", {
                ns: "checkout",
                defaultValue: `${countryCode} 00 000 00 00`,
              })}
              className="flex-1 rounded-none border-none rounded-r-lg"
              required
            />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {t("contact.email", { ns: "checkout" })}
          </p>
          <Input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder={t("contact.emailPlaceholder", {
              ns: "checkout",
              defaultValue: "you@example.com",
            })}
            required
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {t("contact.firstName", { ns: "checkout" })}
          </p>
          <Input
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            placeholder={t("contact.firstNamePlaceholder", {
              ns: "checkout",
              defaultValue: "John",
            })}
            required
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {t("contact.lastName", { ns: "checkout" })}
          </p>
          <Input
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            placeholder={t("contact.lastNamePlaceholder", {
              ns: "checkout",
              defaultValue: "Doe",
            })}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
