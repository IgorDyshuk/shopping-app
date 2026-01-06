import countryCodes from "@/constants/CountriesCode.json";

export type CountryInfo = {
  code: string;
  dial_code: string;
  name: string;
  emoji?: string;
};

export const countriesList = countryCodes as CountryInfo[];

export const findCountryByCode = (value?: string): CountryInfo | null => {
  if (!value) return null;
  return (
    countriesList.find(
      (c) => c.code === value || c.dial_code === value
    ) ?? null
  );
};
