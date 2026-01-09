import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { PlacedOrder } from "@/types/orderConformation";
import type { TFunction } from "i18next";

type OrdersSectionProps = {
  orders: PlacedOrder[];
  t: TFunction<"profile">;
};

export function OrdersSection({ orders, t }: OrdersSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const receiverName =
          `${order.contact?.firstName ?? ""} ${
            order.contact?.lastName ?? ""
          }`.trim() || "—";
        const createdDate = new Date(order.createdAt).toLocaleDateString();
        const itemsTotal = order.items.reduce(
          (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
          0
        );

        return (
          <details
            key={order.id}
            className="group rounded-lg border p-4 bg-card"
          >
            <summary className="cursor-pointer list-none space-y-3">
              <div className="w-full flex justify-between items-start">
                <div className="flex flex-col  gap-2 sm:gap-0">
                  <div className="flex flex-col sm:flex-row items-start gap-0 sm:gap-2 text-sm">
                    <span className="font-semibold">
                      {t("orders.number", {
                        ns: "profile",
                        id: order.id,
                        defaultValue: `№ ${order.id}`,
                      })}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {t("orders.datePrefix", {
                        ns: "profile",
                        date: createdDate,
                        defaultValue: `от ${createdDate}`,
                      })}
                    </span>
                  </div>
                  <span className="text-emerald-600 font-semibold text-sm group-open:hidden">
                    {t("orders.statusDone", { ns: "profile" })}
                  </span>
                </div>
                <div className="flex items-start gap-2 w-auto">
                  <div className="group-open:hidden text-right text-sm min-w-[110px]">
                    <div className="text-muted-foreground text-xs">
                      {t("orders.amount", { ns: "profile" })}
                    </div>
                    <div className="font-semibold">
                      ${order.grandTotal.toFixed(2)}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {order.items.length}{" "}
                      {t("orders.itemsShort", { ns: "profile" })}
                    </div>
                  </div>
                  <ChevronDown className="hidden group-open:block h-4 w-4 text-muted-foreground transition-transform rotate-180 mt-1" />
                </div>
              </div>

              <div className="group-open:hidden flex items-end justify-between gap-2">
                {order.items.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {order.items.slice(0, 6).map((item) => (
                      <div
                        key={`${order.id}-${item.product.id}-${
                          item.size ?? "default"
                        }`}
                        className="size-12 md:size-14 lg:size-16 xl:size-18 2xl:size-20 flex-shrink-0 p-0.5"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
              </div>
            </summary>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-emerald-600 font-semibold">
                      {t("orders.statusDone", { ns: "profile" })}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {createdDate}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    {t("actions.review", { ns: "profile" })}
                  </Button>
                </div>

                <div className="space-y-2 rounded-lg border p-3 bg-muted/40">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground text-xs">
                      {t("orders.seller", { ns: "profile" })}
                    </span>
                    <span className="font-medium">—</span>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border p-3">
                  <div className="font-semibold text-sm">
                    {t("orders.delivery", { ns: "profile" })}:{" "}
                    {order.deliveryMethod || "—"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("orders.deliveryAddress", { ns: "profile" })}
                  </div>
                  <div className="text-sm">
                    {order.shipping?.city || "—"},{" "}
                    {order.shipping?.address || "—"}
                  </div>
                  {order.shipping?.comment ? (
                    <p className="text-xs text-muted-foreground">
                      {t("orders.comment", { ns: "profile" })}:{" "}
                      {order.shipping.comment}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-1 rounded-lg border p-3">
                  <div className="text-muted-foreground text-xs">
                    {t("orders.receiver", { ns: "profile" })}
                  </div>
                  <div className="text-sm font-medium">{receiverName}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.contact?.phone || "—"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.contact?.email || "—"}
                  </div>
                </div>
              </div>

              <div className="space-y-7">
                <div className="space-y-3">
                  {order.items.map((item) => {
                    const productUrl = `/category/${encodeURIComponent(
                      item.product.category
                    )}/${item.product.id}?size=${encodeURIComponent(
                      item.size ?? ""
                    )}`;

                    return (
                      <div
                        key={`${order.id}-${item.product.id}-${
                          item.size ?? "default"
                        }`}
                        className="flex gap-3 items-start rounded-lg pt-2 hover:cursor-pointer"
                        onClick={() => navigate(productUrl)}
                      >
                        <div className="size-16 min-w-16 rounded-md overflow-hidden">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div className="flex-1 space-y-1 text-sm">
                          <p className="font-medium">{item.product.title}</p>
                          {item.size && (
                            <p className="text-muted-foreground text-xs">
                              {t("orders.size", { ns: "profile" })}: {item.size}
                            </p>
                          )}
                          <p className="text-muted-foreground text-xs">
                            {t("orders.qty", { ns: "profile" })}:{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-semibold">
                          $
                          {((item.product.price ?? 0) * item.quantity).toFixed(
                            2
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("orders.productsTotal", {
                        ns: "profile",
                        defaultValue: "Стоимость товаров",
                      })}
                    </span>
                    <span>{itemsTotal ? `$${itemsTotal.toFixed(2)}` : ""}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("orders.delivery", { ns: "profile" })}
                    </span>
                    <span>
                      {typeof order.deliveryCost === "number"
                        ? `$${order.deliveryCost.toFixed(2)}`
                        : ""}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold">
                    <span>{t("orders.total", { ns: "profile" })}</span>
                    <span>${order.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
