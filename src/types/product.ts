export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  images?: string[];
  // fakestore often includes rating; keep optional to stay compatible
  rating?: {
    rate: number;
    count: number;
  };
};

export type ProductImagePayload = {
  url: string;
  alt: string;
};

export type ProductCategoryPayload = {
  main_category: string;
  sub_category: string;
};

export type ProductState = "new" | "used";

export type ProductCharacteristicsPayload = {
  brand: string;
  state: ProductState;
  material: string;
  size: string[];
  quantity: number;
  is_new_arrival: boolean;
};

export type ProductCreatePayload = {
  title: string;
  description: string;
  price: number;
  images: ProductImagePayload[];
  category: ProductCategoryPayload;
  characteristics: ProductCharacteristicsPayload;
};

export type ProductCreateResponse = ProductCreatePayload & {
  id: string;
  seller_id: string;
  rating: {
    rate: number;
    count: number;
  };
};

export type ProductUpdatePayload = Partial<ProductCreatePayload> & {
  id: string | number;
};
