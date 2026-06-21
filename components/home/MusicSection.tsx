"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ExternalLink, Music, Play } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artistName: string;
  soundcloudEmbedUrl?: string | null;
  spotifyEmbedUrl?: string | null;
  youtubeEmbedUrl?: string | null;
  externalUrl?: string | null;
  cover?: string | null;
}

interface MusicSectionProps {
  tracks: Track[];
}

function TrackCard({ track }: { track: Track }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = track.soundcloudEmbedUrl || track.spotifyEmbedUrl || track.youtubeEmbedUrl;

  return (
    <article className="carousel-item w-[82vw] flex-shrink-0 sm:w-64">
      <div className="group flex h-full flex-col rounded-2xl border border-cyan-200/15 bg-white/[0.045] p-4 backdrop-blur-xl transition-colors hover:bg-white/[0.075]">
        <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-cyan-300/15 to-blue-900/30">
          {track.cover ? (
            <img src={track.cover} alt={track.title} className="h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Music size={36} className="text-white/22" />
            </div>
          )}
          {embedUrl && !playing && (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100"
              aria-label={`Play ${track.title}`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-300/85">
                <Play size={18} className="ml-0.5 text-white" fill="white" />
              </span>
            </button>
          )}
        </div>

        <div className="mb-3 flex-1">
          <h3 className="truncate text-sm font-bold leading-tight text-white">{track.title}</h3>
          <p className="mt-1 truncate text-xs text-white/50">{track.artistName}</p>
        </div>

        <div className="flex gap-2">
          {embedUrl && !playing && (
            <button onClick={() => setPlaying(true)} className="btn-primary flex-1 justify-center py-2 text-xs">
              <Play size={11} fill="white" />
              Ecouter
            </button>
          )}
          {track.externalUrl && (
            <a
              href={track.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] transition-colors hover:bg-white/10"
            >
              <ExternalLink size={13} className="text-white/55" />
            </a>
          )}
        </div>

        {playing && embedUrl && (
          <div className="mt-3">
            {track.soundcloudEmbedUrl && (
              <iframe src={track.soundcloudEmbedUrl} width="100%" height="120" scrolling="no" frameBorder="0" allow="autoplay" className="rounded-lg" />
            )}
            {track.spotifyEmbedUrl && !track.soundcloudEmbedUrl && (
              <iframe src={track.spotifyEmbedUrl} width="100%" height="120" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="rounded-lg" />
            )}
            {track.youtubeEmbedUrl && !track.soundcloudEmbedUrl && !track.spotifyEmbedUrl && (
              <iframe src={`${track.youtubeEmbedUrl}?autoplay=1`} width="100%" height="100" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" className="rounded-lg" />
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function MusicSection({ tracks }: MusicSectionProps) {
  const t = useTranslations("home.music");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  };

  if (tracks.length === 0) return null;

  return (
    <section id="musique" className="py-20">
      <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.4em] text-cyan-300">Music</p>
          <h2 className="section-title">{t("title")}</h2>
          <p className="mt-2 text-sm text-white/50">{t("subtitle")}</p>
        </motion.div>
        <div className="hidden flex-shrink-0 gap-4 md:flex">
          <button onClick={() => scroll("left")} className="scroll-dot" aria-label="Previous tracks" />
          <button onClick={() => scroll("right")} className="scroll-dot" aria-label="Next tracks" />
        </div>
      </div>

      <div ref={scrollRef} className="carousel-scroll flex gap-4 px-6 pb-4">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
        <div className="w-2 flex-shrink-0" />
      </div>
    </section>
  );
}
