import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, priority, nextAction, nextActionAt, lastContactAt, adminNote, rating, assignedTo } = body;

  const data: Record<string, any> = {};
  if (status) data.status = status;
  if (priority) data.priority = priority;
  if (nextAction !== undefined) data.nextAction = nextAction || null;
  if (nextActionAt) data.nextActionAt = new Date(nextActionAt);
  if (lastContactAt) data.lastContactAt = new Date(lastContactAt);
  if (adminNote !== undefined) data.adminNote = adminNote || null;
  if (rating !== undefined) data.rating = rating ? parseInt(rating) : null;
  if (assignedTo !== undefined) data.assignedTo = assignedTo || null;

  const app = await prisma.artistApplication.update({ where: { id }, data });
  return NextResponse.json(app);
}
