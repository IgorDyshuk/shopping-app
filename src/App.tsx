import {
  BrowserRouter,
  HashRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider defaultOpen={false}>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
        <Toaster richColors theme="light" />
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
