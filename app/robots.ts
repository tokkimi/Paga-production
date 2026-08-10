import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/fr/admin/",
        "/en/admin/",
        "/ko/admin/",
        "/fr/connexion",
        "/en/connexion",
        "/ko/connexion",
        "/fr/profil",
        "/en/profil",
        "/ko/profil",
      ],
    },
    sitemap: "https://www.sherriesherrie.com/sitemap.xml",
    host: "https://www.sherriesherrie.com",
  };
}

