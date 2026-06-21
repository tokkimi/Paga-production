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
    <div className="min-h-screen pt-24 pb-28 md:pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          href={`/${locale}/dates`}
          className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white mb-10 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={14} />
          Retour aux dates
        </Link>

        {/* Date display */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary mb-2">
            {dateObj.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>

          <div className="flex flex-wrap items-start gap-3 mb-4">
            {event.isB2B && (
              <span className="badge-b2b flex items-center gap-1">
                <Users size={10} />
                B2B
              </span>
            )}
            {isPast && (
              <span className="text-xs font-bold uppercase tracking-wider text-white/30 border border-white/15 rounded px-2 py-0.5">
                Passé
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold mb-5 leading-snug">{title}</h1>

          <div className="flex flex-col gap-2 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-primary/70 flex-shrink-0" />
              <span>{event.venue}, {event.city}{event.country !== "France" && `, ${event.country}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-primary/70 flex-shrink-0" />
              <span>
                {dateObj.toLocaleTimeString(locale === "fr" ? "fr-FR" : "en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Artists */}
          {event.artists.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {event.artists.map((ea, i) => (
                <Link
                  key={ea.artist.slug}
                  href={`/${locale}/artistes/${ea.artist.slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-white/10 hover:border-primary/30 hover:text-primary transition-colors"
                >
                  {ea.artist.name}
                  {i < event.artists.length - 1 && (
                    <span className="text-primary ml-1">×</span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex gap-3 mt-8">
            {event.ticketUrl && !isPast && (
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Ticket size={15} />
                Réserver
              </a>
            )}
            {event.eventUrl && (
              <a
                href={event.eventUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <ExternalLink size={15} />
                Événement
              </a>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/6 mb-8" />

        {/* Description */}
        {description && (
          <div className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-4">
              À propos
            </h2>
            <p className="text-white/70 leading-relaxed text-sm whitespace-pre-line">
              {description}
            </p>
          </div>
        )}

        {/* Related events */}
        {serializedRelated.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-6">
              Autres dates à venir
            </h2>
            <div>
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
