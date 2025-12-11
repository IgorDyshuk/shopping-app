export const CATALOG_CATEGORIES = {
  men: "men's clothing",
  women: "women's clothing",
  clothing: "clothing",
  electronics: "electronics",
  jewelery: "jewelery",
} as const;

export type CatalogCategoryKey = keyof typeof CATALOG_CATEGORIES;
