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

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const type = req.nextUrl.searchParams.get("type") || "proposals";

  if (type === "campaigns") {
    return NextResponse.json(await prisma.campaign.findMany({
      orderBy: [{ nextActionAt: "asc" }, { updatedAt: "desc" }],
      include: { proposal: { select: { id: true, brandName: true } }, activities: { orderBy: { createdAt: "desc" }, take: 8 } },
    }));
  }

  if (type === "bookings") {
    return NextResponse.json(await prisma.privateBooking.findMany({
      orderBy: [{ eventDate: "asc" }, { updatedAt: "desc" }],
      include: { activities: { orderBy: { createdAt: "desc" }, take: 8 } },
    }));
  }

  return NextResponse.json(await prisma.sponsorProposal.findMany({
    orderBy: [{ nextActionAt: "asc" }, { updatedAt: "desc" }],
    include: {
      user: { select: { name: true, email: true } },
      campaigns: { select: { id: true, name: true, status: true } },
      activities: { orderBy: { createdAt: "desc" }, take: 8 },
    },
  }));
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const type = body.type;

  if (type === "campaign") {
    const item = await prisma.campaign.create({
      data: {
        proposalId: body.proposalId || null,
        name: body.name,
        brandName: body.brandName,
        contactName: body.contactName || null,
        contactEmail: body.contactEmail || null,
        phone: body.phone || null,
        status: body.status || "DRAFT",
        priority: body.priority || "NORMAL",
        budget: cleanNumber(body.budget),
        paidAmount: cleanNumber(body.paidAmount),
        currency: body.currency || "EUR",
        startDate: cleanDate(body.startDate),
        endDate: cleanDate(body.endDate),
        nextAction: body.nextAction || null,
        nextActionAt: cleanDate(body.nextActionAt),
        deliverables: body.deliverables || null,
        requiredAssets: body.requiredAssets || null,
        pressKitUrl: body.pressKitUrl || null,
        boardUrl: body.boardUrl || null,
        contractUrl: body.contractUrl || null,
        invoiceUrl: body.invoiceUrl || null,
        promoCode: body.promoCode || null,
        notes: body.notes || null,
      },
    });
    return NextResponse.json(item, { status: 201 });
  }

  if (type === "booking") {
    const item = await prisma.privateBooking.create({
      data: {
        title: body.title,
        artistName: body.artistName || null,
        eventType: body.eventType || null,
        venue: body.venue || null,
        city: body.city || null,
        country: body.country || null,
        eventDate: cleanDate(body.eventDate),
        contactName: body.contactName,
        company: body.company || null,
        contactEmail: body.contactEmail || null,
        phone: body.phone || null,
        status: body.status || "NEW",
        priority: body.priority || "NORMAL",
        budget: cleanNumber(body.budget),
        fee: cleanNumber(body.fee),
        deposit: cleanNumber(body.deposit),
        currency: body.currency || "EUR",
        source: body.source || null,
        nextAction: body.nextAction || null,
        nextActionAt: cleanDate(body.nextActionAt),
        lastContactAt: cleanDate(body.lastContactAt),
        requirements: body.requirements || null,
        requiredAssets: body.requiredAssets || null,
        pressKitUrl: body.pressKitUrl || null,
        contractUrl: body.contractUrl || null,
        invoiceUrl: body.invoiceUrl || null,
        notes: body.notes || null,
      },
    });
    return NextResponse.json(item, { status: 201 });
  }

  const item = await prisma.sponsorProposal.create({
    data: {
      userId: body.userId || null,
      brandName: body.brandName,
      contactName: body.contactName || null,
      contactEmail: body.contactEmail,
      phone: body.phone || null,
      website: body.website || null,
      source: body.source || null,
      campaignType: body.campaignType || null,
      description: body.description || "",
      budget: body.budget || null,
      expectedAmount: cleanNumber(body.expectedAmount),
      paidAmount: cleanNumber(body.paidAmount),
      currency: body.currency || "EUR",
      status: body.status || "PENDING",
      priority: body.priority || "NORMAL",
      assignedTo: body.assignedTo || null,
      nextAction: body.nextAction || null,
      nextActionAt: cleanDate(body.nextActionAt),
      lastContactAt: cleanDate(body.lastContactAt),
      startDate: cleanDate(body.startDate),
      endDate: cleanDate(body.endDate),
      deliverables: body.deliverables || null,
      requiredAssets: body.requiredAssets || null,
      pressKitUrl: body.pressKitUrl || null,
      boardUrl: body.boardUrl || null,
      contractUrl: body.contractUrl || null,
      invoiceUrl: body.invoiceUrl || null,
      promoCode: body.promoCode || null,
      adminNote: body.adminNote || null,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
