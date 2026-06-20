"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: {
    id: string;
    slug: string;
    title_fr: string;
    title_en: string;
    venue: string;
    city: string;
    country: string;
    date: string | Date;
    ticketUrl?: string | null;
    isB2B: boolean;
    isFeatured: boolean;
    artists?: {
      artist: { name: string; slug: string };
    }[];
  };
  index?: number;
  compact?: boolean;
}

export default function EventCard({ event, index = 0, compact = false }: EventCardProps) {
  const locale = useLocale();
  const dateObj = new Date(event.date);
  const day = dateObj.toLocaleDateString("fr-FR", { day: "2-digit" });
  const month = dateObj.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase();
  const year = dateObj.getFullYear();
  const title = locale === "en" ? event.title_en : event.title_fr;

  const isPast = dateObj < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
    >
      <Link href={`/${locale}/dates/${event.slug}`}>
        <div
          className={cn(
            "glass-card hover-lift group cursor-pointer transition-all duration-300",
            "hover:border-primary/30 hover:bg-white/8",
            compact ? "p-4" : "p-5",
            isPast && "opacity-60"
          )}
        >
          <div className="flex items-center gap-4">
            {/* Date badge */}
            <div
              className={cn(
                "flex-shrink-0 text-center rounded-xl p-3 min-w-[64px]",
                event.isFeatured
                  ? "bg-primary/20 border border-primary/40"
                  : "bg-white/5 border border-white/10"
              )}
            >
              <div className={cn(
                "text-2xl font-black leading-none",
                event.isFeatured ? "text-primary" : "text-white"
              )}>
                {day}
              </div>
              <div className="text-xs font-bold text-white/60 uppercase tracking-wider mt-0.5">
                {month}
              </div>
              <div className="text-xs text-white/40">{year}</div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {event.isB2B && (
                  <span className="badge-b2b flex items-center gap-1">
                    <Users size={9} />
                    B2B
                  </span>
                )}
                {event.isFeatured && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent px-2 py-0.5 rounded border border-accent/30 bg-accent/10">
                    ★ Featured
                  </span>
                )}
              </div>

              <h3
                className={cn(
                  "font-bold truncate group-hover:text-primary transition-colors",
                  compact ? "text-sm" : "text-base"
                )}
              >
                {title}
              </h3>

              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-white/60">
                  <MapPin size={11} />
                  {event.venue}
                </span>
                <span className="flex items-center gap-1 text-xs text-white/50">
                  <Calendar size={11} />
                  {event.city}
                  {event.country !== "France" && `, ${event.country}`}
                </span>
              </div>

              {!compact && event.artists && event.artists.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  {event.artists.map((ea, i) => (
                    <span key={ea.artist.slug}>
                      <span className="text-xs text-white/50">{ea.artist.name}</span>
                      {i < event.artists!.length - 1 && (
                        <span className="text-primary mx-1">×</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            {event.ticketUrl && !isPast && (
              <div className="flex-shrink-0">
                <div className="flex items-center gap-1 text-xs text-primary border border-primary/30 rounded-lg px-3 py-2 group-hover:bg-primary group-hover:text-white transition-all">
                  <Ticket size={12} />
                  <span className="hidden sm:inline font-medium">Réserver</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
