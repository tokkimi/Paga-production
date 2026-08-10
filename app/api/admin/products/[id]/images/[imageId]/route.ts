import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";

type RouteContext = { params: Promise<{ id: string; imageId: string }> };

export async function PATCH(_request: Request, { params }: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }
  const { id, imageId } = await params;
  const image = await prisma.productImage.findFirst({ where: { id: imageId, productId: id } });
  if (!image) return NextResponse.json({ error: "Image introuvable." }, { status: 404 });

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

