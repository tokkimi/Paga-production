import { prisma } from "@/lib/prisma";
import Hero from "@/components/home/Hero";
import DatesSection from "@/components/home/DatesSection";
import MusicSection from "@/components/home/MusicSection";
import VideoSection from "@/components/home/VideoSection";
import HowItWorks from "@/components/home/HowItWorks";
import Newsletter from "@/components/home/Newsletter";
import Contact from "@/components/home/Contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paga Production | DJ Label - Summer Tour 2026",
  description:
    "Paga Production - Label DJ basé dans le Sud de la France. Dates de concert, musique et partenariats.",
};

async function getHomeData() {
  const [events, tracks, videos] = await Promise.all([
    prisma.event.findMany({
      where: { isActive: true, date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 6,
      include: { artists: { include: { artist: true } } },
    }),
    prisma.track.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 10,
    }),
    prisma.video.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 6,
    }),
  ]);
  return { events, tracks, videos };
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
