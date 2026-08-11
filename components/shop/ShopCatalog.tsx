"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { PackageOpen, ShoppingBag, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { AUDIENCE_LABELS, CATEGORY_LABELS, colorSwatchValue, formatPrice, type ProductAudienceValue, type ProductCategoryValue } from "@/lib/shop";
import type { ShopProduct } from "@/lib/shop-types";

const copy = {
  fr: { all: "Tout", collection: "Collection", audience: "Pour qui", product: "Type", discover: "Voir le produit", empty: "Aucun produit ne correspond à ces filtres.", featured: "À la une", soldOut: "Épuisé" },
  en: { all: "All", collection: "Collection", audience: "For whom", product: "Type", discover: "View product", empty: "No product matches these filters.", featured: "Featured", soldOut: "Sold out" },
  ko: { all: "전체", collection: "컬렉션", audience: "대상", product: "유형", discover: "상품 보기", empty: "필터와 일치하는 상품이 없습니다.", featured: "추천", soldOut: "품절" },
};

function localizedProduct(product: ShopProduct, locale: string) {
  if (locale === "en") return { name: product.nameEn || product.name, description: product.descriptionEn || product.description };
  if (locale === "ko") return { name: product.nameKo || product.name, description: product.descriptionKo || product.description };
  return { name: product.name, description: product.description };
}

export default function ShopCatalog({ products }: { products: ShopProduct[] }) {
  const locale = useLocale();
  const labels = copy[locale as keyof typeof copy] ?? copy.fr;
  const [category, setCategory] = useState<"ALL" | ProductCategoryValue>("ALL");
  const [collection, setCollection] = useState("ALL");
  const [audience, setAudience] = useState<"ALL" | ProductAudienceValue>("ALL");
  const collections = useMemo(() => [...new Set(products.map((product) => product.collection))], [products]);
  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products],
  );
  const shown = products.filter((product) => {
    if (collection !== "ALL" && product.collection !== collection) return false;
    if (category !== "ALL" && product.category !== category) return false;
    if (audience === "MIXTE" && product.audience !== "MIXTE") return false;
    if (audience === "HOMME" && !["HOMME", "MIXTE"].includes(product.audience)) return false;
    if (audience === "FEMME" && !["FEMME", "MIXTE"].includes(product.audience)) return false;
    return true;
  });

  if (!products.length) {
    return (
      <div className="shop-product-card mx-auto max-w-xl rounded-[30px] border border-[#c85586]/18 bg-white/25 px-6 py-16 text-center shadow-[0_24px_80px_rgba(60,30,45,.08)] backdrop-blur-xl">
        <PackageOpen size={36} className="mx-auto text-[#c85586]/55" />
        <p className="mt-5 text-sm font-semibold opacity-60">{labels.empty}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 space-y-4 rounded-[24px] border border-[#c85586]/12 bg-white/20 p-4 backdrop-blur-xl">
        <FilterRow label={labels.collection}>
          <FilterButton active={collection === "ALL"} onClick={() => setCollection("ALL")}>{labels.all}</FilterButton>
          {collections.map((item) => <FilterButton key={item} active={collection === item} onClick={() => setCollection(item)}>{item}</FilterButton>)}
        </FilterRow>
        <FilterRow label={labels.audience}>
          <FilterButton active={audience === "ALL"} onClick={() => setAudience("ALL")}>{labels.all}</FilterButton>
          {(["MIXTE", "FEMME", "HOMME"] as ProductAudienceValue[]).map((item) => <FilterButton key={item} active={audience === item} onClick={() => setAudience(item)}>{AUDIENCE_LABELS[item][locale as "fr" | "en" | "ko"] || AUDIENCE_LABELS[item].fr}</FilterButton>)}
        </FilterRow>
        <FilterRow label={labels.product}>
        <button
          type="button"
          onClick={() => setCategory("ALL")}
          className={`shrink-0 rounded-full border px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] transition ${category === "ALL" ? "border-[#c85586] bg-[#c85586] text-white" : "shop-filter-pill border-[#c85586]/25 bg-white/20 text-[#9b4f70] backdrop-blur-xl"}`}
        >
          {labels.all}
        </button>
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`shrink-0 rounded-full border px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] transition ${category === item ? "border-[#c85586] bg-[#c85586] text-white" : "shop-filter-pill border-[#c85586]/25 bg-white/20 text-[#9b4f70] backdrop-blur-xl"}`}
          >
            {CATEGORY_LABELS[item][locale as "fr" | "en" | "ko"] || CATEGORY_LABELS[item].fr}
          </button>
        ))}
        </FilterRow>
      </div>

      {shown.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((product) => {
          const content = localizedProduct(product, locale);
          const unavailable = product.trackStock && product.stock <= 0;
          return (
            <article key={product.id} className="shop-product-card group overflow-hidden rounded-[28px] border border-[#c85586]/14 bg-white/30 shadow-[0_20px_70px_rgba(60,30,45,.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(200,85,134,.15)]">
              <Link href={`/${locale}/shop/${product.slug}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(239,106,164,.16),transparent_58%)]">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt || content.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-3 transition duration-700 group-hover:scale-[1.025]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center"><ShoppingBag size={42} className="text-[#c85586]/22" /></div>
                  )}
                  {product.isFeatured ? (
                    <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[#100c0f]/75 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-[#ff9bc4] backdrop-blur-xl">
                      <Sparkles size={11} /> {labels.featured}
                    </span>
                  ) : null}
                  {unavailable ? <span className="absolute inset-x-4 bottom-4 rounded-full bg-black/75 px-4 py-2 text-center text-[10px] font-black uppercase tracking-wider text-white">{labels.soldOut}</span> : null}
                </div>
                <div className="p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#c85586]">{product.collection} · {AUDIENCE_LABELS[product.audience][locale as "fr" | "en" | "ko"] || AUDIENCE_LABELS[product.audience].fr} · {CATEGORY_LABELS[product.category][locale as "fr" | "en" | "ko"] || CATEGORY_LABELS[product.category].fr}</p>
                  <div className="mt-2 flex items-start justify-between gap-4">
                    <h2 className="text-lg font-black uppercase leading-tight">{content.name}</h2>
                    <strong className="shop-accent-text shrink-0 text-sm text-[#c85586]">{formatPrice(product.priceCents, product.currency, locale)}</strong>
                  </div>
                  {content.description ? <p className="mt-3 line-clamp-2 text-sm leading-relaxed opacity-52">{content.description}</p> : null}
                  {product.colors.length ? <div className="mt-4 flex items-center gap-1.5" aria-label={`${product.colors.length} couleurs disponibles`}>{product.colors.slice(0, 7).map((item) => <span key={item} title={item} className="h-4 w-4 rounded-full border border-black/15 shadow-sm" style={{ background: colorSwatchValue(item) }} />)}{product.colors.length > 7 ? <span className="ml-1 text-[9px] font-black opacity-45">+{product.colors.length - 7}</span> : null}</div> : null}
                  <span className="shop-accent-text mt-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#9b4f70]">{labels.discover} <span aria-hidden>→</span></span>
                </div>
              </Link>
            </article>
          );
        })}
      </div> : <div className="shop-product-card rounded-[28px] border border-dashed border-[#c85586]/22 bg-white/20 px-6 py-16 text-center text-sm font-semibold opacity-65 backdrop-blur-xl">{labels.empty}</div>}
    </>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="mb-2 text-[9px] font-black uppercase tracking-[0.22em] text-[#a75177]">{label}</p><div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{children}</div></div>;
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`shrink-0 rounded-full border px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.12em] transition ${active ? "border-[#c85586] bg-[#c85586] text-white" : "shop-filter-pill border-[#c85586]/25 bg-white/20 text-[#9b4f70] backdrop-blur-xl"}`}>{children}</button>;
}
