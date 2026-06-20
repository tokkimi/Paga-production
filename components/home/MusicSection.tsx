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
    <div className="carousel-item flex-shrink-0 w-64 sm:w-72">
      <div className="glass-card p-5 hover-lift group h-full">
        {/* Cover */}
        <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-primary/20 to-secondary/20">
          {track.cover ? (
            <img
              src={track.cover}
              alt={track.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Music size={40} className="text-white/20" />
            </div>
          )}

          {/* Play overlay */}
          {embedUrl && (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center glow-red">
                <Play size={22} className="text-white ml-1" fill="white" />
              </div>
            </button>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Info */}
        <div className="space-y-1 mb-3">
          <h3 className="font-bold text-sm truncate">{track.title}</h3>
          <p className="text-xs text-white/60">{track.artistName}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {embedUrl && !playing && (
            <button
              onClick={() => setPlaying(true)}
              className="flex-1 btn-primary text-xs py-2 justify-center"
            >
              <Play size={12} fill="white" />
              Écouter
            </button>
          )}
          {track.externalUrl && (
            <a
              href={track.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 glass-card rounded-lg hover:bg-white/10 transition-colors"
            >
              <ExternalLink size={14} className="text-white/60" />
            </a>
          )}
        </div>

        {/* Embed Player */}
        {playing && embedUrl && (
          <div className="mt-3">
            {track.soundcloudEmbedUrl && (
              <iframe
                src={track.soundcloudEmbedUrl}
                width="100%"
                height="166"
                scrolling="no"
                frameBorder="0"
                allow="autoplay"
                className="rounded-lg"
              />
            )}
            {track.spotifyEmbedUrl && !track.soundcloudEmbedUrl && (
              <iframe
                src={track.spotifyEmbedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg"
              />
            )}
            {track.youtubeEmbedUrl && !track.soundcloudEmbedUrl && !track.spotifyEmbedUrl && (
              <iframe
                src={`${track.youtubeEmbedUrl}?autoplay=1`}
                width="100%"
                height="120"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="rounded-lg"
              />
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
    const amount = 300;
    scrollRef.current.scrollBy({
      left: dir === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  if (tracks.length === 0) return null;

  return (
    <section id="musique" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary mb-3">
              Music
            </p>
            <h2 className="section-title">{t("title")}</h2>
            <p className="text-white/60 mt-3 text-sm">{t("subtitle")}</p>
          </div>

          {/* Navigation buttons */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={18} className="text-white/70" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={18} className="text-white/70" />
            </button>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="carousel-scroll flex gap-4 pb-4"
        >
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </div>
    </section>
  );
}
