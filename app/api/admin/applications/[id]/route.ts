import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user.role === "ADMIN";
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const fields = [
    "name", "realName", "email", "phone", "city", "country", "bio", "genres",
    "soundLinks", "socialLinks", "pressKitUrl", "portfolioUrl", "stageName",
    "experience", "availability", "expectations", "status", "priority",
    "assignedTo", "nextAction", "nextActionAt", "lastContactAt", "adminNote", "rating",
  ];
  const data = Object.fromEntries(fields.filter((field) => field in body).map((field) => [field, body[field]])) as Record<string, any>;
  for (const field of ["nextActionAt", "lastContactAt"]) {
    if (field in data) data[field] = data[field] ? new Date(String(data[field])) : null;
  }
  if ("rating" in data) data.rating = data.rating ? Number(data.rating) : null;
  const item = await prisma.artistApplication.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.artistApplication.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
