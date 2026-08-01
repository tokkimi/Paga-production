import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "600", "700", "800"],
});

const siteUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || "https://paga-production.vercel.app";
const metadataBase = new URL(siteUrl.startsWith("http") ? siteUrl : "https://" + siteUrl);

export const metadata: Metadata = {
  title: {
    default: "Paga Production | DJ Label",
    template: "%s | Paga Production",
  },
  description:
    "Paga Production is a DJ label and artist management platform for bookings, music, events and brand partnerships.",
  keywords: ["Paga", "DJ", "label", "France", "Korea", "Asia", "Alexis Dante", "electro", "techno", "summer tour 2026"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://paga-production.vercel.app",
    siteName: "Paga Production",
    title: "Paga Production | DJ Label",
    description:
      "DJ label and artist management platform for bookings, music, events and brand partnerships.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paga Production",
    description:
      "DJ label and artist management platform for bookings, music, events and brand partnerships.",
  },
  metadataBase,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
