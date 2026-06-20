"use client";

import { SessionProvider } from "next-auth/react";
import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}

export default function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
