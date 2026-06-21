import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json([], { status: 401 });

    const proposals = await prisma.sponsorProposal.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(proposals);
  } catch (error) {
    console.error("Sponsors GET error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { brandName, contactEmail, phone, budget, campaignType, description } = body;

    if (!brandName || !description) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const proposal = await prisma.sponsorProposal.create({
      data: {
        brandName,
        contactEmail: contactEmail || session.user.email,
        phone,
        budget,
        campaignType,
        description,
        userId: session.user.id,
        status: "PENDING",
      },
    });
    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error("Sponsors POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
