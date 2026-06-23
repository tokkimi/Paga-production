"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import EventCard from "@/components/EventCard";
import { Filter as FilterIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Event {
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
  const t = useTranslations("dates");
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/events?upcoming=" + (tab === "upcoming"));
        const data = await res.json();
        setEvents(data);
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
    if (filter === "paga") return e.artists.some((a) => a.artist.slug === "paga");
    if (filter === "alexis-dante") return e.artists.some((a) => a.artist.slug === "alexis-dante");
    return true;
  });

  return (
    <div className="min-h-screen px-4 pb-20 pt-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-primary">Live</p>
          <h1 className="section-title mb-4">{t("title")}</h1>
          <p className="text-sm text-white/40">{t("subtitle")}</p>
        </div>

        <div className="glass-card mx-auto mb-6 flex max-w-sm gap-2 rounded-xl p-1">
          {(["upcoming", "past"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={cn("flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all", tab === item ? "bg-primary text-white" : "text-white/60 hover:text-white")}
            >
              {item === "upcoming" ? t("upcoming") : t("past")}
            </button>
          ))}
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-2">
          <FilterIcon size={14} className="text-white/40" />
          {[
            { value: "all", label: t("filter_all") },
            { value: "paga", label: "Paga" },
            { value: "alexis-dante", label: "Alexis Dante" },
            { value: "b2b", label: t("filter_b2b") },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value as FilterType)}
              className={cn("rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all", filter === item.value ? "bg-primary text-white" : "glass-card text-white/60 hover:text-white")}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass-card animate-pulse p-5">
                <div className="flex gap-4">
                  <div className="h-16 w-16 rounded-xl bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-white/5" />
                    <div className="h-3 w-2/3 rounded bg-white/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 text-center text-white/40">
            {tab === "upcoming" ? t("no_upcoming") : t("no_past")}
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
