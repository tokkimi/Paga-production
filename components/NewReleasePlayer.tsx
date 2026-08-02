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
    <aside className="fixed inset-x-4 bottom-[112px] z-[70] mx-auto w-auto max-w-[460px] sm:left-auto sm:right-6 sm:mx-0">
      <div
        className={`relative overflow-hidden rounded-[30px] border p-2.5 backdrop-blur-xl ${
          isDark
            ? "border-white/18 bg-[#171923]/25 text-white shadow-[0_0_28px_rgba(255,255,255,.12),0_24px_80px_rgba(0,0,0,.44)]"
            : "border-[#12131b]/12 bg-white/25 text-[#111118] shadow-[0_0_30px_rgba(255,255,255,.46),0_22px_70px_rgba(20,14,18,.16)]"
        }`}
      >
        {isOpen ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className={`absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full transition ${
                isDark ? "bg-black/35 hover:bg-white/14" : "bg-white/45 hover:bg-white/65"
              }`}
              aria-label={text.close}
            >
              <X size={15} />
            </button>
            <div className="overflow-hidden rounded-[24px] border border-white/30 bg-black">
              <iframe
                src={iframeSrc}
                title={track.title}
                width="100%"
                height="210"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-[64px_58px_minmax(0,1fr)_32px] items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className={`inline-flex h-16 w-16 items-center justify-center rounded-[20px] border backdrop-blur-xl transition hover:scale-[1.03] ${
                isDark
                  ? "border-white/12 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.10)]"
                  : "border-[#111118]/10 bg-white/30 text-[#111118] shadow-[inset_0_1px_0_rgba(255,255,255,.50)]"
              }`}
              aria-label={text.kicker}
            >
              <Play size={24} fill="currentColor" />
            </button>
            <img src={cover} alt="" className="h-[58px] w-[58px] rounded-[16px] object-cover shadow-[0_12px_24px_rgba(0,0,0,.18)]" />
            <button type="button" onClick={() => setIsOpen(true)} className="min-w-0 text-left">
              <span className={`block truncate text-xs font-black uppercase tracking-[0.18em] ${isDark ? "text-white/58" : "text-[#111118]/50"}`}>
                {text.kicker}
              </span>
              <strong className="mt-0.5 block truncate text-lg font-black uppercase leading-tight">{track.title}</strong>
              <span className={`block truncate text-xs font-black uppercase tracking-[0.12em] ${isDark ? "text-white/60" : "text-[#111118]/48"}`}>
                {track.artistName}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition ${
                isDark ? "text-white/45 hover:bg-white/10 hover:text-white" : "text-[#111118]/38 hover:bg-white/40 hover:text-[#111118]"
              }`}
              aria-label={text.close}
            >
              <X size={15} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
