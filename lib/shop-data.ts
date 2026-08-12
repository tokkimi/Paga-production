import "server-only";

import type { Product, ProductImage } from "@prisma/client";
import type { ShopProduct } from "@/lib/shop-types";
import { getActiveProductColors, getProductColorSettings } from "@/lib/shop";

export function serializeProduct(product: Product & { images: ProductImage[] }): ShopProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    nameEn: product.nameEn,
    nameKo: product.nameKo,
    description: product.description,
    descriptionEn: product.descriptionEn,
    descriptionKo: product.descriptionKo,
    details: product.details,
    category: product.category,
    collection: product.collection,
    audience: product.audience,
    // Supplier provenance is kept in the authenticated admin API only.
    sourceUrl: null,
    priceCents: product.priceCents,
    currency: product.currency,
    sizes: product.sizes,
    colors: getActiveProductColors(product.colors, product.colorSettings),
    colorSettings: getProductColorSettings(product.colors, product.colorSettings),
    stock: product.stock,
    trackStock: product.trackStock,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    order: product.order,
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      pathname: image.pathname,
      alt: image.alt,
      color: image.color,
      order: image.order,
    })),
  };
}
