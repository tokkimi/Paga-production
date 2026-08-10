import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en", "ko"],
  defaultLocale: "fr",
  pathnames: {
    "/": "/",
    "/artistes": "/artistes",
    "/artistes/[slug]": "/artistes/[slug]",
    "/dates": "/dates",
    "/dates/[id]": "/dates/[id]",
    "/shop": "/shop",
    "/shop/[slug]": "/shop/[slug]",
    "/shop/confirmation": "/shop/confirmation",
    "/sponsors": "/sponsors",
    "/rejoindre": "/rejoindre",
    "/connexion": "/connexion",
    "/inscription": "/inscription",
    "/profil": "/profil",
    "/marque": "/marque",
    "/admin": "/admin",
    "/admin/boutique": "/admin/boutique",
    "/cgv": "/cgv",
    "/mentions-legales": "/mentions-legales",
    "/politique-confidentialite": "/politique-confidentialite",
    "/cookies": "/cookies",
  },
});
