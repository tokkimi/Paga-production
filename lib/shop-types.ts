import type { ProductCategoryValue } from "@/lib/shop";

export type ShopImage = {
  id: string;
  url: string;
  pathname: string;
  alt: string | null;
  order: number;
};

export type ShopProduct = {
  id: string;
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
  images: ShopImage[];
  createdAt?: string;
  updatedAt?: string;
};

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  priceCents: number;
  currency: string;
  size: string | null;
  color: string | null;
  quantity: number;
};

