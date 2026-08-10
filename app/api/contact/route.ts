import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const rateLimit = await checkRateLimit(req, "contact", 10, 60 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Trop de messages. Réessayez plus tard." }, { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } });
    }
    const body = await req.json();
    if (String(body.website || "").trim()) return NextResponse.json({ error: "Requête refusée" }, { status: 400 });
    const name = String(body.name || "").trim().slice(0, 160);
    const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
    const subject = String(body.subject || "contact").trim().slice(0, 120);
    const message = String(body.message || "").trim().slice(0, 8_000);
    if (!name || !email.includes("@") || !message) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    await prisma.contact.create({ data: { name, email, subject, message } });

    return NextResponse.json({ message: "sent" }, { status: 200 });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
