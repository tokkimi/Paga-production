import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { PrismaClient, type ProductAudience, type ProductCategory } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type MerchImage = { file: string; alt: string };
type MerchProduct = {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  details: string;
  category: ProductCategory;
  audience: ProductAudience;
  sourceUrl?: string;
  priceCents: number;
  sizes: string[];
  colors: string[];
  order: number;
  images: MerchImage[];
};

const assetDirectory = path.join(process.cwd(), "public", "shop-products");
const care = "Lavage à la main ou en machine à froid. Ne pas nettoyer à sec, blanchir, sécher au sèche-linge ni repasser directement sur l’imprimé.";
const legacyColorSlugs = [
  "t-shirt-classique-noir",
  "t-shirt-classique-blanc",
  "t-shirt-classique-gris-chine",
  "t-shirt-raglan-noir",
  "t-shirt-raglan-rouge",
  "t-shirt-raglan-marine",
  "hoodie-sherrie-sherrie-blanc",
  "hoodie-zippe-sherrie-sherrie-gris",
];

const products: MerchProduct[] = [
  {
    slug: "essentiel-t-shirt-classique",
    name: "Essentiel — T-shirt classique",
    nameEn: "Essentiel — Classic T-shirt",
    description: "T-shirt unisexe à coupe droite avec le logo Sherrie Sherrie en dégradé rose-orange. Une seule fiche regroupe toutes les couleurs disponibles.",
    descriptionEn: "Straight-cut unisex T-shirt with the pink-to-orange Sherrie Sherrie logo. All available colours are grouped on one product page.",
    details: `Tailles disponibles : S, M et L. Coupe unisexe. Coton doux. ${care}`,
    category: "TSHIRT",
    audience: "MIXTE",
    priceCents: 3399,
    sizes: ["S", "M", "L"],
    colors: ["Noir", "Blanc", "Gris chiné"],
    order: 0,
    images: [
      { file: "collection-01/tee-classic-black-main.png", alt: "T-shirt classique Essentiel noir, vue produit non portée" },
      { file: "collection-01/tee-classic-black-worn-front.png", alt: "T-shirt classique Essentiel noir porté, vue de face" },
      { file: "collection-01/tee-classic-black-worn-back.png", alt: "T-shirt classique Essentiel noir porté, vue de dos" },
      { file: "collection-01/tee-classic-white-main.png", alt: "T-shirt classique Essentiel blanc, vue produit non portée" },
      { file: "collection-01/tee-classic-white-worn-front.png", alt: "T-shirt classique Essentiel blanc porté, vue de face" },
      { file: "collection-01/tee-classic-white-worn-back.png", alt: "T-shirt classique Essentiel blanc porté, vue de dos" },
      { file: "collection-01/tee-classic-grey-main.png", alt: "T-shirt classique Essentiel gris chiné, vue produit non portée" },
      { file: "collection-01/tee-classic-grey-worn-front.png", alt: "T-shirt classique Essentiel gris chiné porté, vue de face" },
      { file: "collection-01/tee-classic-grey-worn-back.png", alt: "T-shirt classique Essentiel gris chiné porté, vue de dos" },
    ],
  },
  {
    slug: "essentiel-t-shirt-raglan",
    name: "Essentiel — T-shirt raglan",
    nameEn: "Essentiel — Raglan T-shirt",
    description: "T-shirt unisexe à manches trois-quarts raglan, corps blanc et logo Sherrie Sherrie sur la poitrine. Les trois couleurs de manches sont réunies sur une fiche.",
    descriptionEn: "Unisex three-quarter sleeve raglan T-shirt with a white body and Sherrie Sherrie chest logo. All three sleeve colours share one product page.",
    details: `Tailles disponibles : S, M et L. Coupe unisexe. ${care}`,
    category: "TSHIRT",
    audience: "MIXTE",
    priceCents: 2999,
    sizes: ["S", "M", "L"],
    colors: ["Blanc / Noir", "Blanc / Rouge", "Blanc / Bleu marine"],
    order: 1,
    images: [
      { file: "collection-01/tee-raglan-black-main.png", alt: "T-shirt raglan Essentiel blanc et noir, vue produit non portée" },
      { file: "collection-01/tee-raglan-black-worn-front.png", alt: "T-shirt raglan Essentiel blanc et noir porté" },
      { file: "collection-01/tee-raglan-red-main.png", alt: "T-shirt raglan Essentiel blanc et rouge, vue produit non portée" },
      { file: "collection-01/tee-raglan-red-worn-front.png", alt: "T-shirt raglan Essentiel blanc et rouge porté" },
      { file: "collection-01/tee-raglan-navy-main.png", alt: "T-shirt raglan Essentiel blanc et bleu marine, vue produit non portée" },
      { file: "collection-01/tee-raglan-navy-worn-front.png", alt: "T-shirt raglan Essentiel blanc et bleu marine porté" },
    ],
  },
  {
    slug: "essentiel-hoodie-pullover",
    name: "Essentiel — Hoodie blanc",
    nameEn: "Essentiel — White pullover hoodie",
    description: "Hoodie unisexe à capuche, poche kangourou et logo Sherrie Sherrie sur la poitrine.",
    descriptionEn: "Unisex pullover hoodie with a kangaroo pocket and Sherrie Sherrie chest logo.",
    details: `Tailles disponibles : S, M et L. Coupe unisexe. ${care}`,
    category: "HOODIE",
    audience: "MIXTE",
    priceCents: 4599,
    sizes: ["S", "M", "L"],
    colors: ["Blanc"],
    order: 2,
    images: [
      { file: "collection-01/hoodie-pullover-white-main.png", alt: "Hoodie Essentiel blanc, vue produit non portée" },
      { file: "collection-01/hoodie-pullover-white-worn-front.png", alt: "Hoodie Essentiel blanc porté, vue de face" },
      { file: "collection-01/hoodie-pullover-white-worn-back.png", alt: "Hoodie Essentiel blanc porté, vue de dos" },
    ],
  },
  {
    slug: "essentiel-hoodie-zippe",
    name: "Essentiel — Hoodie zippé gris",
    nameEn: "Essentiel — Grey zip hoodie",
    description: "Hoodie unisexe zippé, poches avant, cordons blancs et petit logo Sherrie Sherrie côté cœur.",
    descriptionEn: "Unisex zip hoodie with front pockets, white drawstrings and a small Sherrie Sherrie chest logo.",
    details: `Tailles disponibles : S, M et L. Coupe unisexe. ${care}`,
    category: "JACKET",
    audience: "MIXTE",
    priceCents: 4599,
    sizes: ["S", "M", "L"],
    colors: ["Gris chiné"],
    order: 3,
    images: [
      { file: "collection-01/hoodie-zip-grey-main.png", alt: "Hoodie zippé Essentiel gris chiné, vue produit non portée" },
      { file: "collection-01/hoodie-zip-grey-worn-front.png", alt: "Hoodie zippé Essentiel gris chiné porté, vue de face" },
      { file: "collection-01/hoodie-zip-grey-worn-back.png", alt: "Hoodie zippé Essentiel gris chiné porté, vue de dos" },
    ],
  },
  {
    slug: "essentiel-t-shirt-decontracte",
    name: "Essentiel — T-shirt décontracté",
    nameEn: "Essentiel — Relaxed T-shirt",
    description: "T-shirt souple à coupe relax et toucher vintage, avec col et manches côtelés.",
    descriptionEn: "Soft relaxed-fit T-shirt with a vintage wash and ribbed neck and sleeves.",
    details: `55 % coton filé, 45 % polyester. Jersey délavé vintage de poids moyen. ${care}`,
    category: "TSHIRT",
    audience: "FEMME",
    sourceUrl: "https://www.redbubble.com/fr/i/t-shirt/Sherrie-sherrie-par-alexialila/182713722/xmcg",
    priceCents: 3499,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Noir de jais", "Gris", "Naturel", "Marine", "Bronze", "Rose", "Basil Green", "Prune", "Oceanside"],
    order: 4,
    images: [
      { file: "essentiel/relaxed-tee-main.webp", alt: "T-shirt décontracté Essentiel, vue produit non portée sur fond clair" },
      { file: "essentiel/relaxed-tee-women.webp", alt: "T-shirt décontracté Essentiel porté par une femme, vue de face" },
      { file: "essentiel/relaxed-tee-women-back.webp", alt: "T-shirt décontracté Essentiel porté par une femme, vue de dos" },
      { file: "essentiel/relaxed-tee-art.webp", alt: "Détail du visuel Sherrie Sherrie de la collection Essentiel" },
    ],
  },
  {
    slug: "essentiel-t-shirt-oversize",
    name: "Essentiel — T-shirt oversize",
    nameEn: "Essentiel — Oversized T-shirt",
    description: "T-shirt premium oversize à col rond, épaules tombantes et manches mi-longues amples. Silhouette unisexe.",
    descriptionEn: "Premium oversized crew-neck T-shirt with dropped shoulders and roomy mid-length sleeves. Unisex silhouette.",
    details: "Jersey épais 240 g/m², 100 % coton filé. Col côtelé à surpiqûre simple.",
    category: "TSHIRT",
    audience: "MIXTE",
    sourceUrl: "https://www.redbubble.com/fr/i/t-shirt/Sherrie-sherrie-par-alexialila/182713722/rh5j",
    priceCents: 3999,
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["Noir", "Blanc", "Marine", "Gris fumée", "Sable", "Rouge coquelicot", "Vert treillis", "Marron kaki"],
    order: 5,
    images: [
      { file: "essentiel/oversize-tee-main.webp", alt: "T-shirt oversize Essentiel, vue produit non portée sur fond clair" },
      { file: "essentiel/oversize-tee-men.webp", alt: "T-shirt oversize Essentiel porté par un homme" },
      { file: "essentiel/oversize-tee-women.webp", alt: "T-shirt oversize Essentiel porté par une femme" },
      { file: "essentiel/oversize-tee-lifestyle.webp", alt: "T-shirt oversize Essentiel porté en situation" },
    ],
  },
  {
    slug: "essentiel-casquette-dad-hat",
    name: "Essentiel — Casquette Dad Hat",
    nameEn: "Essentiel — Dad Hat",
    description: "Casquette décontractée souple, profil moyen, visière légèrement incurvée et bride à boucle réglable.",
    descriptionEn: "Relaxed unstructured mid-profile Dad Hat with a gently curved visor and adjustable buckle strap.",
    details: "100 % coton, 240 g/m². Construction cinq pans avec panneau avant doublé. Nettoyage au chiffon humide.",
    category: "CAP",
    audience: "MIXTE",
    sourceUrl: "https://www.redbubble.com/fr/i/casquette/Sherrie-sherrie-par-alexialila/182713722/fce2",
    priceCents: 3099,
    sizes: ["Taille unique"],
    colors: ["Noir", "Blanc", "Gris ardoise", "Beige", "Marine", "Vert jade", "Rose clair"],
    order: 6,
    images: [
      { file: "essentiel/dad-hat-main.webp", alt: "Casquette Dad Hat Essentiel, vue produit non portée" },
      { file: "essentiel/dad-hat-hanging.webp", alt: "Casquette Dad Hat Essentiel suspendue" },
      { file: "essentiel/dad-hat-men.webp", alt: "Casquette Dad Hat Essentiel portée par un homme" },
      { file: "essentiel/dad-hat-women.webp", alt: "Casquette Dad Hat Essentiel portée par une femme" },
    ],
  },
  {
    slug: "essentiel-casquette-baseball",
    name: "Essentiel — Casquette baseball",
    nameEn: "Essentiel — Baseball cap",
    description: "Casquette structurée à profil moyen, visière incurvée et bride à boutons-pression réglable.",
    descriptionEn: "Structured mid-profile baseball cap with a curved visor and adjustable snapback closure.",
    details: "100 % polyester, 285 g/m². Construction cinq pans avec panneau avant doublé. Nettoyage au chiffon humide.",
    category: "CAP",
    audience: "MIXTE",
    sourceUrl: "https://www.redbubble.com/fr/i/casquette/Sherrie-sherrie-par-alexialila/182713722/4sgw",
    priceCents: 3099,
    sizes: ["Taille unique"],
    colors: ["Noir", "Blanc", "Gris foncé", "Gris clair", "Marine", "Bleu clair"],
    order: 7,
    images: [
      { file: "essentiel/baseball-cap-main.webp", alt: "Casquette baseball Essentiel, vue produit non portée" },
      { file: "essentiel/baseball-cap-hanging.webp", alt: "Casquette baseball Essentiel suspendue" },
      { file: "essentiel/baseball-cap-men.webp", alt: "Casquette baseball Essentiel portée par un homme" },
      { file: "essentiel/baseball-cap-women.webp", alt: "Casquette baseball Essentiel portée par une femme" },
    ],
  },
  {
    slug: "essentiel-sweat-capuche-leger",
    name: "Essentiel — Sweat à capuche léger",
    nameEn: "Essentiel — Lightweight hoodie",
    description: "Sweat à capuche léger à coupe ajustée, poche kangourou, cordon assorti et poignets bords-côtes.",
    descriptionEn: "Slim-fit lightweight hoodie with a kangaroo pocket, matching drawstring and ribbed cuffs.",
    details: `Molleton 250 g/m². Couleurs unies : 80 % coton filé et 20 % polyester. Couleurs chinées : 60 % coton filé et 40 % polyester. ${care}`,
    category: "HOODIE",
    audience: "MIXTE",
    sourceUrl: "https://www.redbubble.com/fr/i/sweat/Sherrie-sherrie-par-alexialila/182713722/lgcw",
    priceCents: 4899,
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["Noir", "Gris chiné", "Gris anthracite chiné", "Bleu roi chiné", "Marine", "Denim chiné"],
    order: 8,
    images: [
      { file: "essentiel/light-hoodie-main.webp", alt: "Sweat à capuche léger Essentiel, vue produit non portée" },
      { file: "essentiel/light-hoodie-men.webp", alt: "Sweat à capuche léger Essentiel porté par un homme" },
      { file: "essentiel/light-hoodie-women.webp", alt: "Sweat à capuche léger Essentiel porté par une femme" },
      { file: "essentiel/light-hoodie-men-back.webp", alt: "Sweat à capuche léger Essentiel porté, vue de dos" },
    ],
  },
  {
    slug: "essentiel-debardeur-dos-nageur",
    name: "Essentiel — Débardeur dos nageur",
    nameEn: "Essentiel — Racerback tank",
    description: "Débardeur féminin moulant à dos nageur, grandes échancrures et fini doux et lisse.",
    descriptionEn: "Fitted women's racerback tank with generous arm openings and a soft, smooth finish.",
    details: "100 % coton. Laver à froid puis sécher à l’air libre.",
    category: "TANK",
    audience: "FEMME",
    sourceUrl: "https://www.redbubble.com/fr/i/d%C3%A9bardeur/Sherrie-sherrie-par-alexialila/182713722/wwtp",
    priceCents: 3199,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Noir", "Blanc", "Bleu foncé"],
    order: 9,
    images: [
      { file: "essentiel/racerback-main.webp", alt: "Débardeur dos nageur Essentiel, vue produit non portée" },
      { file: "essentiel/racerback-women.webp", alt: "Débardeur dos nageur Essentiel porté par une femme" },
      { file: "essentiel/racerback-women-back.webp", alt: "Débardeur dos nageur Essentiel porté, vue de dos" },
      { file: "essentiel/racerback-art.webp", alt: "Détail du visuel Sherrie Sherrie du débardeur dos nageur" },
    ],
  },
  {
    slug: "essentiel-debardeur",
    name: "Essentiel — Débardeur",
    nameEn: "Essentiel — Tank top",
    description: "Débardeur à coupe ajustée et visuel Sherrie Sherrie sur la poitrine.",
    descriptionEn: "Slim-fit tank top with the Sherrie Sherrie artwork on the chest.",
    details: `Couleurs unies 100 % coton. Prendre une taille au-dessus pour une coupe moins près du corps. ${care}`,
    category: "TANK",
    audience: "HOMME",
    sourceUrl: "https://www.redbubble.com/fr/i/d%C3%A9bardeur/Sherrie-sherrie-par-alexialila/182713722/5xql",
    priceCents: 3099,
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: ["Noir", "Blanc", "Bleu foncé", "Gris chiné", "Bleu", "Rouge"],
    order: 10,
    images: [
      { file: "essentiel/tank-main.webp", alt: "Débardeur Essentiel, vue produit non portée" },
      { file: "essentiel/tank-men.webp", alt: "Débardeur Essentiel porté par un homme" },
      { file: "essentiel/tank-men-back.webp", alt: "Débardeur Essentiel porté, vue de dos" },
      { file: "essentiel/tank-art.webp", alt: "Détail du visuel Sherrie Sherrie du débardeur" },
    ],
  },
  {
    slug: "essentiel-sac-de-sport",
    name: "Essentiel — Sac de sport",
    nameEn: "Essentiel — Duffle bag",
    description: "Sac de sport robuste pour la salle, le bureau et les voyages, disponible en deux formats.",
    descriptionEn: "Durable duffle bag for the gym, office and travel, available in two sizes.",
    details: "Toile 100 % polyester. Petit : 49 × 24 × 24 cm. Grand : 58 × 30 × 30 cm. Poche ordinateur, poche extérieure en filet et bandoulière rembourrée réglable. Impression par sublimation.",
    category: "ACCESSORY",
    audience: "MIXTE",
    sourceUrl: "https://www.redbubble.com/fr/i/sac-de-sport/Sherrie-sherrie-par-alexialila/182713722/mf4n",
    priceCents: 6899,
    sizes: ["Petit", "Grand"],
    colors: [],
    order: 11,
    images: [
      { file: "essentiel/duffle-main.webp", alt: "Sac de sport Essentiel, vue produit de face" },
      { file: "essentiel/duffle-back.webp", alt: "Sac de sport Essentiel, vue arrière" },
      { file: "essentiel/duffle-art.webp", alt: "Détail du visuel Sherrie Sherrie du sac de sport" },
    ],
  },
];

function contentType(file: string) {
  if (file.endsWith(".png")) return "image/png";
  if (file.endsWith(".jpg") || file.endsWith(".jpeg")) return "image/jpeg";
  return "image/webp";
}

async function main() {
  const shouldApply = process.argv.includes("--apply");
  const shouldList = process.argv.includes("--list");
  if (!shouldApply && !shouldList) throw new Error("Ajoutez --apply pour publier la collection Essentiel.");

  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!connectionString) throw new Error("DATABASE_URL_UNPOOLED ou DATABASE_URL est manquante.");
  if (shouldApply && !blobToken) throw new Error("BLOB_READ_WRITE_TOKEN est manquant.");

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    if (shouldList) {
      const rows = await prisma.product.findMany({
        where: { collection: "Essentiel" },
        select: { slug: true, name: true, priceCents: true, audience: true, colors: true, images: { select: { url: true }, orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      });
      console.log(JSON.stringify(rows, null, 2));
      return;
    }

    for (const product of products) {
      for (const image of product.images) {
        const filePath = path.join(assetDirectory, image.file);
        const fileStats = await stat(filePath);
        if (!fileStats.isFile() || fileStats.size === 0) throw new Error(`Image invalide : ${filePath}`);
      }
    }

    for (const product of products) {
      const uploadedImages = [];
      for (const [order, image] of product.images.entries()) {
        const sourcePath = path.join(assetDirectory, image.file);
        const fileName = path.basename(image.file);
        const blobPath = `shop/essentiel/${product.slug}/${fileName}`;
        const blob = await put(blobPath, await readFile(sourcePath), {
          access: "public",
          addRandomSuffix: false,
          allowOverwrite: true,
          cacheControlMaxAge: 31_536_000,
          contentType: contentType(image.file),
          token: blobToken!,
        });
        uploadedImages.push({ url: blob.url, pathname: blob.pathname, alt: image.alt, order });
      }

      const data = {
        name: product.name,
        nameEn: product.nameEn,
        description: product.description,
        descriptionEn: product.descriptionEn,
        details: product.details,
        category: product.category,
        collection: "Essentiel",
        audience: product.audience,
        sourceUrl: product.sourceUrl || null,
        priceCents: product.priceCents,
        currency: "EUR",
        sizes: product.sizes,
        colors: product.colors,
        stock: 0,
        trackStock: false,
        isActive: true,
        isFeatured: true,
        order: product.order,
      };
      await prisma.product.upsert({
        where: { slug: product.slug },
        create: { slug: product.slug, ...data, images: { create: uploadedImages } },
        update: { ...data, images: { deleteMany: {}, create: uploadedImages } },
      });
      console.log(`✓ ${product.name} — ${(product.priceCents / 100).toFixed(2)} € — ${product.colors.length} couleur(s)`);
    }

    const removed = await prisma.product.deleteMany({ where: { slug: { in: legacyColorSlugs } } });
    const published = await prisma.product.findMany({
      where: { slug: { in: products.map((product) => product.slug) } },
      select: { slug: true, collection: true, images: { select: { order: true }, orderBy: { order: "asc" } } },
    });
    if (published.length !== products.length || published.some((product) => product.collection !== "Essentiel" || product.images[0]?.order !== 0)) {
      throw new Error("La vérification finale de la collection Essentiel a échoué.");
    }
    console.log(`Collection Essentiel vérifiée : ${published.length} modèles. Anciennes fiches par couleur supprimées : ${removed.count}.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
