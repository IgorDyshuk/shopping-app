import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import Category from "@/pages/Category";
import { Toaster } from "./components/ui/sonner";

function App() {
  const basename = import.meta.env.BASE_URL ?? "/";

  return (
    <BrowserRouter basename={basename}>
      <SidebarProvider defaultOpen={false}>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/category/:category" element={<Category />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
        <Toaster richColors theme="light" />
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
