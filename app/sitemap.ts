import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://www.sherriesherrie.com";
const locales = ["fr", "en", "ko"];
const publicRoutes = [
  "", "/shop", "/dates", "/artistes", "/sponsors", "/rejoindre",
  "/cgv", "/mentions-legales", "/politique-confidentialite", "/cookies",
];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, events] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.event.findMany({ where: { isActive: true }, select: { slug: true, createdAt: true } }),
  ]);
  const staticEntries = locales.flatMap((locale) =>
    publicRoutes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "/shop" || route === "/dates" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : route === "/shop" ? 0.9 : 0.7,
    })),
  );
  const productEntries = products.flatMap((product) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/shop/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );
  const eventEntries = events.flatMap((event) => locales.map((locale) => ({
    url: `${BASE_URL}/${locale}/dates/${event.slug}`,
    lastModified: event.createdAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })));
  return [...staticEntries, ...productEntries, ...eventEntries];
}
