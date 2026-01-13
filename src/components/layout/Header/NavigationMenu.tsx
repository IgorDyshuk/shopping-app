"use client";

import * as React from "react";

import { useIsMobile } from "@/hooks/media-hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import { CATALOG_CATEGORIES } from "@/constants/catalog-categories";
import { useTranslation } from "react-i18next";

const clothingCategory = CATALOG_CATEGORIES.clothing;
const electronicsCategory = CATALOG_CATEGORIES.electronics;
const jeweleryCategory = CATALOG_CATEGORIES.jewelery;

export function NavigationMenuComplete() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const catalog = React.useMemo(
    () => [
      {
        title: t("nav.catalog.clothing.title"),
        href: clothingCategory,
        description: t("nav.catalog.clothing.description"),
      },
      {
        title: t("nav.catalog.sneakers.title"),
        href: electronicsCategory,
        description: t("nav.catalog.sneakers.description"),
      },
      {
        title: t("nav.catalog.accessories.title"),
        href: jeweleryCategory,
        description: t("nav.catalog.accessories.description"),
      },
    ],
    [t]
  );

  const bloggers = React.useMemo(
    () => [
      {
        title: t("nav.bloggers.all.title"),
        href: "/bloggers",
        description: t("nav.bloggers.all.description"),
      },
      {
        title: t("nav.bloggers.top.title"),
        href: "#creators-top",
        description: t("nav.bloggers.top.description"),
      },
      {
        title: t("nav.bloggers.collabs.title"),
        href: "#creators-collabs",
        description: t("nav.bloggers.collabs.description"),
      },
    ],
    [t]
  );

  return (
    <NavigationMenu
      viewport={isMobile}
      className="justify-start text-foreground"
    >
      <NavigationMenuList className="flex-wrap z-100">
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/">{t("sidebar.main.home")}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger onClick={() => navigate("/catalog")}>
            {t("nav.catalogTrigger")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                    to="/catalog"
                  >
                    <div className="mb-2 text-lg font-medium sm:mt-4">
                      {t("nav.catalogHeroTitle")}
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      {t("nav.catalogHeroDescription")}
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              {catalog.map((item) => (
                <ListItem key={item.title} href={item.href} title={item.title}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger onClick={() => navigate("/bloggers")}>
            {t("nav.bloggersTrigger")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px]">
              {bloggers.map((item) => (
                <ListItem key={item.title} href={item.href} title={item.title}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/faq">{t("nav.support")}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  const isAbsolute = href.startsWith("/") || href.startsWith("#");
  const to = isAbsolute ? href : `/category/${encodeURIComponent(href)}`;

  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={to}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
