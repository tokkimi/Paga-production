import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { normalizeSpotifyEmbedUrl, normalizeSpotifyExternalUrl } from "@/lib/media";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user.role === "ADMIN" ? session : null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const { title, artistName, soundcloudEmbedUrl, spotifyEmbedUrl, youtubeEmbedUrl, externalUrl, cover, order, isActive, releasedAt } = await req.json();
  const normalizedSpotifyEmbedUrl = normalizeSpotifyEmbedUrl(spotifyEmbedUrl);
  const normalizedExternalUrl = externalUrl || normalizeSpotifyExternalUrl(spotifyEmbedUrl);
  const track = await prisma.track.update({
    where: { id },
    data: {
      title,
      artistName,
      soundcloudEmbedUrl: soundcloudEmbedUrl || null,
      spotifyEmbedUrl: normalizedSpotifyEmbedUrl,
      youtubeEmbedUrl: youtubeEmbedUrl || null,
      externalUrl: normalizedExternalUrl,
      cover: cover || null,
      order: order ?? 0,
      isActive: isActive ?? true,
      releasedAt: releasedAt ? new Date(releasedAt) : null,
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
