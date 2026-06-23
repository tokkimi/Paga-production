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

const allowedFields = {
  proposal: [
    "brandName", "contactName", "contactEmail", "phone", "website", "source",
    "campaignType", "description", "budget", "expectedAmount", "paidAmount",
    "currency", "status", "priority", "assignedTo", "nextAction", "nextActionAt",
    "lastContactAt", "startDate", "endDate", "deliverables", "requiredAssets",
    "pressKitUrl", "boardUrl", "contractUrl", "invoiceUrl", "promoCode", "adminNote",
  ],
  campaign: [
    "proposalId", "name", "brandName", "contactName", "contactEmail", "phone",
    "status", "priority", "budget", "paidAmount", "currency", "startDate", "endDate",
    "nextAction", "nextActionAt", "deliverables", "requiredAssets", "pressKitUrl",
    "boardUrl", "contractUrl", "invoiceUrl", "promoCode", "notes",
  ],
  booking: [
    "title", "artistName", "eventType", "venue", "city", "country", "eventDate",
    "contactName", "company", "contactEmail", "phone", "status", "priority", "budget",
    "fee", "deposit", "currency", "source", "nextAction", "nextActionAt",
    "lastContactAt", "requirements", "requiredAssets", "pressKitUrl", "contractUrl",
    "invoiceUrl", "notes",
  ],
} as const;

type CrmType = keyof typeof allowedFields;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const type: CrmType = body.type === "campaign" || body.type === "booking" ? body.type : "proposal";
  const data = Object.fromEntries(
    allowedFields[type]
      .filter((field) => field in body)
      .map((field) => [field, body[field]])
  ) as Record<string, any>;

  const dateFields = ["startDate", "endDate", "nextActionAt", "lastContactAt", "eventDate"];
  const numberFields = ["budget", "expectedAmount", "paidAmount", "fee", "deposit"];
  for (const key of dateFields) if (key in data) data[key] = cleanDate(data[key]);
  for (const key of numberFields) if (key in data) data[key] = cleanNumber(data[key]);

  const item = type === "campaign"
    ? await prisma.campaign.update({ where: { id }, data })
    : type === "booking"
      ? await prisma.privateBooking.update({ where: { id }, data })
      : await prisma.sponsorProposal.update({ where: { id }, data });

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
