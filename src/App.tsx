import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import Category from "@/pages/Category";
import ProductPage from "@/pages/Product";
import BloggersPage from "@/pages/Bloggers";
import BloggerPage from "@/pages/Blogger";
import LoginPage from "@/pages/Login";
import SignupPage from "@/pages/Signup";
import UsersPage from "@/pages/Users";
import ProfilePage from "@/pages/Profile";
import OrderConfirmationPage from "@/pages/OrderConfirmation";
import { Toaster } from "./components/ui/sonner";
import CartPage from "@/pages/Cart";

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
            <Route path="/category/:category/:id" element={<ProductPage />} />
            <Route path="/bloggers" element={<BloggersPage />} />
            <Route path="/bloggers/:id" element={<BloggerPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/order/confirmation" element={<OrderConfirmationPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
        <Toaster richColors theme="light" />
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
