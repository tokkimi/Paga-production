export const PRODUCT_CATEGORIES = [
  "TSHIRT",
  "HOODIE",
  "CAP",
  "HAT",
  "JACKET",
  "ACCESSORY",
  "OTHER",
] as const;

export type ProductCategoryValue = (typeof PRODUCT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ProductCategoryValue, { fr: string; en: string; ko: string }> = {
  TSHIRT: { fr: "T-shirts", en: "T-shirts", ko: "티셔츠" },
  HOODIE: { fr: "Hoodies", en: "Hoodies", ko: "후디" },
  CAP: { fr: "Casquettes", en: "Caps", ko: "캡" },
  HAT: { fr: "Chapeaux", en: "Hats", ko: "모자" },
  JACKET: { fr: "Vestes", en: "Jackets", ko: "재킷" },
  ACCESSORY: { fr: "Accessoires", en: "Accessories", ko: "액세서리" },
  OTHER: { fr: "Autres", en: "Other", ko: "기타" },
};

export function formatPrice(cents: number, currency = "EUR", locale = "fr") {
  const localeCode = locale === "ko" ? "ko-KR" : locale === "en" ? "en-GB" : "fr-FR";
  return new Intl.NumberFormat(localeCode, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function normalizeOptionList(value: unknown) {
  if (Array.isArray(value)) {
    return [...new Set(value.map((item) => String(item).trim()).filter(Boolean))].slice(0, 30);
  }
  return [...new Set(String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean))].slice(0, 30);
}

export function normalizeProductSlug(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export type ProductInput = {
  slug: string;
  name: string;
  nameEn: string | null;
  nameKo: string | null;
  description: string | null;
  descriptionEn: string | null;
  descriptionKo: string | null;
  details: string | null;
  category: ProductCategoryValue;
  priceCents: number;
  currency: string;
  sizes: string[];
  colors: string[];
  stock: number;
  trackStock: boolean;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
};

export function parseProductInput(body: Record<string, unknown>): ProductInput {
  const name = String(body.name ?? "").trim().slice(0, 140);
  const slug = normalizeProductSlug(body.slug || name);
  const category = PRODUCT_CATEGORIES.includes(body.category as ProductCategoryValue)
    ? (body.category as ProductCategoryValue)
    : "OTHER";
  const priceCents = Number.isInteger(body.priceCents)
    ? Number(body.priceCents)
    : Math.round(Number(body.price ?? 0) * 100);
  const stock = Math.max(0, Math.min(1_000_000, Math.trunc(Number(body.stock ?? 0)) || 0));
  const order = Math.max(0, Math.min(100_000, Math.trunc(Number(body.order ?? 0)) || 0));

  if (!name) throw new Error("Le nom du produit est obligatoire.");
  if (!slug) throw new Error("Le slug du produit est obligatoire.");
  if (!Number.isInteger(priceCents) || priceCents < 0 || priceCents > 100_000_000) {
    throw new Error("Le prix du produit est invalide.");
  }

  const optionalText = (value: unknown, max: number) => {
    const text = String(value ?? "").trim().slice(0, max);
    return text || null;
  };

  return {
    slug,
    name,
    nameEn: optionalText(body.nameEn, 140),
    nameKo: optionalText(body.nameKo, 140),
    description: optionalText(body.description, 5_000),
    descriptionEn: optionalText(body.descriptionEn, 5_000),
    descriptionKo: optionalText(body.descriptionKo, 5_000),
    details: optionalText(body.details, 5_000),
    category,
    priceCents,
    currency: "EUR",
    sizes: normalizeOptionList(body.sizes),
    colors: normalizeOptionList(body.colors),
    stock,
    trackStock: Boolean(body.trackStock),
    isActive: body.isActive !== false,
    isFeatured: Boolean(body.isFeatured),
    order,
  };
}
