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
  for (const field of ["nextActionAt", "lastContactAt"]) {
    if (field in body) body[field] = body[field] ? new Date(body[field]) : null;
  }
  if ("rating" in body) body.rating = body.rating ? Number(body.rating) : null;
  const item = await prisma.artistApplication.update({ where: { id }, data: body });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.artistApplication.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
