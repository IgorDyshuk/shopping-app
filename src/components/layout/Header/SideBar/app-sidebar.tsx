"use client";

import * as React from "react";
import {
  Boxes,
  CircleDollarSign,
  GalleryVerticalEnd,
  Home,
  LifeBuoy,
  Send,
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
import { CATALOG_CATEGORIES } from "@/constants/catalog-categories";
import { useTranslation } from "react-i18next";
import LogIN_SignUp from "./LoginSugnupButtons";
import { useAuthStore } from "@/stores/use-auth";

const clothingCategory = CATALOG_CATEGORIES.clothing;
const electronicsCategory = CATALOG_CATEGORIES.electronics;
const jeweleryCategory = CATALOG_CATEGORIES.jewelery;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile } = useSidebar();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();
  const showAuthButtons =
    (state === "expanded" || isMobile) && !isAuthenticated;

  const data = React.useMemo(
    () => ({
      user: {
        name: user?.username ?? "Guest",
        email: user?.email ?? "guest@example.com",
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
          title: t("sidebar.main.home"),
          url: "/",
          icon: Home,
        },
        {
          title: t("sidebar.main.catalog"),
          url: "/catalog",
          icon: Boxes,
          isActive: true,
          items: [
            {
              title: t("sidebar.main.catalogAll"),
              url: "/catalog",
            },
            {
              title: t("sidebar.main.catalogClothing"),
              url: `/category/${encodeURIComponent(clothingCategory)}`,
            },
            {
              title: t("sidebar.main.catalogSneakers"),
              url: `/category/${encodeURIComponent(electronicsCategory)}`,
            },
            {
              title: t("sidebar.main.catalogAccessories"),
              url: `/category/${encodeURIComponent(jeweleryCategory)}`,
            },
          ],
        },
        {
          title: t("sidebar.main.bloggers"),
          url: "#creators",
          icon: Users,
          isActive: true,
          items: [
            {
              title: t("sidebar.main.bloggersAll"),
              url: "/bloggers",
            },
            {
              title: t("sidebar.main.bloggersTop"),
              url: "/bloggers",
            },
            {
              title: t("sidebar.main.bloggersCollabs"),
              url: "#creators-collabs",
            },
          ],
        },
      ],
      navFooter: [
        {
          title: t("sidebar.footer.support"),
          url: "#",
          icon: LifeBuoy,
        },
        {
          title: t("sidebar.footer.faq"),
          url: "#",
          icon: Send,
        },
      ],
    }),
    [t, user?.username, user?.email]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {showAuthButtons && <LogIN_SignUp />}
        {state === "collapsed" && !isMobile && !isAuthenticated && (
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
        {isAuthenticated && <NavUser user={data.user} />}
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
