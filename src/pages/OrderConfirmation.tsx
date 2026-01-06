import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCartStore } from "@/stores/use-cart";
import { useAuthStore } from "@/stores/use-auth";
import { useOrdersStore } from "@/stores/use-orders";
import { findCountryByCode } from "@/lib/country";
import { LoginForm } from "@/components/login-form";
import { ContactDetailsCard } from "@/components/pages/OrderConfirmation/ContactDetailsCard";
import { OrderCard } from "@/components/pages/OrderConfirmation/OrderCard";
import { SummaryCard } from "@/components/pages/OrderConfirmation/SummaryCard";
import { SuccessDialog } from "@/components/pages/OrderConfirmation/SuccessDialog";
import type {
  DeliveryId,
  OrderFormState,
  PaymentId,
} from "@/types/orderConformation";
import { buildOrders } from "@/lib/checkout/orders";

const deliveryOptions: { id: DeliveryId; price: number }[] = [
  { id: "pickup", price: 0 },
  { id: "courier", price: 12 },
  { id: "post", price: 8 },
];

const paymentOptions: { id: PaymentId }[] = [
  { id: "cod" },
  { id: "card" },
  { id: "invoice" },
];

const defaultOrderForm = (): OrderFormState => ({
  delivery: deliveryOptions[0].id,
  city: "Kyiv",
  address: "",
  comment: "",
  payment: paymentOptions[0].id,
  promo: "",
});

function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(["checkout", "common"]);
  const { items, totalCount, clear } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const addOrder = useOrdersStore((state) => state.addOrder);

  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const parsePhone = (value?: string) => {
    const match = value?.match(/^(\+\d+)\s*(.*)$/);
    return {
      code: match?.[1] ?? "+380",
      number: match?.[2]?.replace(/\D/g, "") ?? "",
    };
  };
  const parsedPhone = parsePhone(user?.phone);

  const [countryCode, setCountryCode] = useState(parsedPhone.code);
  const [phoneNumber, setPhoneNumber] = useState(parsedPhone.number);
  const [email, setEmail] = useState(user?.email ?? "");
  const [firstName, setFirstName] = useState(
    user?.name?.firstname ?? user?.username ?? ""
  );
  const [lastName, setLastName] = useState(user?.name?.lastname ?? "");
  const [showSuccess, setShowSuccess] = useState(false);
  const orders = useMemo(
    () => buildOrders(items, t, t("order.seller", { ns: "checkout" })),
    [items, t]
  );
  const [orderForms, setOrderForms] = useState<Record<number, OrderFormState>>(
    {}
  );
  useEffect(() => {
    setOrderForms((prev) => {
      const next = { ...prev };
      orders.forEach((order) => {
        if (!next[order.id]) {
          next[order.id] = defaultOrderForm();
        }
      });
      Object.keys(next).forEach((id) => {
        const numericId = Number(id);
        if (!orders.find((o) => o.id === numericId)) {
          delete next[numericId];
        }
      });
      return next;
    });
  }, [orders]);
  const selectedCountry = findCountryByCode(countryCode) ?? {
    dial_code: countryCode,
    emoji: "",
    code: "",
    name: "",
  };

  const itemsTotal = useMemo(
    () => orders.reduce((sum, order) => sum + order.subtotal, 0),
    [orders]
  );

  const getDeliveryPrice = (id: DeliveryId) =>
    deliveryOptions.find((opt) => opt.id === id)?.price ?? 0;

  const deliveryCostTotal = useMemo(
    () =>
      orders.reduce((sum, order) => {
        const form = orderForms[order.id] ?? defaultOrderForm();
        return sum + getDeliveryPrice(form.delivery);
      }, 0),
    [orderForms, orders]
  );

  const grandTotal = itemsTotal + deliveryCostTotal;
  const formatLocalPhone = (digits: string) => {
    const clean = digits.replace(/\D/g, "");
    const parts: string[] = [];
    if (clean.length > 0) parts.push(clean.slice(0, 2));
    if (clean.length > 2) parts.push(clean.slice(2, 5));
    if (clean.length > 5) parts.push(clean.slice(5, 7));
    if (clean.length > 7) parts.push(clean.slice(7, 9));
    return parts.join(" ");
  };

  const getDeliveryLabel = (id: (typeof deliveryOptions)[number]["id"]) =>
    t(`delivery.options.${id}`, {
      ns: "checkout",
      defaultValue: id,
    });

  const getPaymentLabel = (id: (typeof paymentOptions)[number]["id"]) =>
    t(`payment.${id}`, {
      ns: "checkout",
      defaultValue: id,
    });

  const updateOrderForm = (
    orderId: number,
    updater: (prev: OrderFormState) => OrderFormState
  ) => {
    setOrderForms((prev) => {
      const current = prev[orderId] ?? defaultOrderForm();
      return { ...prev, [orderId]: updater(current) };
    });
  };

  const missingFields = useMemo(() => {
    if (!isAuthenticated) return [];
    const fields: { label: string; filled: boolean }[] = [
      {
        label: t("contact.phone", { ns: "checkout" }),
        filled: !!phoneNumber.trim(),
      },
      { label: t("contact.email", { ns: "checkout" }), filled: !!email.trim() },
      {
        label: t("contact.firstName", { ns: "checkout" }),
        filled: !!firstName.trim(),
      },
      {
        label: t("contact.lastName", { ns: "checkout" }),
        filled: !!lastName.trim(),
      },
    ];

    orders.forEach((order, idx) => {
      const form = orderForms[order.id] ?? defaultOrderForm();
      const orderLabel = t("order.title", {
        ns: "checkout",
        num: idx + 1,
        defaultValue: `Order #${idx + 1}`,
      });
      fields.push(
        {
          label: `${orderLabel}: ${t("delivery.city", { ns: "checkout" })}`,
          filled: !!form.city.trim(),
        },
        {
          label: `${orderLabel}: ${t("delivery.address", { ns: "checkout" })}`,
          filled: !!form.address.trim(),
        }
      );
    });

    return fields.filter((f) => !f.filled).map((f) => f.label);
  }, [
    email,
    firstName,
    isAuthenticated,
    lastName,
    orderForms,
    orders,
    phoneNumber,
    t,
  ]);

  const canConfirm = isAuthenticated && missingFields.length === 0;

  const handleConfirm = () => {
    orders.forEach((order) => {
      const form = orderForms[order.id] ?? defaultOrderForm();
      const orderDeliveryPrice = getDeliveryPrice(form.delivery);
      addOrder({
        items: order.items,
        grandTotal: order.subtotal + orderDeliveryPrice,
        deliveryMethod: form.delivery,
        paymentMethod: form.payment,
        contact: {
          email,
          phone: `${countryCode} ${formatLocalPhone(phoneNumber)}`,
          firstName,
          lastName,
          countryCode,
        },
        shipping: {
          city: form.city,
          address: form.address,
          comment: form.comment,
        },
        promo: form.promo || undefined,
      });
    });

    setShowSuccess(true);
  };

  const handleContinueShopping = () => {
    setShowSuccess(false);
    clear();
    navigate("/");
  };

  const handleViewCart = () => {
    setShowSuccess(false);
    clear();
    navigate("/cart");
  };

  return (
    <section className="flex flex-col w-full items-start my-18 xl:my-19">
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
              <Link to="/cart">
                {t("breadcrumb.cart", { ns: "common", defaultValue: "Cart" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/order/confirmation">
                {t("title", { ns: "checkout" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full mt-4 xl:mt-6 grid gap-4 lg:grid-cols-[2fr_1fr] items-start">
        <div className="space-y-4">
          {isAuthenticated ? (
            <ContactDetailsCard
              countryCode={countryCode}
              selectedCountry={selectedCountry}
              phoneNumber={phoneNumber}
              email={email}
              firstName={firstName}
              lastName={lastName}
              formatLocalPhone={formatLocalPhone}
              onCountryChange={setCountryCode}
              onPhoneChange={setPhoneNumber}
              onEmailChange={setEmail}
              onFirstNameChange={setFirstName}
              onLastNameChange={setLastName}
              phoneInputRef={phoneInputRef}
            />
          ) : (
            <div className="w-full flex justify-center border rounded-lg">
              <LoginForm
                className="w-full max-w-lg"
                isPage
                titleOverride={t("loginForCheckout", {
                  ns: "checkout",
                  defaultValue: "Log in to place your order",
                })}
              />
            </div>
          )}

          {orders.map((order) => {
            const form = orderForms[order.id] ?? defaultOrderForm();
            return (
              <OrderCard
                key={order.id}
                order={order}
                form={form}
                deliveryOptions={deliveryOptions}
                paymentOptions={paymentOptions}
                getDeliveryLabel={getDeliveryLabel}
                getPaymentLabel={getPaymentLabel}
                onFormChange={(next) => updateOrderForm(order.id, () => next)}
              />
            );
          })}
        </div>

        <SummaryCard
          totalCount={totalCount}
          itemsTotal={itemsTotal}
          deliveryCostTotal={deliveryCostTotal}
          grandTotal={grandTotal}
          canConfirm={!!items.length && canConfirm}
          isAuthenticated={isAuthenticated}
          missingFields={missingFields}
          onConfirm={handleConfirm}
        />
      </div>
      <SuccessDialog
        open={showSuccess}
        onClose={setShowSuccess}
        grandTotal={grandTotal}
        deliveryLabels={orders.map((order) =>
          getDeliveryLabel(
            (orderForms[order.id] ?? defaultOrderForm()).delivery
          )
        )}
        paymentLabels={orders.map((order) =>
          getPaymentLabel((orderForms[order.id] ?? defaultOrderForm()).payment)
        )}
        email={email || user?.email || ""}
        onContinueShopping={handleContinueShopping}
        onViewCart={handleViewCart}
      />
    </section>
  );
}

export default OrderConfirmationPage;
