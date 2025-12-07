import { Check, ChevronsUpDown, EarthIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const languages = [
  { value: "en", labelKey: "languages.en" },
  { value: "uk", labelKey: "languages.uk" },
] as const;

export function NavLanguage() {
  const { t, i18n } = useTranslation();
  const { isMobile, state } = useSidebar();

  const currentLanguage = (i18n.resolvedLanguage ??
    i18n.language ??
    "en") as string;

  const handleSelect = (value: string) => {
    if (value === currentLanguage) return;
    void i18n.changeLanguage(value);
  };

  const compactButton = (
    <SidebarMenuButton className="justify-center">
      <EarthIcon />
    </SidebarMenuButton>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {state === "collapsed" && !isMobile ? (
              compactButton
            ) : (
              <SidebarMenuButton
                size="default"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <EarthIcon />
                <span className="flex flex-1 items-center gap-2 text-sm leading-tight ">
                  {t("language.label")}
                </span>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-48 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-sm font-medium">
              {t("language.label")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.value}
                onSelect={() => handleSelect(lang.value)}
                className="flex items-center gap-2 text-sm"
              >
                <span>{t(lang.labelKey)}</span>
                <Check
                  className={cn(
                    "ml-auto size-4 ",
                    currentLanguage === lang.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
