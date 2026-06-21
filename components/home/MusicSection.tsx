"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, Music, ExternalLink } from "lucide-react";

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
    <div className="flex-shrink-0 w-56 sm:w-64">
      <div className="glass-card p-4 group h-full flex flex-col">
        {/* Cover */}
        <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-primary/20 to-secondary/20">
          {track.cover ? (
            <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Music size={36} className="text-white/20" />
            </div>
          )}
          {embedUrl && !playing && (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                <Play size={18} className="text-white ml-0.5" fill="white" />
              </div>
            </button>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </div>

        {/* Info */}
        <div className="flex-1 mb-3">
          <h3 className="font-semibold text-sm truncate leading-tight">{track.title}</h3>
          <p className="text-xs text-white/50 mt-0.5 truncate">{track.artistName}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {embedUrl && !playing && (
            <button
              onClick={() => setPlaying(true)}
              className="flex-1 btn-primary text-xs py-2 justify-center"
            >
              <Play size={11} fill="white" />
              Écouter
            </button>
          )}
          {track.externalUrl && (
            <a
              href={track.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 glass-card rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <ExternalLink size={13} className="text-white/50" />
            </a>
          )}
        </div>

        {/* Embed */}
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
    </div>
  );
}

export default function MusicSection({ tracks }: MusicSectionProps) {
  const t = useTranslations("home.music");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  };

  if (tracks.length === 0) return null;

  return (
    <section id="musique" className="py-20">
      {/* Header — padded */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary mb-3">Music</p>
            <h2 className="section-title">{t("title")}</h2>
            <p className="text-white/50 mt-2 text-sm">{t("subtitle")}</p>
          </div>
          <div className="hidden md:flex gap-2 flex-shrink-0">
            <button onClick={() => scroll("left")} className="w-9 h-9 glass-card rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
              <ChevronLeft size={16} className="text-white/60" />
            </button>
            <button onClick={() => scroll("right")} className="w-9 h-9 glass-card rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
              <ChevronRight size={16} className="text-white/60" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Carousel — full width with left padding, scrolls right */}
      <div ref={scrollRef} className="carousel-scroll flex gap-4 pb-4 px-6">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
        <div className="flex-shrink-0 w-2" />
      </div>
    </section>
  );
}
