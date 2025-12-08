"use client";

import * as React from "react";

import { useIsMobile } from "@/hooks/use-mobile";
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

const drops = [
  {
    title: "Сегодняшний дроп",
    href: "#drops-today",
    description: "Свежее поступление вещей блогеров — успей купить первым.",
  },
  {
    title: "Календарь дропов",
    href: "#drops-calendar",
    description: "Следи за расписанием будущих релизов.",
  },
  {
    title: "Редкие лоты",
    href: "#drops-archive",
    description: "Последние экземпляры из прошедших дропов.",
  },
];

const catalog = [
  {
    title: "Одежда",
    href: "#catalog-clothes",
    description: "Худи, футболки, джинсы и коллаборации.",
  },
  {
    title: "Обувь",
    href: "#catalog-sneakers",
    description: "Сникеры и лимитированные пары.",
  },
  {
    title: "Аксессуары",
    href: "#catalog-accessories",
    description: "Сумки, часы, украшения от блогеров.",
  },
  {
    title: "Гаджеты",
    href: "#catalog-gadgets",
    description: "Техника и сетапы инфлюенсеров.",
  },
];

const creators = [
  {
    title: "Топ блогеры",
    href: "#creators-top",
    description: "Популярные витрины с новыми вещами.",
  },
  {
    title: "Все создатели",
    href: "#creators-all",
    description: "Ищи по имени или никнейму.",
  },
  {
    title: "Коллаборации",
    href: "#creators-collabs",
    description: "Спец-дропы вместе с брендами.",
  },
];

export function NavigationMenuComplete() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <NavigationMenu
      viewport={isMobile}
      className="justify-start text-foreground"
    >
      <NavigationMenuList className="flex-wrap z-100">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Дропы</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
              <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                    to="#drops"
                  >
                    <div className="mb-2 text-lg font-medium sm:mt-4">
                      Эксклюзивные дропы
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Следи за расписанием релизов и забирай редкие вещи
                      блогеров первым.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              {drops.map((item) => (
                <ListItem key={item.title} href={item.href} title={item.title}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger onClick={() => navigate("/catalog")}>
            Каталог
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {catalog.map((item) => (
                <ListItem key={item.title} href={item.href} title={item.title}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Блогеры</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px]">
              {creators.map((item) => (
                <ListItem key={item.title} href={item.href} title={item.title}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="#sell">Продать вещь</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="#support">FAQ & Поддержка</Link>
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
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <a href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}
