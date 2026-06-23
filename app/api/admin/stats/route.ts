import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const days = Math.min(Math.max(Number(req.nextUrl.searchParams.get("days") || 30), 1), 365);
  const since = new Date(Date.now() - days * 86400000);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const week = new Date(Date.now() - 7 * 86400000);

  const [views, todayViews, weekViews, clicks, users, proposals, campaigns, bookings] = await Promise.all([
    prisma.pageView.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: "desc" }, take: 5000 }),
    prisma.pageView.count({ where: { createdAt: { gte: today } } }),
    prisma.pageView.count({ where: { createdAt: { gte: week } } }),
    prisma.analyticsEvent.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: "desc" }, take: 3000 }),
    prisma.user.count(),
    prisma.sponsorProposal.count(),
    prisma.campaign.count(),
    prisma.privateBooking.count(),
  ]);

  const countBy = <T>(items: T[], value: (item: T) => string | null | undefined) => {
    const map = new Map<string, number>();
    for (const item of items) {
      const key = value(item) || "Inconnu";
      map.set(key, (map.get(key) || 0) + 1);
    }
    return [...map.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  };

  const dailyMap = new Map<string, number>();
  for (const view of views) {
    const key = view.createdAt.toISOString().slice(0, 10);
    dailyMap.set(key, (dailyMap.get(key) || 0) + 1);
  }

  return NextResponse.json({
    summary: {
      views: views.length,
      todayViews,
      weekViews,
      uniqueVisitors: new Set(views.map((v) => v.sessionId || v.ipHash).filter(Boolean)).size,
      clicks: clicks.length,
      users,
      proposals,
      campaigns,
      bookings,
    },
    daily: [...dailyMap.entries()].map(([date, value]) => ({ date, value })).sort((a, b) => a.date.localeCompare(b.date)),
    pages: countBy(views, (v) => v.path).slice(0, 12),
    countries: countBy(views, (v) => v.country).slice(0, 10),
    cities: countBy(views, (v) => v.city).slice(0, 10),
    devices: countBy(views, (v) => v.device),
    browsers: countBy(views, (v) => v.browser),
    referrers: countBy(views, (v) => {
      if (!v.referrer) return "Accès direct";
      try { return new URL(v.referrer).hostname; } catch { return v.referrer; }
    }).slice(0, 10),
    clickTargets: countBy(clicks, (v) => v.label || v.target).slice(0, 12),
    recent: [
      ...views.slice(0, 30).map((v) => ({ type: "view", label: v.path, detail: [v.city, v.country, v.device].filter(Boolean).join(" · "), date: v.createdAt })),
      ...clicks.slice(0, 30).map((v) => ({ type: "click", label: v.label || v.target || "Clic", detail: v.path, date: v.createdAt })),
    ].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 40),
  });
}
