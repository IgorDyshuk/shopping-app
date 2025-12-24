import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { AppSidebar } from "@/components/layout/Header/SideBar/app-sidebar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SidebarInset } from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/media-hooks/use-media-query";
import { useSidebar } from "@/components/ui/sidebar";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const showSidebar = useMediaQuery("(max-width: 1131px)");
  const { pathname } = useLocation();
  const { closeSidebar } = useSidebar();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!showSidebar) return;
    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
      closeSidebar();
    }
  }, [showSidebar, pathname, closeSidebar]);

  return (
    <>
      {showSidebar && <AppSidebar />}
      <SidebarInset>
        <div className="min-h-svh bg-background text-foreground flex flex-col">
          <Header showSidebar={showSidebar} />
          <main className="mx-auto max-w-[1464px] px-3 flex-1 w-full">
            {children}
          </main>
          <Footer showLanguage={!showSidebar} />
        </div>
      </SidebarInset>
    </>
  );
}
