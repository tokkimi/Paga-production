"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Disc3, ExternalLink, Music2, Play, Sparkles, Video } from "lucide-react";
import { useMemo, useState } from "react";

type PaneId = "paga" | "mirage" | "alexis";

type Track = {
  title: string;
  artist: string;
  date: string;
  year: string;
  spotify?: string;
  external: string;
  cover?: string;
  note?: string;
};

type Clip = {
  title: string;
  date: string;
  embed: string;
};

const panes: { id: PaneId; label: string; eyebrow: string }[] = [
  { id: "paga", label: "Paga", eyebrow: "Solo energy" },
  { id: "mirage", label: "Mirage", eyebrow: "B2B center" },
  { id: "alexis", label: "Alexis", eyebrow: "Dante side" },
];

const tracks: Record<PaneId, Track[]> = {
  mirage: [
    {
      title: "Let's Go",
      artist: "Paga, Alexis Dante",
      date: "28 May 2026",
      year: "2026",
      spotify: "https://open.spotify.com/embed/track/2V0lvj6SvvUEKSMoydK2sp?utm_source=generator",
      external: "https://open.spotify.com/track/2V0lvj6SvvUEKSMoydK2sp",
      cover: "https://i.scdn.co/image/ab67616d0000b273c6b92c13775056fb443d2cf4",
      note: "Joint single",
    },
    {
      title: "Movin To The Sun - Alexis Dante & PAGA Remix",
      artist: "HUGEL, Ultra Nate, Imael Angel",
      date: "June 2026",
      year: "2026",
      external: "https://www.youtube.com/watch?v=yLuwf5FlG0U",
      note: "Official audio",
    },
    {
      title: "Let U Go",
      artist: "Alexis Dante, Paga",
      date: "10 Apr 2026",
      year: "2026",
      spotify: "https://open.spotify.com/embed/track/22vcJV5l9t7qRqHgQEW8RT?utm_source=generator",
      external: "https://open.spotify.com/track/22vcJV5l9t7qRqHgQEW8RT",
      cover: "https://i.scdn.co/image/ab67616d0000b273a51dc128e04b80f02c1412ff",
      note: "Joint single",
    },
  ],
  paga: [
    {
      title: "Let's Go",
      artist: "Paga, Alexis Dante",
      date: "28 May 2026",
      year: "2026",
      spotify: "https://open.spotify.com/embed/track/2V0lvj6SvvUEKSMoydK2sp?utm_source=generator",
      external: "https://open.spotify.com/track/2V0lvj6SvvUEKSMoydK2sp",
      cover: "https://i.scdn.co/image/ab67616d0000b273c6b92c13775056fb443d2cf4",
    },
    {
      title: "Un soir d'ete",
      artist: "Paga, Anton Wick",
      date: "2026",
      year: "2026",
      external: "https://open.spotify.com/track/3szQTrDsphGZUxisEn7jcw",
    },
    {
      title: "Amour Amor",
      artist: "Paga, Anton Wick",
      date: "2026",
      year: "2026",
      external: "https://open.spotify.com/track/07gdaIftYSFwwOPkg5K8IK",
    },
    {
      title: "Echoes - Extended Version",
      artist: "Paga",
      date: "May 2026",
      year: "2026",
      spotify: "https://open.spotify.com/embed/track/1xt7v8NDn8eV8F5dsKNumQ?utm_source=generator",
      external: "https://open.spotify.com/track/1xt7v8NDn8eV8F5dsKNumQ",
      cover: "https://i.scdn.co/image/ab67616d0000b2733f95db20a1f362e0b85b3d22",
    },
    {
      title: "Let U Go",
      artist: "Alexis Dante, Paga",
      date: "10 Apr 2026",
      year: "2026",
      spotify: "https://open.spotify.com/embed/track/22vcJV5l9t7qRqHgQEW8RT?utm_source=generator",
      external: "https://open.spotify.com/track/22vcJV5l9t7qRqHgQEW8RT",
      cover: "https://i.scdn.co/image/ab67616d0000b273a51dc128e04b80f02c1412ff",
    },
    {
      title: "Superstition",
      artist: "Paga, Anton Wick",
      date: "Feb 2026",
      year: "2026",
      spotify: "https://open.spotify.com/embed/track/7yu9Brx3IMGHR7IyE1yPKE?utm_source=generator",
      external: "https://open.spotify.com/track/7yu9Brx3IMGHR7IyE1yPKE",
      cover: "https://i.scdn.co/image/ab67616d0000b273b9e412900a6ba835786ec6f1",
    },
    {
      title: "Main dans la main",
      artist: "Paga, Anton Wick",
      date: "Feb 2026",
      year: "2026",
      spotify: "https://open.spotify.com/embed/track/57QkSOnTLRHh3UdRs0bHoD?utm_source=generator",
      external: "https://open.spotify.com/track/57QkSOnTLRHh3UdRs0bHoD",
      cover: "https://i.scdn.co/image/ab67616d0000b273b9e412900a6ba835786ec6f1",
    },
    {
      title: "Mi Amore",
      artist: "Paga, Anton Wick, Maelyss",
      date: "2025",
      year: "2025",
      external: "https://open.spotify.com/track/2jTBVsughylVfz0yMwEScD",
    },
    {
      title: "SUZY",
      artist: "Laurent Wolf, Paga, Anton Wick, Mod Martin",
      date: "2025",
      year: "2025",
      external: "https://open.spotify.com/track/3GGiHFTIwJawWjBv0BkvYx",
    },
    {
      title: "Better Days",
      artist: "Jimmy Sax, Paga",
      date: "Jan 2026",
      year: "2026",
      spotify: "https://open.spotify.com/embed/track/57STvUXxPuKlOsL1BCzD1D?utm_source=generator",
      external: "https://open.spotify.com/track/57STvUXxPuKlOsL1BCzD1D",
      cover: "https://i.scdn.co/image/ab67616d0000b2730280e4f5a668f5fffb3119ca",
    },
  ],
  alexis: [
    {
      title: "Let's Go",
      artist: "Paga, Alexis Dante",
      date: "28 May 2026",
      year: "2026",
      spotify: "https://open.spotify.com/embed/track/2V0lvj6SvvUEKSMoydK2sp?utm_source=generator",
      external: "https://open.spotify.com/track/2V0lvj6SvvUEKSMoydK2sp",
      cover: "https://i.scdn.co/image/ab67616d0000b273c6b92c13775056fb443d2cf4",
    },
    {
      title: "Let U Go",
      artist: "Alexis Dante, Paga",
      date: "10 Apr 2026",
      year: "2026",
      spotify: "https://open.spotify.com/embed/track/22vcJV5l9t7qRqHgQEW8RT?utm_source=generator",
      external: "https://open.spotify.com/track/22vcJV5l9t7qRqHgQEW8RT",
      cover: "https://i.scdn.co/image/ab67616d0000b273a51dc128e04b80f02c1412ff",
    },
    {
      title: "Everybody",
      artist: "Alexis Dante",
      date: "16 Jul 2012",
      year: "2012",
      external: "https://www.deezer.com/album/5762101",
      note: "EP - Njoy Records",
    },
    {
      title: "Alive",
      artist: "Alexis Dante",
      date: "27 Jun 2011",
      year: "2011",
      external: "https://www.deezer.com/album/1156008",
      note: "EP",
    },
    {
      title: "Eivissa - Deluna Remix",
      artist: "Amine Edge, Alexis Dante",
      date: "2011",
      year: "2011",
      external: "https://www.deezer.com/track/119549586",
    },
    {
      title: "Get Up Dance",
      artist: "Alexis Dante, J M Sicky, Eva Menson",
      date: "2010",
      year: "2010",
      external: "https://open.spotify.com/track/1wHLmzEcce4dbiWYMIxQvi",
      note: "Older catalog",
    },
    {
      title: "It's Alright",
      artist: "Alexis Dante",
      date: "2009",
      year: "2009",
      external: "https://open.spotify.com/album/7cotp1CZooWmpKnllLUkrK",
      note: "Older catalog",
    },
  ],
};

const clips: Record<PaneId, Clip[]> = {
  mirage: [
    { title: "HUGEL - Movin To The Sun (Alexis Dante & PAGA Remix)", date: "June 2026", embed: "https://www.youtube.com/embed/yLuwf5FlG0U" },
    { title: "Paga x Alexis Dante - B2B Ibiza energy", date: "Mirage live direction", embed: "https://www.youtube.com/embed/yLuwf5FlG0U" },
  ],
  paga: [
    { title: "Jimmy Sax x Paga - Better Days", date: "2026", embed: "https://www.youtube.com/embed/NHc6FDWpNCk" },
    { title: "Paga x Wick - Evazion", date: "2025", embed: "https://www.youtube.com/embed/ChjDnJHrFCY" },
    { title: "Paga - Echoes", date: "2026", embed: "https://www.youtube.com/embed/On_SsuUXCHU" },
  ],
  alexis: [
    { title: "Alexis Dante & Paga - Let U Go", date: "2026", embed: "https://www.youtube.com/embed/yLuwf5FlG0U" },
    { title: "Alexis Dante - legacy catalog", date: "2011-2012", embed: "https://www.youtube.com/embed/yLuwf5FlG0U" },
  ],
};

const paneCopy = {
  mirage: {
    title: "MIRAGE",
    subtitle: "Paga x Alexis Dante",
    image: "/images/mirage/mirage-duo-banner.jpg",
    poster: "/images/mirage/mirage-action-banner.jpg",
    intro:
      "Le point central : un duo B2B nocturne, plus premium, plus international, construit autour de leurs sorties communes, remixes et dates partagees.",
    bullets: ["B2B festival", "Tech house", "France x Europe", "Club pressure"],
  },
  paga: {
    title: "PAGA",
    subtitle: "South of France energy",
    image: "/images/mirage/mirage-duo-portrait-dark.jpg",
    poster: "/images/paga-hero-monument.png",
    intro:
      "La page solo Paga concentre son univers : sorties recentes, titres avec Anton Wick, videos, dates et ADN festival venu du Sud.",
    bullets: ["DJ", "TV personality", "Festival dates", "Paga Production"],
  },
  alexis: {
    title: "ALEXIS DANTE",
    subtitle: "From club legacy to Mirage",
    image: "/images/mirage/mirage-handshake-dark.jpg",
    poster: "/images/mirage/duo-handshake.jpeg",
    intro:
      "Alexis Dante garde son cote producteur : sorties 2026 avec Paga, ancien catalogue club, EPs Alive / Everybody et passerelle vers le projet Mirage.",
    bullets: ["Producer", "B2B partner", "Older catalog", "Alexis Iacono"],
  },
} satisfies Record<PaneId, { title: string; subtitle: string; image: string; poster: string; intro: string; bullets: string[] }>;

function nextPane(current: PaneId, dir: 1 | -1) {
  const index = panes.findIndex((pane) => pane.id === current);
  return panes[(index + dir + panes.length) % panes.length].id;
}

function TrackCard({ track }: { track: Track }) {
  return (
    <article className="min-w-[82vw] snap-start rounded-[18px] border border-cyan-200/15 bg-white/[0.055] p-3 backdrop-blur-2xl sm:min-w-[360px]">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-cyan-200/15 bg-cyan-300/10">
          {track.cover ? <img src={track.cover} alt="" className="h-full w-full object-cover" /> : <Disc3 className="text-cyan-200" size={23} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-cyan-300/10 px-2 py-0.5 text-[10px] font-black text-cyan-200">{track.year}</span>
            {track.note && <span className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-white/34">{track.note}</span>}
          </div>
          <h3 className="mt-1 truncate text-sm font-black text-white">{track.title}</h3>
          <p className="truncate text-xs text-white/48">{track.artist}</p>
        </div>
        <a href={track.external} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-white/50 transition hover:text-cyan-200">
          <ExternalLink size={14} />
        </a>
      </div>
      {track.spotify ? (
        <iframe
          src={track.spotify}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-xl"
        />
      ) : (
        <a href={track.external} target="_blank" rel="noreferrer" className="flex h-[152px] items-center justify-center rounded-xl border border-cyan-200/10 bg-black/20 text-xs font-black uppercase tracking-[0.18em] text-cyan-100/70">
          Open release
        </a>
      )}
      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white/35">{track.date}</p>
    </article>
  );
}

function ClipCard({ clip }: { clip: Clip }) {
  return (
    <article className="min-w-[84vw] snap-start overflow-hidden rounded-[18px] border border-cyan-200/15 bg-white/[0.055] backdrop-blur-2xl sm:min-w-[390px]">
      <div className="aspect-video">
        <iframe
          src={`${clip.embed}?rel=0`}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="p-4">
        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200/70">{clip.date}</p>
        <h3 className="line-clamp-2 text-sm font-black text-white">{clip.title}</h3>
      </div>
    </article>
  );
}

export default function MirageExperience() {
  const [active, setActive] = useState<PaneId>("mirage");
  const [direction, setDirection] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const copy = paneCopy[active];

  const orderedTracks = useMemo(() => tracks[active], [active]);

  const go = (pane: PaneId) => {
    const oldIndex = panes.findIndex((item) => item.id === active);
    const newIndex = panes.findIndex((item) => item.id === pane);
    setDirection(newIndex > oldIndex ? 1 : -1);
    setActive(pane);
  };

  const swipe = (clientX: number) => {
    if (dragStart === null) return;
    const diff = dragStart - clientX;
    if (Math.abs(diff) < 58) return;
    const pane = nextPane(active, diff > 0 ? 1 : -1);
    setDirection(diff > 0 ? 1 : -1);
    setActive(pane);
    setDragStart(null);
  };

  return (
    <>
      <section
        className="mirage-shell relative min-h-screen overflow-hidden pt-24"
        onTouchStart={(event) => setDragStart(event.touches[0]?.clientX ?? null)}
        onTouchEnd={(event) => swipe(event.changedTouches[0]?.clientX ?? 0)}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(82,220,255,.16),transparent_34%),linear-gradient(180deg,rgba(3,7,17,.22),#05080f_88%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(5,8,15,.82),transparent)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 sm:px-6">
          <div className="mb-5 flex items-center justify-between">
            <button onClick={() => go(nextPane(active, -1))} className="scroll-dot" aria-label="Previous universe" />
            <div className="rounded-full border border-cyan-200/15 bg-white/[0.04] px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/70 backdrop-blur-xl">
              Swipe the mirage
            </div>
            <button onClick={() => go(nextPane(active, 1))} className="scroll-dot" aria-label="Next universe" />
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
            key={active}
            custom={direction}
            initial={{ opacity: 0, x: direction * 90, rotateY: direction * -18, filter: "blur(18px)", scale: 0.98 }}
            animate={{ opacity: 1, x: 0, rotateY: 0, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, x: direction * -90, rotateY: direction * 18, filter: "blur(18px)", scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mirage-pane overflow-hidden rounded-[28px] border border-cyan-200/14 bg-white/[0.035] shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-2xl"
          >
            <div className="relative min-h-[610px] overflow-hidden">
              <img src={copy.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,16,.96),rgba(3,7,16,.66)_42%,rgba(3,7,16,.18)),linear-gradient(0deg,rgba(3,7,16,.95),transparent_56%)]" />
              <div className="absolute right-[-8%] top-[12%] hidden text-[clamp(5rem,14vw,12rem)] font-black uppercase leading-none tracking-[.08em] text-white/[0.035] lg:block">
                {active === "mirage" ? "MIRAGE" : copy.title}
              </div>

              <div className="relative grid min-h-[610px] items-end gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-12">
                <div className="max-w-3xl pb-4">
                  <p className="mb-4 text-[11px] font-black uppercase tracking-[0.42em] text-cyan-200">{copy.subtitle}</p>
                  <h1 className="text-[clamp(3.6rem,12vw,8.8rem)] font-black uppercase leading-[0.82] tracking-[-0.08em] text-white">
                    {copy.title}
                  </h1>
                  <p className="mt-6 max-w-xl text-base leading-relaxed text-white/68">{copy.intro}</p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {copy.bullets.map((bullet) => (
                      <span key={bullet} className="rounded-full border border-cyan-200/14 bg-cyan-200/[0.055] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/75">
                        {bullet}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[22px] border border-cyan-200/16 bg-black/24 p-4 backdrop-blur-2xl">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/12 text-cyan-200">
                      {active === "mirage" ? <Sparkles size={20} /> : active === "paga" ? <Music2 size={20} /> : <Disc3 size={20} />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200/70">{panes.find((pane) => pane.id === active)?.eyebrow}</p>
                      <p className="text-sm font-black text-white">{orderedTracks.length} releases shown</p>
                    </div>
                  </div>
                  <img src={copy.poster} alt="" className="h-44 w-full rounded-2xl object-cover opacity-85" />
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-2xl bg-white/[0.055] p-3">
                      <Music2 className="mx-auto mb-2 text-cyan-200" size={16} />
                      <p className="text-[10px] font-bold text-white/50">Tracks</p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.055] p-3">
                      <Video className="mx-auto mb-2 text-cyan-200" size={16} />
                      <p className="text-[10px] font-bold text-white/50">Videos</p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.055] p-3">
                      <CalendarDays className="mx-auto mb-2 text-cyan-200" size={16} />
                      <p className="text-[10px] font-bold text-white/50">Dates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-14 px-4 py-10 sm:px-8 lg:px-12">
              {active === "alexis" && (
                <div className="rounded-[22px] border border-cyan-200/14 bg-cyan-200/[0.045] p-5 backdrop-blur-xl">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">Research note</p>
                  <p className="max-w-3xl text-sm leading-relaxed text-white/60">
                    Les plateformes publiques rattachent Alexis Dante a Alexis Iacono sur certaines credits Deezer. Je n'ai pas trouve de source fiable confirmant publiquement l'ancien nom "Cheri Cheri", donc je ne l'affiche pas comme fait acquis.
                  </p>
                </div>
              )}

              <div>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-cyan-200/75">Chronological</p>
                    <h2 className="text-2xl font-black uppercase tracking-[0.06em] text-white">Latest sounds</h2>
                  </div>
                  <ChevronRight className="hidden text-cyan-200/50 sm:block" />
                </div>
                <div className="carousel-scroll -mx-4 flex snap-x gap-4 px-4 pb-2 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
                  {orderedTracks.map((track) => (
                    <TrackCard key={`${active}-${track.title}-${track.date}`} track={track} />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-cyan-200/75">Video layer</p>
                    <h2 className="text-2xl font-black uppercase tracking-[0.06em] text-white">Latest videos</h2>
                  </div>
                  <Play className="hidden text-cyan-200/50 sm:block" />
                </div>
                <div className="carousel-scroll -mx-4 flex snap-x gap-4 px-4 pb-2 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
                  {clips[active].map((clip) => (
                    <ClipCard key={`${active}-${clip.title}`} clip={clip} />
                  ))}
                </div>
              </div>
            </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <nav className="fixed bottom-4 left-1/2 z-[70] w-[min(92vw,520px)] -translate-x-1/2 rounded-[24px] border border-cyan-200/18 bg-slate-950/54 p-2 shadow-[0_20px_80px_rgba(0,0,0,.5)] backdrop-blur-2xl">
        <div className="grid grid-cols-3 gap-1">
          {panes.map((pane) => (
            <button
              key={pane.id}
              onClick={() => go(pane.id)}
              className={`relative flex items-center justify-center gap-2 rounded-[18px] px-3 py-3 text-xs font-black uppercase tracking-[0.14em] transition ${
                active === pane.id ? "text-white" : "text-white/46 hover:bg-white/[0.045] hover:text-white/80"
              }`}
            >
              {pane.id === "paga" && <ChevronLeft size={15} />}
              {pane.id === "mirage" && <Sparkles size={15} />}
              {pane.id === "alexis" && <ChevronRight size={15} />}
              {pane.label}
              {active === pane.id && <motion.span layoutId="mirage-bottom-active" className="absolute inset-0 -z-10 rounded-[18px] border border-cyan-200/28 bg-cyan-200/[0.10] shadow-[0_0_28px_rgba(73,220,255,.24)]" />}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
