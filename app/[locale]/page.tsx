import { prisma } from "@/lib/prisma";
import Hero from "@/components/home/Hero";
import DatesSection from "@/components/home/DatesSection";
import MusicSection from "@/components/home/MusicSection";
import VideoSection from "@/components/home/VideoSection";
import HowItWorks from "@/components/home/HowItWorks";
import Newsletter from "@/components/home/Newsletter";
import Contact from "@/components/home/Contact";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const descriptions = {
    fr: "Paga Production - Label DJ, dates de concert, musique et partenariats sur mesure.",
    en: "Paga Production - DJ label, tour dates, music and custom brand partnerships.",
    ko: "Paga Production - DJ 레이블, 공연 일정, 음악, 맞춤 브랜드 파트너십.",
  };

  return {
    title: "Paga Production | " + t("subtitle"),
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  };
}

async function getHomeData() {
  try {
    const [events, tracks, videos] = await Promise.all([
      prisma.event.findMany({
        where: { isActive: true, date: { gte: new Date() } },
        orderBy: { date: "asc" },
        take: 6,
        include: { artists: { include: { artist: true } } },
      }),
      prisma.track.findMany({
        where: { isActive: true },
        orderBy: [
          { releasedAt: { sort: "desc", nulls: "last" } },
          { createdAt: "desc" },
          { order: "asc" },
        ],
        take: 10,
      }),
      prisma.video.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        take: 6,
      }),
    ]);
    return { events, tracks, videos };
  } catch (error) {
    console.error("Home data error:", error);
    return { events: [], tracks: [], videos: [] };
  }
}

export default async function HomePage() {
  const { events, tracks, videos } = await getHomeData();

  const serializedEvents = events.map((e) => ({
    ...e,
    date: e.date.toISOString(),
    endDate: e.endDate?.toISOString() || null,
    createdAt: e.createdAt.toISOString(),
    artists: e.artists.map((ea) => ({
      artist: {
        name: ea.artist.name,
        slug: ea.artist.slug,
      },
    })),
  }));

  const serializedTracks = tracks.map((t) => ({
    ...t,
    releasedAt: t.releasedAt?.toISOString() || null,
    createdAt: t.createdAt.toISOString(),
  }));

  const serializedVideos = videos.map((v) => ({
    ...v,
    createdAt: v.createdAt.toISOString(),
  }));

  return (
    <>
      <Hero />
      <DatesSection events={serializedEvents} />
      <MusicSection tracks={serializedTracks} />
      <VideoSection videos={serializedVideos} />
      <HowItWorks />
      <Newsletter />
      <Contact />
    </>
  );
}
