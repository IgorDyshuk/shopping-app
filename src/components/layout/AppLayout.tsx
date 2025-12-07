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
    const mql = window.matchMedia("(max-width: 1100px)");
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
          <main className="mt-20 sm:mt-22 md:mt-24 lg:mt-26 xl:mt-28 2xl:mt-30">
            {children}
          </main>
          <Footer />
        </div>
      </SidebarInset>
    </>
  );
}
