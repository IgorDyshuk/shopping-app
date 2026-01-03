import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Plus, Minus, Heart, Trash2 } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/use-cart";
import { Toggle } from "@/components/ui/toggle";
import { useFavoritesStore } from "@/stores/use-favorites";

function AnimatedNumber({
  value,
  formatter = (v: number) => `${v.toFixed(2)}$`,
  className,
}: {
  value: number;
  formatter?: (v: number) => string;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const start = previous.current;
    const delta = value - start;
    const duration = 320;
    let frame: number;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplay(start + delta * progress);
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        previous.current = value;
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span className={className}>{formatter(display)}</span>;
}

function CartPage() {
  const { t } = useTranslation("common");
  const { items, addItem, removeItem, removeLine, clear } = useCartStore();
  const { ids: favoriteIds, toggle: toggleFavoriteId } = useFavoritesStore();

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
        0
      ),
    [items]
  );

  return (
    <section className="w-full my-18 xl:my-20 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">{t("breadcrumb.home")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{t("cart.title")}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">{t("cart.title")}</h1>
        </div>

        {items.length === 0 ? (
          <p className="text-muted-foreground">{t("cart.empty")}</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[3fr_1fr] items-start">
            <Card className="rounded-md py-0 font-normal h-fit">
              <CardContent className="p-0">
                <table className="w-full">
                  <tbody className="divide-y">
                    {items.map(({ product, quantity }) => (
                      <tr
                        key={product.id}
                        className="align-top grid grid-cols-[1fr_auto] gap-3 sm:table-row"
                      >
                        <td className="pt-5 sm:py-5 pl-5 sm:px-5 order-1 sm:order-0 sm:table-cell w-full">
                          <div className="flex items-start gap-5">
                            <div className="h-22 md:h-25 w-22 md:w-25 my-0 sm:my-2 rounded-md shrink-0 flex items-center justify-center overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="line-clamp-2">
                                {product.title}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-1 sm:py-5 px-5 xl:px-10 2xl:px-20 order-3 sm:order-0 sm:table-cell">
                          <div className="flex flex-col items-start sm:items-center  gap-0.5">
                            <div className="flex items-center gap-1 bg-muted rounded-sm font-semibold ">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(product.id)}
                                className="p-0"
                              >
                                <Minus className="size-4" strokeWidth={3} />
                              </Button>
                              <span className="text-center text-sm min-w-3">
                                {quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => addItem(product, 1)}
                                className="p-0"
                              >
                                <Plus className="size-4" strokeWidth={3} />
                              </Button>
                            </div>
                            <span className="text-xs text-muted-foreground block px-1 sm:px-0">
                              {product.price?.toFixed(2)} $/item
                            </span>
                          </div>
                        </td>
                        <td className="py-0 sm:py-5 pr-5 sm:px-5 order-4 sm:order-0 sm:table-cell text-right sm:text-left justify-self-end sm:justify-self-auto">
                          <AnimatedNumber
                            value={(product.price ?? 0) * quantity}
                            className="font-normal whitespace-nowrap"
                          />
                        </td>
                        <td className="pt-5 sm:py-5 pr-3 sm:px-3 order-2 sm:order-0 sm:table-cell justify-self-end sm:justify-self-auto">
                          <div className="flex flex-col items-center gap-2">
                            <button
                              onClick={() => removeLine(product.id)}
                              title={t("cart.removeItem")}
                              className="flex items-center justify-center hover:cursor-pointer text-muted-foreground hover:text-foreground transition-colors duration-150"
                            >
                              <Trash2 className="size-5" />
                            </button>
                            <Toggle
                              aria-label={
                                favoriteIds.includes(product.id)
                                  ? t("favorites.removed")
                                  : t("favorites.added")
                              }
                              pressed={favoriteIds.includes(product.id)}
                              onPressedChange={() =>
                                toggleFavoriteId(product.id)
                              }
                              className="hover:cursor-pointer text-muted-foreground hover:text-foreground hover:bg-chart-1 data-[state=on]:bg-rose-100 data-[state=on]:text-rose-600 transition-colors duration-150"
                            >
                              <Heart className="size-5" />
                            </Toggle>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-1">
              <Card className="h-fit">
                <CardContent className="space-y-3 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl">{t("cart.total")}</h1>
                    <AnimatedNumber
                      value={total}
                      className="text-xl font-normal"
                    />
                  </div>
                  <Button className="w-full" disabled>
                    {t("cart.checkout")}
                  </Button>
                </CardContent>
              </Card>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs"
                onClick={clear}
              >
                <X className="size-3" />
                {t("cart.clear")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CartPage;
