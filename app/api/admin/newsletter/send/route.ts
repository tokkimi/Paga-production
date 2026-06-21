import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { subject, content } = await req.json();
  if (!subject || !content) return NextResponse.json({ error: "Subject and content required" }, { status: 400 });

  const subscribers = await prisma.newsletterSubscriber.findMany({ where: { isActive: true } });

  // In production with Resend configured, emails would be sent here
  console.log(`Sending newsletter "${subject}" to ${subscribers.length} subscribers`);

  return NextResponse.json({ sent: subscribers.length });
}
