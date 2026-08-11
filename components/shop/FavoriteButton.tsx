"use client";

import { Heart } from "lucide-react";
import { useLocale } from "next-intl";
import { useShopFavorites } from "@/components/shop/ShopFavoritesProvider";

const labels = {
  fr: { add: "Ajouter aux favoris", remove: "Retirer des favoris" },
  en: { add: "Add to favourites", remove: "Remove from favourites" },
  ko: { add: "Add to favourites", remove: "Remove from favourites" },
};

export default function FavoriteButton({ productId, className = "" }: { productId: string; className?: string }) {
  const locale = useLocale();
  const { ready, isFavorite, toggleFavorite } = useShopFavorites();
  const favorite = isFavorite(productId);
  const copy = labels[locale as keyof typeof labels] || labels.fr;

  return (
    <button
      type="button"
      onClick={() => void toggleFavorite(productId)}
      disabled={!ready}
      aria-label={favorite ? copy.remove : copy.add}
      aria-pressed={favorite}
      title={favorite ? copy.remove : copy.add}
      className={`inline-flex items-center justify-center rounded-full border border-white/35 bg-[#171116]/78 text-white shadow-lg backdrop-blur-xl transition hover:scale-105 disabled:opacity-55 ${className}`}
    >
      <Heart size={18} fill={favorite ? "currentColor" : "none"} className={favorite ? "text-[#ff7caf]" : "text-white"} />
    </button>
  );
}
