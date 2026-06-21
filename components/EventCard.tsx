"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { MapPin, Ticket, Users } from "lucide-react";
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
  const title = locale === "en" ? event.title_en : event.title_fr;
  const isPast = dateObj < new Date();
  const artists = event.artists?.map((item) => item.artist.name).join(" / ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.035, duration: 0.38 }}
    >
      <Link href={`/${locale}/dates/${event.slug}`} className="block">
        <div
          className={cn(
            "group grid items-center gap-4 rounded-2xl border border-cyan-200/15 bg-white/[0.045] backdrop-blur-xl transition-all duration-200 hover:border-cyan-200/35 hover:bg-white/[0.075]",
            compact ? "grid-cols-[62px_minmax(0,1fr)] px-4 py-3" : "grid-cols-[78px_minmax(0,1fr)_auto] px-5 py-4",
            isPast && "opacity-45"
          )}
        >
          <div className="text-center">
            <div className={cn("text-3xl font-black leading-none tabular-nums", event.isFeatured ? "text-cyan-300" : "text-white")}>
              {day}
            </div>
            <div className="mt-1 text-[10px] font-black uppercase tracking-widest text-white/42">
              {month}
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              {event.isB2B && (
                <span className="badge-b2b inline-flex items-center gap-1">
                  <Users size={9} />
                  B2B
                </span>
              )}
              {event.isFeatured && (
                <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-cyan-200">
                  Featured
                </span>
              )}
            </div>
            <h3 className={cn("truncate font-bold tracking-[-0.03em] text-white transition-colors group-hover:text-cyan-200", compact ? "text-sm" : "text-lg")}>
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-white/48">
              <MapPin size={11} className="shrink-0 text-cyan-300/65" />
              <span className="truncate">
                {event.venue} / {event.city}
                {event.country !== "France" && `, ${event.country}`}
                {artists && ` / ${artists}`}
              </span>
            </div>
          </div>

          {!compact && (
            <div className="hidden shrink-0 sm:block">
              {event.ticketUrl && !isPast ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200/25 px-3 py-2 text-xs font-bold text-cyan-200 group-hover:bg-cyan-300/10">
                  <Ticket size={12} />
                  Details
                </span>
              ) : (
                <span className="text-xs font-bold uppercase tracking-wider text-white/32">Details</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
