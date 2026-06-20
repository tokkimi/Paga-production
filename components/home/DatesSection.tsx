"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import EventCard from "@/components/EventCard";

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
  artists?: { artist: { name: string; slug: string } }[];
}

interface DatesSectionProps {
  events: Event[];
}

export default function DatesSection({ events }: DatesSectionProps) {
  const t = useTranslations("home.upcoming");
  const locale = useLocale();

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary mb-3">
            Live
          </p>
          <h2 className="section-title mb-4">{t("title")}</h2>
          <p className="text-white/60 max-w-md mx-auto text-sm">{t("subtitle")}</p>
        </motion.div>

        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="text-center text-white/40 py-12">{t("no_events")}</div>
          ) : (
            events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href={`/${locale}/dates`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors group"
          >
            {t("see_all")}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
