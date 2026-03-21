import { api } from "./client";
import axios from "axios";
import { API_CONFIG } from "@/lib/apiConfig";
import type {
  Product,
  ProductCreatePayload,
  ProductCreateResponse,
  ProductUpdatePayload,
} from "@/types/product";

const basePath = "/products";
const getIdentityProductUrl = () => API_CONFIG.buildIdentityUrl(basePath);
const catalogBase = API_CONFIG.catalogBaseURL.replace(/\/+$/, "");
const getCatalogProductUrl = (path = "") => `${catalogBase}${basePath}${path}`;
const identityRequestConfig = API_CONFIG.identityRequestConfig;

const toNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
};

const toString = (value: unknown) => (typeof value === "string" ? value : "");

const extractImageUrls = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (typeof entry === "string") return entry;
      if (
        entry &&
        typeof entry === "object" &&
        typeof (entry as { url?: unknown }).url === "string"
      ) {
        return (entry as { url: string }).url;
      }
      return "";
    })
    .filter(Boolean);
};

const normalizeCategory = (value: unknown) => {
  if (typeof value === "string" && value.trim()) return value;
  if (value && typeof value === "object") {
    const category = value as {
      main_category?: unknown;
      sub_category?: unknown;
      name?: unknown;
    };
    if (
      typeof category.main_category === "string" &&
      category.main_category.trim()
    ) {
      return category.main_category;
    }
    if (typeof category.sub_category === "string" && category.sub_category.trim()) {
      return category.sub_category;
    }
    if (typeof category.name === "string" && category.name.trim()) {
      return category.name;
    }
  }
  return "unknown";
};

const normalizeProduct = (
  raw: unknown,
  fallbackId: number,
): Product | null => {
  if (!raw || typeof raw !== "object") return null;
  const source = raw as Record<string, unknown>;
  const images = extractImageUrls(source.images);
  const image =
    (typeof source.image === "string" && source.image.trim()) ||
    images[0] ||
    "";
  const rawRating = source.rating;
  const rating =
    rawRating && typeof rawRating === "object"
      ? {
          rate: toNumber((rawRating as { rate?: unknown }).rate),
          count: toNumber((rawRating as { count?: unknown }).count),
        }
      : undefined;

  return {
    id: toNumber(source.id) || fallbackId,
    title: toString(source.title) || "Untitled",
    price: toNumber(source.price),
    description: toString(source.description),
    category: normalizeCategory(source.category),
    image,
    ...(images.length ? { images } : {}),
    ...(rating ? { rating } : {}),
  };
};

const extractProductList = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const container = payload as Record<string, unknown>;
    const list = container.items ?? container.products ?? container.results ?? container.data;
    if (Array.isArray(list)) return list;
  }
  return [];
};

export const productApi = {
  list: async () =>
    axios
      .get<unknown>(getCatalogProductUrl(), {
        timeout: API_CONFIG.timeoutMs,
      })
      .then((res) =>
        extractProductList(res.data)
          .map((item, index) => normalizeProduct(item, index + 1))
          .filter((item): item is Product => Boolean(item)),
      ),
  getById: async (id: number) =>
    axios
      .get<unknown>(getCatalogProductUrl(`/${id}`), {
        timeout: API_CONFIG.timeoutMs,
      })
      .then((res) => {
        const normalized = normalizeProduct(res.data, id);
        if (!normalized) {
          throw new Error("Invalid product response");
        }
        return normalized;
      }),
  create: async (payload: ProductCreatePayload) =>
    api
      .post<ProductCreateResponse>(getIdentityProductUrl(), payload, {
        ...identityRequestConfig,
        headers: {
          ...API_CONFIG.identityHeaders,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data),
  update: async ({ id, ...payload }: ProductUpdatePayload) =>
    api
      .put<Product>(`${getIdentityProductUrl()}/${id}`, payload, {
        ...identityRequestConfig,
        headers: API_CONFIG.identityHeaders,
      })
      .then((res) => res.data),
  remove: async (id: string | number) =>
    api
      .delete<Product>(`${getIdentityProductUrl()}/${id}`, {
        ...identityRequestConfig,
        headers: API_CONFIG.identityHeaders,
      })
      .then((res) => res.data),
};
