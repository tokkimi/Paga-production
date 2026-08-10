import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/shop-data";
import ShopCatalog from "@/components/shop/ShopCatalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "en" ? "Official Shop" : locale === "ko" ? "공식 샵" : "Boutique officielle";
  const description = locale === "en"
    ? "Official Sherrie Sherrie merch: T-shirts, hoodies, caps, jackets and accessories."
    : locale === "ko"
      ? "Sherrie Sherrie 공식 머치: 티셔츠, 후디, 캡, 재킷 및 액세서리."
      : "Le merch officiel Sherrie Sherrie : T-shirts, hoodies, casquettes, vestes et accessoires.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/shop`,
      languages: { fr: "/fr/shop", en: "/en/shop", ko: "/ko/shop" },
    },
    openGraph: { title, description, url: `/${locale}/shop`, type: "website" },
  };
}

const heroCopy = {
  fr: { eyebrow: "Sherrie Shop", title: "Le merch entre dans la danse", body: "T-shirts, hoodies, casquettes, chapeaux, vestes et accessoires pensés dans l'univers Sherrie Sherrie." },
  en: { eyebrow: "Sherrie Shop", title: "Merch joins the dance", body: "T-shirts, hoodies, caps, hats, jackets and accessories shaped by the Sherrie Sherrie universe." },
  ko: { eyebrow: "Sherrie Shop", title: "머치와 함께 춤을", body: "Sherrie Sherrie의 감성을 담은 티셔츠, 후디, 캡, 모자, 재킷과 액세서리." },
};

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const labels = heroCopy[locale as keyof typeof heroCopy] ?? heroCopy.fr;
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="sherrie-page min-h-screen px-4 pb-56 pt-32 sm:px-6 sm:pb-40">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-[0.42em] text-[#c85586]">{labels.eyebrow}</p>
          <h1 className="mt-4 text-[clamp(3rem,8vw,7.2rem)] font-black uppercase leading-[0.82] tracking-[-0.07em]">{labels.title}</h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed opacity-58 sm:text-base">{labels.body}</p>
        </header>
        <ShopCatalog products={products.map(serializeProduct)} />
      </div>
    </div>
  );
}
