import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type ColorSetting = { name: string; active: boolean };

const imageColorRules: Array<{ slug: string; marker: string; color: string }> = [
  { slug: "essentiel-t-shirt-classique", marker: "tee-classic-black", color: "Noir" },
  { slug: "essentiel-t-shirt-classique", marker: "tee-classic-white", color: "Blanc" },
  { slug: "essentiel-t-shirt-classique", marker: "tee-classic-grey", color: "Gris chiné" },
  { slug: "essentiel-t-shirt-raglan", marker: "tee-raglan-black", color: "Blanc / Noir" },
  { slug: "essentiel-t-shirt-raglan", marker: "tee-raglan-red", color: "Blanc / Rouge" },
  { slug: "essentiel-t-shirt-raglan", marker: "tee-raglan-navy", color: "Blanc / Bleu marine" },
];

function colorForImage(slug: string, url: string, colors: string[]) {
  const rule = imageColorRules.find((candidate) => candidate.slug === slug && url.includes(candidate.marker));
  if (rule) return rule.color;
  return colors.length === 1 ? colors[0] : null;
}

function normalizedSettings(colors: string[], current: unknown): ColorSetting[] {
  const currentSettings = Array.isArray(current) ? current : [];
  const byName = new Map(
    currentSettings
      .filter((item): item is { name: unknown; active: unknown } => Boolean(item) && typeof item === "object")
      .filter((item) => typeof item.name === "string")
      .map((item) => [item.name, item.active !== false]),
  );
  return colors.map((name) => ({ name, active: byName.get(name) ?? true }));
}

async function main() {
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL_UNPOOLED ou DATABASE_URL est manquante.");

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    const products = await prisma.product.findMany({
      include: { images: { orderBy: { order: "asc" } } },
    });

    let imageUpdates = 0;
    for (const product of products) {
      const colorSettings = normalizedSettings(product.colors, product.colorSettings);
      await prisma.product.update({
        where: { id: product.id },
        data: { colorSettings: colorSettings as unknown as Prisma.InputJsonValue },
      });

      for (const image of product.images) {
        if (image.color) continue;
        const color = colorForImage(product.slug, image.url, product.colors);
        if (!color) continue;
        await prisma.productImage.update({ where: { id: image.id }, data: { color } });
        imageUpdates += 1;
      }
    }
    console.log(`Paramètres créés pour ${products.length} produits ; ${imageUpdates} images reliées à une couleur.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
