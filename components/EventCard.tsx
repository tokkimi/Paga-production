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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.45 }}
    >
      <Link href={`/${locale}/dates/${event.slug}`}>
        <div
          className={cn(
            "group flex items-center gap-5 border-b border-white/6 transition-all duration-200",
            "hover:border-primary/20",
            compact ? "py-3" : "py-4",
            isPast && "opacity-40"
          )}
        >
          {/* Date — typography only, no box */}
          <div className="flex-shrink-0 w-12 text-center">
            <div className={cn(
              "text-2xl font-black leading-none tabular-nums",
              event.isFeatured ? "text-primary" : "text-white"
            )}>
              {day}
            </div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-0.5">
              {month}
            </div>
          </div>

          {/* Thin vertical separator */}
          <div className="w-px h-8 bg-white/10 flex-shrink-0" />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {event.isB2B && (
                <span className="badge-b2b flex items-center gap-1">
                  <Users size={9} />
                  B2B
                </span>
              )}
              {event.isFeatured && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-accent">
                  ★
                </span>
              )}
            </div>
            <h3 className={cn(
              "font-semibold truncate group-hover:text-primary transition-colors",
              compact ? "text-sm" : "text-[0.95rem]"
            )}>
              {title}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin size={10} className="text-white/30 flex-shrink-0" />
              <span className="text-xs text-white/40 truncate">
                {event.venue} — {event.city}
                {event.country !== "France" && `, ${event.country}`}
              </span>
            </div>
          </div>

          {/* Right: ticket or arrow */}
          <div className="flex-shrink-0">
            {event.ticketUrl && !isPast ? (
              <div className="flex items-center gap-1 text-xs text-primary border border-primary/25 rounded-lg px-2.5 py-1.5 group-hover:bg-primary/10 transition-all">
                <Ticket size={11} />
                <span className="hidden sm:inline">Réserver</span>
              </div>
            ) : (
              <span className="text-white/20 text-lg group-hover:text-white/40 transition-colors">→</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
