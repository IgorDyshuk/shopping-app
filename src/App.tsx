import { useEffect, useState } from "react";

import { AppSidebar } from "@/components/layout/Header/SideBar/app-sidebar";
import { Header } from "@/components/layout/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Home from "@/pages/Home";
import { Toaster } from "./components/ui/sonner";

function App() {
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
    <SidebarProvider defaultOpen={false}>
      {showSidebar && <AppSidebar />}
      <SidebarInset>
        <div className="min-h-svh bg-background text-foreground">
          <Header showSidebar={showSidebar} />
          <main className="mt-20 sm:mt-22 md:mt-24 lg:mt-26 xl:mt-28 2xl:mt-30">
            <Home />
          </main>
        </div>
        <Toaster richColors theme="light" position="top-right" />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
