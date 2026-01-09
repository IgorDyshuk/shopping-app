import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type SummaryCardProps = {
  totalCount: number;
  itemsTotal: number;
  deliveryCostTotal: number;
  grandTotal: number;
  isAuthenticated: boolean;
  missingFields: string[];
  onConfirm: () => void;
};

export function SummaryCard({
  totalCount,
  itemsTotal,
  deliveryCostTotal,
  grandTotal,
  isAuthenticated,
  missingFields,
  onConfirm,
}: SummaryCardProps) {
  const { t } = useTranslation(["checkout"]);
  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error(
        t("loginForCheckout", {
          ns: "checkout",
          defaultValue: "Log in to place your order.",
        })
      );
      return;
    }
    if (missingFields.length) {
      toast.error(
        t("summary.fillFields", {
          ns: "checkout",
          defaultValue: "Fill required fields: {{fields}}",
          fields: missingFields.join(", "),
        })
      );
      return;
    }
    onConfirm();
  };

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-xl">
          {t("summary.title", { ns: "checkout" })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span>
            {t("summary.productsWorth", {
              ns: "checkout",
              count: totalCount,
            })}
          </span>
          <span>${itemsTotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>{t("summary.deliveryCost", { ns: "checkout" })}</span>
          <span>
            {deliveryCostTotal
              ? `$${deliveryCostTotal.toFixed(2)}`
              : t("delivery.free", { ns: "checkout" })}
          </span>
        </div>
        <Separator />
        <div className="flex items-center justify-between text-md">
          <span className="text-muted-foreground">
            {t("summary.toPay", { ns: "checkout" })}
          </span>
          <span className="font-semibold">${grandTotal.toFixed(2)}</span>
        </div>
        <Button
          className="w-full mt-2"
          size="lg"
          onClick={handleClick}
          disabled={!totalCount}
        >
          {t("summary.confirm", { ns: "checkout" })}
        </Button>
        <p className="text-xs text-muted-foreground">
          {t("summary.disclaimer", { ns: "checkout" })}
        </p>
      </CardContent>
    </Card>
  );
}
