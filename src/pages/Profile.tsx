import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Heart, ShoppingBag } from "lucide-react";

import { useAuthStore } from "@/stores/use-auth";
import { useOrdersStore } from "@/stores/use-orders";
import { useFavoritesStore } from "@/stores/use-favorites";
import countryCodes from "@/constants/CountriesCode.json";
import { useProducts } from "@/hooks/api-hooks/useProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ProfileSidebar,
  type SidebarItem,
} from "@/components/pages/Profile/ProfileSidebar";
import { ProfileInfoSection } from "@/components/pages/Profile/ProfileInfoSection";
import { FavoritesSection } from "@/components/pages/Profile/FavoritesSection";
import { OrdersSection } from "@/components/pages/Profile/OrdersSection";

type ProfileTab = "profile" | "favorites" | "orders";

function ProfilePage() {
  const { t } = useTranslation(["profile", "common"]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, logout, setUser } = useAuthStore();
  const { data: allProducts = [], isLoading: isLoadingProducts } =
    useProducts();
  const orders = useOrdersStore((state) => state.orders);
  const favoriteIds = useFavoritesStore((state) => state.ids);

  const parseTab = (value: string | null): ProfileTab =>
    value === "favorites" || value === "orders" ? value : "profile";
  const [activeTab, setActiveTab] = useState<ProfileTab>(() =>
    parseTab(searchParams.get("tab"))
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const parsePhone = (value?: string) => {
    const match = value?.match(/^(\+\d+)\s*(.*)$/);
    return {
      code: match?.[1] ?? "+380",
      number: match?.[2]?.replace(/\D/g, "") ?? "",
    };
  };
  const parsedPhone = parsePhone(user?.phone);

  const [usernameInput, setUsernameInput] = useState(user?.username ?? "");
  const [firstNameInput, setFirstNameInput] = useState(
    user?.name?.firstname ?? ""
  );
  const [lastNameInput, setLastNameInput] = useState(
    user?.name?.lastname ?? ""
  );
  const [emailInput, setEmailInput] = useState(user?.email ?? "");
  const [countryCode, setCountryCode] = useState(parsedPhone.code);
  const [phoneInput, setPhoneInput] = useState(parsedPhone.number);
  const [countryInput, setCountryInput] = useState(
    user?.country ?? countryCodes[0]?.code ?? ""
  );
  const [passwordInput, setPasswordInput] = useState(user?.password ?? "");

  const favoriteProducts = useMemo(
    () => allProducts.filter((p) => favoriteIds.includes(p.id)),
    [allProducts, favoriteIds]
  );

  const handleLogOut = () => {
    logout();
    navigate("/");
  };

  const startEdit = () => {
    setIsEditing(true);
    setUsernameInput(user?.username ?? "");
    setFirstNameInput(user?.name?.firstname ?? "");
    setLastNameInput(user?.name?.lastname ?? "");
    setEmailInput(user?.email ?? "");
    const parsed = parsePhone(user?.phone);
    setCountryCode(parsed.code);
    setPhoneInput(parsed.number);
    setCountryInput(user?.country ?? parsed.code);
    setPasswordInput(user?.password ?? "");
  };

  const handleSave = () => {
    if (!user) return;
    const nextUser = {
      ...user,
      username: usernameInput || user.username,
      email: emailInput || user.email,
      phone: `${countryCode} ${phoneInput}`.trim(),
      country: countryInput || user.country || countryCode,
      name: {
        firstname: firstNameInput || user.name?.firstname,
        lastname: lastNameInput || user.name?.lastname,
      },
      password: passwordInput || user.password,
    };
    setUser(nextUser);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUsernameInput(user?.username ?? "");
    setFirstNameInput(user?.name?.firstname ?? "");
    setLastNameInput(user?.name?.lastname ?? "");
    setEmailInput(user?.email ?? "");
    const parsed = parsePhone(user?.phone);
    setCountryCode(parsed.code);
    setPhoneInput(parsed.number);
    setCountryInput(user?.country ?? parsed.code);
    setPasswordInput(user?.password ?? "");
  };

  const sidebarItems = useMemo(
    () => [
      {
        id: "profile",
        label: t("tabs.profile", { ns: "profile" }),
        icon: User,
      },
      {
        id: "favorites",
        label: t("tabs.favorites", { ns: "profile" }),
        icon: Heart,
      },
      {
        id: "orders",
        label: t("tabs.orders", { ns: "profile" }),
        icon: ShoppingBag,
      },
    ],
    [t]
  );

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const next = parseTab(tabParam);
    if (next !== activeTab) setActiveTab(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleTabChange = (tab: ProfileTab) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (tab === "profile") {
        next.delete("tab");
      } else {
        next.set("tab", tab);
      }
      return next;
    });
  };

  return (
    <section className="flex flex-col w-full items-start my-18 xl:my-19">
      <Breadcrumb className="flex justify-center">
        <BreadcrumbList className="flex justify-center items-center gap-2 text-center">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">{t("breadcrumb.home", { ns: "common" })}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/profile">
                {t("pageTitle.profile", { ns: "profile" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full mt-3 xl:mt-4 grid gap-4 lg:grid-cols-[270px_1fr]">
        <Card className="h-fit py-0">
          <ProfileSidebar
            title={t("menuTitle", { ns: "profile" })}
            items={sidebarItems as SidebarItem[]}
            activeId={activeTab}
            onChange={(id) => handleTabChange(id as ProfileTab)}
          />
        </Card>

        <Card
          className={`gap-4  ${
            activeTab === "profile" ? "border py-6" : "border-none py-6 sm:py-0"
          }`}
        >
          <CardHeader className={`${activeTab === "profile" ? "" : "px-1"}`}>
            <CardTitle>
              {activeTab === "profile"
                ? t("pageTitle.profile", { ns: "profile" })
                : activeTab === "favorites"
                ? t("pageTitle.favorites", { ns: "profile" })
                : t("pageTitle.orders", { ns: "profile" })}
            </CardTitle>
          </CardHeader>
          <CardContent
            className={`space-y-4 ${activeTab === "profile" ? "" : "px-0"}`}
          >
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  {t("auth.notLogged", { ns: "profile" })}
                </p>
                <div className="flex gap-2">
                  <Button onClick={() => navigate("/login")}>
                    {t("auth.login", { ns: "profile" })}
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/signup")}>
                    {t("auth.signup", { ns: "profile" })}
                  </Button>
                </div>
              </div>
            ) : activeTab === "profile" ? (
              <ProfileInfoSection
                user={user}
                isEditing={isEditing}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                usernameInput={usernameInput}
                firstNameInput={firstNameInput}
                lastNameInput={lastNameInput}
                emailInput={emailInput}
                passwordInput={passwordInput}
                countryCode={countryCode}
                phoneInput={phoneInput}
                countryInput={countryInput}
                onUsernameChange={setUsernameInput}
                onFirstNameChange={setFirstNameInput}
                onLastNameChange={setLastNameInput}
                onEmailChange={setEmailInput}
                onPasswordChange={setPasswordInput}
                onCountryCodeChange={setCountryCode}
                onPhoneChange={setPhoneInput}
                onCountryInputChange={setCountryInput}
                onLogout={handleLogOut}
                onStartEdit={startEdit}
                onSave={handleSave}
                onCancel={handleCancelEdit}
                labels={{
                  username: t("fields.username", { ns: "profile" }),
                  firstName: t("fields.firstName", { ns: "profile" }),
                  lastName: t("fields.lastName", { ns: "profile" }),
                  email: t("fields.email", { ns: "profile" }),
                  password: t("fields.password", { ns: "profile" }),
                  phone: t("fields.phone", { ns: "profile" }),
                  country: t("fields.country", { ns: "profile" }),
                  role: t("fields.role", { ns: "profile" }),
                  logout: t("actions.logout", { ns: "profile" }),
                  edit: t("actions.edit", { ns: "profile" }),
                  save: t("actions.save", { ns: "profile" }),
                  cancel: t("actions.cancel", { ns: "profile" }),
                }}
              />
            ) : activeTab === "favorites" ? (
              <FavoritesSection
                products={favoriteProducts}
                isLoading={isLoadingProducts}
                emptyText={t("favorites.empty", { ns: "profile" })}
                loadingText={t("favorites.loading", { ns: "profile" })}
              />
            ) : (
              <OrdersSection orders={orders} t={t} />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default ProfilePage;
