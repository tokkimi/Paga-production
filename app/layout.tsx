import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Paga Production | DJ Label - South of France",
    template: "%s | Paga Production",
  },
  description:
    "Paga Production - Label DJ et management artistique basé dans le Sud de la France. Retrouvez les dates de concert de Paga et Alexis Dante.",
  keywords: [
    "Paga",
    "DJ",
    "label",
    "France",
    "Alexis Dante",
    "electro",
    "techno",
    "summer tour 2026",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://pagaproduction.fr",
    siteName: "Paga Production",
    title: "Paga Production | DJ Label - South of France",
    description:
      "Label DJ et management artistique basé dans le Sud de la France.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paga Production",
    description:
      "Label DJ et management artistique basé dans le Sud de la France.",
  },
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable}`}>
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
