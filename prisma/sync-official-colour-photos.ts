import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { put } from "@vercel/blob";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const execFileAsync = promisify(execFile);
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

type PhotoKind = "main" | "worn";
type Candidate = { color: string; kind: PhotoKind; url: string };

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function curl(url: string, accept: string) {
  const { stdout } = await execFileAsync("curl.exe", ["-L", "--fail", "-A", USER_AGENT, "-H", `Accept: ${accept}`, "--max-time", "45", "-s", url], {
    encoding: "buffer",
    maxBuffer: 20 * 1024 * 1024,
  });
  return Buffer.from(stdout);
}

function colorsByHex(html: string) {
  const colors = new Map<string, string>();
  const pattern = /"defaultText","value":"([^"]+)"[\s\S]{0,160}?"hexColor","value":"([0-9a-f]{6})"/gi;
  for (const match of html.matchAll(pattern)) colors.set(match[2].toLowerCase(), match[1]);
  return colors;
}

function sourceArtworkId(html: string) {
  return html.match(/https:\/\/ih1\.redbubble\.net\/image\.([^/]+)\//i)?.[1] || null;
}

function selectedPhotos(html: string, productColors: string[]) {
  const artworkId = sourceArtworkId(html);
  if (!artworkId) return [];

  const nameByHex = colorsByHex(html);
  const urlPattern = new RegExp(`https://ih1\\.redbubble\\.net/image\\.${artworkId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/[^"\\\\ ]+?\\.jpg`, "gi");
  const byColor = new Map<string, Set<string>>();

  for (const match of html.matchAll(urlPattern)) {
    const url = match[0].replace(/\\u0026/g, "&");
    const hex = url.match(/,([0-9a-f]{6}):[0-9a-f]+,/i)?.[1]?.toLowerCase();
    const redbubbleColor = hex ? nameByHex.get(hex) : undefined;
    const color = redbubbleColor ? productColors.find((candidate) => normalize(candidate) === normalize(redbubbleColor)) : undefined;
    if (!color) continue;
    const collection = byColor.get(color) || new Set<string>();
    collection.add(url);
    byColor.set(color, collection);
  }

  const candidates: Candidate[] = [];
  for (const [color, urls] of byColor) {
    const list = [...urls];
    const main = list.find((url) => url.includes(",flatlay,")) || list.find((url) => url.includes(",product_square,")) || list.find((url) => url.includes(",mens,")) || list[0];
    if (main) candidates.push({ color, kind: "main", url: main });
    const worn = list.find((url) => url !== main && (url.includes(",mens,") || url.includes(",womens,")) && !url.includes("product_square"));
    if (worn) candidates.push({ color, kind: "worn", url: worn });
  }
  return candidates;
}

function pathname(slug: string, color: string, kind: PhotoKind) {
  return `shop/official-colours/${slug}/${normalize(color)}-${kind}.jpg`;
}

async function main() {
  const shouldApply = process.argv.includes("--apply");
  const slugArg = process.argv.find((arg) => arg.startsWith("--slug="));
  const onlySlug = slugArg?.split("=", 2)[1];
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!connectionString) throw new Error("DATABASE_URL_UNPOOLED ou DATABASE_URL est manquante.");
  if (shouldApply && !blobToken) throw new Error("BLOB_READ_WRITE_TOKEN est manquant.");

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    const products = await prisma.product.findMany({
      where: { sourceUrl: { contains: "redbubble.com" }, colors: { isEmpty: false }, ...(onlySlug ? { slug: onlySlug } : {}) },
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    });
    console.log(`${products.length} fiche(s) à contrôler.`);

    let added = 0;
    for (const product of products) {
      const html = (await curl(product.sourceUrl!, "text/html")).toString("utf8");
      const candidates = selectedPhotos(html, product.colors);
      if (candidates.length < product.colors.length) {
        console.log(`${product.slug}: source incomplète — ignoré pour éviter un mélange.`);
        continue;
      }
      const existing = new Set(product.images.map((image) => image.pathname));
      let order = Math.max(-1, ...product.images.map((image) => image.order)) + 1;
      for (const photo of candidates) {
        const target = pathname(product.slug, photo.color, photo.kind);
        if (existing.has(target)) continue;
        if (!shouldApply) continue;
        const blob = await put(target, await curl(photo.url, "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"), {
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
            alt: `${product.name} — ${photo.color}, ${photo.kind === "main" ? "vue produit" : "vue portée"}`,
            color: photo.color,
            order: order++,
          },
        });
        added += 1;
      }
      console.log(`${product.slug}: ${candidates.length} visuel(s) contrôlé(s).`);
    }
    console.log(shouldApply ? `${added} visuel(s) officiel(s) ajoutés.` : "Contrôle terminé.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
