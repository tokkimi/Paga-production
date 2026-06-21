import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({ message: "already" }, { status: 409 });
      }
      await prisma.newsletterSubscriber.update({ where: { email }, data: { isActive: true } });
      return NextResponse.json({ message: "reactivated" }, { status: 200 });
    }

    await prisma.newsletterSubscriber.create({ data: { email } });
    return NextResponse.json({ message: "subscribed" }, { status: 201 });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
