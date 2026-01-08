import type { CartItem } from "@/stores/use-cart";

export type DeliveryId = "pickup" | "courier" | "post";
export type PaymentId = "cod" | "card" | "invoice";

export type OrderFormState = {
  delivery: DeliveryId;
  city: string;
  address: string;
  comment: string;
  payment: PaymentId;
  promo: string;
};

export type CheckoutOrder = {
  id: number;
  sellerName: string;
  items: CartItem[];
  subtotal: number;
};

export type PlacedOrder = {
  id: number;
  createdAt: string;
  items: CartItem[];
  grandTotal: number;
  deliveryMethod: DeliveryId;
  deliveryCost?: number;
  paymentMethod: PaymentId;
  contact: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    countryCode: string;
  };
  shipping: {
    city: string;
    address: string;
    comment?: string;
  };
  promo?: string;
};
