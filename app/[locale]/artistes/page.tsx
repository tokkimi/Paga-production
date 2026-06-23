import { prisma } from "@/lib/prisma";
import ArtistCard from "@/components/ArtistCard";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("artists");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

async function getArtists() {
  return prisma.artist.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export default async function ArtistesPage() {
  const t = await getTranslations("artists");
  const artists = await getArtists();

  const serialized = artists.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen px-4 pb-20 pt-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-primary">Roster</p>
          <h1 className="section-title mb-4">{t("title")}</h1>
          <p className="mx-auto max-w-md text-white/60">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {serialized.map((artist, i) => (
            <ArtistCard key={artist.id} artist={artist} index={i} />
          ))}
        </div>

        {serialized.length === 0 && (
          <div className="py-20 text-center text-white/40">{t("no_events")}</div>
        )}
      </div>
    </div>
  );
}
