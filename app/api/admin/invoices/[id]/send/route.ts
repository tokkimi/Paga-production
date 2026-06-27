import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInvoiceHtml } from "@/lib/invoice-template";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const html = generateInvoiceHtml(invoice);

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY non configurée sur le serveur." }, { status: 500 });
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error: sendError } = await resend.emails.send({
    from: "Paga Production <noreply@pagaproduction.fr>",
    to: invoice.clientEmail,
    subject: `Facture ${invoice.invoiceNumber} — AP Management`,
    html,
  });

  if (sendError) {
    return NextResponse.json({ error: `Erreur Resend : ${sendError.message}` }, { status: 502 });
  }

  const updated = await prisma.invoice.update({
    where: { id },
    data: { sentAt: new Date() },
  });

  return NextResponse.json({
    ...updated,
    invoiceDate: updated.invoiceDate.toISOString(),
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
    sentAt: updated.sentAt?.toISOString() ?? null,
    paidAt: updated.paidAt?.toISOString() ?? null,
  });
}
