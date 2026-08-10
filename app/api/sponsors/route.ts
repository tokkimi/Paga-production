import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

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
    const rateLimit = await checkRateLimit(req, "sponsor-proposal", 5, 60 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Trop de demandes. Réessayez plus tard." }, { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } });
    }
    const contentType = req.headers.get("content-type") || "";
    const body = contentType.includes("multipart/form-data")
      ? Object.fromEntries((await req.formData()).entries())
      : await req.json();

    const pdf = body.pdf instanceof File ? body.pdf : null;
    if (String(body.companyFax || "").trim()) return NextResponse.json({ error: "Requête refusée" }, { status: 400 });
    if (pdf && pdf.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "PDF trop lourd" }, { status: 400 });
    }

    let pdfData: Uint8Array<ArrayBuffer> | null = null;
    if (pdf) {
      if (pdf.type !== "application/pdf" || !pdf.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json({ error: "Seuls les fichiers PDF sont acceptés" }, { status: 400 });
      }
      pdfData = new Uint8Array(await pdf.arrayBuffer());
      if (new TextDecoder().decode(pdfData.slice(0, 5)) !== "%PDF-") {
        return NextResponse.json({ error: "Fichier PDF invalide" }, { status: 400 });
      }
    }

    const clean = (value: unknown, max: number) => String(value || "").trim().slice(0, max);
    const brandName = clean(body.brandName, 160);
    const contactName = clean(body.contactName, 160);
    const contactEmail = clean(body.contactEmail, 200).toLowerCase();
    const phone = clean(body.phone, 50);
    const website = clean(body.website, 500);
    const budget = clean(body.budget, 120);
    const campaignType = clean(body.campaignType, 160);
    const goals = clean(body.goals, 3_000);
    const deliverables = clean(body.deliverables, 3_000);
    const description = clean(body.description, 8_000);

    if (!brandName || !contactEmail.includes("@") || !description) {
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
        pressKitName: pdf?.name || null,
        pressKitMimeType: pdf?.type || null,
        pressKitData: pdfData,
        pressKitUrl: pdf ? `PDF reçu : ${pdf.name} (${Math.round(pdf.size / 1024)} Ko)` : null,
        status: "PENDING",
      },
    });
    if (pdf) {
      await prisma.sponsorProposal.update({
        where: { id: proposal.id },
        data: { pressKitUrl: `/api/admin/sponsors/${proposal.id}/document` },
      });
    }
    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error("Sponsors POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
