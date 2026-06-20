"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Share2, Music, Play } from "lucide-react";

interface ArtistCardProps {
  artist: {
    id: string;
    slug: string;
    name: string;
    shortBio_fr?: string | null;
    shortBio_en?: string | null;
    avatar?: string | null;
    instagram?: string | null;
    spotify?: string | null;
    soundcloud?: string | null;
    youtube?: string | null;
  };
  index?: number;
}

export default function ArtistCard({ artist, index = 0 }: ArtistCardProps) {
  const locale = useLocale();
  const bio = locale === "en" ? artist.shortBio_en : artist.shortBio_fr;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/${locale}/artistes/${artist.slug}`}>
        <div className="glass-card overflow-hidden hover-lift group cursor-pointer">
          {/* Avatar */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/30 to-secondary/20">
            {artist.avatar ? (
              <img
                src={artist.avatar}
                alt={artist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-black text-white/10 uppercase">
                  {artist.name[0]}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-2xl font-black uppercase tracking-wider text-white group-hover:text-primary transition-colors">
                {artist.name}
              </h3>
            </div>
          </div>

          {/* Info */}
          <div className="p-5">
            {bio && (
              <p className="text-sm text-white/60 leading-relaxed line-clamp-3 mb-4">
                {bio}
              </p>
            )}

            {/* Social links */}
            <div className="flex gap-2">
              {artist.instagram && (
                <a
                  href={artist.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 glass-card rounded-lg flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-colors"
                >
                  <Share2 size={14} className="text-white/60" />
                </a>
              )}
              {artist.spotify && (
                <a
                  href={artist.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 glass-card rounded-lg flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-colors"
                >
                  <Music size={14} className="text-white/60" />
                </a>
              )}
              {artist.youtube && (
                <a
                  href={artist.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 glass-card rounded-lg flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-colors"
                >
                  <Play size={14} className="text-white/60" />
                </a>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
