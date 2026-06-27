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

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const clientEmail = searchParams.get("clientEmail");
  const type = searchParams.get("type") as "ARTIST" | "SPONSOR" | null;

  const invoices = await prisma.invoice.findMany({
    where: {
      ...(clientEmail ? { clientEmail } : {}),
      ...(type ? { type } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices.map(serialize));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    type, clientName, clientEmail, clientAddress, clientPhone,
    prestation, priceHT, tvaRate, artistId, sponsorId,
  } = body;

  const count = await prisma.invoice.count();
  const invoiceNumber = `PAGA2026-${String(count + 1).padStart(4, "0")}`;

  const priceHTNum = parseFloat(priceHT);
  const tvaRateNum = parseFloat(tvaRate) || 20;
  const priceTTC = Math.round(priceHTNum * (1 + tvaRateNum / 100) * 100) / 100;

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      type,
      clientName,
      clientEmail,
      clientAddress: clientAddress || null,
      clientPhone: clientPhone || null,
      prestation,
      priceHT: priceHTNum,
      tvaRate: tvaRateNum,
      priceTTC,
      artistId: artistId || null,
      sponsorId: sponsorId || null,
    },
  });

  return NextResponse.json(serialize(invoice as unknown as Record<string, unknown>), { status: 201 });
}
