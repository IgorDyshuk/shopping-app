import { useEffect, useState } from "react";

import { AppSidebar } from "@/components/layout/Header/SideBar/app-sidebar";
import { Header } from "@/components/layout/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Home from "@/pages/Home";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 867px)");
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
          <main>
            <Home />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
