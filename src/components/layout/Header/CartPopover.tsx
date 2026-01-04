import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/use-cart";
import { useMediaQuery } from "@/hooks/media-hooks/use-media-query";
import { toast } from "sonner";

export function CartPopover() {
  const navigate = useNavigate();
  const { t } = useTranslation(["cart", "common"]);
  const items = useCartStore((state) => state.items);
  const removeLine = useCartStore((state) => state.removeLine);
  const cartCount = items.length;
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const isBelowSm = useMediaQuery("(max-width: 639px)");

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  const handleOpen = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
        0
      ),
    [items]
  );

  useEffect(() => clearCloseTimer, []);

  if (isBelowSm) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Cart"
        className="relative"
        onClick={() => navigate("/cart")}
      >
        <ShoppingCart className="size-5" />
        {cartCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 min-w-4.5 h-4.5 rounded-full bg-primary text-primary-foreground text-[9px] leading-none flex items-center justify-center px-1">
            {cartCount}
          </span>
        )}
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Cart"
          className="relative"
          onClick={() => navigate("/cart")}
          onMouseEnter={handleOpen}
          onMouseLeave={scheduleClose}
        >
          <ShoppingCart className="size-5" />
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 min-w-4.5 h-4.5 rounded-full bg-primary text-primary-foreground text-[9px] leading-none flex items-center justify-center px-1">
              {cartCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-96 p-0 shadow-xl"
        sideOffset={12}
        onMouseEnter={handleOpen}
        onMouseLeave={scheduleClose}
      >
        {items.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">{t("empty")}</div>
        ) : (
          <div className="flex flex-col gap-0 shadow-2xl">
            <ul className="max-h-96 overflow-auto">
              {items.map(({ product, quantity, size }) => (
                <li
                  key={`${product.id}-${size ?? "default"}`}
                  className="p-2.5"
                >
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/category/${encodeURIComponent(product.category)}/${
                        product.id
                      }?size=${encodeURIComponent(size ?? "")}`}
                      className="h-14 w-14 rounded-md flex items-center justify-center overflow-hidden shrink-0"
                      onClick={() => setOpen(false)}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-contain"
                      />
                    </Link>
                    <div className="flex flex-col gap-1 min-w-0 flex-1 justify-center">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <span>{(product.price ?? 0).toFixed(2)}$</span>
                        {quantity > 1 && (
                          <span className="text-xs text-muted-foreground">
                            × {quantity}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/category/${encodeURIComponent(
                          product.category
                        )}/${product.id}?size=${encodeURIComponent(
                          size ?? ""
                        )}`}
                        className="text-sm line-clamp-2 hover:text-primary"
                        onClick={() => setOpen(false)}
                      >
                        {product.title}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {size ? `${t("size")}: ${size}` : t("sizeUnknown")}
                      </span>
                    </div>
                    <button
                      className="flex items-center justify-center hover:cursor-pointer text-muted-foreground hover:text-foreground transition-colors duration-150"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeLine(product.id, size);
                        toast.message(t("removed"), {
                          description: product.title,
                        });
                      }}
                      title={t("removeItem")}
                    >
                      <Trash2 className="size-4.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <Separator className="my-1" />

            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-base font-semibold">{t("total")}</span>
              <span className="text-lg font-semibold">{total.toFixed(2)}$</span>
            </div>
            <div className="px-3 pb-3">
              <Button
                className="w-full"
                onClick={() => {
                  setOpen(false);
                  navigate("/cart");
                }}
              >
                {t("goToCart")}
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
