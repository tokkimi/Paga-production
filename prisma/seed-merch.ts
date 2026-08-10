import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { PrismaClient, type ProductCategory } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type MerchImage = {
  file: string;
  alt: string;
};

type MerchProduct = {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  details: string;
  category: ProductCategory;
  priceCents: number;
  colors: string[];
  order: number;
  images: MerchImage[];
};

const assetDirectory = path.join(process.cwd(), "public", "shop-products", "collection-01");
const sizes = ["S", "M", "L"];
const productCare = "Tailles disponibles : S, M et L. Coupe unisexe. Lavage à 30 °C sur l’envers. Ne pas repasser directement sur l’impression.";

const products: MerchProduct[] = [
  {
    slug: "t-shirt-classique-noir",
    name: "T-shirt classique Sherrie Sherrie — Noir",
    nameEn: "Sherrie Sherrie Classic T-shirt — Black",
    description: "T-shirt unisexe en coton doux, coupe droite, avec le logo Sherrie Sherrie en dégradé rose-orange sur la poitrine.",
    descriptionEn: "Soft unisex cotton T-shirt with a straight cut and the pink-to-orange Sherrie Sherrie logo on the chest.",
    details: productCare,
    category: "TSHIRT",
    priceCents: 3399,
    colors: ["Noir"],
    order: 0,
    images: [
      { file: "tee-classic-black-main.png", alt: "T-shirt classique Sherrie Sherrie noir sur fond blanc" },
      { file: "tee-classic-black-worn-front.png", alt: "T-shirt classique Sherrie Sherrie noir porté, vue de face" },
      { file: "tee-classic-black-worn-back.png", alt: "T-shirt classique Sherrie Sherrie noir porté, vue de dos" },
    ],
  },
  {
    slug: "t-shirt-classique-blanc",
    name: "T-shirt classique Sherrie Sherrie — Blanc",
    nameEn: "Sherrie Sherrie Classic T-shirt — White",
    description: "T-shirt unisexe en coton doux, coupe droite, avec le logo Sherrie Sherrie en dégradé rose-orange sur la poitrine.",
    descriptionEn: "Soft unisex cotton T-shirt with a straight cut and the pink-to-orange Sherrie Sherrie logo on the chest.",
    details: productCare,
    category: "TSHIRT",
    priceCents: 3399,
    colors: ["Blanc"],
    order: 1,
    images: [
      { file: "tee-classic-white-main.png", alt: "T-shirt classique Sherrie Sherrie blanc sur fond blanc" },
      { file: "tee-classic-white-worn-front.png", alt: "T-shirt classique Sherrie Sherrie blanc porté, vue de face" },
      { file: "tee-classic-white-worn-back.png", alt: "T-shirt classique Sherrie Sherrie blanc porté, vue de dos" },
    ],
  },
  {
    slug: "t-shirt-classique-gris-chine",
    name: "T-shirt classique Sherrie Sherrie — Gris chiné",
    nameEn: "Sherrie Sherrie Classic T-shirt — Heather Grey",
    description: "T-shirt unisexe en coton doux, coupe droite, avec le logo Sherrie Sherrie en dégradé rose-orange sur la poitrine.",
    descriptionEn: "Soft unisex cotton T-shirt with a straight cut and the pink-to-orange Sherrie Sherrie logo on the chest.",
    details: productCare,
    category: "TSHIRT",
    priceCents: 3399,
    colors: ["Gris chiné"],
    order: 2,
    images: [
      { file: "tee-classic-grey-main.png", alt: "T-shirt classique Sherrie Sherrie gris chiné sur fond blanc" },
      { file: "tee-classic-grey-worn-front.png", alt: "T-shirt classique Sherrie Sherrie gris chiné porté, vue de face" },
      { file: "tee-classic-grey-worn-back.png", alt: "T-shirt classique Sherrie Sherrie gris chiné porté, vue de dos" },
    ],
  },
  {
    slug: "t-shirt-raglan-noir",
    name: "T-shirt raglan Sherrie Sherrie — Manches noires",
    nameEn: "Sherrie Sherrie Raglan T-shirt — Black Sleeves",
    description: "T-shirt unisexe à manches 3/4 style raglan, corps blanc, manches noires et logo Sherrie Sherrie sur la poitrine.",
    descriptionEn: "Unisex three-quarter sleeve raglan T-shirt with a white body, black sleeves and the Sherrie Sherrie chest logo.",
    details: productCare,
    category: "TSHIRT",
    priceCents: 2999,
    colors: ["Blanc / Noir"],
    order: 3,
    images: [
      { file: "tee-raglan-black-main.png", alt: "T-shirt raglan Sherrie Sherrie blanc et noir sur fond blanc" },
      { file: "tee-raglan-black-worn-front.png", alt: "T-shirt raglan Sherrie Sherrie blanc et noir porté" },
    ],
  },
  {
    slug: "t-shirt-raglan-rouge",
    name: "T-shirt raglan Sherrie Sherrie — Manches rouges",
    nameEn: "Sherrie Sherrie Raglan T-shirt — Red Sleeves",
    description: "T-shirt unisexe à manches 3/4 style raglan, corps blanc, manches rouges et logo Sherrie Sherrie sur la poitrine.",
    descriptionEn: "Unisex three-quarter sleeve raglan T-shirt with a white body, red sleeves and the Sherrie Sherrie chest logo.",
    details: productCare,
    category: "TSHIRT",
    priceCents: 2999,
    colors: ["Blanc / Rouge"],
    order: 4,
    images: [
      { file: "tee-raglan-red-main.png", alt: "T-shirt raglan Sherrie Sherrie blanc et rouge sur fond blanc" },
      { file: "tee-raglan-red-worn-front.png", alt: "T-shirt raglan Sherrie Sherrie blanc et rouge porté" },
    ],
  },
  {
    slug: "t-shirt-raglan-marine",
    name: "T-shirt raglan Sherrie Sherrie — Manches marine",
    nameEn: "Sherrie Sherrie Raglan T-shirt — Navy Sleeves",
    description: "T-shirt unisexe à manches 3/4 style raglan, corps blanc, manches bleu marine et logo Sherrie Sherrie sur la poitrine.",
    descriptionEn: "Unisex three-quarter sleeve raglan T-shirt with a white body, navy sleeves and the Sherrie Sherrie chest logo.",
    details: productCare,
    category: "TSHIRT",
    priceCents: 2999,
    colors: ["Blanc / Bleu marine"],
    order: 5,
    images: [
      { file: "tee-raglan-navy-main.png", alt: "T-shirt raglan Sherrie Sherrie blanc et bleu marine sur fond blanc" },
      { file: "tee-raglan-navy-worn-front.png", alt: "T-shirt raglan Sherrie Sherrie blanc et bleu marine porté" },
    ],
  },
  {
    slug: "hoodie-sherrie-sherrie-blanc",
    name: "Hoodie Sherrie Sherrie — Blanc",
    nameEn: "Sherrie Sherrie Pullover Hoodie — White",
    description: "Hoodie unisexe à capuche avec poche kangourou et logo Sherrie Sherrie sur la poitrine.",
    descriptionEn: "Unisex pullover hoodie with a kangaroo pocket and the Sherrie Sherrie logo on the chest.",
    details: productCare,
    category: "HOODIE",
    priceCents: 4599,
    colors: ["Blanc"],
    order: 6,
    images: [
      { file: "hoodie-pullover-white-main.png", alt: "Hoodie Sherrie Sherrie blanc sur fond blanc" },
      { file: "hoodie-pullover-white-worn-front.png", alt: "Hoodie Sherrie Sherrie blanc porté, vue de face" },
      { file: "hoodie-pullover-white-worn-back.png", alt: "Hoodie Sherrie Sherrie blanc porté, vue de dos" },
    ],
  },
  {
    slug: "hoodie-zippe-sherrie-sherrie-gris",
    name: "Hoodie zippé Sherrie Sherrie — Gris chiné",
    nameEn: "Sherrie Sherrie Zip Hoodie — Heather Grey",
    description: "Hoodie unisexe zippé, poches avant, cordons blancs et petit logo Sherrie Sherrie côté cœur.",
    descriptionEn: "Unisex zip hoodie with front pockets, white drawstrings and a small Sherrie Sherrie logo on the chest.",
    details: productCare,
    category: "HOODIE",
    priceCents: 4599,
    colors: ["Gris chiné"],
    order: 7,
    images: [
      { file: "hoodie-zip-grey-main.png", alt: "Hoodie zippé Sherrie Sherrie gris chiné sur fond blanc" },
      { file: "hoodie-zip-grey-worn-front.png", alt: "Hoodie zippé Sherrie Sherrie gris chiné porté, vue de face" },
      { file: "hoodie-zip-grey-worn-back.png", alt: "Hoodie zippé Sherrie Sherrie gris chiné porté, vue de dos" },
    ],
  },
];

async function main() {
  const shouldApply = process.argv.includes("--apply");
  const shouldList = process.argv.includes("--list");
  if (!shouldApply && !shouldList) {
    throw new Error("Ajoutez --apply pour publier la collection merch.");
  }

  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!connectionString) throw new Error("DATABASE_URL_UNPOOLED ou DATABASE_URL est manquante.");
  if (shouldApply && !blobToken) throw new Error("BLOB_READ_WRITE_TOKEN est manquant.");

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  if (shouldList) {
    try {
      const rows = await prisma.product.findMany({
        select: { slug: true, name: true, priceCents: true, isActive: true, order: true, images: { select: { url: true, order: true }, orderBy: { order: "asc" } } },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      });
      console.log(JSON.stringify(rows, null, 2));
      return;
    } finally {
      await prisma.$disconnect();
    }
  }

  for (const product of products) {
    for (const image of product.images) {
      const filePath = path.join(assetDirectory, image.file);
      const fileStats = await stat(filePath);
      if (!fileStats.isFile() || fileStats.size === 0) throw new Error(`Image invalide : ${filePath}`);
    }
  }

  try {
    const existingCount = await prisma.product.count();
    console.log(`Produits existants avant synchronisation : ${existingCount}`);

    for (const product of products) {
      const uploadedImages = [];
      for (const [order, image] of product.images.entries()) {
        const sourcePath = path.join(assetDirectory, image.file);
        const blobPath = `shop/collection-01/${product.slug}/${image.file}`;
        const blob = await put(blobPath, await readFile(sourcePath), {
          access: "public",
          addRandomSuffix: false,
          allowOverwrite: true,
          cacheControlMaxAge: 31_536_000,
          contentType: "image/png",
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
        priceCents: product.priceCents,
        currency: "EUR",
        sizes,
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
      console.log(`✓ ${product.name} — ${(product.priceCents / 100).toFixed(2)} €`);
    }

    const published = await prisma.product.findMany({
      where: { slug: { in: products.map((product) => product.slug) } },
      select: { slug: true, priceCents: true, sizes: true, colors: true, images: { select: { order: true }, orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    });
    if (published.length !== products.length || published.some((product) => product.images[0]?.order !== 0)) {
      throw new Error("La vérification finale de la collection a échoué.");
    }
    console.log(`Collection publiée et vérifiée : ${published.length} annonces.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
