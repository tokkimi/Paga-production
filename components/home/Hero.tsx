"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ChevronDown, Calendar, Users } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export default function Hero() {
  const t = useTranslations("home.hero");
  const locale = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
    }[] = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.6 - 0.2,
        opacity: Math.random() * 0.6 + 0.1,
        hue: Math.random() > 0.5 ? 0 : 20,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${p.opacity})`;
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />

      {/* Radial glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[100px]" />
      </div>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-50"
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(230,57,70,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(230,57,70,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Pre-title */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.4em] text-primary/80 border border-primary/30 rounded-full px-5 py-2 glass-card">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Summer Tour 2026
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            variants={itemVariants}
            className="text-[clamp(3.5rem,12vw,9rem)] font-black uppercase leading-none tracking-[-0.02em] mb-2"
          >
            <span className="block text-white">PAGA</span>
            <span
              className="block"
              style={{
                background: "linear-gradient(135deg, #E63946, #FF6B35)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              PRODUCTION
            </span>
          </motion.h1>

          {/* B2B label */}
          <motion.div variants={itemVariants} className="my-8">
            <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-2xl">
              <Users size={16} className="text-primary" />
              <span className="text-sm font-semibold text-white/90">
                {t("b2b")}
              </span>
              <span className="text-primary font-black text-lg">×</span>
              <span className="text-sm font-semibold text-white/90">
                Alexis Dante
              </span>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/60 mb-10 max-w-xl mx-auto"
          >
            DJ basé dans le Sud de la France — Sets électro, house et techno
            sur les plus belles scènes d&apos;Europe
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href={`/${locale}/dates`}
              className="btn-primary text-base px-8 py-4 justify-center"
            >
              <Calendar size={18} />
              {t("cta_dates")}
            </Link>
            <Link
              href={`/${locale}/artistes`}
              className="btn-secondary text-base px-8 py-4 justify-center"
            >
              {t("cta_artists")}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-6 mt-16 max-w-sm mx-auto"
          >
            {[
              { value: "15+", label: "Dates 2026" },
              { value: "B2B", label: "Alexis Dante" },
              { value: "EU", label: "Tournée" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-primary">{stat.value}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-white/30">
          {t("scroll")}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={20} className="text-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
