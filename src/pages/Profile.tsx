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

function ProfilePage() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

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
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-base font-medium">{user?.email || "—"}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigate("/cart")}>
                    Go to cart
                  </Button>
                  <Button variant="destructive" onClick={handleLogOut}>
                    Logout
                  </Button>
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
