import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const resolvedUrl =
  process.env.NEXTAUTH_URL ||
  (process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "https://paga-production.vercel.app");

process.env.NEXTAUTH_URL = resolvedUrl;
if (!process.env.NEXTAUTH_SECRET) {
  if (process.env.VERCEL) {
    throw new Error("NEXTAUTH_SECRET is required in production");
  }
  process.env.NEXTAUTH_SECRET = "paga-production-local-preview-secret";
}
process.env.DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "is1-ssl.mzstatic.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
