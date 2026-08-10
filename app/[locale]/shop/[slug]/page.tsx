import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/shop-data";
import ProductDetails from "@/components/shop/ProductDetails";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

const getProduct = cache((slug: string) => prisma.product.findFirst({
  where: { slug, isActive: true },
  include: { images: { orderBy: { order: "asc" } } },
}));

function localizedProduct(product: NonNullable<Awaited<ReturnType<typeof getProduct>>>, locale: string) {
  return {
    name: locale === "en" ? product.nameEn || product.name : locale === "ko" ? product.nameKo || product.name : product.name,
    description: locale === "en"
      ? product.descriptionEn || product.description
      : locale === "ko"
        ? product.descriptionKo || product.description
        : product.description,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Sherrie Shop", robots: { index: false } };
  const content = localizedProduct(product, locale);
  const canonical = `/${locale}/shop/${product.slug}`;
  return {
    title: `${content.name} · Sherrie Shop`,
    description: content.description || `Découvre ${content.name} dans la boutique officielle Sherrie Sherrie.`,
    alternates: {
      canonical,
      languages: {
        fr: `/fr/shop/${product.slug}`,
        en: `/en/shop/${product.slug}`,
        ko: `/ko/shop/${product.slug}`,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: content.name,
      description: content.description || undefined,
      images: product.images.map((image) => ({ url: image.url, alt: image.alt || content.name })),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const content = localizedProduct(product, locale);
  const inStock = !product.trackStock || product.stock > 0;
  const productUrl = `https://www.sherriesherrie.com/${locale}/shop/${product.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: content.name,
    description: content.description || undefined,
    image: product.images.map((image) => image.url),
    sku: product.id,
    category: product.category,
    brand: { "@type": "Brand", name: "Sherrie Sherrie" },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: product.currency,
      price: (product.priceCents / 100).toFixed(2),
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <ProductDetails product={serializeProduct(product)} />
    </>
  );
}
