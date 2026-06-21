import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Videos GET error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
