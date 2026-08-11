"use client";

import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type FavoritesContextValue = {
  ready: boolean;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function useShopFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useShopFavorites must be used inside ShopFavoritesProvider");
  return context;
}

export default function ShopFavoritesProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (status === "loading") return;
    if (status !== "authenticated") {
      const timer = window.setTimeout(() => {
        setIds(new Set());
        setReady(true);
      }, 0);
      return () => window.clearTimeout(timer);
    }

    Promise.resolve().then(() => {
      if (!cancelled) setReady(false);
    });
    fetch("/api/shop/favorites", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : { productIds: [] })
      .then((result: { productIds?: string[] }) => {
        if (!cancelled) setIds(new Set(Array.isArray(result.productIds) ? result.productIds : []));
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => { cancelled = true; };
  }, [status]);

  const toggleFavorite = useCallback(async (productId: string) => {
    if (status !== "authenticated") {
      const callbackUrl = pathname || `/${locale}/shop`;
      router.push(`/${locale}/connexion?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    const wasFavorite = ids.has(productId);
    setIds((current) => {
      const next = new Set(current);
      if (wasFavorite) next.delete(productId);
      else next.add(productId);
      return next;
    });

    const response = await fetch("/api/shop/favorites", {
      method: wasFavorite ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (!response.ok) {
      setIds((current) => {
        const next = new Set(current);
        if (wasFavorite) next.add(productId);
        else next.delete(productId);
        return next;
      });
    }
  }, [ids, locale, pathname, router, status]);

  const value = useMemo<FavoritesContextValue>(() => ({
    ready,
    isFavorite: (productId) => ids.has(productId),
    toggleFavorite,
  }), [ids, ready, toggleFavorite]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
