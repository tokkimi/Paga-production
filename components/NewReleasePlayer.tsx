"use client";

import { Pause, Play, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  fr: { kicker: "Dernière sortie", close: "Fermer", play: "Écouter", pause: "Mettre en pause" },
  en: { kicker: "Latest release", close: "Close", play: "Play", pause: "Pause" },
  ko: { kicker: "최신 발매", close: "닫기", play: "듣기", pause: "일시정지" },
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [track, setTrack] = useState<ApiTrack>(fallbackTrack);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
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
  const isYoutube = playerUrl.includes("youtube.com/embed/");
  const cover = track.cover || youtubeThumbnail(track.youtubeEmbedUrl) || fallbackTrack.cover!;
  const iframeSrc = isYoutube
    ? `${playerUrl}?enablejsapi=1&playsinline=1&controls=0&rel=0&modestbranding=1`
    : playerUrl;

  const sendYoutubeCommand = useCallback((command: "playVideo" | "pauseVideo") => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args: [] }),
      "https://www.youtube.com",
    );
  }, []);

  const togglePlayback = () => {
    const nextPlaying = !isPlaying;
    if (isYoutube && isReady) {
      sendYoutubeCommand(nextPlaying ? "playVideo" : "pauseVideo");
    }
    setIsPlaying(nextPlaying);
  };

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
        {isYoutube ? (
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            title={`${track.title} audio`}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 opacity-[0.001]"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            tabIndex={-1}
            aria-hidden="true"
            onLoad={() => {
              setIsReady(true);
              if (isPlaying) sendYoutubeCommand("playVideo");
            }}
          />
        ) : (
          isPlaying && (
            <iframe
              src={iframeSrc}
              title={`${track.title} audio`}
              className="pointer-events-none absolute h-px w-px opacity-0"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              tabIndex={-1}
              aria-hidden="true"
            />
          )
        )}
        <div className="relative grid grid-cols-[34px_34px_minmax(0,1fr)_18px] items-center gap-2">
          <button
            type="button"
            onClick={togglePlayback}
            className={`inline-flex h-[34px] w-[34px] items-center justify-center rounded-[12px] backdrop-blur-md transition hover:scale-[1.03] ${
              isDark ? "bg-white/8 text-white" : "bg-white/18 text-[#111118]"
            }`}
            aria-label={isPlaying ? text.pause : text.play}
          >
            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          </button>
          <img src={cover} alt="" className="h-[34px] w-[34px] rounded-[10px] object-cover shadow-[0_8px_18px_rgba(0,0,0,.08)]" />
          <button type="button" onClick={togglePlayback} className="min-w-0 text-left" aria-label={isPlaying ? text.pause : text.play}>
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
            onClick={() => {
              if (isYoutube && isReady) sendYoutubeCommand("pauseVideo");
              setDismissed(true);
            }}
            className={`inline-flex h-[18px] w-[18px] items-center justify-center rounded-full transition ${
              isDark ? "text-white/42 hover:bg-white/10 hover:text-white" : "text-[#111118]/34 hover:bg-white/35 hover:text-[#111118]"
            }`}
            aria-label={text.close}
          >
            <X size={12} />
          </button>
        </div>
        <div className="relative mt-1.5 h-[2px] overflow-hidden rounded-full bg-[#d85e98]/12">
          {isPlaying && <span className="release-progress-bar" />}
        </div>
      </div>
    </aside>
  );
}
