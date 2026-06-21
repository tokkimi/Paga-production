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
  const { title, artistName, soundcloudEmbedUrl, spotifyEmbedUrl, youtubeEmbedUrl, externalUrl, cover, order, isActive } = await req.json();
  const track = await prisma.track.update({
    where: { id },
    data: {
      title,
      artistName,
      soundcloudEmbedUrl: soundcloudEmbedUrl || null,
      spotifyEmbedUrl: spotifyEmbedUrl || null,
      youtubeEmbedUrl: youtubeEmbedUrl || null,
      externalUrl: externalUrl || null,
      cover: cover || null,
      order: order ?? 0,
      isActive: isActive ?? true,
    },
  });
  return NextResponse.json(track);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.track.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
