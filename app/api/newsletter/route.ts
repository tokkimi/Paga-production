import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const rateLimit = await checkRateLimit(req, "newsletter", 5, 60 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Trop de tentatives. Réessayez plus tard." }, { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } });
    }
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
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
