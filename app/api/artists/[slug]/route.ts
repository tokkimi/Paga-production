import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const artist = await prisma.artist.findUnique({
      where: { slug },
      include: {
        events: {
          include: { event: { include: { artists: { include: { artist: true } } } } },
          orderBy: { event: { date: "asc" } },
        },
        tracks: { orderBy: { order: "asc" } },
      },
    });
    if (!artist) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(artist);
  } catch (error) {
    console.error("Artist GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
