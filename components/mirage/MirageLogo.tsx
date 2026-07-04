"use client";

export default function MirageLogo() {
  return (
    <div className="mirage-logo pointer-events-none select-none text-center">
      <h1
        style={{
          fontSize: "clamp(4rem, 16vw, 13rem)",
          fontWeight: 300,
          letterSpacing: "0.22em",
          color: "#F7FBFF",
          textShadow:
            "0 0 40px rgba(0,140,255,0.9), 0 0 80px rgba(0,100,255,0.45), 0 0 140px rgba(0,80,200,0.2)",
          lineHeight: 1,
        }}
      >
        MIRAGE
      </h1>
    </div>
  );
}
