import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const proposal = await prisma.sponsorProposal.findUnique({
    where: { id },
    select: { pressKitData: true, pressKitName: true, pressKitMimeType: true },
  });

  if (!proposal?.pressKitData) {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }

  const filename = (proposal.pressKitName || "brief-sponsor.pdf").replace(/["\r\n]/g, "");
  return new NextResponse(proposal.pressKitData, {
    headers: {
      "Content-Type": proposal.pressKitMimeType || "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
