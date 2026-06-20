import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Share2, Music, Play, ExternalLink, MapPin, Calendar } from "lucide-react";
import EventCard from "@/components/EventCard";
import type { Metadata } from "next";

interface ArtistPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = await prisma.artist.findUnique({ where: { slug } });
  if (!artist) return { title: "Artiste non trouvé" };
  return {
    title: artist.name,
    description: artist.shortBio_fr || `Découvrez ${artist.name} sur Paga Production.`,
  };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { locale, slug } = await params;

  const artist = await prisma.artist.findUnique({
    where: { slug },
    include: {
      events: {
        include: { event: { include: { artists: { include: { artist: true } } } } },
        orderBy: { event: { date: "asc" } },
      },
      tracks: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!artist || !artist.isActive) notFound();

  const bio = locale === "en" ? artist.bio_en : artist.bio_fr;

  const upcomingEvents = artist.events
    .filter((ea) => ea.event.date >= new Date())
    .map((ea) => ({
      ...ea.event,
      date: ea.event.date.toISOString(),
      endDate: ea.event.endDate?.toISOString() || null,
      createdAt: ea.event.createdAt.toISOString(),
      artists: ea.event.artists.map((a) => ({
        artist: { name: a.artist.name, slug: a.artist.slug },
      })),
    }));

  const socialLinks = [
    { icon: Share2, href: artist.instagram, label: "Instagram" },
    { icon: Music, href: artist.spotify, label: "Spotify" },
    { icon: Music, href: artist.soundcloud, label: "SoundCloud" },
    { icon: Play, href: artist.youtube, label: "YouTube" },
    { icon: ExternalLink, href: artist.appleMusic, label: "Apple Music" },
    { icon: ExternalLink, href: artist.deezer, label: "Deezer" },
    { icon: ExternalLink, href: artist.tiktok, label: "TikTok" },
  ].filter((l) => l.href);

  return (
    <div className="min-h-screen">
      {/* Banner / Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        {artist.banner ? (
          <img
            src={artist.banner}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-black to-secondary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent" />

        {artist.avatar && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className="w-28 h-28 rounded-full border-4 border-[#0a0a0a] overflow-hidden">
              <img
                src={artist.avatar}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-20 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black uppercase tracking-wider gradient-text-red mb-2">
            {artist.name}
          </h1>

          {socialLinks.length > 0 && (
            <div className="flex gap-3 justify-center mt-6">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-colors"
                    title={link.label}
                  >
                    <Icon size={16} className="text-white/70" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {bio && (
          <div className="glass-card p-8 mb-12">
            <h2 className="text-xl font-bold mb-4 text-primary uppercase tracking-wider">
              Biographie
            </h2>
            <p className="text-white/80 leading-relaxed whitespace-pre-line">{bio}</p>
          </div>
        )}

        {upcomingEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Prochaines dates
            </h2>
            <div className="space-y-3">
              {upcomingEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </div>
        )}

        {artist.tracks.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Music size={20} className="text-primary" />
              Musique
            </h2>
            <div className="space-y-3">
              {artist.tracks.map((track) => (
                <div key={track.id} className="glass-card p-4">
                  <div className="flex items-center gap-4">
                    {track.cover && (
                      <img
                        src={track.cover}
                        alt={track.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{track.title}</h3>
                      <p className="text-sm text-white/50">{track.artistName}</p>
                    </div>
                    {track.externalUrl && (
                      <a
                        href={track.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/10 transition-colors"
                      >
                        <ExternalLink size={12} />
                        Écouter
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
