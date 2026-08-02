"use client";

import { Play, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useState } from "react";

type ApiTrack = {
  title: string;
  artistName: string;
  youtubeEmbedUrl?: string | null;
  spotifyEmbedUrl?: string | null;
  soundcloudEmbedUrl?: string | null;
  cover?: string | null;
  order?: number | null;
};

const fallbackTrack: ApiTrack = {
  title: "Sunshine",
  artistName: "Sherrie Sherrie",
  youtubeEmbedUrl: "https://www.youtube.com/embed/jQytxOJ6ksQ",
  cover: "https://i.ytimg.com/vi/jQytxOJ6ksQ/hqdefault.jpg",
  order: -1,
};

const labels = {
  fr: { kicker: "Nouveau titre", cta: "Écouter le nouveau titre", close: "Réduire" },
  en: { kicker: "New release", cta: "Listen to the new track", close: "Minimize" },
  ko: { kicker: "새 릴리스", cta: "새 트랙 듣기", close: "줄이기" },
};

function normalizeYoutubeEmbed(url?: string | null) {
  if (!url) return null;
  const trimmed = url.trim();
  const short = trimmed.match(/youtu\.be\/([^?&]+)/)?.[1];
  const watch = trimmed.match(/[?&]v=([^?&]+)/)?.[1];
  const embed = trimmed.match(/youtube\.com\/embed\/([^?&]+)/)?.[1];
  const id = embed || short || watch;
  return id ? `https://www.youtube.com/embed/${id}` : trimmed;
}

function youtubeThumbnail(url?: string | null) {
  const embed = normalizeYoutubeEmbed(url);
  const id = embed?.match(/embed\/([^?&]+)/)?.[1];
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

function getPlayableUrl(track: ApiTrack) {
  return normalizeYoutubeEmbed(track.youtubeEmbedUrl) || track.spotifyEmbedUrl || track.soundcloudEmbedUrl || fallbackTrack.youtubeEmbedUrl!;
}

function pickFeatured(tracks: ApiTrack[]) {
  const activeFeatured = tracks.find((track) => typeof track.order === "number" && track.order < 0);
  const sunshine = tracks.find((track) => /sunshine/i.test(track.title));
  return activeFeatured || sunshine || fallbackTrack;
}

export default function NewReleasePlayer() {
  const locale = useLocale();
  const text = labels[locale as keyof typeof labels] ?? labels.en;
  const [track, setTrack] = useState<ApiTrack>(fallbackTrack);
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetch("/api/tracks", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (!ignore && Array.isArray(data)) setTrack(pickFeatured(data));
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const syncTheme = () => setIsDark(localStorage.getItem("sherrie-theme") === "dark");
    syncTheme();
    window.addEventListener("sherrie-theme-change", syncTheme);
    return () => window.removeEventListener("sherrie-theme-change", syncTheme);
  }, []);

  const playerUrl = useMemo(() => getPlayableUrl(track), [track]);
  const cover = track.cover || youtubeThumbnail(track.youtubeEmbedUrl) || fallbackTrack.cover!;
  const iframeSrc = isOpen && playerUrl.includes("youtube.com/embed/") ? `${playerUrl}?rel=0&autoplay=1` : playerUrl;

  if (dismissed) return null;

  return (
    <aside className="fixed inset-x-4 bottom-[112px] z-[70] mx-auto w-auto max-w-[390px] sm:left-auto sm:right-6 sm:mx-0">
      <div
        className={`relative overflow-hidden rounded-[28px] p-3 backdrop-blur-[8px] ${
          isDark
            ? "border border-white/18 bg-black/24 text-white shadow-[0_0_34px_rgba(255,119,174,.22),0_24px_80px_rgba(0,0,0,.42)]"
            : "border border-white/55 bg-white/25 text-[#111118] shadow-[0_0_30px_rgba(255,255,255,.46),0_24px_80px_rgba(20,14,18,.20)]"
        }`}
      >
        <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? "from-black/74 via-black/42 to-black/18" : "from-white/78 via-white/44 to-white/18"}`} />
        <div className="relative">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className={`rounded-full border border-[#d85e98]/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] backdrop-blur-[3px] ${isDark ? "bg-black/18 text-[#ff8dba]" : "bg-white/28 text-[#c85586]"}`}>
              {text.kicker}
            </span>
            <button type="button" onClick={() => setDismissed(true)} className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition ${isDark ? "bg-black/22 hover:bg-white/12" : "bg-white/28 hover:bg-white/45"}`} aria-label="Fermer">
              <X size={15} />
            </button>
          </div>

          {isOpen ? (
            <div className="overflow-hidden rounded-[20px] border border-white/45 bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]">
              <iframe
                src={iframeSrc}
                title={track.title}
                width="100%"
                height="190"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <button type="button" onClick={() => setIsOpen(true)} className="group grid w-full grid-cols-[72px_minmax(0,1fr)_54px] items-center gap-3 text-left">
              <img src={cover} alt="" className="h-[72px] w-[72px] rounded-[18px] object-cover shadow-[0_14px_30px_rgba(0,0,0,.18)]" />
              <span className="min-w-0">
                <strong className="block truncate text-lg font-black leading-tight">{track.title}</strong>
                <span className="mt-1 block truncate text-xs font-semibold opacity-70">{track.artistName}</span>
                <span className={`mt-2 inline-flex rounded-full border border-[#d85e98]/46 bg-white/18 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${isDark ? "text-[#ff8dba]" : "text-[#c85586]"}`}>
                  {text.cta}
                </span>
              </span>
              <span className="inline-flex h-[54px] w-[54px] items-center justify-center rounded-[18px] border border-white/60 bg-white/25 text-[#111118] shadow-[0_0_24px_rgba(255,255,255,.52)] backdrop-blur-[8px] transition group-hover:scale-105">
                <Play size={22} fill="currentColor" />
              </span>
            </button>
          )}

          {isOpen && (
            <button type="button" onClick={() => setIsOpen(false)} className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-60 transition hover:opacity-100">
              {text.close}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
