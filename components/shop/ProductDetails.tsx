"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Check, ChevronLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AUDIENCE_LABELS, CATEGORY_LABELS, colorSwatchValue, formatPrice } from "@/lib/shop";
import type { ShopProduct } from "@/lib/shop-types";
import { useShopCart } from "@/components/shop/ShopCartProvider";
import FavoriteButton from "@/components/shop/FavoriteButton";

const copy = {
  fr: { back: "Retour au shop", size: "Taille", color: "Couleur", quantity: "Quantité", add: "Ajouter au panier", added: "Ajouté au panier", details: "Détails", stock: "En stock", low: "Plus que {count} en stock", soldOut: "Épuisé", standard: "Taille unique" },
  en: { back: "Back to shop", size: "Size", color: "Colour", quantity: "Quantity", add: "Add to cart", added: "Added to cart", details: "Details", stock: "In stock", low: "Only {count} left", soldOut: "Sold out", standard: "One size" },
  ko: { back: "샵으로 돌아가기", size: "사이즈", color: "색상", quantity: "수량", add: "장바구니에 담기", added: "장바구니에 추가됨", details: "상세 정보", stock: "재고 있음", low: "재고 {count}개 남음", soldOut: "품절", standard: "프리 사이즈" },
};

export default function ProductDetails({ product }: { product: ShopProduct }) {
  const locale = useLocale();
  const labels = copy[locale as keyof typeof copy] ?? copy.fr;
  const { addItem } = useShopCart();
  const [size, setSize] = useState(product.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const content = useMemo(() => {
    if (locale === "en") return { name: product.nameEn || product.name, description: product.descriptionEn || product.description };
    if (locale === "ko") return { name: product.nameKo || product.name, description: product.descriptionKo || product.description };
    return { name: product.name, description: product.description };
  }, [locale, product]);
  const unavailable = product.trackStock && product.stock <= 0;
  const maxQuantity = product.trackStock ? Math.min(10, product.stock) : 10;
  const colorImageCount = useMemo(() => new Map(
    product.colors.map((item) => [item, product.images.filter((image) => image.color === item).length]),
  ), [product.colors, product.images]);
  const hasColourGalleries = [...colorImageCount.values()].some((count) => count > 0);
  const purchasableColors = useMemo(
    () => hasColourGalleries ? product.colors.filter((item) => (colorImageCount.get(item) || 0) > 0) : product.colors,
    [colorImageCount, hasColourGalleries, product.colors],
  );
  const [color, setColor] = useState(purchasableColors[0] || "");
  const visibleImages = useMemo(() => {
    if (!color) return product.images;
    const matching = product.images.filter((image) => image.color === color);
    const general = product.images.filter((image) => !image.color);
    // Once a colour has a dedicated gallery, never mix it with generic or
    // another-colour visuals. Generic images remain the fallback only.
    return matching.length ? matching : general.length ? general : product.images;
  }, [color, product.images]);
  const [activeImageId, setActiveImageId] = useState<string | null>(visibleImages[0]?.id || null);
  const selectedImage = visibleImages.find((image) => image.id === activeImageId) || visibleImages[0];

  useEffect(() => {
    if (!visibleImages.some((image) => image.id === activeImageId)) setActiveImageId(visibleImages[0]?.id || null);
  }, [activeImageId, visibleImages]);

  const chooseColor = (nextColor: string) => {
    setColor(nextColor);
    const first = product.images.find((image) => image.color === nextColor) || product.images.find((image) => !image.color) || null;
    setActiveImageId(first?.id || null);
  };

  const add = () => {
    if (unavailable) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: content.name,
      image: selectedImage?.url || product.images[0]?.url || null,
      priceCents: product.priceCents,
      currency: product.currency,
      size: size || null,
      color: color || null,
      quantity,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="sherrie-page min-h-screen px-4 pb-56 pt-28 sm:px-6 sm:pb-40">
      <div className="mx-auto max-w-7xl">
        <Link href={`/${locale}/shop`} className="shop-accent-text mb-7 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#a75177]">
          <ChevronLeft size={15} /> {labels.back}
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.12fr_.88fr] lg:gap-14">
          <div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-[#c85586]/14 bg-[radial-gradient(circle_at_50%_35%,rgba(239,106,164,.16),transparent_58%)] shadow-[0_24px_90px_rgba(60,30,45,.10)]">
              <FavoriteButton productId={product.id} className="absolute right-5 top-5 z-10 h-12 w-12" />
              {selectedImage ? (
                <Image
                  key={selectedImage.id}
                  src={selectedImage.url}
                  alt={selectedImage.alt || content.name}
                  fill
                  preload
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  className="object-contain p-3 sm:p-5"
                />
              ) : (
                <div className="flex h-full items-center justify-center"><ShoppingBag size={54} className="text-[#c85586]/22" /></div>
              )}
            </div>
            {visibleImages.length > 1 ? (
              <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-6">
                {visibleImages.map((image, index) => (
                  <button
                    type="button"
                    key={image.id}
                    onClick={() => setActiveImageId(image.id)}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 transition ${selectedImage?.id === image.id ? "border-[#c85586]" : "border-transparent opacity-58 hover:opacity-100"}`}
                    aria-label={`Image ${index + 1}`}
                  >
                    <Image src={image.url} alt="" fill sizes="120px" className="object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#c85586]">{product.collection} · {AUDIENCE_LABELS[product.audience][locale as "fr" | "en" | "ko"] || AUDIENCE_LABELS[product.audience].fr} · {CATEGORY_LABELS[product.category][locale as "fr" | "en" | "ko"] || CATEGORY_LABELS[product.category].fr}</p>
            <h1 className="mt-3 text-[clamp(2.5rem,6vw,5.5rem)] font-black uppercase leading-[.86] tracking-[-.055em]">{content.name}</h1>
            <p className="shop-accent-text mt-6 text-2xl font-black text-[#c85586]">{formatPrice(product.priceCents, product.currency, locale)}</p>
            {content.description ? <p className="mt-6 whitespace-pre-line text-sm leading-7 opacity-62">{content.description}</p> : null}

            <div className="shop-product-panel mt-8 space-y-6 rounded-[26px] border border-[#c85586]/15 bg-white/25 p-5 backdrop-blur-xl sm:p-6">
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] opacity-48">{labels.size}</p>
                {product.sizes.length ? (
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((item) => <button type="button" key={item} onClick={() => setSize(item)} className={`min-w-12 rounded-xl border px-4 py-2.5 text-xs font-black transition ${size === item ? "border-[#c85586] bg-[#c85586] text-white" : "border-[#c85586]/20 bg-white/20"}`}>{item}</button>)}
                  </div>
                ) : <p className="text-sm opacity-58">{labels.standard}</p>}
              </div>

              {purchasableColors.length ? (
                <div>
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] opacity-48">{labels.color} <span className="ml-2 text-[#c85586] opacity-100">{color}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {purchasableColors.map((item) => <button type="button" key={item} onClick={() => chooseColor(item)} title={item} aria-label={`${labels.color} ${item}`} className={`h-9 w-9 rounded-full border-2 p-1 transition ${color === item ? "scale-110 border-[#c85586] shadow-[0_0_0_3px_rgba(200,85,134,.18)]" : "border-black/10 hover:scale-105"}`}><span className="block h-full w-full rounded-full border border-black/10" style={{ background: colorSwatchValue(item) }} /></button>)}
                  </div>
                </div>
              ) : null}

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] opacity-48">{labels.quantity}</p>
                  <div className="inline-flex items-center rounded-full border border-[#c85586]/20 bg-white/20">
                    <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="p-3" aria-label="Moins"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-black">{quantity}</span>
                    <button type="button" onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))} className="p-3" aria-label="Plus"><Plus size={14} /></button>
                  </div>
                </div>
                {product.trackStock ? <p className={`text-xs font-semibold ${unavailable ? "text-red-400" : "text-emerald-500"}`}>{unavailable ? labels.soldOut : product.stock <= 5 ? labels.low.replace("{count}", String(product.stock)) : labels.stock}</p> : null}
              </div>

              <button type="button" onClick={add} disabled={unavailable} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ef6aa4] px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_14px_36px_rgba(239,106,164,.22)] transition hover:bg-[#ff7caf] disabled:cursor-not-allowed disabled:opacity-45">
                {added ? <><Check size={18} /> {labels.added}</> : <><ShoppingBag size={18} /> {unavailable ? labels.soldOut : labels.add}</>}
              </button>
            </div>

            {product.details ? (
              <section className="mt-7 border-t border-[#c85586]/14 pt-6">
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">{labels.details}</h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 opacity-58">{product.details}</p>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
