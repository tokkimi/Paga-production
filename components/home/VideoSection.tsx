"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";

interface Video {
  id: string;
  title: string;
  youtubeEmbedUrl: string;
  thumbnail?: string | null;
}

interface VideoSectionProps {
  videos: Video[];
}

function VideoCard({ video }: { video: Video }) {
  const [modalOpen, setModalOpen] = useState(false);

  const getYoutubeId = (url: string) => {
    const match = url.match(/embed\/([^?&]+)/);
    return match ? match[1] : null;
  };

  const ytId = getYoutubeId(video.youtubeEmbedUrl);
  const thumbnail = video.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null);

  return (
    <>
      <div className="flex-shrink-0 w-64 sm:w-72">
        <div
          className="glass-card overflow-hidden cursor-pointer group"
          onClick={() => setModalOpen(true)}
        >
          <div className="relative aspect-video overflow-hidden">
            {thumbnail ? (
              <img src={thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/85 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={20} className="text-white ml-0.5" fill="white" />
              </div>
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug">
              {video.title}
            </h3>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-base truncate pr-4">{video.title}</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-9 h-9 glass-card rounded-full flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden">
                <iframe
                  src={`${video.youtubeEmbedUrl}?autoplay=1&rel=0`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function VideoSection({ videos }: VideoSectionProps) {
  const t = useTranslations("home.videos");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  };

  if (videos.length === 0) return null;

  return (
    <section className="py-20">
      {/* Header — padded */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary mb-3">Videos</p>
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

      {/* Carousel — full width with left padding */}
      <div ref={scrollRef} className="carousel-scroll flex gap-4 pb-4 px-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
        <div className="flex-shrink-0 w-2" />
      </div>
    </section>
  );
}
