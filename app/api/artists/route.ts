import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const artists = await prisma.artist.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(artists);
  } catch (error) {
    console.error("Artists GET error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
