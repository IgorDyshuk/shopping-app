import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

type SuccessDialogProps = {
  open: boolean;
  grandTotal: number;
  deliveryLabels: string[];
  paymentLabels: string[];
  email: string;
  onClose: (open: boolean) => void;
  onContinueShopping: () => void;
  onViewCart: () => void;
};

export function SuccessDialog({
  open,
  grandTotal,
  deliveryLabels,
  paymentLabels,
  email,
  onClose,
  onContinueShopping,
  onViewCart,
}: SuccessDialogProps) {
  const { t } = useTranslation(["checkout"]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("success.title", { ns: "checkout" })}</DialogTitle>
          <DialogDescription>
            {t("success.desc", {
              ns: "checkout",
              email,
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <span>{t("summary.toPay", { ns: "checkout" })}</span>
            <span className="font-semibold">${grandTotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>{t("delivery.title", { ns: "checkout" })}</span>
            <span>{deliveryLabels.join(", ")}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>{t("payment.title", { ns: "checkout" })}</span>
            <span>{paymentLabels.join(", ")}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onViewCart}>
            {t("viewOrders", { ns: "checkout", defaultValue: "View orders" })}
          </Button>
          <Button onClick={onContinueShopping}>
            {t("continueShopping", { ns: "checkout" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
