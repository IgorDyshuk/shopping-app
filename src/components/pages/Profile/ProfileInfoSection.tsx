import { useRef, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import countryCodes from "@/constants/CountriesCode.json";
import { findCountryByCode } from "@/lib/country";
import { useTranslation } from "react-i18next";

type Name = { firstname?: string; lastname?: string };

type ProfileInfoSectionProps = {
  user: {
    username?: string;
    email?: string;
    phone?: string;
    country?: string;
    role?: string;
    company_name?: string;
    bank_details_id?: string | null;
    name?: Name;
    password?: string;
  } | null;
  isEditing: boolean;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  usernameInput: string;
  firstNameInput: string;
  lastNameInput: string;
  emailInput: string;
  passwordInput: string;
  companyNameInput: string;
  bankAccountNumberInput: string;
  bankBikInput: string;
  bankNameInput: string;
  bankInnInput: string;
  countryCode: string;
  phoneInput: string;
  countryInput: string;
  onUsernameChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onBankAccountNumberChange: (value: string) => void;
  onBankBikChange: (value: string) => void;
  onBankNameChange: (value: string) => void;
  onBankInnChange: (value: string) => void;
  onCountryCodeChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onCountryInputChange: (value: string) => void;
  onLogout: () => void;
  isLogoutPending?: boolean;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onSubmitBankDetails: () => Promise<boolean> | boolean;
  isBankDetailsSubmitting?: boolean;
  labels: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    country: string;
    role: string;
    companyName: string;
    bankDetails: string;
    bankDetailsFormTitle: string;
    bankAccountNumber: string;
    bankBik: string;
    bankName: string;
    bankInn: string;
    viewBankDetailsLabel: string;
    updateBankDetailsLabel: string;
    submitBankDetails: string;
    logout: string;
    edit: string;
    save: string;
    cancel: string;
  };
};

export function ProfileInfoSection({
  user,
  isEditing,
  showPassword,
  setShowPassword,
  usernameInput,
  firstNameInput,
  lastNameInput,
  emailInput,
  passwordInput,
  companyNameInput,
  bankAccountNumberInput,
  bankBikInput,
  bankNameInput,
  bankInnInput,
  countryCode,
  phoneInput,
  countryInput,
  onUsernameChange,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPasswordChange,
  onCompanyNameChange,
  onBankAccountNumberChange,
  onBankBikChange,
  onBankNameChange,
  onBankInnChange,
  onCountryCodeChange,
  onPhoneChange,
  onCountryInputChange,
  onLogout,
  isLogoutPending = false,
  onStartEdit,
  onSave,
  onCancel,
  onSubmitBankDetails,
  isBankDetailsSubmitting = false,
  labels,
}: ProfileInfoSectionProps) {
  const { t } = useTranslation();
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const [isBankDetailsViewDialogOpen, setIsBankDetailsViewDialogOpen] =
    useState(false);
  const [isBankDetailsDialogOpen, setIsBankDetailsDialogOpen] = useState(false);
  const PHONE_REQUIRED_LENGTH = 9;

  const formatLocalPhone = (digits: string) => {
    const clean = digits.replace(/\D/g, "");
    const parts: string[] = [];
    if (clean.length > 0) parts.push(clean.slice(0, 2));
    if (clean.length > 2) parts.push(clean.slice(2, 5));
    if (clean.length > 5) parts.push(clean.slice(5, 7));
    if (clean.length > 7) parts.push(clean.slice(7, 9));
    return parts.join(" ");
  };

  const formatViewPhone = (raw?: string) => {
    if (!raw) return "";
    const codeDigits = countryCode.replace(/\D/g, "");
    const clean = raw.replace(/\D/g, "");
    const local =
      codeDigits && clean.startsWith(codeDigits)
        ? clean.slice(codeDigits.length)
        : clean;
    return `${countryCode} ${formatLocalPhone(local)}`.trim();
  };
  const resolvedCountry =
    findCountryByCode(user?.country) ??
    (user?.phone ? findCountryByCode(countryCode) : null);

  const handleSave = () => {
    if (phoneInput.trim().length < PHONE_REQUIRED_LENGTH) {
      toast.error(
        t("authForm.signup.phoneRequired", {
          defaultValue: "Please enter your full phone number.",
        }),
      );
      phoneInputRef.current?.focus();
      return;
    }
    onSave();
  };

  const handleBankDetailsSubmit = async () => {
    const isSuccess = await onSubmitBankDetails();
    if (isSuccess) {
      setIsBankDetailsDialogOpen(false);
      setIsBankDetailsViewDialogOpen(true);
    }
  };

  const handleOpenSubmitDialog = () => {
    setIsBankDetailsViewDialogOpen(false);
    setIsBankDetailsDialogOpen(true);
  };

  return (
    <>
      <div>
        <p className="text-sm text-muted-foreground">{labels.username}</p>
        {isEditing ? (
          <Input
            placeholder={user?.username ?? "—"}
            value={usernameInput}
            onChange={(e) => onUsernameChange(e.target.value)}
          />
        ) : (
          <p className="text-base font-medium">{user?.username ?? "—"}</p>
        )}
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">{labels.firstName}</p>
          {isEditing ? (
            <Input
              placeholder={user?.name?.firstname || "—"}
              value={firstNameInput}
              onChange={(e) => onFirstNameChange(e.target.value)}
            />
          ) : (
            <p className="text-base font-medium">
              {user?.name?.firstname || "—"}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{labels.lastName}</p>
          {isEditing ? (
            <Input
              placeholder={user?.name?.lastname || "—"}
              value={lastNameInput}
              onChange={(e) => onLastNameChange(e.target.value)}
            />
          ) : (
            <p className="text-base font-medium">
              {user?.name?.lastname || "—"}
            </p>
          )}
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{labels.email}</p>
        {isEditing ? (
          <Input
            placeholder={user?.email || "—"}
            value={emailInput}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        ) : (
          <p className="text-base font-medium">{user?.email || "—"}</p>
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{labels.password}</p>
        {!isEditing ? (
          <div className="flex items-center gap-2">
            <span className="text-base font-medium">
              {showPassword
                ? user?.password || "—"
                : user?.password
                  ? "••••••••"
                  : "—"}
            </span>
            {user?.password ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            ) : null}
          </div>
        ) : (
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={passwordInput}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>
      {user?.role === "seller" && (
        <div className="grid gap-2 md:grid-cols-2">
          <div className="">
            <p className="text-sm text-muted-foreground">
              {labels.companyName}
            </p>
            {isEditing ? (
              <Input
                placeholder={user?.company_name || "—"}
                value={companyNameInput}
                onChange={(e) => onCompanyNameChange(e.target.value)}
              />
            ) : (
              <p className="text-base font-medium">
                {user?.company_name || "—"}
              </p>
            )}
          </div>

          <Dialog
            open={isBankDetailsViewDialogOpen}
            onOpenChange={setIsBankDetailsViewDialogOpen}
          >
            <DialogTrigger asChild>
              <div>
                <p className="text-sm text-muted-foreground">
                  {labels.bankDetails}
                </p>
                <Button variant="outline" size="sm" className="w-fit">
                  {labels.viewBankDetailsLabel}
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{labels.bankDetails}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm text-muted-foreground">
                    {labels.bankAccountNumber}
                  </p>
                  <p className="border rounded-sm py-0.5 px-2">
                    {bankAccountNumberInput ? bankAccountNumberInput : "-"}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm text-muted-foreground">
                    {labels.bankInn}
                  </p>
                  <p className="border rounded-sm  py-0.5 px-2">
                    {bankInnInput ? bankInnInput : "-"}
                  </p>
                </div>

                <div className="flex flex-col gap-0.5">
                  <p className="text-sm text-muted-foreground">
                    {labels.bankName}
                  </p>
                  <p className="border rounded-sm py-0.5 px-2">
                    {bankNameInput ? bankNameInput : "-"}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm text-muted-foreground">
                    {labels.bankBik}
                  </p>
                  <p className="border rounded-sm py-0.5 px-2">
                    {bankBikInput ? bankBikInput : "-"}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setIsBankDetailsViewDialogOpen(false)}
                >
                  {labels.cancel}
                </Button>
                <Button onClick={handleOpenSubmitDialog}>
                  {labels.updateBankDetailsLabel}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isBankDetailsDialogOpen}
            onOpenChange={setIsBankDetailsDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{labels.bankDetailsFormTitle}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {labels.bankAccountNumber}
                  </p>
                  <Input
                    placeholder={labels.bankAccountNumber}
                    value={bankAccountNumberInput}
                    onChange={(e) => onBankAccountNumberChange(e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {labels.bankBik}
                  </p>
                  <Input
                    placeholder={labels.bankBik}
                    value={bankBikInput}
                    onChange={(e) => onBankBikChange(e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {labels.bankName}
                  </p>
                  <Input
                    placeholder={labels.bankName}
                    value={bankNameInput}
                    onChange={(e) => onBankNameChange(e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {labels.bankInn}
                  </p>
                  <Input
                    placeholder={labels.bankInn}
                    value={bankInnInput}
                    onChange={(e) => onBankInnChange(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setIsBankDetailsDialogOpen(false)}
                  disabled={isBankDetailsSubmitting}
                >
                  {labels.cancel}
                </Button>
                <Button
                  onClick={handleBankDetailsSubmit}
                  disabled={isBankDetailsSubmitting}
                >
                  {isBankDetailsSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    labels.submitBankDetails
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
      <div>
        <p className="text-sm text-muted-foreground">{labels.phone}</p>
        {isEditing ? (
          <div className="border flex rounded-lg focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition">
            <div className="relative min-w-[70px]">
              <NativeSelect
                value={countryCode}
                onChange={(e) => {
                  onCountryCodeChange(e.target.value);
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
                  >
                    {country.emoji ?? ""} {country.name} {country.dial_code}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              <div className="pointer-events-none absolute inset-0 flex items-center gap-2 px-3 text-sm">
                <span className="text-lg leading-none">
                  {findCountryByCode(countryCode)?.emoji}
                </span>
              </div>
            </div>
            <Input
              ref={phoneInputRef}
              value={`${countryCode} ${formatLocalPhone(phoneInput)}`}
              onChange={(e) => {
                const raw = e.target.value;
                const stripped = raw.startsWith(countryCode)
                  ? raw.slice(countryCode.length).trimStart()
                  : raw.replace(/^\\+?\\d+\\s*/, "");
                const digits = stripped.replace(/\D/g, "");
                onPhoneChange(digits.slice(0, PHONE_REQUIRED_LENGTH));
              }}
              placeholder={`${countryCode} 00 000 00 00`}
              className="flex-1 rounded-none border-none rounded-r-lg"
            />
          </div>
        ) : (
          <p className="text-base font-medium">
            {formatViewPhone(user?.phone) || "—"}
          </p>
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{labels.country}</p>
        {isEditing ? (
          <div className="relative">
            <NativeSelect
              value={countryInput}
              onChange={(e) => onCountryInputChange(e.target.value)}
              aria-label="Country"
              className="text-transparent bg-muted border rounded-lg"
            >
              {(
                countryCodes as {
                  code: string;
                  dial_code: string;
                  name: string;
                  emoji?: string;
                }[]
              ).map((country) => (
                <NativeSelectOption key={country.code} value={country.code}>
                  {country.emoji ?? ""} {country.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <div className="pointer-events-none absolute inset-0 flex items-center gap-2 px-3 text-sm">
              <span className="text-lg leading-none">
                {findCountryByCode(countryInput)?.emoji}
              </span>
              <span>
                {findCountryByCode(countryInput)?.name ||
                  resolvedCountry?.name ||
                  user?.country ||
                  "—"}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-base font-medium flex items-center gap-2">
            {resolvedCountry?.emoji && (
              <span className="text-lg leading-none">
                {resolvedCountry?.emoji}
              </span>
            )}
            <span>{resolvedCountry?.name || user?.country || "—"}</span>
          </p>
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{labels.role}</p>
        <p className="text-base font-medium">
          {user?.role
            ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
            : "—"}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="destructive"
          onClick={onLogout}
          disabled={isLogoutPending}
          aria-label={labels.logout}
        >
          {isLogoutPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            labels.logout
          )}
        </Button>
        {!isEditing ? (
          <Button onClick={onStartEdit}>{labels.edit}</Button>
        ) : (
          <>
            <Button onClick={handleSave}>{labels.save}</Button>
            <Button variant="ghost" onClick={onCancel}>
              {labels.cancel}
            </Button>
          </>
        )}
      </div>
    </>
  );
}
