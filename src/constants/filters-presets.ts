export type FilterPresetOption = {
  id: string;
  label: string;
  labelKey?: string;
};

export const defaultSizeOptions: FilterPresetOption[] = [
  { id: "XS", label: "XS" },
  { id: "S", label: "S" },
  { id: "M", label: "M" },
  { id: "L", label: "L" },
  { id: "XL", label: "XL" },
];

export const sneakerSizeOptions: FilterPresetOption[] = [
  { id: "EU36", label: "EU 36" },
  { id: "EU38", label: "EU 38" },
  { id: "EU40", label: "EU 40" },
  { id: "EU42", label: "EU 42" },
  { id: "EU44", label: "EU 44" },
];

export const accessorySizeOptions: FilterPresetOption[] = [
  { id: "ONE", label: "One size", labelKey: "filters.options.size.one" },
  { id: "S", label: "Small", labelKey: "filters.options.size.small" },
  { id: "M", label: "Medium", labelKey: "filters.options.size.medium" },
  { id: "L", label: "Large", labelKey: "filters.options.size.large" },
];

export const conditionOptions: FilterPresetOption[] = [
  { id: "new", label: "New", labelKey: "filters.options.condition.new" },
  {
    id: "used",
    label: "Pre-owned",
    labelKey: "filters.options.condition.used",
  },
];

export const genderOptions: FilterPresetOption[] = [
  { id: "men", label: "Men", labelKey: "filters.options.gender.men" },
  { id: "women", label: "Women", labelKey: "filters.options.gender.women" },
];

export const presetCategoryOptions: Record<string, FilterPresetOption[]> = {
  clothing: [
    {
      id: "outerwear",
      label: "Outerwear",
      labelKey: "filters.options.categories.outerwear",
    },
    {
      id: "long-sleeves",
      label: "Sweatshirts & Long sleeves",
      labelKey: "filters.options.categories.longSleeves",
    },
    {
      id: "tees",
      label: "Tees & Tanks",
      labelKey: "filters.options.categories.tees",
    },
    {
      id: "bottoms",
      label: "Pants & Shorts",
      labelKey: "filters.options.categories.bottoms",
    },
    {
      id: "other-clothing",
      label: "Other",
      labelKey: "filters.options.categories.other",
    },
  ],
  sneakers: [
    {
      id: "lifestyle",
      label: "Lifestyle",
      labelKey: "filters.options.categories.lifestyle",
    },
    {
      id: "running",
      label: "Running",
      labelKey: "filters.options.categories.running",
    },
    {
      id: "basketball",
      label: "Basketball",
      labelKey: "filters.options.categories.basketball",
    },
    {
      id: "trail",
      label: "Trail / Hiking",
      labelKey: "filters.options.categories.trail",
    },
    {
      id: "other-sneakers",
      label: "Other",
      labelKey: "filters.options.categories.other",
    },
  ],
  accessories: [
    { id: "bags", label: "Bags", labelKey: "filters.options.categories.bags" },
    {
      id: "hats",
      label: "Hats & Caps",
      labelKey: "filters.options.categories.hats",
    },
    {
      id: "jewelry",
      label: "Jewelry",
      labelKey: "filters.options.categories.jewelry",
    },
    {
      id: "tech",
      label: "Tech accessories",
      labelKey: "filters.options.categories.tech",
    },
    {
      id: "other-accessories",
      label: "Other",
      labelKey: "filters.options.categories.other",
    },
  ],
};
