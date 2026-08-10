import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }
  const orders = await prisma.shopOrder.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 250,
  });
  return NextResponse.json(orders);
}

