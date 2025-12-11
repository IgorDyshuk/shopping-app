"use client";

import * as React from "react";
import {
  Boxes,
  CircleDollarSign,
  GalleryVerticalEnd,
  Home,
  LifeBuoy,
  Send,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/layout/Header/SideBar/nav-main";
import { NavUser } from "@/components/layout/Header/SideBar/nav-user";
import { NavLanguage } from "@/components/layout/Header/SideBar/nav-language";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import LogIn from "../LogInForm";
import SignUp from "../SIgnUpForm";
import { CATALOG_CATEGORIES } from "@/constants/catalog-categories";

const clothingCategory = CATALOG_CATEGORIES.clothing;
const electronicsCategory = CATALOG_CATEGORIES.electronics;
const jeweleryCategory = CATALOG_CATEGORIES.jewelery;

const data = {
  user: {
    name: "Guest",
    email: "guest@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Influencers",
      logo: GalleryVerticalEnd,
      plan: "Marketplace",
    },
    {
      name: "Collectors",
      logo: CircleDollarSign,
      plan: "Premium",
    },
  ],
  navMain: [
    {
      title: "Главная",
      url: "/",
      icon: Home,
    },
    {
      title: "Каталог",
      url: "/catalog",
      icon: Boxes,
      isActive: true,
      items: [
        {
          title: "Весь каталог",
          url: "/catalog",
        },
        {
          title: "Одежда",
          url: `/category/${encodeURIComponent(clothingCategory)}`,
        },
        {
          title: "Обувь",
          url: `/category/${encodeURIComponent(electronicsCategory)}`,
        },
        {
          title: "Аксессуары",
          url: `/category/${encodeURIComponent(jeweleryCategory)}`,
        },
      ],
    },
    {
      title: "Блогеры",
      url: "#creators",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Топ блогеры",
          url: "#creators-top",
        },
        {
          title: "Все создатели",
          url: "#creators-all",
        },
        {
          title: "Коллаборации",
          url: "#creators-collabs",
        },
      ],
    },
  ],
  navFooter: [
    {
      title: "Поддержка",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "FAQ",
      url: "#",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {(state === "expanded" || isMobile) && (
          <div className="flex gap-2">
            <LogIn className="flex-1 min-w-0 justify-center" />
            <SignUp className="flex-1 min-w-0 justify-center" />
          </div>
        )}
        {state === "collapsed" && !isMobile && (
          <div className="flex justify-center py-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full bg-sidebar text-sidebar-foreground"
              aria-label="Account"
            >
              <UserRound className="size-5" />
            </Button>
          </div>
        )}
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter items={data.navFooter}>
        <div className="flex w-full justify-center">
          <NavLanguage />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
