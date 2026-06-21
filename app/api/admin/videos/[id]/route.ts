import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user.role === "ADMIN" ? session : null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const { title, youtubeEmbedUrl, thumbnail, order, isActive } = await req.json();
  const video = await prisma.video.update({
    where: { id },
    data: { title, youtubeEmbedUrl, thumbnail: thumbnail || null, order: order ?? 0, isActive: isActive ?? true },
  });
  return NextResponse.json(video);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.video.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
