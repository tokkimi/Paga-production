import { NextResponse } from "next/server";
import { ShopOrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";

const ALLOWED_STATUSES = new Set(Object.values(ShopOrderStatus));

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }
  const { id } = await params;
  const body = (await request.json()) as { status?: ShopOrderStatus };
  if (!body.status || !ALLOWED_STATUSES.has(body.status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }
  const order = await prisma.shopOrder.update({ where: { id }, data: { status: body.status } });
  return NextResponse.json(order);
}

