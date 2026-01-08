import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

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
import { ChevronDown } from "lucide-react";

type AddItemFormProps = {
  onCancel: () => void;
  onSaved?: () => void;
};

type ProductDraft = {
  title: string;
  price: number | "";
  description: string;
  images: File[];
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

const defaultDraft: ProductDraft = {
  title: "",
  price: "",
  description: "",
  images: [],
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
};

export function AddItemForm({ onCancel, onSaved }: AddItemFormProps) {
  const { t } = useTranslation("profile");
  const [draft, setDraft] = useState<ProductDraft>(defaultDraft);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [sizeMenuOpen, setSizeMenuOpen] = useState(false);
  const [tempSizes, setTempSizes] = useState<string[]>([]);
  const mainCategories = useMemo(
    () => [
      { id: "clothing", label: "Clothing" },
      { id: "sneakers", label: "Sneakers" },
      { id: "accessories", label: "Accessories" },
    ],
    []
  );

  const subCategories = useMemo(
    () => presetCategoryOptions[draft.category.mainCategory] ?? [],

    [draft.category.mainCategory]
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
    [sizeOptions]
  );

  const selectedSizeLabels = useMemo(
    () =>
      (sizeMenuOpen ? tempSizes : draft.characteristics.sizes)
        .map((id) => sizeLabelMap[id])
        .filter(Boolean)
        .join(", "),
    [draft.characteristics.sizes, sizeLabelMap, sizeMenuOpen, tempSizes]
  );

  const genderOptions = [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "unisex", label: "Unisex" },
  ];

  const handleChange = <K extends keyof ProductDraft>(
    key: K,
    value: ProductDraft[K]
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleCharacteristicChange = <
    K extends keyof ProductDraft["characteristics"]
  >(
    key: K,
    value: ProductDraft["characteristics"][K]
  ) => {
    setDraft((prev) => ({
      ...prev,
      characteristics: { ...prev.characteristics, [key]: value },
    }));
  };

  const handleCategoryChange = <K extends keyof ProductDraft["category"]>(
    key: K,
    value: ProductDraft["category"][K]
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.images.length === 0) {
      toast.error(
        t("addItem.imagesRequired", {
          defaultValue: "Add at least one product photo",
        })
      );
      return;
    }
    if (!draft.category.mainCategory) {
      toast.error(
        t("addItem.selectMainFirst", {
          defaultValue: "Select a main category first",
        })
      );
      return;
    }
    if (!draft.category.subCategory) {
      toast.error(
        t("addItem.selectSubCategory", {
          defaultValue: "Select a sub category",
        })
      );
      return;
    }
    if (!draft.characteristics.state) {
      toast.error(
        t("addItem.selectState", {
          defaultValue: "Select product condition",
        })
      );
      return;
    }
    if (draft.characteristics.sizes.length === 0) {
      toast.error(
        t("addItem.selectSize", {
          defaultValue: "Select at least one size",
        })
      );
      return;
    }
    if (draft.price === "" || draft.characteristics.quantity === "") {
      toast.error(
        t("addItem.fillNumbers", { defaultValue: "Fill price and quantity" })
      );
      return;
    }
    toast.success(
      t("addItem.success", { defaultValue: "Product draft saved locally" })
    );
    onSaved?.();
  };

  const toggleSize = (id: string) => {
    setTempSizes((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-3">
        <label className="text-sm text-muted-foreground">
          {t("addItem.images")}
        </label>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setDraft((prev) => ({ ...prev, images: files }));
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="sr-only"
            id="product-images-input"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="max-w-xs"
          >
            {t("addItem.browse", { defaultValue: "Browse..." })}
          </Button>
        </div>
        {draft.images.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {t("addItem.selectedImages", {
                count: draft.images.length,
                defaultValue: "{{count}} file(s) selected",
              })}
            </p>
            <div className="flex flex-wrap gap-2">
              {draft.images.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <div
                    key={`${file.name}-${idx}`}
                    className="relative size-20 rounded-md overflow-hidden border bg-muted/30 flex items-center justify-center"
                  >
                    <img
                      src={url}
                      alt={file.name}
                      className="h-full w-full object-cover"
                      onLoad={() => URL.revokeObjectURL(url)}
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 rounded-full flex items-center justify-center bg-white/80 px-1 pb-px sm:pb-0.5 text-xs font-semibold leading-none text-destructive shadow hover:bg-white"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== idx),
                        }))
                      }
                    >
                      ×
                    </button>
                  </div>
                );
              })}
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
                val === "" ? "" : Number(val)
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
                    })
                  )
            }
            onMouseDown={(e) => {
              if (!draft.category.mainCategory) {
                e.preventDefault();
                toast.error(
                  t("addItem.selectMainFirst", {
                    defaultValue: "Select a main category first",
                  })
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
                e.target.value as ProductDraft["characteristics"]["state"]
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
                  })
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
        <Button type="submit">{t("addItem.save")}</Button>
        <Button variant="ghost" type="button" onClick={onCancel}>
          {t("addItem.cancel")}
        </Button>
      </div>
    </form>
  );
}
