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
    const contentType = req.headers.get("content-type") || "";
    const body = contentType.includes("multipart/form-data")
      ? Object.fromEntries((await req.formData()).entries())
      : await req.json();

    const pdf = body.pdf instanceof File ? body.pdf : null;
    if (pdf && pdf.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "PDF trop lourd" }, { status: 400 });
    }

    const brandName = String(body.brandName || "").trim();
    const contactName = String(body.contactName || "").trim();
    const contactEmail = String(body.contactEmail || "").trim();
    const phone = String(body.phone || "").trim();
    const website = String(body.website || "").trim();
    const budget = String(body.budget || "").trim();
    const campaignType = String(body.campaignType || "").trim();
    const goals = String(body.goals || "").trim();
    const deliverables = String(body.deliverables || "").trim();
    const description = String(body.description || "").trim();

    if (!brandName || !contactEmail || !description) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const proposal = await prisma.sponsorProposal.create({
      data: {
        brandName,
        contactName: contactName || null,
        contactEmail,
        phone: phone || null,
        website: website || null,
        budget: budget || null,
        campaignType: campaignType || null,
        description: [description, goals && `Objectifs : ${goals}`, deliverables && `Éléments attendus : ${deliverables}`].filter(Boolean).join("\n\n"),
        requiredAssets: deliverables || null,
        pressKitUrl: pdf ? `PDF reçu : ${pdf.name} (${Math.round(pdf.size / 1024)} Ko)` : null,
        status: "PENDING",
      },
    });
    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error("Sponsors POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
