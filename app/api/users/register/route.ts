import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const rateLimit = await checkRateLimit(req, "register", 5, 60 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Trop de tentatives. Réessayez plus tard." }, { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } });
    }
    const body = await req.json();
    const name = String(body.name || "").trim().slice(0, 160);
    const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
    const password = String(body.password || "");
    const role = String(body.role || "USER");

    if (!email.includes("@") || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }
    if (password.length < 12 || password.length > 128 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule et un chiffre." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Un compte existe déjà avec cet email" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const userRole: "USER" | "BRAND" = role === "BRAND" ? "BRAND" : "USER";

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: userRole },
    });

    return NextResponse.json({ id: user.id, email: user.email, role: user.role }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
