import "server-only";

import type { Product, ProductImage } from "@prisma/client";
import type { ShopProduct } from "@/lib/shop-types";

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
    priceCents: product.priceCents,
    currency: product.currency,
    sizes: product.sizes,
    colors: product.colors,
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
      order: image.order,
    })),
  };
}

