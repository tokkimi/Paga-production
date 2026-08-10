import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sherriesherrie.com";
const metadataBase = new URL(siteUrl.startsWith("http") ? siteUrl : "https://" + siteUrl);

export const metadata: Metadata = {
  title: {
    default: "Sherrie Sherrie | DJ Project",
    template: "%s | Sherrie Sherrie",
  },
  description:
    "Sherrie Sherrie, le projet DJ de Paga et Alexis Dante : musique, dates, booking, collaborations et boutique officielle.",
  keywords: ["Sherrie Sherrie", "Paga", "Alexis Dante", "DJ", "house", "musique électronique", "dates", "merch", "boutique officielle"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Sherrie Sherrie",
    title: "Sherrie Sherrie | DJ Project",
    description:
      "Projet DJ de Paga et Alexis Dante : musique, dates, booking et boutique officielle.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sherrie Sherrie",
    description:
      "Projet DJ de Paga et Alexis Dante : musique, dates, booking et boutique officielle.",
  },
  metadataBase,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
