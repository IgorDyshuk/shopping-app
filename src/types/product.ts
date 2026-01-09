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

export type ProductCreatePayload = Omit<Product, "id" | "rating">;
export type ProductUpdatePayload = Partial<ProductCreatePayload> & {
  id: number;
};
