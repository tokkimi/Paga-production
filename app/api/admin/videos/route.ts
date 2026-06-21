import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { title, youtubeEmbedUrl, thumbnail, order, isActive } = await req.json();
  if (!title || !youtubeEmbedUrl) return NextResponse.json({ error: "title and youtubeEmbedUrl required" }, { status: 400 });
  const video = await prisma.video.create({
    data: { title, youtubeEmbedUrl, thumbnail: thumbnail || null, order: order ?? 0, isActive: isActive ?? true },
  });
  return NextResponse.json(video, { status: 201 });
}
