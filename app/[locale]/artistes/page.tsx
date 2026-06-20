import { prisma } from "@/lib/prisma";
import ArtistCard from "@/components/ArtistCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artistes",
  description: "Découvrez les artistes de Paga Production : Paga et Alexis Dante.",
};

async function getArtists() {
  return prisma.artist.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export default async function ArtistesPage() {
  const artists = await getArtists();

  const serialized = artists.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary mb-3">
            Roster
          </p>
          <h1 className="section-title mb-4">Artistes</h1>
          <p className="text-white/60 max-w-md mx-auto">
            Découvrez les artistes de Paga Production
          </p>
        </div>

        {/* Artists grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {serialized.map((artist, i) => (
            <ArtistCard key={artist.id} artist={artist} index={i} />
          ))}
        </div>

        {serialized.length === 0 && (
          <div className="text-center text-white/40 py-20">
            Aucun artiste pour le moment
          </div>
        )}
      </div>
    </div>
  );
}
