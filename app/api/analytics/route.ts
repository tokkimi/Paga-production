import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function deviceFromAgent(agent: string) {
  if (/tablet|ipad/i.test(agent)) return "tablet";
  if (/mobile|android|iphone/i.test(agent)) return "mobile";
  return "desktop";
}

function browserFromAgent(agent: string) {
  if (/edg/i.test(agent)) return "Edge";
  if (/chrome/i.test(agent)) return "Chrome";
  if (/safari/i.test(agent)) return "Safari";
  if (/firefox/i.test(agent)) return "Firefox";
  return "Other";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userAgent = req.headers.get("user-agent") || "";
    const forwarded = req.headers.get("x-forwarded-for") || "";
    const ipHash = forwarded ? createHash("sha256").update(forwarded.split(",")[0] + (process.env.NEXTAUTH_SECRET || "paga")).digest("hex").slice(0, 20) : null;
    const common = {
      path: String(body.path || "/").slice(0, 500),
      locale: body.locale || null,
      referrer: body.referrer || null,
      sessionId: body.sessionId || null,
      ipHash,
      country: req.headers.get("x-vercel-ip-country"),
      city: req.headers.get("x-vercel-ip-city"),
      device: deviceFromAgent(userAgent),
      browser: browserFromAgent(userAgent),
    };

    if (body.type === "page_view") {
      await prisma.pageView.create({ data: { ...common, userAgent } });
    } else {
      await prisma.analyticsEvent.create({
        data: {
          ...common,
          type: String(body.type || "click").slice(0, 80),
          label: body.label ? String(body.label).slice(0, 250) : null,
          target: body.target ? String(body.target).slice(0, 500) : null,
          metadata: body.metadata ? JSON.stringify(body.metadata).slice(0, 3000) : null,
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
