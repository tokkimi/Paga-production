import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";
import { parseProductInput } from "@/lib/shop";

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const product = await prisma.product.create({ data: parseProductInput(body) });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Cette adresse produit existe déjà." }, { status: 409 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Impossible de créer le produit." },
      { status: 400 },
    );
  }
}

