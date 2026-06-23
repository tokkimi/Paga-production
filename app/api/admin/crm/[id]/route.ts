import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user.role === "ADMIN";
}

function cleanDate(value: unknown) {
  return value ? new Date(String(value)) : null;
}

function cleanNumber(value: unknown) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const type = body.type;
  delete body.type;

  const dateFields = ["startDate", "endDate", "nextActionAt", "lastContactAt", "eventDate"];
  const numberFields = ["budget", "expectedAmount", "paidAmount", "fee", "deposit"];
  for (const key of dateFields) if (key in body) body[key] = cleanDate(body[key]);
  for (const key of numberFields) if (key in body) body[key] = cleanNumber(body[key]);

  const item = type === "campaign"
    ? await prisma.campaign.update({ where: { id }, data: body })
    : type === "booking"
      ? await prisma.privateBooking.update({ where: { id }, data: body })
      : await prisma.sponsorProposal.update({ where: { id }, data: body });

  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const type = req.nextUrl.searchParams.get("type") || "proposal";

  if (type === "campaign") await prisma.campaign.delete({ where: { id } });
  else if (type === "booking") await prisma.privateBooking.delete({ where: { id } });
  else await prisma.sponsorProposal.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
