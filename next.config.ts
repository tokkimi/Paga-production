import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const resolvedUrl =
  process.env.NEXTAUTH_URL ||
  (process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "https://paga-production.vercel.app");

process.env.NEXTAUTH_URL = resolvedUrl;
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "paga-production-local-preview-secret";
process.env.DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
