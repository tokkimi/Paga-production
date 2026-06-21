import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const event = await prisma.event.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { artists: { include: { artist: true } } },
    });
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(event);
  } catch (error) {
    console.error("Event GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
