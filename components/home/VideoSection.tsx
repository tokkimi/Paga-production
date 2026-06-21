"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";

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
  const ytId = video.youtubeEmbedUrl.match(/embed\/([^?&]+)/)?.[1] || null;
  const thumbnail = video.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null);

  return (
    <>
      <article className="carousel-item w-[84vw] flex-shrink-0 sm:w-80">
        <button
          className="group block w-full overflow-hidden rounded-2xl border border-cyan-200/15 bg-white/[0.045] text-left backdrop-blur-xl transition-colors hover:bg-white/[0.075]"
          onClick={() => setModalOpen(true)}
        >
          <div className="relative aspect-video overflow-hidden">
            {thumbnail ? (
              <img src={thumbnail} alt={video.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/15 to-blue-900/35" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 transition-colors group-hover:bg-black/52">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-300/85 transition-transform group-hover:scale-110">
                <Play size={20} className="ml-0.5 text-white" fill="white" />
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white transition-colors group-hover:text-cyan-200">
              {video.title}
            </h3>
          </div>
        </button>
      </article>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="truncate pr-4 text-base font-semibold">{video.title}</h3>
                <button onClick={() => setModalOpen(false)} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                  <X size={16} />
                </button>
              </div>
              <div className="aspect-video overflow-hidden rounded-2xl">
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
    scrollRef.current.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };

  if (videos.length === 0) return null;

  return (
    <section className="py-20">
      <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.4em] text-cyan-300">Videos</p>
          <h2 className="section-title">{t("title")}</h2>
          <p className="mt-2 text-sm text-white/50">{t("subtitle")}</p>
        </motion.div>
        <div className="hidden flex-shrink-0 gap-4 md:flex">
          <button onClick={() => scroll("left")} className="scroll-dot" aria-label="Previous videos" />
          <button onClick={() => scroll("right")} className="scroll-dot" aria-label="Next videos" />
        </div>
      </div>

      <div ref={scrollRef} className="carousel-scroll flex gap-4 px-6 pb-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
        <div className="w-2 flex-shrink-0" />
      </div>
    </section>
  );
}
