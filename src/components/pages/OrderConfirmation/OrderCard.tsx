import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { OrderFormState } from "../../../types/orderConformation";
import type {
  CheckoutOrder,
  DeliveryId,
  PaymentId,
} from "../../../types/orderConformation";

type OrderCardProps = {
  order: CheckoutOrder;
  form: OrderFormState;
  deliveryOptions: { id: DeliveryId; price: number }[];
  paymentOptions: { id: PaymentId }[];
  getDeliveryLabel: (id: DeliveryId) => string;
  getPaymentLabel: (id: PaymentId) => string;
  onFormChange: (next: OrderFormState) => void;
};

export function OrderCard({
  order,
  form,
  deliveryOptions,
  paymentOptions,
  getDeliveryLabel,
  getPaymentLabel,
  onFormChange,
}: OrderCardProps) {
  const { t } = useTranslation(["checkout"]);

  return (
    <Card className="gap-8 sm:gap-10">
      <div className="space-y-2">
        <CardHeader>
          <CardTitle className="py-0">
            <div className="flex justify-between items-start font-light text-sm">
              <div className="flex flex-col gap-1 ">
                <span className="text-lg font-bold">
                  {t("order.title", { ns: "checkout", num: order.id })}
                </span>
                {t("order.seller", { ns: "checkout" })}: {order.sellerName}
              </div>
              <div className="flex flex-col items-end">
                <span>{t("order.sumLabel", { ns: "checkout" })}:</span>
                <span className="font-medium">
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("order.empty", { ns: "checkout" })}
            </p>
          ) : (
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li
                  key={`${item.product.id}-${item.size ?? "default"}`}
                  className="flex justify-between gap-3 rounded-md py-2 text-sm"
                >
                  <div className="flex gap-3">
                    <div className="size-16 min-w-16 overflow-hidden rounded-md">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{item.product.title}</p>
                      {item.size && (
                        <p className="text-muted-foreground text-xs">
                          {t("order.size", {
                            ns: "checkout",
                            defaultValue: "Size",
                          })}
                          : {item.size}
                        </p>
                      )}
                      <p className="text-muted-foreground text-xs">
                        {t("order.qty", {
                          ns: "checkout",
                          defaultValue: "Qty",
                        })}
                        : {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Button variant="outline" className="w-full" asChild>
            <Link to="/cart">{t("order.edit", { ns: "checkout" })}</Link>
          </Button>
        </CardContent>
      </div>

      <div className="space-y-2">
        <CardHeader className="border-b-0">
          <CardTitle>{t("delivery.title", { ns: "checkout" })}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {deliveryOptions.map((opt) => (
              <Button
                key={opt.id}
                variant={form.delivery === opt.id ? "default" : "outline"}
                onClick={() => onFormChange({ ...form, delivery: opt.id })}
                className={cn(
                  "justify-between",
                  form.delivery === opt.id && "text-primary-foreground"
                )}
              >
                <span>{getDeliveryLabel(opt.id)}</span>
                <span
                  className={cn(
                    "ml-2 text-xs",
                    form.delivery === opt.id
                      ? "text-primary-foreground/90"
                      : "text-muted-foreground"
                  )}
                >
                  {opt.price
                    ? `$${opt.price}`
                    : t("delivery.free", { ns: "checkout" })}
                </span>
              </Button>
            ))}
          </div>
          <Separator />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {t("delivery.city", { ns: "checkout" })}
              </p>
              <Input
                value={form.city}
                onChange={(e) =>
                  onFormChange({ ...form, city: e.target.value })
                }
                placeholder={t("delivery.cityPlaceholder", {
                  ns: "checkout",
                  defaultValue: "City",
                })}
                required
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {t("delivery.address", { ns: "checkout" })}
              </p>
              <Input
                value={form.address}
                onChange={(e) =>
                  onFormChange({ ...form, address: e.target.value })
                }
                placeholder={t("delivery.addressPlaceholder", {
                  ns: "checkout",
                  defaultValue: "Street, house, apt",
                })}
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {t("delivery.comment", { ns: "checkout" })}
            </p>
            <Textarea
              value={form.comment}
              onChange={(e) =>
                onFormChange({ ...form, comment: e.target.value })
              }
              placeholder={t("delivery.commentPlaceholder", {
                ns: "checkout",
                defaultValue: "Entrance, floor, delivery window...",
              })}
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </div>

      <div className="space-y-2">
        <CardHeader>
          <CardTitle>{t("payment.title", { ns: "checkout" })}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {paymentOptions.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 rounded-md border p-3 hover:border-primary cursor-pointer"
            >
              <input
                type="radio"
                name={`payment-${order.id}`}
                value={opt.id}
                checked={form.payment === opt.id}
                onChange={() => onFormChange({ ...form, payment: opt.id })}
                className="accent-primary"
              />
              <span className="text-sm">{getPaymentLabel(opt.id)}</span>
            </label>
          ))}
        </CardContent>
      </div>

      <div className="space-y-2">
        <CardHeader>
          <CardTitle>{t("promo.title", { ns: "checkout" })}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={form.promo}
            onChange={(e) => onFormChange({ ...form, promo: e.target.value })}
            placeholder={t("promo.placeholder", { ns: "checkout" })}
            className="sm:flex-1"
          />
          <Button variant="outline" className="sm:w-fit">
            {t("promo.apply", { ns: "checkout" })}
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
