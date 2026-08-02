import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || "https://paga-production.vercel.app";
const metadataBase = new URL(siteUrl.startsWith("http") ? siteUrl : "https://" + siteUrl);

export const metadata: Metadata = {
  title: {
    default: "Sherrie Sherrie | DJ Project",
    template: "%s | Sherrie Sherrie",
  },
  description:
    "Sherrie Sherrie is the DJ project by Paga and Alexis Dante for bookings, music, events and brand partnerships.",
  keywords: ["Sherrie Sherrie", "Paga", "DJ", "France", "Korea", "Asia", "Alexis Dante", "electro", "house", "summer tour 2026"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://paga-production.vercel.app",
    siteName: "Sherrie Sherrie",
    title: "Sherrie Sherrie | DJ Project",
    description:
      "DJ project by Paga and Alexis Dante for bookings, music, events and brand partnerships.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sherrie Sherrie",
    description:
      "DJ project by Paga and Alexis Dante for bookings, music, events and brand partnerships.",
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
