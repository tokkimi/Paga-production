"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MirageLogo from "./MirageLogo";
import FaceLayer from "./FaceLayer";
import HologramScanner from "./HologramScanner";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_DISTANCE = 3000;

export default function MirageHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${SCROLL_DISTANCE}`,
          scrub: 1.2,
          pin: true,
        },
      });

      // ── 0–10%: Logo reveals ────────────────────────────────────────────────
      tl.fromTo(
        ".mirage-logo",
        { opacity: 0.25, scale: 0.94 },
        { opacity: 1, scale: 1, ease: "none", duration: 0.12 },
        0
      );

      // ── 8–28%: Faces rise from shadow ─────────────────────────────────────
      tl.fromTo(
        ".face-paga",
        { opacity: 0, x: "-6vw" },
        { opacity: 1, x: "0vw", ease: "none", duration: 0.22 },
        0.08
      );
      tl.fromTo(
        ".face-alexis",
        { opacity: 0, x: "6vw" },
        { opacity: 1, x: "0vw", ease: "none", duration: 0.22 },
        0.08
      );

      // ── 28–46%: Hologram scanner sweeps across ────────────────────────────
      tl.fromTo(
        ".hologram-scanner",
        { y: "-5vh", opacity: 1 },
        { y: "106vh", opacity: 0.7, ease: "none", duration: 0.18 },
        0.28
      );
      // Fade in at start
      tl.fromTo(
        ".hologram-scanner",
        { opacity: 0 },
        { opacity: 1, ease: "none", duration: 0.03 },
        0.28
      );
      // Fade out at end
      tl.to(
        ".hologram-scanner",
        { opacity: 0, ease: "none", duration: 0.03 },
        0.44
      );

      // ── 48–52%: Background glow breathes ─────────────────────────────────
      tl.fromTo(
        ".mirage-bg-glow",
        { opacity: 0.5 },
        { opacity: 1, ease: "none", duration: 0.04 },
        0.48
      );
      tl.to(
        ".mirage-bg-glow",
        { opacity: 0.6, ease: "none", duration: 0.04 },
        0.52
      );

      // ── 65–95%: Faces converge toward center ──────────────────────────────
      tl.to(
        ".face-paga",
        { x: "8vw", rotate: 6, ease: "none", duration: 0.30 },
        0.65
      );
      tl.to(
        ".face-alexis",
        { x: "-8vw", rotate: -6, ease: "none", duration: 0.30 },
        0.65
      );

      // ── 85–100%: Logo pulse + CTA ─────────────────────────────────────────
      tl.to(
        ".mirage-logo",
        { scale: 1.05, ease: "none", duration: 0.15 },
        0.85
      );
      tl.fromTo(
        ".mirage-cta",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, ease: "none", duration: 0.15 },
        0.85
      );

      // ── Scroll hint fades early ────────────────────────────────────────────
      tl.to(
        ".mirage-scroll-hint",
        { opacity: 0, ease: "none", duration: 0.04 },
        0.03
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden"
      style={{ background: "#020611" }}
    >
      {/* ── Deep background ─────────────────────────────────────────────── */}
      <div
        className="mirage-bg-glow pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 60%, rgba(0,140,255,0.07), transparent 68%)",
          opacity: 0.5,
        }}
      />

      {/* ── Center blackout — keeps logo readable over faces ────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 42% 55% at 50% 38%, rgba(2,6,17,0.72), transparent 70%)",
        }}
      />

      {/* ── Faces ───────────────────────────────────────────────────────── */}
      <FaceLayer
        person="paga"
        side="left"
        imgSrc="/mirage/processed/paga/paga-face.webp"
      />
      <FaceLayer
        person="alexis"
        side="right"
        imgSrc="/mirage/processed/alexis/alexis-face.webp"
      />

      {/* ── Scanner ─────────────────────────────────────────────────────── */}
      <HologramScanner />

      {/* ── Logo ────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 z-30 flex justify-center"
        style={{ top: "11%" }}
      >
        <MirageLogo />
      </div>

      {/* ── Subtle bottom floor glow ─────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{
          height: "28%",
          background:
            "linear-gradient(to top, rgba(0,140,255,0.06), transparent)",
        }}
      />

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <div
        className="mirage-cta absolute inset-x-0 z-30 flex justify-center"
        style={{ bottom: "10%", opacity: 0 }}
      >
        <button
          style={{
            border: "1px solid rgba(0,140,255,0.35)",
            background: "rgba(0,140,255,0.04)",
            backdropFilter: "blur(6px)",
            padding: "14px 36px",
            color: "#61D4FF",
            fontSize: "0.65rem",
            fontWeight: 400,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            boxShadow: "0 0 24px rgba(0,140,255,0.12)",
            cursor: "pointer",
          }}
        >
          Discover the Experience
        </button>
      </div>

      {/* ── Scroll hint ─────────────────────────────────────────────────── */}
      <div
        className="mirage-scroll-hint pointer-events-none absolute inset-x-0 z-30 text-center"
        style={{ bottom: "6%" }}
      >
        <p
          style={{
            fontSize: "0.6rem",
            fontWeight: 300,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(0,140,255,0.45)",
          }}
        >
          Scroll to reveal
        </p>
      </div>
    </section>
  );
}
