import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  presetCategoryOptions,
  defaultSizeOptions,
  sneakerSizeOptions,
  accessorySizeOptions,
} from "@/constants/filters-presets";
import { useCreateProduct } from "@/hooks/api-hooks/useProducts";
import { ChevronDown } from "lucide-react";
import type { Product, ProductCreatePayload } from "@/types/product";

type ItemFormProps = {
  onCancel: () => void;
  onSaved?: () => void;
  initialProduct?: Product;
};

type ProductDraft = {
  title: string;
  price: number | "";
  description: string;
  existingImages: string[];
  category: {
    mainCategory: string;
    subCategory: string;
  };
  gender?: string;
  characteristics: {
    brand: string;
    state: "" | "new" | "used";
    material: string;
    sizes: string[];
    quantity: number | "";
    isNewArrival: boolean;
  };
};

const createDefaultDraft = (): ProductDraft => ({
  title: "",
  price: "",
  description: "",
  existingImages: [],
  category: { mainCategory: "", subCategory: "" },
  gender: "",
  characteristics: {
    brand: "",
    state: "",
    material: "",
    sizes: [],
    quantity: "",
    isNewArrival: true,
  },
});

const isValidImageUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; detail?: unknown }
      | undefined;
    if (Array.isArray(data?.detail)) {
      const detailMessage = data.detail
        .map((entry) =>
          entry && typeof entry === "object" && "msg" in entry
            ? String((entry as { msg?: unknown }).msg ?? "")
            : "",
        )
        .filter(Boolean)
        .join("; ");
      if (detailMessage) return detailMessage;
    }
    if (typeof data?.detail === "string" && data.detail.trim()) {
      return data.detail;
    }
    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }
    return error.message || "Failed to create product";
  }
  if (error instanceof Error && error.message) return error.message;
  return "Failed to create product";
};

export function ItemForm({ onCancel, onSaved, initialProduct }: ItemFormProps) {
  const { t } = useTranslation("profile");
  const { mutateAsync: createProduct, isPending: isCreatingProduct } =
    useCreateProduct();
  const [draft, setDraft] = useState<ProductDraft>(createDefaultDraft());
  const [sizeMenuOpen, setSizeMenuOpen] = useState(false);
  const [tempSizes, setTempSizes] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const mainCategories = useMemo(
    () => [
      { id: "clothing", label: "Clothing" },
      { id: "sneakers", label: "Sneakers" },
      { id: "accessories", label: "Accessories" },
    ],
    [],
  );

  const subCategories = useMemo(
    () => presetCategoryOptions[draft.category.mainCategory] ?? [],

    [draft.category.mainCategory],
  );

  const sizeOptions = useMemo(() => {
    if (draft.category.mainCategory === "sneakers") return sneakerSizeOptions;
    if (draft.category.mainCategory === "accessories")
      return accessorySizeOptions;
    if (draft.category.mainCategory === "clothing") return defaultSizeOptions;
    return [];
  }, [draft.category.mainCategory]);

  const sizeLabelMap = useMemo(
    () =>
      sizeOptions.reduce<Record<string, string>>((acc, opt) => {
        acc[opt.id] = opt.label;
        return acc;
      }, {}),
    [sizeOptions],
  );

  const selectedSizeLabels = useMemo(
    () =>
      (sizeMenuOpen ? tempSizes : draft.characteristics.sizes)
        .map((id) => sizeLabelMap[id])
        .filter(Boolean)
        .join(", "),
    [draft.characteristics.sizes, sizeLabelMap, sizeMenuOpen, tempSizes],
  );

  const genderOptions = [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "unisex", label: "Unisex" },
  ];

  const productToDraft = (product: Product): ProductDraft => {
    const mainKeys = Object.keys(presetCategoryOptions);
    let mainCategory = "";
    let subCategory = "";

    if (mainKeys.includes(product.category)) {
      mainCategory = product.category;
    } else {
      for (const key of mainKeys) {
        const found = presetCategoryOptions[key]?.find(
          (opt) =>
            opt.id.toLowerCase() === product.category.toLowerCase() ||
            opt.label.toLowerCase() === product.category.toLowerCase(),
        );
        if (found) {
          mainCategory = key;
          subCategory = found.id;
          break;
        }
      }
    }

    if (!mainCategory) {
      // heuristic match
      const lower = product.category.toLowerCase();
      if (lower.includes("cloth")) mainCategory = "clothing";
      else if (lower.includes("sneaker") || lower.includes("shoe"))
        mainCategory = "sneakers";
      else if (lower.includes("accessor")) mainCategory = "accessories";
    }

    const initialImages: string[] = Array.isArray((product as any).images)
      ? ((product as any).images as string[]).filter(Boolean)
      : product.image
        ? [product.image]
        : [];

    return {
      title: product.title ?? "",
      price: product.price ?? "",
      description: product.description ?? "",
      existingImages: initialImages,
      category: { mainCategory, subCategory },
      gender: "",
      characteristics: {
        brand: "",
        state: "",
        material: "",
        sizes: [],
        quantity: "",
        isNewArrival: true,
      },
    };
  };

  useEffect(() => {
    if (initialProduct) {
      const next = productToDraft(initialProduct);
      setDraft(next);
      setTempSizes(next.characteristics.sizes);
      setImageUrlInput("");
    } else {
      setDraft(createDefaultDraft());
      setTempSizes([]);
      setImageUrlInput("");
    }
  }, [initialProduct]);

  const handleChange = <K extends keyof ProductDraft>(
    key: K,
    value: ProductDraft[K],
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleCharacteristicChange = <
    K extends keyof ProductDraft["characteristics"],
  >(
    key: K,
    value: ProductDraft["characteristics"][K],
  ) => {
    setDraft((prev) => ({
      ...prev,
      characteristics: { ...prev.characteristics, [key]: value },
    }));
  };

  const handleCategoryChange = <K extends keyof ProductDraft["category"]>(
    key: K,
    value: ProductDraft["category"][K],
  ) => {
    setDraft((prev) => {
      const nextCategory =
        key === "mainCategory"
          ? { mainCategory: value as string, subCategory: "" }
          : { ...prev.category, [key]: value };
      const resetSizes = key === "mainCategory";
      return {
        ...prev,
        category: nextCategory,
        characteristics: {
          ...prev.characteristics,
          sizes: resetSizes ? [] : prev.characteristics.sizes,
        },
      };
    });
    if (key === "mainCategory") {
      setTempSizes([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.existingImages.length === 0) {
      toast.error(
        t("addItem.imagesRequired", {
          defaultValue: "Add at least one product photo",
        }),
      );
      return;
    }
    if (!draft.category.mainCategory) {
      toast.error(
        t("addItem.selectMainFirst", {
          defaultValue: "Select a main category first",
        }),
      );
      return;
    }
    if (!draft.category.subCategory) {
      toast.error(
        t("addItem.selectSubCategory", {
          defaultValue: "Select a sub category",
        }),
      );
      return;
    }
    if (!draft.characteristics.state) {
      toast.error(
        t("addItem.selectState", {
          defaultValue: "Select product condition",
        }),
      );
      return;
    }
    if (draft.characteristics.sizes.length === 0) {
      toast.error(
        t("addItem.selectSize", {
          defaultValue: "Select at least one size",
        }),
      );
      return;
    }
    if (draft.price === "" || draft.characteristics.quantity === "") {
      toast.error(
        t("addItem.fillNumbers", { defaultValue: "Fill price and quantity" }),
      );
      return;
    }

    if (initialProduct) {
      toast.success(
        t("addItem.localSuccess", {
          defaultValue: "Product draft saved locally",
        }),
      );
      onSaved?.();
      return;
    }

    try {
      const title = draft.title.trim();
      const description = draft.description.trim();
      const brand = draft.characteristics.brand.trim();
      const material = draft.characteristics.material.trim();

      const existingImagePayload = draft.existingImages
        .filter(Boolean)
        .map((url) => ({
          url,
          alt: title || "Product image",
        }));

      const payload: ProductCreatePayload = {
        title,
        description,
        price: Number(draft.price),
        images: existingImagePayload,
        category: {
          main_category: draft.category.mainCategory,
          sub_category: draft.category.subCategory,
        },
        characteristics: {
          brand,
          state: draft.characteristics.state,
          material,
          size: draft.characteristics.sizes,
          quantity: Number(draft.characteristics.quantity),
          is_new_arrival: draft.characteristics.isNewArrival,
        },
      };

      await createProduct(payload);

      toast.success(
        t("addItem.success", { defaultValue: "Product created successfully" }),
      );
      setDraft(createDefaultDraft());
      setTempSizes([]);
      setImageUrlInput("");
      onSaved?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const toggleSize = (id: string) => {
    setTempSizes((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleAddImageUrl = () => {
    const normalized = imageUrlInput.trim();
    if (!normalized) {
      toast.error(
        t("addItem.invalidImageUrl", {
          defaultValue: "Enter a valid image URL",
        }),
      );
      return;
    }
    if (!isValidImageUrl(normalized)) {
      toast.error(
        t("addItem.invalidImageUrl", {
          defaultValue: "Enter a valid image URL",
        }),
      );
      return;
    }
    if (draft.existingImages.includes(normalized)) {
      toast.error(
        t("addItem.duplicateImageUrl", {
          defaultValue: "This image URL is already added",
        }),
      );
      return;
    }
    setDraft((prev) => ({
      ...prev,
      existingImages: [...prev.existingImages, normalized],
    }));
    setImageUrlInput("");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">
            {t("addItem.imageUrl", { defaultValue: "Image URL" })}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder={t("addItem.imageUrlPlaceholder", {
                defaultValue: "https://example.com/image.png",
              })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddImageUrl();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddImageUrl}
              disabled={isCreatingProduct}
              className="sm:w-auto"
            >
              {t("addItem.addImageUrl", { defaultValue: "Add URL" })}
            </Button>
          </div>
        </div>
        {draft.existingImages.length > 0 && (
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">
              {t("addItem.images")}
            </label>
            <div className="flex flex-wrap gap-2">
              {draft.existingImages.map((url, idx) => (
                <div
                  key={`existing-${idx}`}
                  className="relative size-20 rounded-md overflow-hidden border bg-muted/30 flex items-center justify-center"
                >
                  <img
                    src={url}
                    alt={`existing-${idx}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 rounded-full flex items-center justify-center bg-white/80 px-1 pb-px sm:pb-0.5 text-xs font-semibold leading-none text-destructive shadow hover:bg-white"
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        existingImages: prev.existingImages.filter(
                          (_, i) => i !== idx,
                        ),
                      }))
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-sm text-muted-foreground">
          {t("addItem.title")}
        </label>
        <Input
          value={draft.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">
            {t("addItem.price")}
          </label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={draft.price}
            onChange={(e) => {
              const val = e.target.value;
              handleChange("price", val === "" ? "" : Number(val));
            }}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">
            {t("addItem.quantity")}
          </label>
          <Input
            type="number"
            min={1}
            value={draft.characteristics.quantity}
            onChange={(e) => {
              const val = e.target.value;
              handleCharacteristicChange(
                "quantity",
                val === "" ? "" : Number(val),
              );
            }}
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm text-muted-foreground">
          {t("addItem.description")}
        </label>
        <Textarea
          value={draft.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
          rows={4}
        />
      </div>

      <div className="grid gap-3  grid-cols-2 md:grid-cols-4">
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">
            {t("addItem.mainCategory")}
          </label>
          <NativeSelect
            fullWidth
            value={draft.category.mainCategory}
            onChange={(e) =>
              handleCategoryChange("mainCategory", e.target.value)
            }
            required
            className="w-full"
          >
            <NativeSelectOption value="">
              {t("addItem.selectOption", { defaultValue: "Select" })}
            </NativeSelectOption>
            {mainCategories.map((opt) => (
              <NativeSelectOption key={opt.id} value={opt.id}>
                {opt.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">
            {t("addItem.subCategory")}
          </label>
          <NativeSelect
            fullWidth
            required
            className="w-full"
            value={draft.category.subCategory}
            onChange={(e) =>
              draft.category.mainCategory
                ? handleCategoryChange("subCategory", e.target.value)
                : toast.error(
                    t("addItem.selectMainFirst", {
                      defaultValue: "Select a main category first",
                    }),
                  )
            }
            onMouseDown={(e) => {
              if (!draft.category.mainCategory) {
                e.preventDefault();
                toast.error(
                  t("addItem.selectMainFirst", {
                    defaultValue: "Select a main category first",
                  }),
                );
              }
            }}
          >
            <NativeSelectOption value="">
              {t("addItem.selectOption", { defaultValue: "Select" })}
            </NativeSelectOption>
            {subCategories.map((opt) => (
              <NativeSelectOption key={opt.id} value={opt.id}>
                {opt.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">
            {t("addItem.gender")}
          </label>
          <NativeSelect
            fullWidth
            className="w-full"
            required
            value={draft.gender ?? ""}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <NativeSelectOption value="">
              {t("addItem.selectOption", { defaultValue: "Select" })}
            </NativeSelectOption>
            {genderOptions.map((opt) => (
              <NativeSelectOption key={opt.id} value={opt.id}>
                {opt.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">
            {t("addItem.state")}
          </label>
          <NativeSelect
            fullWidth
            required
            className="w-full"
            value={draft.characteristics.state}
            onChange={(e) =>
              handleCharacteristicChange(
                "state",
                e.target.value as ProductDraft["characteristics"]["state"],
              )
            }
          >
            <NativeSelectOption value="">
              {t("addItem.selectOption", { defaultValue: "Select" })}
            </NativeSelectOption>
            <NativeSelectOption value="new">
              {t("addItem.stateNew")}
            </NativeSelectOption>
            <NativeSelectOption value="used">
              {t("addItem.stateUsed")}
            </NativeSelectOption>
          </NativeSelect>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">
            {t("addItem.brand")}
          </label>
          <Input
            value={draft.characteristics.brand}
            onChange={(e) =>
              handleCharacteristicChange("brand", e.target.value)
            }
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">
            {t("addItem.material")}
          </label>
          <Input
            value={draft.characteristics.material}
            onChange={(e) =>
              handleCharacteristicChange("material", e.target.value)
            }
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">
            {t("addItem.size")}
          </label>
          <DropdownMenu
            open={sizeMenuOpen}
            onOpenChange={(open) => {
              if (open && !draft.category.mainCategory) {
                toast.error(
                  t("addItem.selectMainFirst", {
                    defaultValue: "Select a main category first",
                  }),
                );
                setSizeMenuOpen(false);
                return;
              }
              if (open) {
                setTempSizes(draft.characteristics.sizes);
              }
              setSizeMenuOpen(open);
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
              >
                <span>
                  {selectedSizeLabels ||
                    t("addItem.selectOption", { defaultValue: "Select" })}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-fit">
              {sizeOptions.map((opt) => {
                const checked = tempSizes.includes(opt.id);
                return (
                  <DropdownMenuCheckboxItem
                    key={opt.id}
                    checked={checked}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={() => toggleSize(opt.id)}
                  >
                    {opt.label}
                  </DropdownMenuCheckboxItem>
                );
              })}
              <div className="flex justify-end gap-2 px-2 pb-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setTempSizes(draft.characteristics.sizes);
                    setSizeMenuOpen(false);
                  }}
                >
                  {t("addItem.cancel")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setDraft((prev) => ({
                      ...prev,
                      characteristics: {
                        ...prev.characteristics,
                        sizes: tempSizes,
                      },
                    }));
                    setSizeMenuOpen(false);
                  }}
                >
                  {t("addItem.save")}
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isCreatingProduct}>
          {isCreatingProduct
            ? t("addItem.adding", { defaultValue: "Adding..." })
            : t("addItem.add", { defaultValue: "Add" })}
        </Button>
        <Button
          variant="ghost"
          type="button"
          onClick={onCancel}
          disabled={isCreatingProduct}
        >
          {t("addItem.cancel")}
        </Button>
      </div>
    </form>
  );
}
