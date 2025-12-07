import { AppLayout } from "@/components/layout/AppLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import Home from "@/pages/Home";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppLayout>
        <Home />
      </AppLayout>
      <Toaster richColors theme="light" />
    </SidebarProvider>
  );
}

export default App;
