"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Calendar, ChevronDown, Users } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Hero() {
  const t = useTranslations("home.hero");
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#06080f]" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Stage atmosphere — blue spotlights */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main center glow */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full bg-primary/8 blur-[130px]" />
        {/* Left spotlight */}
        <div className="absolute top-0 left-[15%] w-[300px] h-[60vh] bg-gradient-to-b from-blue-600/6 to-transparent blur-[60px]" style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)" }} />
        {/* Right spotlight */}
        <div className="absolute top-0 right-[15%] w-[300px] h-[60vh] bg-gradient-to-b from-indigo-500/5 to-transparent blur-[60px]" style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)" }} />
        {/* Floor glow */}
        <div className="absolute bottom-0 left-0 right-0 h-[35vh] bg-gradient-to-t from-primary/4 to-transparent" />
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-[30vh] bg-gradient-to-b from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">

          {/* Pre-label */}
          <motion.div variants={itemVariants} className="mb-10">
            <span className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.5em] text-white/40">
              <span className="block w-10 h-px bg-white/20" />
              Summer Tour 2026
              <span className="block w-10 h-px bg-white/20" />
            </span>
          </motion.div>

          {/* Main title */}
          <motion.div variants={itemVariants}>
            <h1
              className="font-display font-black uppercase leading-none tracking-tight text-white"
              style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)" }}
            >
              PAGA
            </h1>
            <p
              className="font-sans font-semibold uppercase tracking-[0.35em] text-white/25 mt-1"
              style={{ fontSize: "clamp(0.6rem, 1.5vw, 0.85rem)" }}
            >
              PRODUCTION
            </p>
          </motion.div>

          {/* B2B separator */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mt-8 mb-8">
            <div className="h-px w-16 bg-white/10" />
            <div className="flex items-center gap-2 text-[11px] text-white/40 font-medium tracking-[0.3em] uppercase">
              <Users size={11} className="text-primary/60" />
              B2B Alexis Dante
            </div>
            <div className="h-px w-16 bg-white/10" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-sm text-white/40 mb-10 max-w-sm mx-auto leading-relaxed"
          >
            Tech house · Melodic techno · Afro house
            <br />
            <span className="text-white/25">Sud de la France — Europe</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href={`/${locale}/dates`}
              className="btn-primary text-sm px-7 py-3 justify-center"
            >
              <Calendar size={15} />
              {t("cta_dates")}
            </Link>
            <Link
              href={`/${locale}/artistes`}
              className="btn-secondary text-sm px-7 py-3 justify-center"
            >
              {t("cta_artists")}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-0 mt-16 divide-x divide-white/8"
          >
            {[
              { value: "15+", label: "Dates 2026" },
              { value: "B2B", label: "Alexis Dante" },
              { value: "4", label: "Pays" },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-8">
                <div className="text-lg font-black text-primary/90">{stat.value}</div>
                <div className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator — higher on mobile to clear bottom nav */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-28 md:bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown size={16} className="text-white/20" />
        </motion.div>
      </motion.div>
    </section>
  );
}
