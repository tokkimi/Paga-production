"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, MapPin, Play, Sparkles } from "lucide-react";
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

type PaneId = "paga" | "sherrie" | "alexis";

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
  { id: "sherrie", label: "Sherrie" },
  { id: "alexis", label: "Alexis" },
];

const sherrieValues = [
  { label: "Liberte", copy: "des sets ouverts, solaires et sans frontieres" },
  { label: "Emotion", copy: "un lien simple entre public, voyage et energie" },
  { label: "Creation", copy: "Paga et Alexis Dante en mode duo, DJ et producteurs" },
  { label: "Voyage", copy: "France, Europe, Mediterranee et ambitions Asie" },
];

const sherrieTracks: ResearchTrack[] = [
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

function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="mb-8">
      <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#d15d8f]">{eyebrow}</p>
      <h2 className="mt-3 text-[clamp(2rem,5vw,4.6rem)] font-black uppercase leading-[0.9] tracking-[0.08em] text-[#191724]">{title}</h2>
      {copy && <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5f6074]">{copy}</p>}
    </div>
  );
}

function MiniDates({ events }: { events: EventItem[] }) {
  const locale = useLocale();
  const [activeDate, setActiveDate] = useState(0);
  const shown = events.length ? events.slice(0, 5) : [];
  if (!shown.length) return null;
  const event = shown[activeDate % shown.length];
  const date = new Date(event.date);

  return (
    <aside className="w-full max-w-[320px]">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#d15d8f]">Next dates</p>
        <span className="text-[10px] font-bold text-[#191724]/35">{String(activeDate + 1).padStart(2, "0")} / {String(shown.length).padStart(2, "0")}</span>
      </div>
      <div className="grid grid-cols-[14px_minmax(0,1fr)_14px] items-center gap-3">
        <button type="button" onClick={() => setActiveDate((activeDate - 1 + shown.length) % shown.length)} className="sherrie-scroll-dot" aria-label="Previous date" />
        <Link href={`/${locale}/dates/${event.slug}`} className="block min-h-[168px] rounded-[28px] border border-white/80 bg-white/45 p-4 text-[#191724] shadow-[0_18px_60px_rgba(213,93,143,.16)] backdrop-blur-xl transition hover:bg-white/70">
          <div className="flex items-start justify-between gap-3">
            <time className="text-[10px] font-black uppercase tracking-widest text-[#d15d8f]">
              <span className="block text-5xl leading-none text-[#191724]">{date.toLocaleDateString("en", { day: "2-digit" })}</span>
              {date.toLocaleDateString("en", { month: "short" })}
            </time>
            <span className="rounded-full border border-[#e8a36c]/35 bg-white/40 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#b85f4c]">Details</span>
          </div>
          <strong className="mt-6 block text-lg leading-tight">{event.title_fr || event.title_en}</strong>
          <small className="mt-3 flex items-center gap-2 text-xs text-[#5f6074]">
            <MapPin size={12} className="text-[#d15d8f]" />
            {event.city} / {event.venue}
          </small>
        </Link>
        <button type="button" onClick={() => setActiveDate((activeDate + 1) % shown.length)} className="sherrie-scroll-dot" aria-label="Next date" />
      </div>
    </aside>
  );
}

function ReleaseRail({ tracks }: { tracks: ResearchTrack[] }) {
  return (
    <div className="carousel-scroll -mx-4 flex gap-4 px-4 pb-2">
      {tracks.map((track) => (
        <article key={`${track.title}-${track.date}`} className="carousel-item w-[min(82vw,380px)] shrink-0 rounded-[30px] border border-white/75 bg-white/46 p-4 text-[#191724] shadow-[0_20px_70px_rgba(215,93,143,.13)] backdrop-blur-xl">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#d15d8f]">{track.year}</p>
              <h3 className="mt-2 text-xl font-black leading-tight">{track.title}</h3>
              <p className="mt-2 text-sm text-[#686777]">{track.artist}</p>
            </div>
            <a href={track.external} target="_blank" rel="noreferrer" className="rounded-full border border-[#e8a36c]/40 bg-white/40 p-2 text-[#b85f4c] transition hover:bg-white">
              <ExternalLink size={15} />
            </a>
          </div>
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-[#4aa6b5]">{track.source}{track.note ? ` - ${track.note}` : ""}</p>
          {track.spotify ? (
            <iframe src={track.spotify} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="rounded-[18px]" />
          ) : (
            <a href={track.external} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d15d8f]/30 bg-[#191724] px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-white">
              <Play size={14} /> Listen
            </a>
          )}
        </article>
      ))}
    </div>
  );
}

function VideoGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {videoClips.map((clip) => (
        <article key={clip.title} className="overflow-hidden rounded-[30px] border border-white/75 bg-white/48 shadow-[0_20px_70px_rgba(215,93,143,.12)] backdrop-blur-xl">
          <div className="aspect-video">
            <iframe src={`${clip.embed}?rel=0`} width="100%" height="100%" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
          <h3 className="p-5 text-sm font-black text-[#191724]">{clip.title}</h3>
        </article>
      ))}
    </div>
  );
}

function SherrieHome({ events }: { events: EventItem[] }) {
  const sherrieEvents = events.filter((event) => event.isB2B || event.artists?.some((item) => item.artist.slug === "alexis-dante"));
  const featuredEvents = sherrieEvents.length ? sherrieEvents : events;

  return (
    <div className="sherrie-theme min-h-screen overflow-hidden bg-[#fbf4ed] text-[#191724]">
      <section className="relative min-h-[820px] overflow-hidden">
        <img src="/images/sherrie/duo-booth.png" alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_42%] opacity-72" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,244,237,.94),rgba(251,244,237,.68)_42%,rgba(251,244,237,.18)),linear-gradient(180deg,rgba(248,196,153,.22),rgba(251,244,237,.98))]" />
        <div className="absolute left-[-12vw] top-[-14vw] h-[42vw] w-[42vw] rounded-full bg-[#e25d9c]/22 blur-3xl" />
        <div className="absolute right-[-10vw] top-[22vh] h-[36vw] w-[36vw] rounded-full bg-[#f1b84b]/24 blur-3xl" />
        <div className="absolute bottom-[-10vw] left-[32vw] h-[34vw] w-[34vw] rounded-full bg-[#70c5d3]/22 blur-3xl" />

        <div className="relative z-10 mx-auto grid min-h-[760px] max-w-7xl items-center gap-10 px-4 pb-36 pt-28 sm:px-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: "easeOut" }}>
            <div className="mb-8 inline-flex rounded-full border border-white/70 bg-white/35 px-4 py-2 text-[11px] font-black uppercase tracking-[0.26em] text-[#b85f4c] shadow-[0_16px_50px_rgba(211,93,143,.13)] backdrop-blur-xl">
              Music is our freedom
            </div>
            <img src="/sherrie-sherrie.png" alt="Sherrie Sherrie" className="w-[min(84vw,520px)] drop-shadow-[0_18px_45px_rgba(213,93,143,.22)]" />
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#5f6074]">
              Sherrie Sherrie, c'est la nouvelle signature solaire de Paga et Alexis Dante : house, indie house et melodic house entre emotion, voyage et energie de festival.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}>
            <MiniDates events={featuredEvents} />
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Brand universe" title="less is more. feel more." copy="Une direction artistique claire, chaude et premium : coucher de soleil, mer, scene, typographies espacees et logo signature." />
          <div className="grid gap-4 md:grid-cols-4">
            {sherrieValues.map((value) => (
              <article key={value.label} className="rounded-[28px] border border-white/75 bg-white/42 p-6 shadow-[0_18px_55px_rgba(215,93,143,.10)] backdrop-blur-xl">
                <Sparkles className="mb-5 text-[#e28a5d]" size={20} />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#191724]">{value.label}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#686777]">{value.copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-[1.15fr_.85fr_1fr]">
            {[
              "/images/sherrie/duo-yellow.png",
              "/images/sherrie/paga-crowd.png",
              "/images/sherrie/paga-blue.png",
            ].map((src, index) => (
              <figure key={src} className={`overflow-hidden border border-white/75 bg-white/45 shadow-[0_20px_70px_rgba(215,93,143,.12)] backdrop-blur-xl ${index === 1 ? "aspect-[4/5]" : "aspect-[5/4] md:mt-10"}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Common sounds" title="Paga x Alexis Dante" copy="Les sons communs et remixes sont gardes lisibles, avec lecture integree quand l'embed existe." />
          <ReleaseRail tracks={sherrieTracks} />
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Videos" title="latest visuals" />
          <VideoGrid />
        </div>
      </section>

      <section className="sherrie-dark-block">
        <HowItWorks />
        <Newsletter />
        <Contact />
      </section>
    </div>
  );
}

function AlexisPage({ events }: { events: EventItem[] }) {
  return (
    <div className="min-h-screen bg-[#090a10] text-white">
      <section className="relative min-h-[720px] overflow-hidden">
        <img src="/images/mirage/alexis-remastered.png" alt="Alexis Dante remastered banner" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,5,12,.18),rgba(2,5,12,.08)_45%,rgba(2,5,12,.68)),linear-gradient(180deg,rgba(2,5,12,.02),rgba(2,5,12,.86))]" />
        <div className="relative z-10 mx-auto grid min-h-[720px] max-w-7xl items-end gap-10 px-4 pb-28 pt-32 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.42em] text-[#f4a85d]">Producer universe</p>
            <h1 className="text-[clamp(3.2rem,9vw,7rem)] font-black uppercase leading-[0.88] tracking-[-0.06em] text-white">Alexis Dante</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/68">Discographie centralisee d'apres Spotify, Deezer, Shazam et Apple Music. Les sons communs avec Paga restent dans l'univers Sherrie Sherrie.</p>
          </div>
          <MiniDates events={events.filter((event) => event.isB2B || event.artists?.some((item) => item.artist.slug === "alexis-dante"))} />
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.36em] text-[#f4a85d]">Full research list</p>
          <h2 className="section-title mb-4">Alexis Dante discography</h2>
          <p className="mb-8 max-w-3xl text-sm leading-relaxed text-white/52">Ordre chronologique du plus recent au plus ancien. Les remixes d'un meme EP sont gardes pour ne pas perdre les details du catalogue.</p>
          <div className="grid gap-4">
            {alexisTracks.map((track) => (
              <article key={`${track.title}-${track.date}`} className="grid gap-4 border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl md:grid-cols-[110px_minmax(0,1fr)_auto] md:items-center">
                <div>
                  <p className="text-2xl font-black text-[#f4a85d]">{track.year}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/38">{track.date}</p>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-black text-white">{track.title}</h3>
                  <p className="mt-1 text-sm text-white/52">{track.artist}</p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/36">{track.source}</p>
                </div>
                <a href={track.external} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#f4a85d] transition hover:text-white">
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
        </div>
      </section>
    </div>
  );
}

function BottomSwitch({ active, go }: { active: PaneId; go: (pane: PaneId) => void }) {
  return (
    <nav className="fixed bottom-4 left-1/2 z-[80] w-[min(92vw,560px)] -translate-x-1/2 rounded-[30px] border border-white/65 bg-white/42 p-2 shadow-[0_20px_80px_rgba(143,79,92,.22)] backdrop-blur-2xl">
      <div className="grid grid-cols-3 gap-1">
        {panes.map((pane) => (
          <button key={pane.id} onClick={() => go(pane.id)} className={`relative flex min-h-[54px] items-center justify-center gap-2 rounded-[24px] px-3 py-3 text-xs font-black uppercase tracking-[0.14em] transition ${active === pane.id ? "text-[#191724]" : "text-[#191724]/45 hover:bg-white/40 hover:text-[#191724]"}`}>
            {pane.id === "paga" && <ChevronLeft size={15} />}
            {pane.id === "sherrie" ? <img src="/sherrie-sherrie.png" alt="Sherrie Sherrie" className="h-9 w-auto max-w-[118px] object-contain" /> : pane.label}
            {pane.id === "alexis" && <ChevronRight size={15} />}
            {active === pane.id && <motion.span layoutId="sherrie-bottom-active" className="absolute inset-0 -z-10 rounded-[24px] border border-white/80 bg-white/54 shadow-[0_0_30px_rgba(226,93,156,.18)]" />}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function MirageExperience({ events, tracks, videos }: { events: EventItem[]; tracks: DbTrack[]; videos: DbVideo[] }) {
  const [active, setActive] = useState<PaneId>("sherrie");
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
          <motion.div
            key={active}
            custom={direction}
            initial={{ opacity: 0, x: direction * 70, rotateY: direction * -8, filter: "blur(12px)" }}
            animate={{ opacity: 1, x: 0, rotateY: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: direction * -70, rotateY: direction * 8, filter: "blur(12px)" }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen"
          >
            {active === "paga" && (
              <div className="bg-[#06080f] pb-24 text-white">
                <Hero />
                <DatesSection events={events} />
                <MusicSection tracks={tracks} />
                <VideoSection videos={videos} />
              </div>
            )}
            {active === "sherrie" && <SherrieHome events={events} />}
            {active === "alexis" && <AlexisPage events={events} />}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomSwitch active={active} go={go} />
    </>
  );
}
