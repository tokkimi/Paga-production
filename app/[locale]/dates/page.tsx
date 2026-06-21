"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import EventCard from "@/components/EventCard";
import { Filter as FilterIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventItem {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string;
  venue: string;
  city: string;
  country: string;
  date: string;
  ticketUrl?: string | null;
  isB2B: boolean;
  isFeatured: boolean;
  artists: { artist: { name: string; slug: string } }[];
}

type FilterType = "all" | "paga" | "alexis-dante" | "b2b";

export default function DatesPage() {
  const locale = useLocale();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/events?upcoming=${tab === "upcoming"}`);
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch {
        console.error("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [tab]);

  const filteredEvents = events.filter((e) => {
    if (filter === "b2b") return e.isB2B;
    if (filter === "paga")
      return e.artists.some((a) => a.artist.slug === "paga");
    if (filter === "alexis-dante")
      return e.artists.some((a) => a.artist.slug === "alexis-dante");
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary mb-3">
            Live
          </p>
          <h1 className="section-title mb-4">Dates</h1>
          <p className="text-white/60">Tous les événements et concerts</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 glass-card p-1 rounded-xl max-w-sm mx-auto">
          {(["upcoming", "past"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all",
                tab === t
                  ? "bg-primary text-white"
                  : "text-white/60 hover:text-white"
              )}
            >
              {t === "upcoming" ? "À venir" : "Passées"}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <FilterIcon size={14} className="text-white/40" />
          {[
            { value: "all", label: "Tous" },
            { value: "paga", label: "Paga" },
            { value: "alexis-dante", label: "Alexis Dante" },
            { value: "b2b", label: "B2B" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as FilterType)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all",
                filter === f.value
                  ? "bg-primary text-white"
                  : "glass-card text-white/60 hover:text-white"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Events */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass-card p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-1/3" />
                    <div className="h-3 bg-white/5 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center text-white/40 py-20">
            Aucune date {tab === "upcoming" ? "à venir" : "passée"}
          </div>
        ) : (
          <motion.div className="space-y-3">
            {filteredEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
