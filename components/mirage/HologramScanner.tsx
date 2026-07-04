"use client";

export default function HologramScanner() {
  return (
    <div
      className="hologram-scanner pointer-events-none absolute inset-x-0 z-20"
      style={{
        top: 0,
        transform: "translateY(-200%)",
        opacity: 0,
      }}
    >
      {/* Scan line */}
      <div
        style={{
          height: "1.5px",
          background:
            "linear-gradient(to right, transparent 0%, rgba(0,140,255,0.4) 15%, rgba(97,212,255,0.95) 40%, rgba(247,251,255,1) 50%, rgba(97,212,255,0.95) 60%, rgba(0,140,255,0.4) 85%, transparent 100%)",
          boxShadow:
            "0 0 8px rgba(97,212,255,0.7), 0 0 18px rgba(0,140,255,0.5), 0 0 35px rgba(0,100,255,0.25)",
        }}
      />
      {/* Glow trail below line */}
      <div
        style={{
          height: "80px",
          background:
            "linear-gradient(to bottom, rgba(0,140,255,0.10), transparent)",
        }}
      />
    </div>
  );
}
