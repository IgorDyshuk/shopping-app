import countryCodes from "@/constants/CountriesCode.json";

export type CountryInfo = {
  code: string;
  dial_code: string;
  name: string;
  emoji?: string;
};

export const countriesList = countryCodes as CountryInfo[];

const countriesByDialCodeLength = [...countriesList].sort(
  (a, b) => b.dial_code.length - a.dial_code.length,
);

export const findCountryByCode = (value?: string): CountryInfo | null => {
  if (!value) return null;
  return (
    countriesList.find(
      (c) => c.code === value || c.dial_code === value
    ) ?? null
  );
};

export const findCountryByPhone = (value?: string): CountryInfo | null => {
  if (!value) return null;
  const normalized = value.trim().replace(/\s+/g, "");
  return (
    countriesByDialCodeLength.find(
      (c) => c.dial_code && normalized.startsWith(c.dial_code),
    ) ?? null
  );
};

export const parsePhoneWithCountry = (
  value?: string,
  fallbackDialCode = "+380",
) => {
  if (!value) return { code: fallbackDialCode, number: "" };
  const normalized = value.trim().replace(/\s+/g, "");
  const country = findCountryByPhone(normalized);
  if (country?.dial_code) {
    const digits = normalized.replace(/\D/g, "");
    const codeDigits = country.dial_code.replace(/\D/g, "");
    const numberDigits = digits.startsWith(codeDigits)
      ? digits.slice(codeDigits.length)
      : digits;
    return { code: country.dial_code, number: numberDigits };
  }
  const match = normalized.match(/^(\+\d+)(.*)$/);
  if (match) {
    return { code: match[1], number: match[2].replace(/\D/g, "") };
  }
  return {
    code: fallbackDialCode,
    number: normalized.replace(/\D/g, ""),
  };
};
