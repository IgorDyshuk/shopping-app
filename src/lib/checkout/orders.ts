import type { CartItem } from "@/stores/use-cart";
import type { CheckoutOrder } from "@/types/orderConformation";
import { type TFunction } from "i18next";

export const buildOrders = (
  items: CartItem[],
  t: TFunction<"checkout">,
  sellerFallback?: string
): CheckoutOrder[] => {
  if (!items.length) return [];

  // Placeholder grouping: single seller until product has seller metadata
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
    0
  );

  return [
    {
      id: 1,
      sellerName:
        sellerFallback || t("order.seller", { ns: "checkout" }) || "Seller",
      items,
      subtotal,
    },
  ];
};
