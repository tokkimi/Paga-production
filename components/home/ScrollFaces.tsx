"use client";

import { useScroll, useTransform, motion } from "framer-motion";

export default function ScrollFaces() {
  const { scrollYProgress } = useScroll();

  // Y: 8vh → 52vh over first 40% of page
  const topRaw = useTransform(scrollYProgress, [0, 0.4], [8, 52]);
  const top = useTransform(topRaw, (v) => `${v}vh`);

  // Paga (left): slides in from left edge, then turns right toward Alexis
  const xPaga = useTransform(
    scrollYProgress,
    [0, 0.38, 0.68, 1.0],
    [-160, -38, -38, -10],
  );
  const rotYPaga = useTransform(
    scrollYProgress,
    [0, 0.38, 0.68, 1.0],
    [-18, -13, -13, 40],
  );

  // Alexis (right): mirror
  const xAlexis = useTransform(
    scrollYProgress,
    [0, 0.38, 0.68, 1.0],
    [160, 38, 38, 10],
  );
  const rotYAlexis = useTransform(
    scrollYProgress,
    [0, 0.38, 0.68, 1.0],
    [18, 13, 13, -40],
  );

  const scale = useTransform(scrollYProgress, [0.68, 1.0], [1, 1.05]);

  const pagaGlow = useTransform(
    scrollYProgress,
    [0.68, 1.0],
    ["0px 0px 0px rgba(103,232,249,0)", "22px 0px 65px rgba(103,232,249,0.48)"],
  );
  const alexisGlow = useTransform(
    scrollYProgress,
    [0.68, 1.0],
    ["0px 0px 0px rgba(103,232,249,0)", "-22px 0px 65px rgba(103,232,249,0.48)"],
  );

  const beamOpacity = useTransform(scrollYProgress, [0.88, 1.0], [0, 0.72]);

  const cls =
    "pointer-events-none fixed z-30 hidden h-[276px] w-[184px] overflow-hidden rounded-[10px] border border-cyan-300/[0.14] lg:block";

  return (
    <>
      {/* Paga – gauche */}
      <motion.div
        className={`${cls} left-0`}
        style={{
          top,
          x: xPaga,
          rotateY: rotYPaga,
          scale,
          transformPerspective: 1000,
          boxShadow: pagaGlow,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/paga-face.jpg"
          alt="Paga"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080f]/75 via-transparent to-transparent" />
      </motion.div>

      {/* Alexis – droite */}
      <motion.div
        className={`${cls} right-0`}
        style={{
          top,
          x: xAlexis,
          rotateY: rotYAlexis,
          scale,
          transformPerspective: 1000,
          boxShadow: alexisGlow,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/alexis-face.jpg"
          alt="Alexis"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080f]/75 via-transparent to-transparent" />
      </motion.div>

      {/* Beam cyan – apparaît quand ils se font face */}
      <motion.div
        className="pointer-events-none fixed left-0 right-0 z-20 hidden h-px lg:block"
        style={{
          top: "calc(52vh + 138px)",
          background:
            "linear-gradient(90deg, transparent 0%, #67e8f9 22%, rgba(59,130,246,0.85) 50%, #67e8f9 78%, transparent 100%)",
          boxShadow: "0 0 8px rgba(103,232,249,0.6), 0 0 20px rgba(103,232,249,0.18)",
          opacity: beamOpacity,
        }}
      />
    </>
  );
}
