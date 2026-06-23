import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const item = await prisma.crmActivity.create({
    data: {
      proposalId: body.type === "proposal" ? body.parentId : null,
      campaignId: body.type === "campaign" ? body.parentId : null,
      bookingId: body.type === "booking" ? body.parentId : null,
      type: body.activityType || "NOTE",
      title: body.title,
      details: body.details || null,
      dueAt: body.dueAt ? new Date(body.dueAt) : null,
      completed: Boolean(body.completed),
    },
  });
  return NextResponse.json(item, { status: 201 });
}
