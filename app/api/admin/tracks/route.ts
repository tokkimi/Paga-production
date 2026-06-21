import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { normalizeSpotifyEmbedUrl, normalizeSpotifyExternalUrl } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { title, artistName, soundcloudEmbedUrl, spotifyEmbedUrl, youtubeEmbedUrl, externalUrl, cover, order, isActive, releasedAt } = await req.json();
  const normalizedSpotifyEmbedUrl = normalizeSpotifyEmbedUrl(spotifyEmbedUrl);
  const normalizedExternalUrl = externalUrl || normalizeSpotifyExternalUrl(spotifyEmbedUrl);
  const track = await prisma.track.create({
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
  return NextResponse.json(track, { status: 201 });
}
