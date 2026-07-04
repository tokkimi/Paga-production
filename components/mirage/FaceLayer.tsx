"use client";

import { useState } from "react";

interface FaceLayerProps {
  person: "paga" | "alexis";
  side: "left" | "right";
  imgSrc: string;
}

export default function FaceLayer({ person, side, imgSrc }: FaceLayerProps) {
  const [imgError, setImgError] = useState(false);

  const isLeft = side === "left";

  const maskImage = isLeft
    ? "linear-gradient(to right, rgba(2,6,17,0.9) 0%, transparent 18%, black 45%, black 78%, transparent 100%), linear-gradient(to bottom, black 55%, transparent 100%)"
    : "linear-gradient(to left, rgba(2,6,17,0.9) 0%, transparent 18%, black 45%, black 78%, transparent 100%), linear-gradient(to bottom, black 55%, transparent 100%)";

  return (
    <div
      className={`face-layer face-${person} absolute top-0 bottom-0 z-10 overflow-hidden`}
      style={{
        width: "48%",
        left: isLeft ? 0 : "auto",
        right: isLeft ? "auto" : 0,
        opacity: 0,
      }}
    >
      {/* Atmospheric glow behind face */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLeft
            ? "radial-gradient(ellipse 70% 70% at 75% 45%, rgba(0,140,255,0.10), transparent 70%)"
            : "radial-gradient(ellipse 70% 70% at 25% 45%, rgba(0,140,255,0.10), transparent 70%)",
        }}
      />

      {/* Face portrait */}
      {imgError ? (
        <div
          className="absolute inset-0 flex items-end justify-center pb-12"
          style={{ opacity: 0.3 }}
        >
          <span
            style={{
              fontSize: "clamp(0.6rem, 1.5vw, 1rem)",
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: "#61D4FF",
              textTransform: "uppercase",
            }}
          >
            {person}
          </span>
        </div>
      ) : (
        <img
          src={imgSrc}
          alt={person === "paga" ? "Paga" : "Alexis"}
          onError={() => setImgError(true)}
          draggable={false}
          className="absolute bottom-0 w-full"
          style={{
            height: "92%",
            objectFit: "cover",
            objectPosition: isLeft ? "right top" : "left top",
            maskImage,
            WebkitMaskImage: maskImage,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        />
      )}

      {/* Inner edge shadow so face blends into center dark zone */}
      <div
        className="absolute inset-y-0 pointer-events-none"
        style={{
          width: "35%",
          left: isLeft ? "auto" : 0,
          right: isLeft ? 0 : "auto",
          background: isLeft
            ? "linear-gradient(to left, rgba(2,6,17,0.6), transparent)"
            : "linear-gradient(to right, rgba(2,6,17,0.6), transparent)",
        }}
      />
    </div>
  );
}
