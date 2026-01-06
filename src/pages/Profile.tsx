import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/use-auth";
import { findCountryByCode } from "@/lib/country";
import { useOrdersStore } from "@/stores/use-orders";
import { Separator } from "@/components/ui/separator";

function ProfilePage() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const countryInfo = findCountryByCode(user?.country);
  const orders = useOrdersStore((state) => state.orders);

  const handleLogOut = () => {
    logout();
    navigate("/");
  };

  return (
    <section className="flex flex-col w-full items-center my-18 xl:my-19">
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
              <Link to="/profile">Profile</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full max-w-xl px-0 sm:px-4 mt-3 xl:mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAuthenticated ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="text-base font-medium">
                    {user?.username ?? "—"}
                  </p>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">First name</p>
                    <p className="text-base font-medium">
                      {user?.name?.firstname || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last name</p>
                    <p className="text-base font-medium">
                      {user?.name?.lastname || "—"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-base font-medium">{user?.email || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-base font-medium">
                    {user?.phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="text-base font-medium flex items-center gap-2">
                    {countryInfo?.emoji && (
                      <span className="text-lg leading-none">
                        {countryInfo.emoji}
                      </span>
                    )}
                    <span>{countryInfo?.name || user?.country || "—"}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="text-base font-medium">
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "—"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigate("/cart")}>
                    Go to cart
                  </Button>
                  <Button variant="destructive" onClick={handleLogOut}>
                    Logout
                  </Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Orders</p>
                  {orders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No orders yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="rounded-lg border p-3 space-y-2"
                        >
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">
                              Order #{order.id}
                            </span>
                            <span className="text-muted-foreground">
                              {new Date(order.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>{order.items.length} items</span>
                            <span className="font-semibold">
                              ${order.grandTotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Delivery: {order.deliveryMethod}, Payment:{" "}
                            {order.paymentMethod}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  You are not logged in.
                </p>
                <div className="flex gap-2">
                  <Button onClick={() => navigate("/login")}>Log in</Button>
                  <Button variant="outline" onClick={() => navigate("/signup")}>
                    Sign up
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default ProfilePage;
