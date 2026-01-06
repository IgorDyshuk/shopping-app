import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TFunction } from "i18next";
import { AnimatedNumber } from "./AnimatedNumber";

type CartTotalsProps = {
  total: number;
  t: TFunction<["cart", "common"]>;
};

export function CartTotals({ total, t }: CartTotalsProps) {
  return (
    <Card className="h-fit">
      <CardContent className="space-y-3 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{t("total")}</h1>
          <AnimatedNumber value={total} className="text-xl font-normal" />
        </div>
        <Button className="w-full" asChild>
          <Link to="/order/confirmation">{t("checkout")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
