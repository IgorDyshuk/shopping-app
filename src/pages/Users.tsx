import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useUsers } from "@/hooks/api-hooks/useUsers";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function UsersPage() {
  const { t } = useTranslation("common");
  const { data, isLoading, isError } = useUsers();

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
              <Link to="/users">{t("usersPage.title", { ns: "common" })}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full max-w-5xl px-0 sm:px-4 mt-3 xl:mt-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("usersPage.title", { ns: "common" })}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("usersPage.description", { ns: "common" })}
            </p>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <p className="text-sm text-muted-foreground">
                {t("usersPage.loading", { ns: "common" })}
              </p>
            )}
            {isError && (
              <p className="text-sm text-destructive">
                {t("usersPage.error", { ns: "common" })}
              </p>
            )}
            {data && data.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4 font-medium">
                        {t("usersPage.id", { ns: "common" })}
                      </th>
                      <th className="py-2 pr-4 font-medium">
                        {t("usersPage.username", { ns: "common" })}
                      </th>
                      <th className="py-2 pr-4 font-medium">
                        {t("usersPage.email", { ns: "common" })}
                      </th>
                      <th className="py-2 pr-4 font-medium">
                        {t("usersPage.password", { ns: "common" })}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((user) => (
                      <tr key={user.id} className="border-b last:border-0">
                        <td className="py-2 pr-4">{user.id}</td>
                        <td className="py-2 pr-4">{user.username}</td>
                        <td className="py-2 pr-4">{user.email}</td>
                        <td className="py-2 pr-4">
                          {user.password ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {data && data.length === 0 && !isLoading && !isError && (
              <p className="text-sm text-muted-foreground">
                {t("usersPage.description", { ns: "common" })}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default UsersPage;
