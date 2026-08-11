"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import ShopCartProvider from "@/components/shop/ShopCartProvider";
import ShopFavoritesProvider from "@/components/shop/ShopFavoritesProvider";

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}

export default function Providers({ children, locale, messages }: ProvidersProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ShopFavoritesProvider>
          <ShopCartProvider>{children}</ShopCartProvider>
        </ShopFavoritesProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
