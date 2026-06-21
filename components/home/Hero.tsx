"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Calendar, Music2 } from "lucide-react";

const heroDates = [
  { href: "delta-festival-marseille-juin-2026", day: "22", month: "Jun", title: "Delta Festival", meta: "Marseille / TBA" },
  { href: "fos-en-petanque-2026", day: "25", month: "Jun", title: "Fos en Petanque", meta: "Fos-sur-Mer" },
  { href: "holi-lakes-festival-2026", day: "12", month: "Jul", title: "Holi Lakes", meta: "Belgium" },
  { href: "scandals-pool-party-lyon-2026", day: "14", month: "Jul", title: "Scandals Pool Party", meta: "Lyon" },
];

export default function Hero() {
  const t = useTranslations("home.hero");
  const locale = useLocale();

  const scrollDates = (direction: number) => {
    const rail = document.getElementById("hero-date-rail");
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.max(220, rail.clientWidth * 0.8), behavior: "smooth" });
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
          className="relative px-6"
          aria-label="Next dates"
        >
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.35em] text-cyan-300/90">
            Next dates
          </p>
          <button
            type="button"
            onClick={() => scrollDates(-1)}
            className="scroll-dot left-0"
            aria-label="Previous dates"
          />
          <div id="hero-date-rail" className="carousel-scroll flex gap-3 pb-2">
            {heroDates.map((date) => (
              <Link
                key={date.href}
                href={`/${locale}/dates/${date.href}`}
                className="carousel-item min-h-[160px] w-[205px] shrink-0 rounded-2xl border border-cyan-200/20 bg-white/[0.045] p-4 backdrop-blur-xl transition-colors hover:bg-white/[0.08]"
              >
                <time className="text-[10px] font-black uppercase tracking-widest text-cyan-300">
                  <span className="block text-3xl leading-none text-white">{date.day}</span>
                  {date.month}
                </time>
                <strong className="mt-5 block text-sm leading-tight text-white">{date.title}</strong>
                <small className="mt-2 block text-xs text-white/48">{date.meta}</small>
              </Link>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollDates(1)}
            className="scroll-dot right-0"
            aria-label="Next dates"
          />
        </motion.aside>
      </div>
    </section>
  );
}
