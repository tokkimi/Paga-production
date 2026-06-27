import { NextResponse } from "next/server";
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

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices.map(serialize));
}
