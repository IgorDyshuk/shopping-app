import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/use-language";

const languages = [
  { value: "en", labelKey: "languages.en" },
  { value: "uk", labelKey: "languages.uk" },
] as const;

function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useLanguageStore();
  const [open, setOpen] = useState(false);

  const currentLanguage = language || (i18n.resolvedLanguage ?? i18n.language ?? "en");
  const activeLanguage =
    languages.find(({ value }) => value === currentLanguage) ?? languages[0];

  // Sync i18n with stored language on mount/update.
  useEffect(() => {
    if (currentLanguage && currentLanguage !== i18n.language) {
      void i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  const handleSelect = (value: string) => {
    if (value === currentLanguage) {
      setOpen(false);
      return;
    }

    setLanguage(value);
    void i18n.changeLanguage(value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[120px] justify-between"
        >
          <span>{t(activeLanguage.labelKey)}</span>
          <ChevronsUpDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[120px] p-0" align="center">
        <Command>
          <CommandList>
            <CommandGroup heading={t("language.label")}>
              {languages.map((lang) => (
                <CommandItem
                  key={lang.value}
                  value={lang.value}
                  onSelect={handleSelect}
                >
                  {t(lang.labelKey)}
                  <Check
                    className={cn(
                      "ml-auto size-4",
                      currentLanguage === lang.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { LanguageSwitcher };
