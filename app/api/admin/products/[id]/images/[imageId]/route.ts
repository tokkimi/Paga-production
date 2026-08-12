import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";

type RouteContext = { params: Promise<{ id: string; imageId: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }
  const { id, imageId } = await params;
  const image = await prisma.productImage.findFirst({ where: { id: imageId, productId: id } });
  if (!image) return NextResponse.json({ error: "Image introuvable." }, { status: 404 });

  const body = await request.json().catch(() => ({})) as { makeCover?: unknown; color?: unknown };
  if (typeof body.color === "string" || body.color === null) {
    const color = typeof body.color === "string" ? body.color.trim() : "";
    const product = await prisma.product.findUnique({ where: { id }, select: { colors: true } });
    if (!product) return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
    if (color && !product.colors.includes(color)) {
      return NextResponse.json({ error: "La couleur associée doit appartenir au produit." }, { status: 400 });
    }
    await prisma.productImage.update({ where: { id: imageId }, data: { color: color || null } });
  }

  if (!body.makeCover) return NextResponse.json({ ok: true });

  await prisma.$transaction([
    prisma.productImage.updateMany({
      where: { productId: id, id: { not: imageId } },
      data: { order: { increment: 1 } },
    }),
    prisma.productImage.update({ where: { id: imageId }, data: { order: 0 } }),
  ]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }
  const { id, imageId } = await params;
  const image = await prisma.productImage.findFirst({ where: { id: imageId, productId: id } });
  if (!image) return NextResponse.json({ error: "Image introuvable." }, { status: 404 });

  await del(image.url);
  await prisma.productImage.delete({ where: { id: imageId } });
  return NextResponse.json({ ok: true });
}
