import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function serialize(inv: Record<string, unknown>) {
  return {
    ...inv,
    invoiceDate: (inv.invoiceDate as Date).toISOString(),
    createdAt: (inv.createdAt as Date).toISOString(),
    updatedAt: (inv.updatedAt as Date).toISOString(),
    sentAt: inv.sentAt ? (inv.sentAt as Date).toISOString() : null,
    paidAt: inv.paidAt ? (inv.paidAt as Date).toISOString() : null,
  };
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();

  const invoice = await prisma.invoice.update({
    where: { id },
    data: {
      status,
      paidAt: status === "PAID" ? new Date() : undefined,
    },
  });

  return NextResponse.json(serialize(invoice as unknown as Record<string, unknown>));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.invoice.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
