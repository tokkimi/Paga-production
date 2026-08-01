import { prisma } from "@/lib/prisma";
import MirageExperience from "@/components/home/MirageExperience";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const descriptions = {
    fr: "Paga Production - Paga, Sherrie Sherrie avec Alexis Dante, dates, musique, videos et partenariats.",
    en: "Paga Production - Paga, Sherrie Sherrie with Alexis Dante, dates, music, videos and partnerships.",
    ko: "Paga Production - Paga와 Alexis Dante의 Sherrie Sherrie, 공연 일정, 음악, 영상 및 파트너십.",
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
        take: 8,
        include: { artists: { include: { artist: true } } },
      }),
      prisma.track.findMany({
        where: { isActive: true },
        orderBy: [
          { releasedAt: { sort: "desc", nulls: "last" } },
          { createdAt: "desc" },
          { order: "asc" },
        ],
        take: 12,
      }),
      prisma.video.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        take: 8,
      }),
    ]);
    return { events, tracks, videos };
  } catch (error) {
    console.warn("Home data unavailable, using local preview fallback:", error);
    const createdAt = new Date("2026-06-01T10:00:00.000Z");
    return {
      events: [
        {
          id: "fallback-delta",
          slug: "delta-festival",
          title_fr: "Delta Festival",
          title_en: "Delta Festival",
          venue: "Delta Festival",
          city: "Marseille",
          country: "France",
          date: new Date("2026-06-22T20:00:00.000Z"),
          endDate: null,
          ticketUrl: "https://www.delta-festival.com/",
          isB2B: true,
          isFeatured: true,
          createdAt,
          artists: [
            { artist: { name: "Paga", slug: "paga" } },
            { artist: { name: "Alexis Dante", slug: "alexis-dante" } },
          ],
        },
      ],
      tracks: [],
      videos: [],
    };
  }
}

export default async function HomePage() {
  const { events, tracks, videos } = await getHomeData();

  const serializedEvents = events.map((event) => ({
    ...event,
    date: event.date.toISOString(),
    endDate: event.endDate?.toISOString() || null,
    createdAt: event.createdAt.toISOString(),
    artists: event.artists.map((eventArtist) => ({
      artist: {
        name: eventArtist.artist.name,
        slug: eventArtist.artist.slug,
      },
    })),
  }));

  const serializedTracks = tracks.map((track) => ({
    ...track,
    releasedAt: track.releasedAt?.toISOString() || null,
    createdAt: track.createdAt.toISOString(),
  }));

  const serializedVideos = videos.map((video) => ({
    ...video,
    createdAt: video.createdAt.toISOString(),
  }));

  return <MirageExperience events={serializedEvents} tracks={serializedTracks} videos={serializedVideos} />;
}
