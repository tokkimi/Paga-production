import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import BottomNav from "@/components/BottomNav";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import NewReleasePlayer from "@/components/NewReleasePlayer";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const locales = routing.locales as readonly string[];
  if (!locales.includes(locale)) notFound();
  const messages = await getMessages();

  return (
    <Providers locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="site-main flex-1">{children}</main>
        <Footer />
        <NewReleasePlayer />
        <BottomNav />
        <CookieBanner />
        <AnalyticsTracker />
      </div>
    </Providers>
  );
}
