import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function authenticatedUserId() {
  const session = await getServerSession(authOptions);
  return session?.user.id || null;
}

function productIdFrom(body: unknown) {
  if (!body || typeof body !== "object") return "";
  return String((body as { productId?: unknown }).productId || "").trim().slice(0, 80);
}

export async function GET() {
  const userId = await authenticatedUserId();
  if (!userId) return NextResponse.json({ productIds: [] }, { status: 401 });

  const favorites = await prisma.productFavorite.findMany({
    where: { userId, product: { isActive: true } },
    select: { productId: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ productIds: favorites.map((favorite) => favorite.productId) });
}

export async function POST(request: Request) {
  const userId = await authenticatedUserId();
  if (!userId) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

  const productId = productIdFrom(await request.json());
  if (!productId) return NextResponse.json({ error: "Produit invalide." }, { status: 400 });

  const product = await prisma.product.findFirst({ where: { id: productId, isActive: true }, select: { id: true } });
  if (!product) return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });

  await prisma.productFavorite.upsert({
    where: { userId_productId: { userId, productId } },
    create: { userId, productId },
    update: {},
  });
  return NextResponse.json({ favorite: true });
}

export async function DELETE(request: Request) {
  const userId = await authenticatedUserId();
  if (!userId) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

  const productId = productIdFrom(await request.json());
  if (!productId) return NextResponse.json({ error: "Produit invalide." }, { status: 400 });

  await prisma.productFavorite.deleteMany({ where: { userId, productId } });
  return NextResponse.json({ favorite: false });
}
