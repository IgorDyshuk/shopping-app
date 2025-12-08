import { useEffect, useState, type ReactNode } from "react";

import { AppSidebar } from "@/components/layout/Header/SideBar/app-sidebar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SidebarInset } from "@/components/ui/sidebar";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1110px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setShowSidebar(event.matches);
    };

    setShowSidebar(mql.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      {showSidebar && <AppSidebar />}
      <SidebarInset>
        <div className="min-h-svh bg-background text-foreground">
          <Header showSidebar={showSidebar} />
          <main className="my-20 sm:my-22 md:my-24 lg:my-26 xl:my-28 2xl:my-30 mx-auto max-w-7xl px-3">
            {children}
          </main>
          <Footer />
        </div>
      </SidebarInset>
    </>
  );
}
