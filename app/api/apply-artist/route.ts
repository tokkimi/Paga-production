import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.bio) return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    const application = await prisma.artistApplication.create({
      data: {
        name: body.name,
        stageName: body.stageName || body.name,
        realName: body.realName || null,
        email: body.email,
        phone: body.phone || null,
        city: body.city || null,
        country: body.country || null,
        bio: body.bio,
        genres: body.genres || "",
        soundLinks: JSON.stringify(body.soundLinks || {}),
        socialLinks: JSON.stringify(body.socialLinks || {}),
        pressKitUrl: body.pressKitUrl || null,
        portfolioUrl: body.portfolioUrl || null,
        experience: body.experience || null,
        availability: body.availability || null,
        expectations: body.expectations || null,
        status: "PENDING",
      },
    });
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Apply artist error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
