import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

async function hasValidImageSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const ascii = new TextDecoder("ascii").decode(bytes);
  if (file.type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.type === "image/png") return bytes[0] === 0x89 && ascii.slice(1, 4) === "PNG";
  if (file.type === "image/webp") return ascii.slice(0, 4) === "RIFF" && ascii.slice(8, 12) === "WEBP";
  if (file.type === "image/avif") return ascii.slice(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii.slice(8, 12));
  return false;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { _count: { select: { images: true } } },
  });
  if (!product) return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  if (product._count.images >= 12) {
    return NextResponse.json({ error: "Maximum 12 images par produit." }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const requestedColor = String(formData.get("color") || "").trim();
  if (!(file instanceof File) || !file.size) {
    return NextResponse.json({ error: "Aucune image reçue." }, { status: 400 });
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Format accepté : JPG, PNG, WebP ou AVIF." }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: "Chaque image doit peser moins de 4 Mo." }, { status: 400 });
  }
  if (!(await hasValidImageSignature(file))) {
    return NextResponse.json({ error: "Le contenu du fichier ne correspond pas à une image valide." }, { status: 400 });
  }
  if (requestedColor && !product.colors.includes(requestedColor)) {
    return NextResponse.json({ error: "La couleur associée doit appartenir au produit." }, { status: 400 });
  }

  const cleanName = file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .slice(-100) || "image";
  const blob = await put(`shop/${product.slug}/${cleanName}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });
  const image = await prisma.productImage.create({
    data: {
      productId: product.id,
      url: blob.url,
      pathname: blob.pathname,
      alt: product.name,
      color: requestedColor || null,
      order: product._count.images,
    },
  });
  return NextResponse.json(image, { status: 201 });
}
