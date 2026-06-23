import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user.role === "ADMIN";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const items = await prisma.artistApplication.findMany({
    orderBy: [{ nextActionAt: "asc" }, { updatedAt: "desc" }],
    include: { user: { select: { name: true, email: true } } },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const item = await prisma.artistApplication.create({
    data: {
      name: body.name,
      realName: body.realName || null,
      stageName: body.stageName || body.name,
      email: body.email,
      phone: body.phone || null,
      city: body.city || null,
      country: body.country || null,
      bio: body.bio || "",
      genres: body.genres || "",
      soundLinks: body.soundLinks || "{}",
      socialLinks: body.socialLinks || "{}",
      pressKitUrl: body.pressKitUrl || null,
      portfolioUrl: body.portfolioUrl || null,
      experience: body.experience || null,
      availability: body.availability || null,
      expectations: body.expectations || null,
      status: body.status || "PENDING",
      priority: body.priority || "NORMAL",
      assignedTo: body.assignedTo || null,
      nextAction: body.nextAction || null,
      nextActionAt: body.nextActionAt ? new Date(body.nextActionAt) : null,
      lastContactAt: body.lastContactAt ? new Date(body.lastContactAt) : null,
      adminNote: body.adminNote || null,
      rating: body.rating ? Number(body.rating) : null,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
