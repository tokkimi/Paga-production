import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, bio, genres, soundLinks, socialLinks } = body;

    if (!name || !email || !bio) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const application = await prisma.artistApplication.create({
      data: {
        name,
        email,
        bio,
        genres: genres || "",
        soundLinks: JSON.stringify(soundLinks || {}),
        socialLinks: JSON.stringify(socialLinks || {}),
        status: "PENDING",
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Apply artist error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
