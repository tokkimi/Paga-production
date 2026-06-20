import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Ticket, Users, ArrowLeft, ExternalLink } from "lucide-react";
import EventCard from "@/components/EventCard";
import type { Metadata } from "next";

interface EventPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await prisma.event.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });
  if (!event) return { title: "Événement non trouvé" };
  return {
    title: event.title_fr,
    description: event.description_fr || `${event.title_fr} - ${event.venue}, ${event.city}`,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { locale, id } = await params;

  const event = await prisma.event.findFirst({
    where: { OR: [{ id }, { slug: id }], isActive: true },
    include: {
      artists: { include: { artist: true } },
    },
  });

  if (!event) notFound();

  const title = locale === "en" ? event.title_en : event.title_fr;
  const description = locale === "en" ? event.description_en : event.description_fr;
  const dateObj = new Date(event.date);
  const isPast = dateObj < new Date();

  const relatedEvents = await prisma.event.findMany({
    where: {
      isActive: true,
      id: { not: event.id },
      date: { gte: new Date() },
    },
    orderBy: { date: "asc" },
    take: 3,
    include: { artists: { include: { artist: true } } },
  });

  const serializedRelated = relatedEvents.map((e) => ({
    ...e,
    date: e.date.toISOString(),
    endDate: e.endDate?.toISOString() || null,
    createdAt: e.createdAt.toISOString(),
    artists: e.artists.map((a) => ({
      artist: { name: a.artist.name, slug: a.artist.slug },
    })),
  }));

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/${locale}/dates`}
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour aux dates
        </Link>

        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="flex-shrink-0 text-center glass-strong rounded-2xl p-5 min-w-[90px]">
              <div className="text-4xl font-black text-primary leading-none">
                {dateObj.toLocaleDateString("fr-FR", { day: "2-digit" })}
              </div>
              <div className="text-sm font-bold text-white/80 uppercase tracking-wider mt-1">
                {dateObj.toLocaleDateString("fr-FR", { month: "short" })}
              </div>
              <div className="text-sm text-white/50">{dateObj.getFullYear()}</div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {event.isB2B && (
                  <span className="badge-b2b flex items-center gap-1">
                    <Users size={10} />
                    B2B
                  </span>
                )}
                {isPast && (
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40 border border-white/20 rounded px-2 py-0.5">
                    Passé
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-black uppercase tracking-wide mb-4">
                {title}
              </h1>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/70">
                  <MapPin size={16} className="text-primary flex-shrink-0" />
                  <span>
                    {event.venue}, {event.city}
                    {event.country !== "France" && `, ${event.country}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Calendar size={16} className="text-primary flex-shrink-0" />
                  <span>
                    {dateObj.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {event.artists.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {event.artists.map((ea, i) => (
                    <Link
                      key={ea.artist.slug}
                      href={`/${locale}/artistes/${ea.artist.slug}`}
                      className="flex items-center gap-1.5 glass-card px-3 py-1.5 rounded-full text-sm hover:border-primary/30 transition-colors"
                    >
                      {ea.artist.name}
                      {i < event.artists.length - 1 && (
                        <span className="text-primary ml-1">×</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {event.ticketUrl && !isPast && (
              <div className="flex-shrink-0">
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <Ticket size={16} />
                  Réserver
                </a>
              </div>
            )}
            {event.eventUrl && (
              <div className="flex-shrink-0">
                <a
                  href={event.eventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <ExternalLink size={16} />
                  Événement
                </a>
              </div>
            )}
          </div>
        </div>

        {description && (
          <div className="glass-card p-8 mb-8">
            <h2 className="text-lg font-bold mb-4 text-primary uppercase tracking-wider">
              À propos
            </h2>
            <p className="text-white/80 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>
        )}

        <div className="glass-card p-8 mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-primary" />
            Lieu
          </h2>
          <div className="bg-white/5 rounded-xl h-48 flex items-center justify-center">
            <div className="text-center text-white/40">
              <MapPin size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">
                {event.venue}
                <br />
                {event.city}, {event.country}
              </p>
            </div>
          </div>
        </div>

        {serializedRelated.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Autres dates</h2>
            <div className="space-y-3">
              {serializedRelated.map((e, i) => (
                <EventCard key={e.id} event={e} index={i} compact />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
