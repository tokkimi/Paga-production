"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 40;

function framePath(person: "paga" | "alexis", index: number) {
  const padded = String(index).padStart(3, "0");
  return `/mirage/faces/${person}/${person}_${padded}.webp`;
}

export default function MirageFaceScroll() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [pagaFrame, setPagaFrame] = useState(0);
  const [alexisFrame, setAlexisFrame] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    /* Preload all frames; track if at least frame_000 loads */
    let loaded = 0;
    const total = FRAME_COUNT * 2;

    (["paga", "alexis"] as const).forEach((person) => {
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.onload = () => { loaded++; if (loaded === 1) setAssetsReady(true); };
        img.onerror = () => { loaded++; };
        img.src = framePath(person, i);
      }
    });

    const obj = { frame: 0 };

    const ctx = gsap.context(() => {
      /* Master scrub: drives frame counter */
      gsap.to(obj, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2200",
          scrub: 0.7,
          pin: true,
          onUpdate: () => {
            const f = Math.round(obj.frame);
            setPagaFrame(f);
            setAlexisFrame(f);
          },
        },
      });

      /* Logo pulse */
      gsap.to(".mirage-logo", {
        scale: 1.06,
        opacity: 0.82,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2200",
          scrub: true,
        },
      });

      /* Paga slides right toward center */
      gsap.to(".paga-face", {
        x: "8vw",
        rotate: 4,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2200",
          scrub: true,
        },
      });

      /* Alexis slides left toward center */
      gsap.to(".alexis-face", {
        x: "-8vw",
        rotate: -4,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2200",
          scrub: true,
        },
      });

      /* Glow intensifies at end */
      gsap.to(".face-glow", {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top+=1600 top",
          end: "+=600",
          scrub: true,
        },
      });

      /* Scroll hint fades out */
      gsap.to(".scroll-hint-mirage", {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top+=100 top",
          end: "top+=400 top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-[#020611] text-white"
    >
      {/* Radial blue atmospheric glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_65%,rgba(0,120,255,0.38),transparent_70%),linear-gradient(180deg,#020611_0%,#051630_55%,#020611_100%)]" />

      {/* Vertical grid lines */}
      <div className="absolute inset-0 opacity-50 [background-image:repeating-linear-gradient(90deg,transparent_0_68px,rgba(30,130,255,0.22)_69px,transparent_72px)]" />

      {/* Horizontal scan line — subtle */}
      <div className="absolute inset-0 [background-image:repeating-linear-gradient(0deg,transparent_0_3px,rgba(0,100,255,0.04)_4px,transparent_4px)] opacity-60" />

      {/* MIRAGE title */}
      <h1 className="mirage-logo pointer-events-none absolute left-1/2 top-[13%] z-10 -translate-x-1/2 select-none whitespace-nowrap font-light tracking-[0.16em] text-white drop-shadow-[0_0_40px_rgba(0,140,255,0.9)] [font-size:clamp(3rem,14vw,11rem)]">
        MIRAGE
      </h1>

      {/* Paga — left */}
      <div className="paga-face absolute left-[24%] top-[48%] z-20 -translate-x-1/2 -translate-y-1/2 md:left-[24%]">
        <div className="relative h-[min(34vw,380px)] w-[min(34vw,380px)] rounded-full sm:h-[min(28vw,320px)] sm:w-[min(28vw,320px)]">
          {/* Glow ring */}
          <div className="face-glow absolute inset-[-14px] rounded-full border border-blue-400/45 opacity-40 shadow-[0_0_40px_rgba(0,140,255,0.85),inset_0_0_20px_rgba(0,100,255,0.3)] transition-opacity" />
          {assetsReady ? (
            <img
              key={pagaFrame}
              src={framePath("paga", pagaFrame)}
              alt="Paga"
              className="h-full w-full rounded-full object-cover object-top"
              draggable={false}
            />
          ) : (
            /* Placeholder while frames aren't uploaded yet */
            <div className="flex h-full w-full items-center justify-center rounded-full border border-blue-500/30 bg-[#061830]">
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-blue-400/60">
                Paga
              </span>
            </div>
          )}
          {/* Blue tint overlay */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_30%,rgba(0,120,255,0.18),transparent_60%)]" />
        </div>
      </div>

      {/* Alexis — right */}
      <div className="alexis-face absolute right-[24%] top-[48%] z-20 translate-x-1/2 -translate-y-1/2 md:right-[24%]">
        <div className="relative h-[min(34vw,380px)] w-[min(34vw,380px)] rounded-full sm:h-[min(28vw,320px)] sm:w-[min(28vw,320px)]">
          <div className="face-glow absolute inset-[-14px] rounded-full border border-blue-400/45 opacity-40 shadow-[0_0_40px_rgba(0,140,255,0.85),inset_0_0_20px_rgba(0,100,255,0.3)] transition-opacity" />
          {assetsReady ? (
            <img
              key={alexisFrame}
              src={framePath("alexis", alexisFrame)}
              alt="Alexis"
              className="h-full w-full rounded-full object-cover object-top"
              draggable={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full border border-blue-500/30 bg-[#061830]">
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-blue-400/60">
                Alexis
              </span>
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(0,120,255,0.18),transparent_60%)]" />
        </div>
      </div>

      {/* Stage floor — perspective grid */}
      <div className="pointer-events-none absolute bottom-[-8%] left-[-10%] right-[-10%] h-[36%] opacity-75 [background:linear-gradient(180deg,rgba(0,140,255,0.5),transparent_14%),repeating-linear-gradient(90deg,rgba(0,170,255,0.16)_0_1px,transparent_1px_88px)] [transform:perspective(600px)_rotateX(62deg)]" />

      {/* Scroll hint */}
      <div className="scroll-hint-mirage absolute bottom-[9%] left-1/2 z-30 -translate-x-1/2 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-blue-200/65">
          Scroll to reveal
        </p>
      </div>
    </section>
  );
}
