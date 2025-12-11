import type { Product } from "@/types/product";

const OUTERWEAR_KEYWORDS = [
  "jacket",
  "coat",
  "parka",
  "rain",
  "windbreaker",
  "snowboard",
  "biker",
  "hooded faux",
];

const LONG_SLEEVES_KEYWORDS = [
  "long sleeve",
  "sweatshirt",
  "hoodie",
  "henley",
  "pullover",
  "sweater",
];

const TEES_KEYWORDS = [
  "t-shirt",
  "tee",
  "short sleeve",
  "top",
  "v-neck",
  "tank",
];

const BOTTOMS_KEYWORDS = ["pant", "short", "jean", "trouser"];

const haystackFromProduct = (product: Product) =>
  `${product.title} ${product.description}`.toLowerCase();

const matchesKeywords = (haystack: string, keywords: string[]) =>
  keywords.some((word) => haystack.includes(word));

export const deriveClothingSubcategory = (
  product: Product
): string | undefined => {
  const haystack = haystackFromProduct(product);

  if (matchesKeywords(haystack, OUTERWEAR_KEYWORDS)) return "outerwear";
  if (matchesKeywords(haystack, LONG_SLEEVES_KEYWORDS)) return "long-sleeves";
  if (matchesKeywords(haystack, TEES_KEYWORDS)) return "tees";
  if (matchesKeywords(haystack, BOTTOMS_KEYWORDS)) return "bottoms";

  return undefined;
};

export const deriveCategoryId = (product: Product): string => {
  const base = product.category?.toLowerCase() ?? "";

  if (base.includes("cloth")) {
    return deriveClothingSubcategory(product) ?? base;
  }

  return base || "other";
};
