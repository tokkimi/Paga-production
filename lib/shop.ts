export const PRODUCT_CATEGORIES = [
  "TSHIRT",
  "TANK",
  "HOODIE",
  "CAP",
  "HAT",
  "JACKET",
  "ACCESSORY",
  "OTHER",
] as const;

export type ProductCategoryValue = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_AUDIENCES = ["MIXTE", "HOMME", "FEMME"] as const;
export type ProductAudienceValue = (typeof PRODUCT_AUDIENCES)[number];

export type ProductColorSetting = {
  name: string;
  active: boolean;
};

export const AUDIENCE_LABELS: Record<ProductAudienceValue, { fr: string; en: string; ko: string }> = {
  MIXTE: { fr: "Mixte", en: "Unisex", ko: "공용" },
  HOMME: { fr: "Homme", en: "Men", ko: "남성" },
  FEMME: { fr: "Femme", en: "Women", ko: "여성" },
};

const COLOR_SWATCHES: Record<string, string> = {
  "blanc / noir": "linear-gradient(135deg, #ffffff 0 48%, #151515 52% 100%)",
  "blanc / rouge": "linear-gradient(135deg, #ffffff 0 48%, #bd3034 52% 100%)",
  "blanc / bleu marine": "linear-gradient(135deg, #ffffff 0 48%, #17213b 52% 100%)",
  noir: "#151515",
  "noir de jais": "#101010",
  "noir graphite": "#282828",
  blanc: "#ffffff",
  os: "#eee9dc",
  naturel: "#e6d8bd",
  sable: "#c9b18d",
  beige: "#d8c3a5",
  bronze: "#8b5e3c",
  "marron kaki": "#655442",
  shiitake: "#8f7865",
  argile: "#a96f5b",
  gris: "#8a8a8a",
  "gris clair": "#c8c8c8",
  "gris fonce": "#454545",
  "gris fume": "#767676",
  "gris ardoise": "#59616a",
  "gris chine": "#a6a6a6",
  "gris anthracite chine": "#4b4b4b",
  "avoine chine": "#c9bca6",
  marine: "#17213b",
  "bleu fonce": "#1c3155",
  "bleu nuit": "#101a31",
  bleu: "#3568b8",
  "bleu clair": "#8fc9e8",
  "bleu roi chine": "#4169a8",
  "denim chine": "#637d9c",
  "denim delave": "#7f9aae",
  oceanside: "#247d86",
  rouge: "#bd3034",
  "rouge coquelicot": "#d83b32",
  "rouge fonce": "#7d2028",
  rose: "#e88da9",
  "rose clair": "#f2b4c8",
  prune: "#653b5c",
  violet: "#6f4a9e",
  "basil green": "#597153",
  "vert jade": "#3f8a72",
  "vert treillis": "#596044",
  "vert olive clair": "#8f9668",
  "olive clair": "#9a9b6a",
  vert: "#3b7d4b",
  "vert foret": "#254f3b",
  kaki: "#767451",
  "vert kiwi": "#8ebf43",
  jaune: "#e8c53a",
  "jaune creme": "#f0dd87",
  creme: "#eee0bb",
};

export function colorSwatchValue(name: string) {
  const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  if (COLOR_SWATCHES[normalized]) return COLOR_SWATCHES[normalized];
  const match = Object.entries(COLOR_SWATCHES).find(([key]) => normalized.includes(key));
  return match?.[1] || "#c8b9bf";
}

export const CATEGORY_LABELS: Record<ProductCategoryValue, { fr: string; en: string; ko: string }> = {
  TSHIRT: { fr: "T-shirts", en: "T-shirts", ko: "티셔츠" },
  TANK: { fr: "Débardeurs", en: "Tank tops", ko: "민소매" },
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

function colorSettingsFromUnknown(value: unknown) {
  if (!Array.isArray(value)) return [] as ProductColorSetting[];
  const seen = new Set<string>();
  const settings: ProductColorSetting[] = [];
  for (const item of value) {
    const name = typeof item === "string"
      ? item.trim()
      : item && typeof item === "object" && "name" in item
        ? String(item.name ?? "").trim()
        : "";
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    settings.push({
      name: name.slice(0, 80),
      active: !(item && typeof item === "object" && "active" in item && item.active === false),
    });
  }
  return settings.slice(0, 30);
}

export function getProductColorSettings(colors: string[], value?: unknown): ProductColorSetting[] {
  const configured = colorSettingsFromUnknown(value);
  const byName = new Map(configured.map((item) => [item.name.toLocaleLowerCase(), item]));
  const ordered = colors.map((name) => byName.get(name.toLocaleLowerCase()) || { name, active: true });
  const extras = configured.filter((item) => !colors.some((name) => name.toLocaleLowerCase() === item.name.toLocaleLowerCase()));
  return [...ordered, ...extras];
}

export function getActiveProductColors(colors: string[], value?: unknown) {
  return getProductColorSettings(colors, value).filter((item) => item.active).map((item) => item.name);
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
  collection: string;
  audience: ProductAudienceValue;
  sourceUrl: string | null;
  priceCents: number;
  currency: string;
  sizes: string[];
  colors: string[];
  colorSettings: ProductColorSetting[];
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
  const audience = PRODUCT_AUDIENCES.includes(body.audience as ProductAudienceValue)
    ? (body.audience as ProductAudienceValue)
    : "MIXTE";
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

  const colors = normalizeOptionList(body.colors);
  const configuredColors = colorSettingsFromUnknown(body.colorSettings);
  const colorSettings = getProductColorSettings(colors, configuredColors);

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
    collection: optionalText(body.collection, 80) || "Essentiel",
    audience,
    sourceUrl: optionalText(body.sourceUrl, 2_000),
    priceCents,
    currency: "EUR",
    sizes: normalizeOptionList(body.sizes),
    colors,
    colorSettings,
    stock,
    trackStock: Boolean(body.trackStock),
    isActive: body.isActive !== false,
    isFeatured: Boolean(body.isFeatured),
    order,
  };
}
