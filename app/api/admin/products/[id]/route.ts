import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";
import { parseProductInput } from "@/lib/shop";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const product = await prisma.product.update({
      where: { id },
      data: parseProductInput(body),
      include: { images: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Cette adresse produit existe déjà." }, { status: 409 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Impossible de modifier le produit." },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!product) return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });

  if (product.images.length) {
    await del(product.images.map((image) => image.url));
  }
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

