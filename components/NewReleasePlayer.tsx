"use client";

import { Pause, Play, X } from "lucide-react";
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
  fr: { kicker: "Dernière sortie", close: "Fermer" },
  en: { kicker: "Latest release", close: "Close" },
  ko: { kicker: "최신 발매", close: "닫기" },
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
  const [isPlaying, setIsPlaying] = useState(false);
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
  const iframeSrc = playerUrl.includes("youtube.com/embed/")
    ? `${playerUrl}?rel=0&autoplay=1&controls=0&modestbranding=1`
    : playerUrl;

  if (dismissed) return null;

  return (
    <aside className="fixed inset-x-3 bottom-[96px] z-[70] mx-auto w-auto max-w-[300px] sm:left-auto sm:right-6 sm:mx-0">
      <div
        className={`relative overflow-hidden rounded-[22px] p-1.5 backdrop-blur-xl ${
          isDark
            ? "bg-[#171923]/25 text-white shadow-[0_10px_34px_rgba(0,0,0,.12)]"
            : "bg-white/25 text-[#111118] shadow-[0_10px_34px_rgba(20,14,18,.04)]"
        }`}
      >
        {isPlaying && (
          <iframe
            src={iframeSrc}
            title={track.title}
            className="pointer-events-none absolute h-px w-px opacity-0"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        <div className="grid grid-cols-[34px_34px_minmax(0,1fr)_18px] items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((value) => !value)}
            className={`inline-flex h-[34px] w-[34px] items-center justify-center rounded-[12px] backdrop-blur-md transition hover:scale-[1.03] ${
              isDark ? "bg-white/8 text-white" : "bg-white/18 text-[#111118]"
            }`}
            aria-label={text.kicker}
          >
            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          </button>
          <img src={cover} alt="" className="h-[34px] w-[34px] rounded-[10px] object-cover shadow-[0_8px_18px_rgba(0,0,0,.08)]" />
          <button type="button" onClick={() => setIsPlaying((value) => !value)} className="min-w-0 text-left">
            <span className="block truncate text-[8px] font-black uppercase tracking-[0.15em] text-[#d85e98]">
              {text.kicker}
            </span>
            <strong className="mt-0.5 block truncate text-[12px] font-black uppercase leading-tight">{track.title}</strong>
            <span className={`block truncate text-[8px] font-black uppercase tracking-[0.10em] ${isDark ? "text-white/42" : "text-[#111118]/38"}`}>
              {track.artistName}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className={`inline-flex h-[18px] w-[18px] items-center justify-center rounded-full transition ${
              isDark ? "text-white/42 hover:bg-white/10 hover:text-white" : "text-[#111118]/34 hover:bg-white/35 hover:text-[#111118]"
            }`}
            aria-label={text.close}
          >
            <X size={12} />
          </button>
        </div>
        <div className="mt-1.5 h-[2px] overflow-hidden rounded-full bg-[#d85e98]/12">
          {isPlaying && <span className="release-progress-bar" />}
        </div>
      </div>
    </aside>
  );
}
