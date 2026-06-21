"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, MapPin, Music2 } from "lucide-react";
import { useState } from "react";

const heroDates = [
  { href: "delta-festival-marseille-juin-2026", day: "22", month: "Jun", title: "Delta Festival", meta: "Marseille / TBA" },
  { href: "fos-en-petanque-2026", day: "25", month: "Jun", title: "Fos en Petanque", meta: "Fos-sur-Mer" },
  { href: "holi-lakes-festival-2026", day: "12", month: "Jul", title: "Holi Lakes", meta: "Belgium" },
  { href: "scandals-pool-party-lyon-2026", day: "14", month: "Jul", title: "Scandals Pool Party", meta: "Lyon" },
];

export default function Hero() {
  const t = useTranslations("home.hero");
  const locale = useLocale();
  const [activeDate, setActiveDate] = useState(0);

  const changeDate = (direction: number) => {
    setActiveDate((current) => (current + direction + heroDates.length) % heroDates.length);
  };

  return (
    <section className="relative min-h-[760px] overflow-hidden">
      <img
        src="/images/paga-hero-monument.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,5,10,.94),rgba(2,5,10,.58)_38%,rgba(2,5,10,.08)_72%),linear-gradient(180deg,rgba(2,5,10,.08),rgba(2,5,10,.88))]" />

      <div className="relative z-10 mx-auto grid min-h-[760px] w-full max-w-[1160px] grid-cols-1 items-end gap-8 px-4 pb-12 pt-32 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16 lg:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.35em] text-cyan-300">
            Summer Tour 2026
          </p>
          <h1 className="text-[clamp(3.5rem,9vw,7rem)] font-black uppercase leading-[0.86] tracking-[-0.08em] text-white">
            Paga Production
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/64">
            Nocturnal tech house, melodic pressure and festival energy between France, Europe and the Mediterranean.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={`/${locale}/dates`} className="btn-primary justify-center">
              <Calendar size={15} />
              {t("cta_dates")}
            </Link>
            <Link href={`/${locale}#musique`} className="btn-secondary justify-center">
              <Music2 size={15} />
              Latest sounds
            </Link>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[390px] lg:mx-0"
          aria-label="Next dates"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-cyan-300/90">
              Next dates
            </p>
            <span className="text-[10px] font-bold tabular-nums text-white/35">
              {String(activeDate + 1).padStart(2, "0")} / {String(heroDates.length).padStart(2, "0")}
            </span>
          </div>

          <div className="grid grid-cols-[18px_minmax(0,1fr)_18px] items-center gap-4">
            <button
              type="button"
              onClick={() => changeDate(-1)}
              className="scroll-dot"
              aria-label="Previous dates"
            />
            <div className="min-w-0 overflow-hidden">
              <AnimatePresence mode="wait">
                {heroDates.map((date, index) => index === activeDate && (
                  <motion.div
                    key={date.href}
                    initial={{ opacity: 0, x: 22 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -22 }}
                    transition={{ duration: 0.24 }}
                  >
              <Link
                href={`/${locale}/dates/${date.href}`}
                      className="block min-h-[190px] rounded-2xl border border-cyan-200/20 bg-black/20 p-5 backdrop-blur-xl transition-colors hover:bg-white/[0.07]"
              >
                      <div className="flex items-start justify-between">
                        <time className="text-[10px] font-black uppercase tracking-widest text-cyan-300">
                          <span className="block text-5xl leading-none text-white">{date.day}</span>
                          {date.month}
                        </time>
                        <span className="rounded-full border border-cyan-200/20 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-cyan-200">
                          Details
                        </span>
                      </div>
                      <strong className="mt-7 block text-xl leading-tight text-white">{date.title}</strong>
                      <small className="mt-3 flex items-center gap-2 text-xs text-white/48">
                        <MapPin size={12} className="text-cyan-300" />
                        {date.meta}
                      </small>
              </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <button
              type="button"
              onClick={() => changeDate(1)}
              className="scroll-dot"
              aria-label="Next dates"
            />
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
