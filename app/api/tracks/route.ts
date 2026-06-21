import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tracks = await prisma.track.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      include: { artist: { select: { name: true, slug: true } } },
    });
    return NextResponse.json(tracks);
  } catch (error) {
    console.error("Tracks GET error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
