import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { generateInvoiceHtml } from "@/lib/invoice-template";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  await resend.emails.send({
    from: "Paga Production <noreply@pagaproduction.fr>",
    to: invoice.clientEmail,
    subject: `Facture ${invoice.invoiceNumber} — AP Management`,
    html,
  });

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
