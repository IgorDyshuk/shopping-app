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
import { User, Heart, ShoppingBag, Boxes } from "lucide-react";
import axios from "axios";

import { useAuthStore } from "@/stores/use-auth";
import { useOrdersStore } from "@/stores/use-orders";
import countryCodes from "@/constants/CountriesCode.json";
import { useProducts } from "@/hooks/api-hooks/useProducts";
import { useLogout } from "@/hooks/api-hooks/useAuth";
import {
  useCreateSellerBankDetails,
  useUpdateClientProfile,
  useUpdateSellerProfile,
} from "@/hooks/api-hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { API_CONFIG } from "@/lib/apiConfig";
import { findCountryByCode, parsePhoneWithCountry } from "@/lib/country";
import {
  ProfileSidebar,
  type SidebarItem,
} from "@/components/pages/Profile/ProfileSidebar";
import { ProfileInfoSection } from "@/components/pages/Profile/ProfileInfoSection";
import { FavoritesSection } from "@/components/pages/Profile/FavoritesSection";
import { OrdersSection } from "@/components/pages/Profile/OrdersSection";
import { MyItemsSection } from "@/components/pages/Profile/MyItemsSection";
import { ItemForm } from "@/components/pages/Profile/ItemForm";
import type { Product } from "@/types/product";

type ProfileTab = "profile" | "favorites" | "orders" | "my-items" | "add-item";
const productsPath = "/products";

function ProfilePage() {
  const { t } = useTranslation(["profile", "common"]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, logout, setUser } = useAuthStore();
  const { mutate: logoutRequest, isPending: isLogoutPending } = useLogout();
  const { mutateAsync: createBankDetails, isPending: isSubmittingBankDetails } =
    useCreateSellerBankDetails();
  const { mutateAsync: updateClientProfile } = useUpdateClientProfile();
  const { mutateAsync: updateSellerProfile } = useUpdateSellerProfile();
  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  const orders = useOrdersStore((state) => state.orders);
  const isSeller = user?.role === "seller";

  const parseTab = (value: string | null): ProfileTab => {
    if (value === "favorites" || value === "orders") return value;
    if ((value === "my-items" || value === "add-item") && isSeller)
      return value;
    return "profile";
  };
  const [activeTab, setActiveTab] = useState<ProfileTab>(() =>
    parseTab(searchParams.get("tab")),
  );
  const { data: allProductsData, isLoading: isLoadingProducts } = useProducts();
  const allProducts = Array.isArray(allProductsData) ? allProductsData : [];
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(
    undefined,
  );

  const parsePhone = (value?: string) => parsePhoneWithCountry(value, "+380");
  const parsedPhone = parsePhone(user?.phone);
  const resolveCountryInput = (value?: string, phone?: string) => {
    const fromCountry = findCountryByCode(value);
    if (fromCountry?.code) return fromCountry.code;
    if (phone) {
      const fromPhone = findCountryByCode(parsePhone(phone).code);
      if (fromPhone?.code) return fromPhone.code;
    }
    return countryCodes[0]?.code ?? "";
  };

  const [usernameInput, setUsernameInput] = useState(user?.username ?? "");
  const [firstNameInput, setFirstNameInput] = useState(
    user?.name?.firstname ?? "",
  );
  const handleShowTokenInfo = async () => {
    const url = API_CONFIG.buildIdentityUrl(productsPath);
    const token = localStorage.getItem(API_CONFIG.authTokenKey);
    try {
      const res = await axios.get(url, {
        params: { offset: 0, limit: 20, state: "new", size: ["XS"] },
        paramsSerializer: {
          indexes: null,
        },
        ...API_CONFIG.identityRequestConfig,
        timeout: API_CONFIG.timeoutMs,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...API_CONFIG.identityHeaders,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      // eslint-disable-next-line no-console
      console.log(res.data);
      toast.success("Products fetched", {
        description: `Получено: ${
          Array.isArray(res.data) ? res.data.length : 0
        }`,
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ??
        err?.response?.data?.message ??
        err?.message ??
        "Failed to fetch products";
      // eslint-disable-next-line no-console
      console.error(err?.response?.data || err);
      toast.error(message);
    }
  };
  const [lastNameInput, setLastNameInput] = useState(
    user?.name?.lastname ?? "",
  );
  const [emailInput, setEmailInput] = useState(user?.email ?? "");
  const [countryCode, setCountryCode] = useState(parsedPhone.code);
  const [phoneInput, setPhoneInput] = useState(parsedPhone.number);
  const [countryInput, setCountryInput] = useState(
    resolveCountryInput(user?.country, user?.phone),
  );
  const [passwordInput, setPasswordInput] = useState(user?.password ?? "");
  const [companyNameInput, setCompanyNameInput] = useState(
    user?.company_name ?? "",
  );
  const [bankAccountNumberInput, setBankAccountNumberInput] = useState("");
  const [bankBikInput, setBankBikInput] = useState("");
  const [bankNameInput, setBankNameInput] = useState("");
  const [bankInnInput, setBankInnInput] = useState("");

  const favoriteProducts = useMemo(() => allProducts, [allProducts]);

  const handleLogOut = () => {
    logoutRequest(undefined, {
      onSettled: () => {
        logout();
        navigate("/");
      },
    });
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
    setCountryInput(resolveCountryInput(user?.country, user?.phone));
    setPasswordInput(user?.password ?? "");
    setCompanyNameInput(user?.company_name ?? "");
  };

  const handleSave = async () => {
    if (!user) return;

    if (user.role === "buyer") {
      const payload = {
        username: usernameInput.trim(),
        email: emailInput.trim(),
        phone: `${countryCode} ${phoneInput}`.trim(),
        first_name: firstNameInput.trim(),
        last_name: lastNameInput.trim(),
      };

      const parsedCurrentPhone = parsePhone(user?.phone);
      const currentPayload = {
        username: (user.username ?? "").trim(),
        email: (user.email ?? "").trim(),
        phone: `${parsedCurrentPhone.code} ${parsedCurrentPhone.number}`.trim(),
        first_name: (user.name?.firstname ?? "").trim(),
        last_name: (user.name?.lastname ?? "").trim(),
      };

      const hasPatchChanges =
        payload.username !== currentPayload.username ||
        payload.email !== currentPayload.email ||
        payload.phone !== currentPayload.phone ||
        payload.first_name !== currentPayload.first_name ||
        payload.last_name !== currentPayload.last_name;

      if (!hasPatchChanges) {
        setIsEditing(false);
        return;
      }

      try {
        const updated = await updateClientProfile(payload);
        const parsedUpdatedPhone = parsePhone(updated.phone);
        const countryFromPhone =
          findCountryByCode(parsedUpdatedPhone.code)?.code ??
          findCountryByCode(countryCode)?.code ??
          user.country;

        setUser({
          ...user,
          username: updated.username,
          email: updated.email,
          phone: updated.phone,
          country: countryFromPhone,
          name: {
            firstname: updated.first_name,
            lastname: updated.last_name,
          },
          accepts_marketing: updated.accepts_marketing,
          password: user.password,
        });
        setIsEditing(false);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update profile";
        toast.error(message);
      }
      return;
    }

    if (user.role === "seller") {
      const payload = {
        username: usernameInput.trim(),
        email: emailInput.trim(),
        phone: `${countryCode} ${phoneInput}`.trim(),
        first_name: firstNameInput.trim(),
        last_name: lastNameInput.trim(),
        company_name: companyNameInput.trim(),
      };

      const parsedCurrentPhone = parsePhone(user?.phone);
      const currentPayload = {
        username: (user.username ?? "").trim(),
        email: (user.email ?? "").trim(),
        phone: `${parsedCurrentPhone.code} ${parsedCurrentPhone.number}`.trim(),
        first_name: (user.name?.firstname ?? "").trim(),
        last_name: (user.name?.lastname ?? "").trim(),
        company_name: (user.company_name ?? "").trim(),
      };

      const hasPatchChanges =
        payload.username !== currentPayload.username ||
        payload.email !== currentPayload.email ||
        payload.phone !== currentPayload.phone ||
        payload.first_name !== currentPayload.first_name ||
        payload.last_name !== currentPayload.last_name ||
        payload.company_name !== currentPayload.company_name;

      if (!hasPatchChanges) {
        setIsEditing(false);
        return;
      }

      try {
        const updated = await updateSellerProfile(payload);
        const parsedUpdatedPhone = parsePhone(updated.phone);
        const countryFromPhone =
          findCountryByCode(parsedUpdatedPhone.code)?.code ??
          findCountryByCode(countryCode)?.code ??
          user.country;

        setUser({
          ...user,
          username: updated.username,
          email: updated.email,
          phone: updated.phone,
          country: countryFromPhone,
          company_name: updated.company_name,
          is_verified: updated.is_verified,
          name: {
            firstname: updated.first_name,
            lastname: updated.last_name,
          },
          password: user.password,
          bank_details_id: user.bank_details_id,
        });
        setIsEditing(false);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update profile";
        toast.error(message);
      }
      return;
    }

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
      company_name:
        user.role === "seller"
          ? companyNameInput || user.company_name
          : user.company_name,
      bank_details_id: user.bank_details_id,
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
    setCountryInput(resolveCountryInput(user?.country, user?.phone));
    setPasswordInput(user?.password ?? "");
    setCompanyNameInput(user?.company_name ?? "");
  };

  const handleSubmitBankDetails = async () => {
    if (!user || user.role !== "seller") return false;

    const account_number = bankAccountNumberInput.trim();
    const bik = bankBikInput.trim();
    const bank_name = bankNameInput.trim();
    const inn = bankInnInput.trim();

    if (!account_number || !bik || !bank_name || !inn) {
      toast.error(t("bankDetailsForm.validation.required", { ns: "profile" }));
      return false;
    }

    try {
      const response = await createBankDetails({
        account_number,
        bik,
        bank_name,
        inn,
      });
      const nextBankDetailsId =
        typeof response === "string" && response.trim().length > 0
          ? response.trim()
          : (user.bank_details_id ?? null);
      setUser({
        ...user,
        bank_details_id: nextBankDetailsId,
      });
      toast.success(t("bankDetailsForm.success", { ns: "profile" }));
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t("bankDetailsForm.error", { ns: "profile" });
      toast.error(message || t("bankDetailsForm.error", { ns: "profile" }));
      return false;
    }
  };

  const sidebarItems = useMemo(() => {
    const base: SidebarItem[] = [
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
    ];
    if (isSeller) {
      base.push({
        id: "my-items",
        label: t("tabs.myItems", { ns: "profile" }),
        icon: Boxes,
      });
    }
    return base;
  }, [t, isSeller]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const next = parseTab(tabParam);
    if (next !== activeTab) setActiveTab(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isSeller]);

  const handleTabChange = (tab: ProfileTab) => {
    if (!isSeller && (tab === "my-items" || tab === "add-item")) {
      tab = "profile";
    }
    if (tab !== "add-item") {
      setEditingProduct(undefined);
    }
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
          className={` ${activeTab === "my-items" ? "gap-0" : "gap-4"} ${
            activeTab === "profile" ? "border py-6" : "border-none py-6 sm:py-0"
          }`}
        >
          <CardHeader className={`${activeTab === "profile" ? "" : "px-1"}`}>
            <div className="flex justify-between items-start">
              <CardTitle>
                {activeTab === "profile"
                  ? t("pageTitle.profile", { ns: "profile" })
                  : activeTab === "favorites"
                    ? t("pageTitle.favorites", { ns: "profile" })
                    : activeTab === "orders"
                      ? t("pageTitle.orders", { ns: "profile" })
                      : activeTab === "my-items"
                        ? t("pageTitle.myItems", { ns: "profile" })
                        : editingProduct
                          ? t("pageTitle.editItem", { ns: "profile" })
                          : t("pageTitle.addItem", { ns: "profile" })}
              </CardTitle>
              <div className="flex gap-2">
                {import.meta.env.DEV && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShowTokenInfo}
                  >
                    Token info
                  </Button>
                )}
                {activeTab === "my-items" && isSeller && (
                  <Button
                    onClick={() => {
                      setEditingProduct(undefined);
                      handleTabChange("add-item");
                    }}
                  >
                    + {t("myItems.addButton", { ns: "profile" })}
                  </Button>
                )}
              </div>
            </div>
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
                companyNameInput={companyNameInput}
                bankAccountNumberInput={bankAccountNumberInput}
                bankBikInput={bankBikInput}
                bankNameInput={bankNameInput}
                bankInnInput={bankInnInput}
                countryCode={countryCode}
                phoneInput={phoneInput}
                countryInput={countryInput}
                onUsernameChange={setUsernameInput}
                onFirstNameChange={setFirstNameInput}
                onLastNameChange={setLastNameInput}
                onEmailChange={setEmailInput}
                onPasswordChange={setPasswordInput}
                onCompanyNameChange={setCompanyNameInput}
                onBankAccountNumberChange={setBankAccountNumberInput}
                onBankBikChange={setBankBikInput}
                onBankNameChange={setBankNameInput}
                onBankInnChange={setBankInnInput}
                onCountryCodeChange={setCountryCode}
                onPhoneChange={setPhoneInput}
                onCountryInputChange={setCountryInput}
                onLogout={handleLogOut}
                isLogoutPending={isLogoutPending}
                onStartEdit={startEdit}
                onSave={handleSave}
                onCancel={handleCancelEdit}
                onSubmitBankDetails={handleSubmitBankDetails}
                isBankDetailsSubmitting={isSubmittingBankDetails}
                labels={{
                  username: t("fields.username", { ns: "profile" }),
                  firstName: t("fields.firstName", { ns: "profile" }),
                  lastName: t("fields.lastName", { ns: "profile" }),
                  email: t("fields.email", { ns: "profile" }),
                  password: t("fields.password", { ns: "profile" }),
                  phone: t("fields.phone", { ns: "profile" }),
                  country: t("fields.country", { ns: "profile" }),
                  role: t("fields.role", { ns: "profile" }),
                  companyName: t("fields.companyName", { ns: "profile" }),
                  bankDetails: t("fields.bankDetails", { ns: "profile" }),
                  bankDetailsFormTitle: t("bankDetailsForm.title", {
                    ns: "profile",
                  }),
                  bankAccountNumber: t("bankDetailsForm.accountNumber", {
                    ns: "profile",
                  }),
                  bankBik: t("bankDetailsForm.bik", { ns: "profile" }),
                  bankName: t("bankDetailsForm.bankName", { ns: "profile" }),
                  bankInn: t("bankDetailsForm.inn", { ns: "profile" }),
                  viewBankDetailsLabel: t("bankDetailsForm.view", {
                    ns: "profile",
                  }),
                  updateBankDetailsLabel: t("bankDetailsForm.update", {
                    ns: "profile",
                  }),
                  submitBankDetails: t("bankDetailsForm.submit", {
                    ns: "profile",
                  }),
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
            ) : activeTab === "my-items" ? (
              <MyItemsSection
                products={allProducts}
                isLoading={isLoadingProducts}
                emptyText={t("myItems.empty", { ns: "profile" })}
                loadingText={t("myItems.loading", { ns: "profile" })}
                onEdit={(product) => {
                  setEditingProduct(product);
                  handleTabChange("add-item");
                }}
              />
            ) : activeTab === "add-item" && isSeller ? (
              <ItemForm
                onCancel={() => handleTabChange("my-items")}
                onSaved={() => {
                  setEditingProduct(undefined);
                  handleTabChange("my-items");
                }}
                initialProduct={editingProduct}
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
