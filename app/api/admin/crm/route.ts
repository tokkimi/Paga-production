import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CrmType = "proposals" | "campaigns" | "bookings";

function getModel(type: CrmType) {
  if (type === "proposals") return prisma.sponsorProposal;
  if (type === "campaigns") return prisma.campaign;
  if (type === "bookings") return prisma.privateBooking;
  return null;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get("type") as CrmType;
  const model = getModel(type);
  if (!model) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const items = await (model as any).findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { type, ...data } = body;
  const model = getModel(type);
  if (!model) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const cleanData = sanitize(data);
  const item = await (model as any).create({ data: cleanData });
  return NextResponse.json(item, { status: 201 });
}

function sanitize(data: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v === "" || v === null || v === undefined) continue;
    if (["expectedAmount", "paidAmount", "budget", "fee", "deposit"].includes(k)) {
      const n = parseFloat(v);
      if (!isNaN(n)) out[k] = n;
    } else if (k.endsWith("At") || k === "eventDate" || k === "startDate" || k === "endDate") {
      const d = new Date(v);
      if (!isNaN(d.getTime())) out[k] = d;
    } else if (!["id", "createdAt", "updatedAt"].includes(k)) {
      out[k] = v;
    }
  }
  return out;
}
