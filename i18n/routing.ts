import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  pathnames: {
    "/": "/",
    "/artistes": "/artistes",
    "/artistes/[slug]": "/artistes/[slug]",
    "/dates": "/dates",
    "/dates/[id]": "/dates/[id]",
    "/sponsors": "/sponsors",
    "/rejoindre": "/rejoindre",
    "/connexion": "/connexion",
    "/inscription": "/inscription",
    "/profil": "/profil",
    "/marque": "/marque",
    "/admin": "/admin",
    "/cgv": "/cgv",
    "/mentions-legales": "/mentions-legales",
    "/politique-confidentialite": "/politique-confidentialite",
    "/cookies": "/cookies",
  },
});