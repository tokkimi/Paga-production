import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter");
    const upcoming = searchParams.get("upcoming");

    const where: Record<string, unknown> = {};
    if (upcoming === "true") where.date = { gte: new Date() };
    if (upcoming === "false") where.date = { lt: new Date() };
    if (filter && filter !== "all") {
      where.artists = { some: { artist: { slug: filter } } };
    }

    const events = await prisma.event.findMany({
      where,
      include: { artists: { include: { artist: true } } },
      orderBy: { date: "asc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Events GET error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
