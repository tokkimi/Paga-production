"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Disc3, ExternalLink, MapPin, Music2, Play, Sparkles, Video } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import Hero from "@/components/home/Hero";
import DatesSection from "@/components/home/DatesSection";
import MusicSection from "@/components/home/MusicSection";
import VideoSection from "@/components/home/VideoSection";
import HowItWorks from "@/components/home/HowItWorks";
import Newsletter from "@/components/home/Newsletter";
import Contact from "@/components/home/Contact";

type PaneId = "paga" | "mirage" | "alexis";

type EventItem = {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string;
  venue: string;
  city: string;
  country: string;
  date: string;
  ticketUrl?: string | null;
  isB2B: boolean;
  isFeatured: boolean;
  artists?: { artist: { name: string; slug: string } }[];
};

type DbTrack = {
  id: string;
  title: string;
  artistName: string;
  soundcloudEmbedUrl?: string | null;
  spotifyEmbedUrl?: string | null;
  youtubeEmbedUrl?: string | null;
  externalUrl?: string | null;
  cover?: string | null;
  createdAt?: string | null;
  releasedAt?: string | null;
};

type DbVideo = {
  id: string;
  title: string;
  youtubeEmbedUrl: string;
  thumbnail?: string | null;
  createdAt?: string | null;
};

type ResearchTrack = {
  title: string;
  artist: string;
  date: string;
  year: string;
  source: string;
  external: string;
  spotify?: string;
  note?: string;
};

const panes: { id: PaneId; label: string }[] = [
  { id: "paga", label: "Paga" },
  { id: "mirage", label: "Mirage" },
  { id: "alexis", label: "Alexis" },
];

const mirageTracks: ResearchTrack[] = [
  {
    title: "Let's Go",
    artist: "Paga, Alexis Dante",
    date: "28 May 2026",
    year: "2026",
    source: "Spotify / Shazam",
    spotify: "https://open.spotify.com/embed/track/2V0lvj6SvvUEKSMoydK2sp?utm_source=generator",
    external: "https://open.spotify.com/track/2V0lvj6SvvUEKSMoydK2sp",
  },
  {
    title: "Movin To The Sun - Alexis Dante & PAGA Remix",
    artist: "HUGEL, Ultra Nate, Imael Angel",
    date: "June 2026",
    year: "2026",
    source: "YouTube PAGA PRODUCTION",
    external: "https://www.youtube.com/watch?v=yLuwf5FlG0U",
    note: "Official audio",
  },
  {
    title: "Let U Go",
    artist: "Alexis Dante, Paga",
    date: "10 Apr 2026",
    year: "2026",
    source: "Spotify / Apple Music",
    spotify: "https://open.spotify.com/embed/track/22vcJV5l9t7qRqHgQEW8RT?utm_source=generator",
    external: "https://open.spotify.com/track/22vcJV5l9t7qRqHgQEW8RT",
  },
];

const alexisTracks: ResearchTrack[] = [
  { title: "Let's Go", artist: "Paga, Alexis Dante", date: "28 May 2026", year: "2026", source: "Spotify / Shazam", spotify: "https://open.spotify.com/embed/track/2V0lvj6SvvUEKSMoydK2sp?utm_source=generator", external: "https://open.spotify.com/track/2V0lvj6SvvUEKSMoydK2sp" },
  { title: "Let U Go", artist: "Alexis Dante, Paga", date: "10 Apr 2026", year: "2026", source: "Spotify / Apple Music", spotify: "https://open.spotify.com/embed/track/22vcJV5l9t7qRqHgQEW8RT?utm_source=generator", external: "https://open.spotify.com/track/22vcJV5l9t7qRqHgQEW8RT" },
  { title: "Everybody - Radio Edit", artist: "Alexis Dante, J.M. Sicky, Nessryne, Ignition Wayne", date: "16 Jul 2012", year: "2012", source: "Deezer", external: "https://www.deezer.com/album/5762101" },
  { title: "Everybody - Club Edit", artist: "Alexis Dante, J.M. Sicky", date: "16 Jul 2012", year: "2012", source: "Deezer", external: "https://www.deezer.com/album/5762101" },
  { title: "Everybody - Nasti & Clarks Remix", artist: "Alexis Dante, J.M. Sicky", date: "16 Jul 2012", year: "2012", source: "Deezer / Shazam", external: "https://www.deezer.com/album/5762101" },
  { title: "Everybody - Adrien Toma Remix", artist: "Alexis Dante, J.M. Sicky", date: "16 Jul 2012", year: "2012", source: "Deezer / Shazam", external: "https://www.deezer.com/album/5762101" },
  { title: "Everybody - Damien N-drix Remix", artist: "Alexis Dante, J.M. Sicky", date: "16 Jul 2012", year: "2012", source: "Deezer / Shazam", external: "https://www.deezer.com/album/5762101" },
  { title: "Everybody - Alta MC & Zane LD Remix", artist: "Alexis Dante, J.M. Sicky", date: "16 Jul 2012", year: "2012", source: "Deezer / Shazam", external: "https://www.deezer.com/album/5762101" },
  { title: "Alive - Original Radio Edit", artist: "Alexis Dante, J.M. Sicky, Eva Menson", date: "27 Jun 2011", year: "2011", source: "Deezer / Shazam", external: "https://www.deezer.com/album/1156008" },
  { title: "Alive - Dante, Sicky Rework", artist: "Alexis Dante, J.M. Sicky, Eva Menson", date: "27 Jun 2011", year: "2011", source: "Deezer", external: "https://www.deezer.com/album/1156008" },
  { title: "Alive - Soundshakerz Club Extended", artist: "Alexis Dante, J.M. Sicky, Eva Menson", date: "27 Jun 2011", year: "2011", source: "Deezer", external: "https://www.deezer.com/album/1156008" },
  { title: "Alive - Club Mix", artist: "Alexis Dante, J.M. Sicky, Eva Menson", date: "27 Jun 2011", year: "2011", source: "Deezer", external: "https://www.deezer.com/album/1156008" },
  { title: "Alive - Tony Romera Remix", artist: "Alexis Dante, J.M. Sicky, Eva Menson", date: "27 Jun 2011", year: "2011", source: "Deezer", external: "https://www.deezer.com/album/1156008" },
  { title: "Eivissa - Deluna Remix", artist: "Amine Edge, Alexis Dante", date: "2011", year: "2011", source: "Deezer / Spotify", external: "https://open.spotify.com/intl-tr/track/3H1CHmv20ipbZ4NUhYolp7" },
  { title: "Get Up Dance - Radio Edit", artist: "Alexis Dante, J.M. Sicky, Eva Menson", date: "2010", year: "2010", source: "Spotify / Shazam", external: "https://open.spotify.com/track/1wHLmzEcce4dbiWYMIxQvi" },
  { title: "It's Alright - Radio Edit", artist: "Alexis Dante, J.M. Sicky, Eva Menson", date: "13 Feb 2009", year: "2009", source: "Apple Music / Shazam", external: "https://music.apple.com/us/song/its-alright-radio-edit/315461982" },
];

const videoClips = [
  { title: "HUGEL - Movin To The Sun (Alexis Dante & PAGA Remix)", embed: "https://www.youtube.com/embed/yLuwf5FlG0U" },
  { title: "Let U Go - Alexis Dante x Paga", embed: "https://www.youtube.com/embed/jLncFjdTgGw" },
];

function nextPane(current: PaneId, dir: 1 | -1) {
  const index = panes.findIndex((pane) => pane.id === current);
  return panes[(index + dir + panes.length) % panes.length].id;
}

function MiniDates({ events }: { events: EventItem[] }) {
  const locale = useLocale();
  const [activeDate, setActiveDate] = useState(0);
  const shown = events.length ? events.slice(0, 5) : [];
  if (!shown.length) return null;
  const event = shown[activeDate % shown.length];
  const date = new Date(event.date);

  return (
    <aside className="w-full max-w-[360px]">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-200">Next dates</p>
        <span className="text-[10px] font-bold text-white/38">{String(activeDate + 1).padStart(2, "0")} / {String(shown.length).padStart(2, "0")}</span>
      </div>
      <div className="grid grid-cols-[16px_minmax(0,1fr)_16px] items-center gap-4">
        <button type="button" onClick={() => setActiveDate((activeDate - 1 + shown.length) % shown.length)} className="scroll-dot" aria-label="Previous date" />
        <Link href={`/${locale}/dates/${event.slug}`} className="block min-h-[170px] border border-cyan-200/18 bg-black/20 p-5 backdrop-blur-xl transition hover:bg-white/[0.055]">
          <div className="flex items-start justify-between gap-3">
            <time className="text-[10px] font-black uppercase tracking-widest text-cyan-200">
              <span className="block text-5xl leading-none text-white">{date.toLocaleDateString("en", { day: "2-digit" })}</span>
              {date.toLocaleDateString("en", { month: "short" })}
            </time>
            <span className="border border-cyan-200/18 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-cyan-100">Details</span>
          </div>
          <strong className="mt-6 block text-lg leading-tight text-white">{event.title_fr || event.title_en}</strong>
          <small className="mt-3 flex items-center gap-2 text-xs text-white/52">
            <MapPin size={12} className="text-cyan-200" />
            {event.city} / {event.venue}
          </small>
        </Link>
        <button type="button" onClick={() => setActiveDate((activeDate + 1) % shown.length)} className="scroll-dot" aria-label="Next date" />
      </div>
    </aside>
  );
}

function ResearchList({ tracks }: { tracks: ResearchTrack[] }) {
  return (
    <div className="grid gap-3">
      {tracks.map((track) => (
        <article key={`${track.title}-${track.date}`} className="grid gap-3 border border-cyan-200/12 bg-white/[0.035] p-4 backdrop-blur-xl md:grid-cols-[110px_minmax(0,1fr)_auto] md:items-center">
          <div>
            <p className="text-2xl font-black text-cyan-100">{track.year}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/38">{track.date}</p>
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-black text-white">{track.title}</h3>
            <p className="mt-1 text-sm text-white/52">{track.artist}</p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/60">{track.source}{track.note ? ` - ${track.note}` : ""}</p>
          </div>
          <a href={track.external} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-cyan-100 transition hover:text-white">
            Open <ExternalLink size={13} />
          </a>
          {track.spotify && (
            <div className="md:col-span-3">
              <iframe src={track.spotify} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function MirageCenter({ events }: { events: EventItem[] }) {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-[760px] overflow-hidden">
        <img src="/images/mirage/mirage-hero-generated.png" alt="Paga and Alexis Dante Mirage banner" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,5,12,.22),rgba(2,5,12,.12)_45%,rgba(2,5,12,.62)),linear-gradient(180deg,rgba(2,5,12,.05),rgba(2,5,12,.82))]" />
        <div className="relative z-10 mx-auto grid min-h-[760px] max-w-7xl items-end gap-10 px-4 pb-16 pt-32 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.42em] text-cyan-200">Paga x Alexis Dante</p>
            <h1 className="text-[clamp(4rem,12vw,9rem)] font-black uppercase leading-[0.82] tracking-[-0.08em] text-white">Mirage</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/68">Le centre de l'experience : les sorties communes, les remixes, les dates B2B et l'identite visuelle Mirage avec le logo detoure en arriere-plan.</p>
          </div>
          <MiniDates events={events} />
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.36em] text-cyan-200">Common releases</p>
          <h2 className="section-title mb-8">Paga x Alexis Dante</h2>
          <ResearchList tracks={mirageTracks} />
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.36em] text-cyan-200">Videos</p>
          <h2 className="section-title mb-8">Mirage video layer</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {videoClips.map((clip) => (
              <article key={clip.title} className="border border-cyan-200/12 bg-white/[0.035]">
                <div className="aspect-video">
                  <iframe src={`${clip.embed}?rel=0`} width="100%" height="100%" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
                <h3 className="p-4 text-sm font-black text-white">{clip.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function AlexisPage({ events }: { events: EventItem[] }) {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-[720px] overflow-hidden">
        <img src="/images/mirage/alexis-remastered.png" alt="Alexis Dante remastered banner" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,5,12,.18),rgba(2,5,12,.08)_45%,rgba(2,5,12,.68)),linear-gradient(180deg,rgba(2,5,12,.02),rgba(2,5,12,.86))]" />
        <div className="relative z-10 mx-auto grid min-h-[720px] max-w-7xl items-end gap-10 px-4 pb-16 pt-32 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.42em] text-cyan-200">Producer universe</p>
            <h1 className="text-[clamp(3.2rem,9vw,7rem)] font-black uppercase leading-[0.88] tracking-[-0.06em] text-white">Alexis Dante</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/68">Discographie centralisee d'apres Spotify, Deezer, Shazam et Apple Music. Je n'affiche pas "Cheri Cheri" comme alias confirme : je n'ai pas trouve de source fiable reliant ce nom a Alexis Dante.</p>
          </div>
          <MiniDates events={events.filter((event) => event.isB2B || event.artists?.some((item) => item.artist.slug === "alexis-dante"))} />
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.36em] text-cyan-200">Full research list</p>
          <h2 className="section-title mb-4">Alexis Dante discography</h2>
          <p className="mb-8 max-w-3xl text-sm leading-relaxed text-white/52">Ordre chronologique du plus recent au plus ancien. Les remixes d'un meme EP sont gardes pour ne pas perdre les details du catalogue.</p>
          <ResearchList tracks={alexisTracks} />
        </div>
      </section>
    </div>
  );
}

function BottomSwitch({ active, go }: { active: PaneId; go: (pane: PaneId) => void }) {
  return (
    <nav className="fixed bottom-4 left-1/2 z-[80] w-[min(92vw,520px)] -translate-x-1/2 border border-cyan-200/18 bg-slate-950/62 p-2 shadow-[0_20px_80px_rgba(0,0,0,.52)] backdrop-blur-2xl">
      <div className="grid grid-cols-3 gap-1">
        {panes.map((pane) => (
          <button key={pane.id} onClick={() => go(pane.id)} className={`relative flex items-center justify-center gap-2 px-3 py-3 text-xs font-black uppercase tracking-[0.14em] transition ${active === pane.id ? "text-white" : "text-white/46 hover:bg-white/[0.045] hover:text-white/80"}`}>
            {pane.id === "paga" && <ChevronLeft size={15} />}
            {pane.id === "mirage" && <Sparkles size={15} />}
            {pane.id === "alexis" && <ChevronRight size={15} />}
            {pane.label}
            {active === pane.id && <motion.span layoutId="mirage-bottom-active" className="absolute inset-0 -z-10 border border-cyan-200/28 bg-cyan-200/[0.10] shadow-[0_0_28px_rgba(73,220,255,.24)]" />}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function MirageExperience({ events, tracks, videos }: { events: EventItem[]; tracks: DbTrack[]; videos: DbVideo[] }) {
  const [active, setActive] = useState<PaneId>("paga");
  const [direction, setDirection] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);

  const go = (pane: PaneId) => {
    const oldIndex = panes.findIndex((item) => item.id === active);
    const newIndex = panes.findIndex((item) => item.id === pane);
    setDirection(newIndex > oldIndex ? 1 : -1);
    setActive(pane);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const swipe = (clientX: number) => {
    if (dragStart === null) return;
    const diff = dragStart - clientX;
    if (Math.abs(diff) < 58) return;
    const pane = nextPane(active, diff > 0 ? 1 : -1);
    setDirection(diff > 0 ? 1 : -1);
    setActive(pane);
    setDragStart(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <main onTouchStart={(event) => setDragStart(event.touches[0]?.clientX ?? null)} onTouchEnd={(event) => swipe(event.changedTouches[0]?.clientX ?? 0)}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={active} custom={direction} initial={{ opacity: 0, x: direction * 70, filter: "blur(14px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: direction * -70, filter: "blur(14px)" }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
            {active === "paga" && (
              <>
                <Hero />
                <DatesSection events={events} />
                <MusicSection tracks={tracks} />
                <VideoSection videos={videos} />
                <HowItWorks />
                <Newsletter />
                <Contact />
              </>
            )}
            {active === "mirage" && <MirageCenter events={events} />}
            {active === "alexis" && <AlexisPage events={events} />}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomSwitch active={active} go={go} />
    </>
  );
}
