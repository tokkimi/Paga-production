import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { put } from "@vercel/blob";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const execFileAsync = promisify(execFile);

type OfficialPreview = { color: string; url: string; view: "product" | "worn" };

function normalized(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function colorNameByHex(html: string) {
  const result = new Map<string, string>();
  const pattern = /"defaultText","value":"([^"]+)"[\s\S]{0,160}?"hexColor","value":"([0-9a-f]{6})"/gi;
  for (const match of html.matchAll(pattern)) result.set(match[2].toLowerCase(), match[1]);
  return result;
}

function officialPreviews(html: string, colors: string[]) {
  const colorNames = colorNameByHex(html);
  const previews = new Map<string, OfficialPreview[]>();
  const urlPattern = /https:\/\/ih1\.redbubble\.net\/(?:image\.[^/]+|preview)\/[^"\\ ]+?\.jpg/g;

  for (const match of html.matchAll(urlPattern)) {
    const url = match[0].replace(/\\u0026/g, "&");
    const colorMatch = url.match(/,([0-9a-f]{6}):[0-9a-f]+,/i);
    if (!colorMatch) continue;
    const sourceColor = colorNames.get(colorMatch[1].toLowerCase());
    if (!sourceColor) continue;
    const color = colors.find((candidate) => normalized(candidate) === normalized(sourceColor));
    if (!color) continue;

    const view = url.includes("flatlay") || url.includes("product_square") ? "product" : "worn";
    const list = previews.get(color) || [];
    if (!list.some((item) => item.url === url)) list.push({ color, url, view });
    previews.set(color, list);
  }

  return [...previews.values()].flatMap((items) => {
    const product = items.find((item) => item.view === "product") || items[0];
    const worn = items.find((item) => item.view === "worn" && item.url !== product.url);
    return worn ? [product, worn] : [product];
  });
}

async function curl(url: string, accept: string) {
  const { stdout } = await execFileAsync("curl.exe", ["-L", "--fail", "-A", USER_AGENT, "-H", `Accept: ${accept}`, "--max-time", "45", "-s", url], {
    encoding: "buffer",
    maxBuffer: 20 * 1024 * 1024,
  });
  return Buffer.from(stdout);
}

async function download(url: string) {
  return curl(url, "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8");
}

function imagePath(slug: string, color: string, view: OfficialPreview["view"]) {
  return `shop/official-colours/${slug}/${normalized(color) || "default"}-${view}.jpg`;
}

async function main() {
  const shouldApply = process.argv.includes("--apply");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const offsetArg = process.argv.find((arg) => arg.startsWith("--offset="));
  const slugArg = process.argv.find((arg) => arg.startsWith("--slug="));
  const limit = limitArg ? Number(limitArg.split("=", 2)[1]) : undefined;
  const offset = offsetArg ? Number(offsetArg.split("=", 2)[1]) : undefined;
  const slug = slugArg?.split("=", 2)[1];
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!connectionString) throw new Error("DATABASE_URL_UNPOOLED ou DATABASE_URL est manquante.");
  if (shouldApply && !blobToken) throw new Error("BLOB_READ_WRITE_TOKEN est manquant.");

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    const products = await prisma.product.findMany({
      where: { sourceUrl: { contains: "redbubble.com" }, ...(slug ? { slug } : {}) },
      include: { images: true },
      orderBy: { order: "asc" },
      ...(offset ? { skip: offset } : {}),
      ...(limit ? { take: limit } : {}),
    });

    let imported = 0;
    for (const product of products) {
      const html = (await curl(product.sourceUrl!, "text/html")).toString("utf8");
      const previews = officialPreviews(html, product.colors);
      const existing = new Set(product.images.map((image) => image.pathname));
      const missing = previews.filter((preview) => !existing.has(imagePath(product.slug, preview.color, preview.view)));
      console.log(`${product.slug}: ${previews.length} visuel(s) officiel(s), ${missing.length} à ajouter.`);

      if (!shouldApply) continue;
      for (const preview of missing) {
        const pathname = imagePath(product.slug, preview.color, preview.view);
        const blob = await put(pathname, await download(preview.url), {
          access: "public",
          addRandomSuffix: false,
          allowOverwrite: true,
          cacheControlMaxAge: 31_536_000,
          contentType: "image/jpeg",
          token: blobToken!,
        });
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: blob.url,
            pathname: blob.pathname,
            alt: `${product.name} — ${preview.color}, ${preview.view === "product" ? "vue produit" : "vue portée"}`,
            color: preview.color,
            order: product.images.length + imported + 1,
          },
        });
        imported += 1;
      }
    }
    console.log(shouldApply ? `${imported} visuel(s) officiel(s) ajouté(s).` : "Contrôle terminé : relancez avec --apply pour importer.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
