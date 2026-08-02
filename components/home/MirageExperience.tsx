"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, MessageCircle, Pause, Play, X } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type EventItem = {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string;
  venue: string;
  city: string;
  country: string;
  date: string;
  ticketUrl?: string | null;
  isB2B: boolean;
  isFeatured: boolean;
  artists?: { artist: { name: string; slug: string } }[];
};

type DbTrack = {
  id: string;
  title: string;
  artistName: string;
  soundcloudEmbedUrl?: string | null;
  spotifyEmbedUrl?: string | null;
  youtubeEmbedUrl?: string | null;
  externalUrl?: string | null;
  cover?: string | null;
  createdAt?: string | null;
  releasedAt?: string | null;
};

type DbVideo = {
  id: string;
  title: string;
  youtubeEmbedUrl: string;
  thumbnail?: string | null;
  createdAt?: string | null;
};

type TrackItem = {
  title: string;
  artist: string;
  year: string;
  date?: string;
  source: string;
  external: string;
  cover: string;
  spotify?: string;
  youtube?: string;
  player?: string;
};

type VideoClip = {
  title: string;
  embed: string;
};

type SocialKind = "instagram" | "youtube" | "spotify" | "deezer";

const copy = {
  fr: {
    nextDates: "Prochaines dates",
    details: "Détails",
    heroTitle: "Step into the pulse of the night",
    heroText:
      "Sherrie Sherrie réunit Paga et Alexis Dante autour d'un format duo pensé pour les clubs, festivals, rooftops et événements premium.",
    storyEyebrow: "Histoire du duo",
    storyTitle: "Paga x Alexis Dante",
    storyText:
      "Paga apporte l'impact populaire, l'énergie du Sud et une connexion directe avec le public. Alexis Dante apporte son parcours de DJ producteur, ses sorties house, ses remixes et une vraie culture club. Ensemble, Sherrie Sherrie devient un projet musical lisible, solaire et taillé pour la scène.",
    soundsEyebrow: "",
    soundsTitle: "Playlist",
    soundsCopy: "",
    videosEyebrow: "",
    videosTitle: "Vidéos",
    pagaProfileEyebrow: "Artiste & scène",
    pagaProfileTitle: "Paga",
    pagaProfileText:
      "Figure marseillaise connue du grand public, Paga a transformé sa notoriété en terrain de jeu musical : DJ sets, festivals, collaborations et contenus capables de parler aux clubs, aux marques et à une communauté très engagée.",
    alexisProfileEyebrow: "DJ producteur",
    alexisProfileTitle: "Alexis Dante",
    alexisProfileText:
      "Alexis Dante est DJ, compositeur et producteur. Son catalogue traverse la house, les remixes et les sorties club sous Alexis Dante, avec l'héritage Sherrie Sherrie pour une direction plus solaire et dancefloor.",
    latest: "Derniers sons",
    catalogue: "Catalogue",
    artistVideos: "Vidéos",
    listen: "Écouter",
    open: "Ouvrir",
    howTitle: "Comment ça marche",
    how1Title: "Découvrir",
    how1Copy: "Explorer l'univers commun, les sons, les vidéos et les prochaines dates.",
    how2Title: "Réserver",
    how2Copy: "Proposer une date, un festival, un club ou une collaboration adaptée au duo.",
    how3Title: "Vibrer",
    how3Copy: "Vivre un set commun accessible, premium et fait pour rassembler le public.",
    newsletterTitle: "Rester informé",
    newsletterCopy: "Recevez les nouvelles dates, sorties et opportunités autour de Sherrie Sherrie.",
    placeholder: "Votre email",
    subscribe: "S'abonner",
    contactTitle: "Booking et collaborations",
    contactCopy: "Pour proposer une date, une campagne, un featuring ou une opération spéciale.",
    sponsorCta: "Projet marque",
    joinCta: "Rejoindre",
    dates: "Dates",
    contact: "Contact",
  },
  en: {
    nextDates: "Next dates",
    details: "Détails",
    heroTitle: "Step into the pulse of the night",
    heroText:
      "Sherrie Sherrie brings Paga and Alexis Dante together in a duo DJ format built for clubs, festivals, rooftops and premium events.",
    storyEyebrow: "Duo story",
    storyTitle: "Paga x Alexis Dante",
    storyText:
      "Paga brings mainstream impact, South of France energy and a direct crowd connection. Alexis Dante brings his DJ-producer background, house releases, remixes and true club culture. Together, Sherrie Sherrie becomes a clear, bright, stage-ready music project.",
    soundsEyebrow: "",
    soundsTitle: "Playlist",
    soundsCopy: "",
    videosEyebrow: "",
    videosTitle: "Vidéos",
    pagaProfileEyebrow: "Artist & stage",
    pagaProfileTitle: "Paga",
    pagaProfileText:
      "A Marseille personality with mainstream reach, Paga has turned visibility into a music playground: DJ sets, festivals, collaborations and content that can speak to clubs, brands and a highly engaged community.",
    alexisProfileEyebrow: "DJ producer",
    alexisProfileTitle: "Alexis Dante",
    alexisProfileText:
      "Alexis Dante is a DJ, composer and producer. His catalogue spans house music, remixes and club releases under Alexis Dante, with the Sherrie Sherrie direction bringing a brighter dancefloor identity.",
    latest: "Latest sounds",
    catalogue: "Catalogue",
    artistVideos: "Vidéos",
    listen: "Listen",
    open: "Open",
    howTitle: "How it works",
    how1Title: "Discover",
    how1Copy: "Explore the shared universe, tracks, videos and upcoming dates.",
    how2Title: "Book",
    how2Copy: "Submit a club, festival, date or collaboration opportunity for the duo.",
    how3Title: "Feel it",
    how3Copy: "Experience an accessible, premium shared set built to bring the crowd together.",
    newsletterTitle: "Stay informed",
    newsletterCopy: "Receive new dates, releases and opportunities around Sherrie Sherrie.",
    placeholder: "Your email",
    subscribe: "Subscribe",
    contactTitle: "Booking and collaborations",
    contactCopy: "For dates, campaigns, featuring requests or special projects.",
    sponsorCta: "Brand project",
    joinCta: "Join",
    dates: "Dates",
    contact: "Contact",
  },
  ko: {
    nextDates: "다가오는 일정",
    details: "상세보기",
    heroTitle: "Step into the pulse of the night",
    heroText: "Sherrie Sherrie는 Paga와 Alexis Dante가 함께하는 DJ 프로젝트로, 클럽, 페스티벌, 루프톱과 프리미엄 이벤트를 위해 만들어졌습니다.",
    storyEyebrow: "듀오 스토리",
    storyTitle: "Paga x Alexis Dante",
    storyText: "Paga는 대중적인 영향력, 남프랑스의 에너지, 관객과의 직접적인 연결을 가져옵니다. Alexis Dante는 DJ 프로듀서로서의 경험, 하우스 릴리즈, 리믹스와 클럽 문화를 더합니다. Sherrie Sherrie는 밝고 선명한 무대형 음악 프로젝트입니다.",
    soundsEyebrow: "",
    soundsTitle: "플레이리스트",
    soundsCopy: "",
    videosEyebrow: "",
    videosTitle: "비디오",
    pagaProfileEyebrow: "아티스트 & 무대",
    pagaProfileTitle: "Paga",
    pagaProfileText: "마르세유를 대표하는 대중적 인물인 Paga는 자신의 인지도를 음악적 무대로 확장했습니다. DJ 세트, 페스티벌, 협업, 브랜드와 클럽을 연결하는 콘텐츠를 통해 강한 커뮤니티와 소통합니다.",
    alexisProfileEyebrow: "DJ 프로듀서",
    alexisProfileTitle: "Alexis Dante",
    alexisProfileText: "Alexis Dante는 DJ, 작곡가, 프로듀서입니다. Alexis Dante라는 이름으로 하우스, 리믹스, 클럽 릴리즈를 이어왔고, Sherrie Sherrie를 통해 더욱 밝고 댄스플로어 중심의 방향을 보여줍니다.",
    latest: "최신 음악",
    catalogue: "카탈로그",
    artistVideos: "비디오",
    listen: "듣기",
    open: "열기",
    howTitle: "진행 방식",
    how1Title: "발견하기",
    how1Copy: "공동 세계관, 음악, 비디오와 다음 일정을 확인하세요.",
    how2Title: "예약하기",
    how2Copy: "클럽, 페스티벌, 일정 또는 협업 기회를 제안하세요.",
    how3Title: "경험하기",
    how3Copy: "관객을 하나로 모으는 프리미엄 DJ 세트를 경험하세요.",
    newsletterTitle: "소식 받기",
    newsletterCopy: "Sherrie Sherrie의 새로운 일정, 릴리즈와 협업 소식을 받아보세요.",
    placeholder: "이메일 주소",
    subscribe: "구독하기",
    contactTitle: "부킹 및 협업",
    contactCopy: "공연, 캠페인, 피처링 또는 특별 프로젝트를 제안하세요.",
    sponsorCta: "브랜드 프로젝트",
    joinCta: "지원하기",
    dates: "일정",
    contact: "문의",
  },};

function getCopy(locale: string) {
  return copy[locale as keyof typeof copy] ?? copy.en;
}

const artwork = {
  letsGo: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c6b92c13775056fb443d2cf4",
  letUGo: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02a51dc128e04b80f02c1412ff",
  echoes: "/images/sherrie/echoes-cover.jpg",
  superstition: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02b9e412900a6ba835786ec6f1",
  everybody: "/images/sherrie/everybody-cover.jpg",
  alive: "/images/sherrie/alive-cover.jpg",
  eivissa: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02d8b5cd30b1a8bba60b35f8e1",
  getUpDance: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e028ab55d4cdcb10ce490dc6cbf",
  itsAlright: "https://is1-ssl.mzstatic.com/image/thumb/Music/f5/3a/fc/mzi.bitylpnw.jpg/600x600bb.jpg",
  alexis: "/images/mirage/alexis-remastered.png",
  paga: "/images/sherrie/paga-blue.png",
};

const commonTracks: TrackItem[] = [
  {
    title: "Sunshine",
    artist: "Sherrie Sherrie",
    year: "2026",
    source: "YouTube",
    cover: "https://i.ytimg.com/vi/jQytxOJ6ksQ/hqdefault.jpg",
    youtube: "https://www.youtube.com/embed/jQytxOJ6ksQ",
    external: "https://www.youtube.com/watch?v=jQytxOJ6ksQ",
  },
  {
    title: "Let's Go",
    artist: "Paga, Alexis Dante",
    year: "2026",
    source: "Spotify / Shazam",
    cover: artwork.letsGo,
    spotify: "https://open.spotify.com/embed/track/2V0lvj6SvvUEKSMoydK2sp?utm_source=generator",
    external: "https://open.spotify.com/track/2V0lvj6SvvUEKSMoydK2sp",
  },
  {
    title: "Movin To The Sun - Alexis Dante & PAGA Remix",
    artist: "HUGEL, Ultra Nate, Imael Angel",
    year: "2026",
    source: "YouTube",
    cover: "https://i.ytimg.com/vi/yLuwf5FlG0U/hqdefault.jpg",
    youtube: "https://www.youtube.com/embed/yLuwf5FlG0U",
    external: "https://www.youtube.com/watch?v=yLuwf5FlG0U",
  },
  {
    title: "Let U Go",
    artist: "Alexis Dante, Paga",
    year: "2026",
    source: "Spotify / Apple Music",
    cover: artwork.letUGo,
    spotify: "https://open.spotify.com/embed/track/22vcJV5l9t7qRqHgQEW8RT?utm_source=generator",
    external: "https://open.spotify.com/track/22vcJV5l9t7qRqHgQEW8RT",
  },
];

const pagaOfficialTracks: TrackItem[] = [
  ...commonTracks,
  { title: "La vie est belle", artist: "Paga, Anton Wick", year: "2026", source: "Spotify", cover: artwork.superstition, spotify: "https://open.spotify.com/embed/track/2UxKl8zTyXHrsgpj30k3F4?utm_source=generator", external: "https://open.spotify.com/track/2UxKl8zTyXHrsgpj30k3F4" },
  { title: "Superstition", artist: "Paga, Anton Wick", year: "2026", source: "Spotify / Shazam", cover: artwork.superstition, spotify: "https://open.spotify.com/embed/track/7yu9Brx3IMGHR7IyE1yPKE?utm_source=generator", external: "https://open.spotify.com/track/7yu9Brx3IMGHR7IyE1yPKE" },
  { title: "Main dans la main", artist: "Paga, Anton Wick", year: "2026", source: "Spotify", cover: artwork.superstition, spotify: "https://open.spotify.com/embed/track/57QkSOnTLRHh3UdRs0bHoD?utm_source=generator", external: "https://open.spotify.com/track/57QkSOnTLRHh3UdRs0bHoD" },
  { title: "Interférences", artist: "Paga, Anton Wick", year: "2026", source: "Spotify", cover: artwork.superstition, spotify: "https://open.spotify.com/embed/track/0OPz6CXEcoBtxJv1Q4oGsS?utm_source=generator", external: "https://open.spotify.com/track/0OPz6CXEcoBtxJv1Q4oGsS" },
  { title: "Positivité", artist: "Paga, Anton Wick", year: "2026", source: "Spotify", cover: artwork.superstition, spotify: "https://open.spotify.com/embed/track/5lrS7gIroJhwuiRmoZDByS?utm_source=generator", external: "https://open.spotify.com/track/5lrS7gIroJhwuiRmoZDByS" },
  { title: "Amour Amor", artist: "Paga, Anton Wick", year: "2026", source: "Spotify", cover: artwork.superstition, spotify: "https://open.spotify.com/embed/track/07gdaIftYSFwwOPkg5K8IK?utm_source=generator", external: "https://open.spotify.com/track/07gdaIftYSFwwOPkg5K8IK" },
  { title: "Un soir d'été", artist: "Paga, Anton Wick", year: "2026", source: "Spotify", cover: artwork.superstition, spotify: "https://open.spotify.com/embed/track/3szQTrDsphGZUxisEn7jcw?utm_source=generator", external: "https://open.spotify.com/track/3szQTrDsphGZUxisEn7jcw" },
  { title: "Nuit blanche", artist: "Paga, Anton Wick", year: "2026", source: "Spotify", cover: artwork.superstition, spotify: "https://open.spotify.com/embed/track/5DVHlhmtpePtRAYSKDHSLL?utm_source=generator", external: "https://open.spotify.com/track/5DVHlhmtpePtRAYSKDHSLL" },
  { title: "Il était une fois", artist: "Paga, Anton Wick", year: "2026", source: "YouTube Music / Spotify", cover: artwork.superstition, external: "https://www.youtube.com/playlist?list=PLtSJdYuQcGgV1qhIYFUbyjEDMF3KmBI-R" },
  { title: "Evazion", artist: "Paga, Anton Wick", year: "2026", source: "YouTube Music / Spotify", cover: artwork.superstition, external: "https://www.youtube.com/playlist?list=PLtSJdYuQcGgV1qhIYFUbyjEDMF3KmBI-R" },
  { title: "Jusqu'au dernier mot", artist: "Paga, Anton Wick", year: "2026", source: "YouTube Music / Spotify", cover: artwork.superstition, external: "https://www.youtube.com/playlist?list=PLtSJdYuQcGgV1qhIYFUbyjEDMF3KmBI-R" },
  { title: "Le voyage", artist: "Paga, Anton Wick", year: "2026", source: "YouTube Music / Spotify", cover: artwork.superstition, external: "https://www.youtube.com/playlist?list=PLtSJdYuQcGgV1qhIYFUbyjEDMF3KmBI-R" },
  { title: "Joie de vivre", artist: "Paga, Anton Wick", year: "2026", source: "YouTube Music / Spotify", cover: artwork.superstition, external: "https://www.youtube.com/playlist?list=PLtSJdYuQcGgV1qhIYFUbyjEDMF3KmBI-R" },
  { title: "Cochabamba", artist: "Paga, Anton Wick", year: "2025", source: "Spotify", cover: artwork.superstition, external: "https://open.spotify.com/search/Paga%20Anton%20Wick%20Cochabamba" },
  { title: "Get Ready For This", artist: "Paga, Anton Wick", year: "2025", source: "Spotify", cover: artwork.superstition, external: "https://open.spotify.com/search/Paga%20Anton%20Wick%20Get%20Ready%20For%20This" },
  { title: "Allez L'OM", artist: "Paga, Bengous, Elams, Hollis l'Infâme", year: "Music", source: "YouTube / Spotify", cover: "https://i.ytimg.com/vi/LwjdOHpljMI/hqdefault.jpg", youtube: "https://www.youtube.com/embed/LwjdOHpljMI", external: "https://www.youtube.com/watch?v=LwjdOHpljMI" },
];

const alexisTracks: TrackItem[] = [
  ...commonTracks,
  { title: "Everybody - Radio Edit", artist: "Alexis Dante, J.M. Sicky, Nessryne, Ignition Wayne", year: "2012", source: "Deezer", cover: artwork.everybody, player: "https://widget.deezer.com/widget/dark/album/5762101", external: "https://www.deezer.com/album/5762101" },
  { title: "Everybody - Club Edit", artist: "Alexis Dante, J.M. Sicky", year: "2012", source: "Deezer", cover: artwork.everybody, player: "https://widget.deezer.com/widget/dark/album/5762101", external: "https://www.deezer.com/album/5762101" },
  { title: "Everybody - Nasti & Clarks Remix", artist: "Alexis Dante, J.M. Sicky", year: "2012", source: "Deezer / Shazam", cover: artwork.everybody, player: "https://widget.deezer.com/widget/dark/album/5762101", external: "https://www.deezer.com/album/5762101" },
  { title: "Everybody - Adrien Toma Remix", artist: "Alexis Dante, J.M. Sicky", year: "2012", source: "Deezer / Shazam", cover: artwork.everybody, player: "https://widget.deezer.com/widget/dark/album/5762101", external: "https://www.deezer.com/album/5762101" },
  { title: "Everybody - Damien N-drix Remix", artist: "Alexis Dante, J.M. Sicky", year: "2012", source: "Deezer / Shazam", cover: artwork.everybody, player: "https://widget.deezer.com/widget/dark/album/5762101", external: "https://www.deezer.com/album/5762101" },
  { title: "Alive - Original Radio Edit", artist: "Alexis Dante, J.M. Sicky, Eva Menson", year: "2011", source: "Deezer / Shazam", cover: artwork.alive, player: "https://widget.deezer.com/widget/dark/album/1156008", external: "https://www.deezer.com/album/1156008" },
  { title: "Alive - Dante, Sicky Rework", artist: "Alexis Dante, J.M. Sicky, Eva Menson", year: "2011", source: "Deezer", cover: artwork.alive, player: "https://widget.deezer.com/widget/dark/album/1156008", external: "https://www.deezer.com/album/1156008" },
  { title: "Alive - Soundshakerz Club Extended", artist: "Alexis Dante, J.M. Sicky, Eva Menson", year: "2011", source: "Deezer", cover: artwork.alive, player: "https://widget.deezer.com/widget/dark/album/1156008", external: "https://www.deezer.com/album/1156008" },
  { title: "Alive - Club Mix", artist: "Alexis Dante, J.M. Sicky, Eva Menson", year: "2011", source: "Deezer", cover: artwork.alive, player: "https://widget.deezer.com/widget/dark/album/1156008", external: "https://www.deezer.com/album/1156008" },
  { title: "Alive - Tony Romera Remix", artist: "Alexis Dante, J.M. Sicky, Eva Menson", year: "2011", source: "Deezer", cover: artwork.alive, player: "https://widget.deezer.com/widget/dark/album/1156008", external: "https://www.deezer.com/album/1156008" },
  { title: "Eivissa - Deluna Remix", artist: "Amine Edge, Alexis Dante", year: "2011", source: "Spotify", cover: artwork.eivissa, spotify: "https://open.spotify.com/embed/track/3H1CHmv20ipbZ4NUhYolp7?utm_source=generator", external: "https://open.spotify.com/intl-tr/track/3H1CHmv20ipbZ4NUhYolp7" },
  { title: "Get Up Dance - Radio Edit", artist: "Alexis Dante, J.M. Sicky, Eva Menson", year: "2010", source: "Spotify / Shazam", cover: artwork.getUpDance, spotify: "https://open.spotify.com/embed/track/1wHLmzEcce4dbiWYMIxQvi?utm_source=generator", external: "https://open.spotify.com/track/1wHLmzEcce4dbiWYMIxQvi" },
  { title: "It's Alright - Radio Edit", artist: "Alexis Dante, J.M. Sicky, Eva Menson", year: "2009", source: "Apple Music / Shazam", cover: artwork.itsAlright, player: "https://embed.music.apple.com/us/song/its-alright-radio-edit/315461982", external: "https://music.apple.com/us/song/its-alright-radio-edit/315461982" },
];

const commonVideos: VideoClip[] = [
  { title: "Sherrie Sherrie - Sunshine", embed: "https://www.youtube.com/embed/jQytxOJ6ksQ" },
  { title: "DAVID GUETTA - DISTORTION (PAGA & Alexis Dante & MIIRAGE REMIX)", embed: "https://www.youtube.com/embed/tQnDYtmAsmU" },
  { title: "HUGEL - Movin To The Sun (Alexis Dante & PAGA Remix)", embed: "https://www.youtube.com/embed/yLuwf5FlG0U" },
  { title: "Let U Go - Alexis Dante x Paga", embed: "https://www.youtube.com/embed/jLncFjdTgGw" },
];

const pagaVideos: VideoClip[] = [
  { title: "DAVID GUETTA - DISTORTION (PAGA & Alexis Dante & MIIRAGE REMIX)", embed: "https://www.youtube.com/embed/tQnDYtmAsmU" },
  { title: "HUGEL - Movin To The Sun (Alexis Dante & PAGA Remix)", embed: "https://www.youtube.com/embed/yLuwf5FlG0U" },
  { title: "ÉVAZION - PAGA & WICK (Clip officiel)", embed: "https://www.youtube.com/embed/ChjDnJHrFCY" },
  { title: "JUL - WESH ALORS - PAGA & WICK (Stadium Remix - Afro House)", embed: "https://www.youtube.com/embed/zc8-SVpTFaU" },
  { title: "ADRENALINE - PAGA & WICK", embed: "https://www.youtube.com/embed/My1ZTBOE6pA" },
  { title: "SEXY - PAGA & WICK", embed: "https://www.youtube.com/embed/V6ZrKN6uuEM" },
  { title: "Jimmy Sax & Paga - Better Days (Clip officiel)", embed: "https://www.youtube.com/embed/NHc6FDWpNCk" },
  { title: "VIKASH - STOP (By PAGA)", embed: "https://www.youtube.com/embed/akfwJdNuzuY" },
  { title: "BENGOUS ET PAGA - TROP BO TIÉ (Prod by PAGA)", embed: "https://www.youtube.com/embed/gwNH7fLidrc" },
  { title: "Outab feat Hollis L'infâme - Infinite (Paga x Hopperman)", embed: "https://www.youtube.com/embed/3rvm_QXaULk" },
  { title: "VIKASH - J'ADORE ÇA (Prod by PAGA)", embed: "https://www.youtube.com/embed/4m6RcbrCxiQ" },
  { title: "PAGA - Allo fraté ft. Elams, Bebew, Bengous, Hollis L'infâme", embed: "https://www.youtube.com/embed/aMn4IjxZYyQ" },
  { title: "PAGA - ALLEZ L'OM ft. Elams, Bengous, Hollis L'Infâme (Clip officiel)", embed: "https://www.youtube.com/embed/LwjdOHpljMI" },
  { title: "PAGA - ALLEZ L'OM ft. Elams, Bengous, Hollis L'Infâme (Audio officiel)", embed: "https://www.youtube.com/embed/iMOgb75Ubhw" },
];

const sherrieVideos: VideoClip[] = [
  { title: "Sunshine", embed: "https://www.youtube.com/embed/jQytxOJ6ksQ" },
  { title: "Sunshine (Extended VIP Edit)", embed: "https://www.youtube.com/embed/Nj8X390s2tc" },
  { title: "Face It all (Extended Mix)", embed: "https://www.youtube.com/embed/fk5py6rzJUM" },
  { title: "Right Now (Extended Mix)", embed: "https://www.youtube.com/embed/qNBApnYBwgU" },
  { title: "Face It all (Extended Mix)", embed: "https://www.youtube.com/embed/QaqR1GS13lo" },
  { title: "Right Now (Extended Mix)", embed: "https://www.youtube.com/embed/RG-HGa2tvE4" },
  { title: "Never Come Back (Radio Edit)", embed: "https://www.youtube.com/embed/VlrGNDGxXIo" },
  { title: "Never Come Back (Extended Mix)", embed: "https://www.youtube.com/embed/tJ6zy8LzAZQ" },
  { title: "Face It all (Extended Mix)", embed: "https://www.youtube.com/embed/DICtXG464JQ" },
  { title: "Face It all", embed: "https://www.youtube.com/embed/WsIB08jqsnk" },
  { title: "Nana Song", embed: "https://www.youtube.com/embed/Y1DIFhIvRq8" },
  { title: "Right Now (Extended Mix)", embed: "https://www.youtube.com/embed/9epvEMe0068" },
  { title: "Right Now (Radio Edit)", embed: "https://www.youtube.com/embed/3zknLQ5PxSw" },
  { title: "Nana Song", embed: "https://www.youtube.com/embed/9nB3_I8hLbg" },
  { title: "Never Come Back (Extended Mix)", embed: "https://www.youtube.com/embed/dDC9S3hRqYA" },
];

const storySlides = [
  "/images/sherrie/story-duo-yellow.png",
  "/images/sherrie/story-la-villa-duo.jpg",
  "/images/sherrie/story-la-villa-paga.jpg",
  "/images/sherrie/story-paga-club-selfie.png",
  "/images/sherrie/story-paga-blue-crowd.png",
  "/images/sherrie/story-paga-best-crowd.png",
  "/images/sherrie/story-paga-best-crowd.png",
  "/images/sherrie/story-paga-red-dj.png",
  "/images/sherrie/story-paga-side.png",
  "/images/sherrie/story-paga-decks-red.jpg",
  "/images/sherrie/story-alexis-bw-booth.jpg",
  "/images/sherrie/story-alexis-red.jpg",
];

const darkHeroSlides = [
  "/images/sherrie/dark-hero-01.jpg",
  "/images/sherrie/dark-hero-02.jpg",
  "/images/sherrie/dark-hero-03.jpg",
  "/images/sherrie/dark-hero-04.jpg",
  "/images/sherrie/dark-hero-05.jpg",
];

function SectionHeader({ eyebrow, title, copy: text, light }: { eyebrow?: string; title: string; copy?: string; light: boolean }) {
  return (
    <div className="mb-6">
      {eyebrow && <p className={`text-[10px] font-black uppercase tracking-[0.30em] ${light ? "text-[#aa5d74]" : "text-cyan-300"}`}>{eyebrow}</p>}
      <h2 className={`mt-2 text-[clamp(1.7rem,3.5vw,3rem)] font-black uppercase leading-[0.95] tracking-[0.04em] ${light ? "text-[#111118]" : "text-white"}`}>{title}</h2>
      {text && <p className={`mt-4 max-w-2xl text-base leading-relaxed ${light ? "text-[#111118]/62" : "text-white/60"}`}>{text}</p>}
    </div>
  );
}

function AutoPhotoSlideshow({ light }: { light: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % storySlides.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <figure className={`relative aspect-[16/10] overflow-hidden rounded-[30px] shadow-[0_24px_90px_rgba(30,24,28,.14)] ${light ? "bg-white/58" : "border border-white/10 bg-white/[0.055]"}`}>
      <motion.img
        key={storySlides[index]}
        src={storySlides[index]}
        alt=""
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </figure>
  );
}

function MiniDates({ events, labels, light }: { events: EventItem[]; labels: ReturnType<typeof getCopy>; light: boolean }) {
  const locale = useLocale();
  const [activeDate, setActiveDate] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const shown = events.slice(0, 5);
  if (!shown.length) return null;
  const event = shown[activeDate % shown.length];
  const date = new Date(event.date);
  const showDate = (direction: number) => setActiveDate((activeDate + direction + shown.length) % shown.length);

  return (
    <aside className="w-full max-w-[290px]">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#aa5d74]">{labels.nextDates}</p>
        <span className={`text-[10px] font-bold ${light ? "text-[#111118]/40" : "text-white/45"}`}>{String(activeDate + 1).padStart(2, "0")} / {String(shown.length).padStart(2, "0")}</span>
      </div>
      <div className="grid grid-cols-[16px_minmax(0,1fr)_16px] items-center gap-3">
        <button type="button" onClick={() => showDate(-1)} className="sherrie-scroll-dot" aria-label="Previous date" />
        <Link
          href={`/${locale}/dates/${event.slug}`}
          onTouchStart={(touchEvent) => {
            touchStartX.current = touchEvent.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(touchEvent) => {
            if (touchStartX.current === null) return;
            const delta = touchEvent.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(delta) < 42) return;
            touchEvent.preventDefault();
            showDate(delta > 0 ? -1 : 1);
          }}
          className={`block min-h-[156px] touch-pan-y rounded-[22px] p-4 shadow-[0_18px_60px_rgba(30,24,28,.12)] backdrop-blur-[12px] transition ${light ? "border border-white/45 bg-white/25 text-[#111118] hover:bg-white/34" : "border border-white/12 bg-white/[0.07] text-white hover:bg-white/[0.10]"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <time className="text-[10px] font-black uppercase tracking-widest text-[#aa5d74]">
              <span className={`block text-4xl leading-none ${light ? "text-[#111118]" : "text-white"}`}>{date.toLocaleDateString("en", { day: "2-digit" })}</span>
              {date.toLocaleDateString("en", { month: "short" })}
            </time>
            <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest backdrop-blur-[8px] ${light ? "border-white/45 bg-white/25 text-[#111118]/68" : "border-white/12 bg-white/10 text-white/70"}`}>{labels.details}</span>
          </div>
          <strong className="mt-6 block text-lg leading-tight">{event.title_fr || event.title_en}</strong>
          <small className={`mt-3 flex items-center gap-2 text-xs ${light ? "text-[#111118]/55" : "text-white/55"}`}>
            <MapPin size={12} className="text-[#aa5d74]" />
            {event.city} / {event.venue}
          </small>
        </Link>
        <button type="button" onClick={() => showDate(1)} className="sherrie-scroll-dot" aria-label="Next date" />
      </div>
    </aside>
  );
}

function Player({ track, compact = false }: { track: TrackItem; compact?: boolean }) {
  const height = compact ? "96" : "152";
  if (track.spotify) {
    return <iframe src={track.spotify} width="100%" height={height} frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="rounded-[14px]" />;
  }
  if (track.youtube) {
    return <iframe src={`${track.youtube}?rel=0`} width="100%" height={height} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" className="rounded-[14px]" />;
  }
  if (track.player) {
    return <iframe src={track.player} width="100%" height={height} frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="rounded-[14px]" />;
  }
  return null;
}

function TrackCard({ track, light, labels, onPlay }: { track: TrackItem; light: boolean; labels: ReturnType<typeof getCopy>; onPlay: (track: TrackItem) => void }) {
  return (
    <article className={`carousel-item w-[min(66vw,218px)] shrink-0 rounded-[18px] p-2.5 shadow-[0_14px_42px_rgba(12,10,18,.10)] transition ${light ? "bg-white/68 text-[#111118]" : "border border-white/10 bg-white/[0.06] text-white"}`}>
      <div className="aspect-square overflow-hidden rounded-[14px] bg-[#15151c]">
        <img src={track.cover} alt="" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.src = artwork.paga; }} />
      </div>
      <div className="mt-3 flex min-h-[88px] flex-col">
        <p className={`text-[8px] font-black uppercase tracking-[0.24em] ${light ? "text-[#aa5d74]" : "text-cyan-300"}`}>{track.year}</p>
        <h3 className="mt-1.5 line-clamp-2 text-sm font-black leading-tight">{track.title}</h3>
        <p className={`mt-1 line-clamp-1 text-xs ${light ? "text-[#111118]/52" : "text-white/52"}`}>{track.artist}</p>
        <p className={`mt-2 text-[7px] font-black uppercase tracking-[0.15em] ${light ? "text-[#111118]/42" : "text-cyan-300/78"}`}>{track.source}</p>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => onPlay(track)} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-black ${light ? "bg-[#111118] text-white" : "bg-[#1a2036] text-[#b9d4ff]"}`}>
          <Play size={13} /> {labels.listen}
        </button>
        <button type="button" onClick={() => onPlay(track)} aria-label={labels.listen} className={`inline-flex w-10 items-center justify-center rounded-xl ${light ? "bg-black/5 text-[#111118]/58" : "bg-white/8 text-white/62"}`}>
          <Play size={14} />
        </button>
      </div>
    </article>
  );
}

function MusicRail({ tracks, light, labels, onPlay }: { tracks: TrackItem[]; light: boolean; labels: ReturnType<typeof getCopy>; onPlay: (track: TrackItem) => void }) {
  const railRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => railRef.current?.scrollBy({ left: direction * 520, behavior: "smooth" });
  return (
    <div className="grid grid-cols-[16px_minmax(0,1fr)_16px] items-center gap-3 sm:grid-cols-[18px_minmax(0,1fr)_18px]">
      <button type="button" onClick={() => scroll(-1)} className="sherrie-scroll-dot justify-self-center" aria-label="Previous tracks" />
      <div className="min-w-0 overflow-hidden">
        <div ref={railRef} className="carousel-scroll flex gap-3 pb-3">
          {tracks.map((track) => (
            <TrackCard key={`${track.title}-${track.artist}`} track={track} light={light} labels={labels} onPlay={onPlay} />
          ))}
        </div>
      </div>
      <button type="button" onClick={() => scroll(1)} className="sherrie-scroll-dot justify-self-center" aria-label="Next tracks" />
    </div>
  );
}

function youtubeThumb(embed: string) {
  const id = embed.split("/embed/")[1]?.split("?")[0];
  if (!id || id === "videoseries") return "/images/sherrie/paga-stage-red.jpg";
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "/images/sherrie/duo-booth.png";
}

function normalizeYoutubeUrl(url?: string) {
  if (!url) return null;
  const trimmed = url.trim();
  const short = trimmed.match(/youtu\.be\/([^?&]+)/)?.[1];
  const watch = trimmed.match(/[?&]v=([^?&]+)/)?.[1];
  const embed = trimmed.match(/youtube\.com\/embed\/([^?&]+)/)?.[1];
  const id = embed || short || watch;
  return id ? `https://www.youtube.com/embed/${id}` : trimmed;
}

function CompactCatalogue({ tracks, light, onPlay }: { tracks: TrackItem[]; light: boolean; onPlay: (track: TrackItem) => void }) {
  return (
    <div className="relative">
      <div className={`max-h-[360px] overflow-y-auto pr-1 ${light ? "text-[#111118]" : "text-white"}`}>
        {tracks.map((track) => (
          <button key={`${track.title}-compact`} type="button" onClick={() => onPlay(track)} className={`mb-2 grid w-full grid-cols-[52px_minmax(0,1fr)_24px] items-center gap-3 rounded-2xl p-2 text-left transition ${light ? "bg-white/64 hover:bg-white" : "bg-white/[0.055] hover:bg-white/[0.09]"}`}>
            <img src={track.cover} alt="" className="h-12 w-12 rounded-xl object-cover" onError={(event) => { event.currentTarget.src = artwork.alexis; }} />
            <span className="min-w-0">
              <strong className="block truncate text-sm">{track.title}</strong>
              <small className={`block truncate text-xs ${light ? "text-[#111118]/48" : "text-white/48"}`}>{track.artist}</small>
            </span>
            <Play size={14} className={light ? "text-[#111118]/40" : "text-white/40"} />
          </button>
        ))}
      </div>
    </div>
  );
}

function VideoRail({ clips, light, onPlay }: { clips: VideoClip[]; light: boolean; onPlay: (clip: VideoClip) => void }) {
  const railRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => railRef.current?.scrollBy({ left: direction * 520, behavior: "smooth" });
  if (!clips.length) return null;
  return (
    <div className="grid grid-cols-[16px_minmax(0,1fr)_16px] items-center gap-3 sm:grid-cols-[18px_minmax(0,1fr)_18px]">
      <button type="button" onClick={() => scroll(-1)} className="sherrie-scroll-dot justify-self-center" aria-label="Previous videos" />
      <div className="min-w-0 overflow-hidden">
        <div ref={railRef} className="carousel-scroll flex gap-3 pb-3">
          {clips.map((clip) => (
            <article key={clip.title} className={`carousel-item w-[min(76vw,330px)] shrink-0 overflow-hidden rounded-[18px] shadow-[0_14px_42px_rgba(12,10,18,.10)] backdrop-blur-[8px] ${light ? "bg-white/25 text-[#111118]" : "border border-white/10 bg-white/[0.06] text-white"}`}>
              <button type="button" onClick={() => onPlay(clip)} className="group relative aspect-video w-full overflow-hidden text-left">
                <img src={youtubeThumb(clip.embed)} alt="" className="h-full w-full scale-[1.12] object-cover object-center transition duration-300 group-hover:scale-[1.18]" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/16 to-black/8" />
                <span className="absolute left-1/2 top-1/2 inline-flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/58 bg-white/25 text-[#111118] shadow-[0_0_28px_rgba(255,255,255,.35)] backdrop-blur-[10px]">
                  <Play size={20} fill="currentColor" />
                </span>
                <strong className="absolute inset-x-3 bottom-3 line-clamp-2 text-xs font-black leading-tight text-white">{clip.title}</strong>
              </button>
            </article>
          ))}
        </div>
      </div>
      <button type="button" onClick={() => scroll(1)} className="sherrie-scroll-dot justify-self-center" aria-label="Next videos" />
    </div>
  );
}

function FloatingTrackPlayer({ track, onClose, light }: { track: TrackItem | null; onClose: () => void; light: boolean }) {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!track) return null;

  const rawPlayer = normalizeYoutubeUrl(track.youtube) || track.spotify || track.player || track.external;
  const iframeSrc = rawPlayer.includes("youtube.com/embed/")
    ? `${rawPlayer}?rel=0&autoplay=1&controls=0&modestbranding=1`
    : rawPlayer;

  return (
    <div className="fixed inset-x-3 bottom-[92px] z-[95] mx-auto max-w-[360px] sm:left-auto sm:right-6 sm:mx-0">
      <div className={`relative overflow-hidden rounded-[24px] p-2 shadow-[0_18px_62px_rgba(18,12,18,.12)] backdrop-blur-xl ${light ? "bg-white/25 text-[#111118]" : "bg-[#171923]/25 text-white"}`}>
        {isPlaying && rawPlayer !== "#" && (
          <iframe
            src={iframeSrc}
            title={track.title}
            className="pointer-events-none absolute h-px w-px opacity-0"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        <div className="grid grid-cols-[42px_40px_minmax(0,1fr)_24px] items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsPlaying((value) => !value)}
            className={`inline-flex h-[42px] w-[42px] items-center justify-center rounded-[15px] transition hover:scale-[1.03] ${light ? "bg-white/24 text-[#111118]" : "bg-white/10 text-white"}`}
            aria-label="Écouter"
          >
            {isPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
          </button>
          <img src={track.cover} alt="" className="h-10 w-10 rounded-[12px] object-cover shadow-[0_8px_18px_rgba(0,0,0,.12)]" />
          <button type="button" onClick={() => setIsPlaying((value) => !value)} className="min-w-0 text-left">
            <span className="block truncate text-[9px] font-black uppercase tracking-[0.16em] text-[#d85e98]">Lecture</span>
            <strong className="mt-0.5 block truncate text-sm font-black uppercase leading-tight">{track.title}</strong>
            <span className={`block truncate text-[10px] font-black uppercase tracking-[0.10em] ${light ? "text-[#111118]/42" : "text-white/46"}`}>{track.artist}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full transition ${light ? "text-[#111118]/38 hover:bg-white/40 hover:text-[#111118]" : "text-white/45 hover:bg-white/10 hover:text-white"}`}
            aria-label="Fermer"
          >
            <X size={14} />
          </button>
        </div>
        <div className="mt-2 h-[2px] overflow-hidden rounded-full bg-[#d85e98]/15">
          {isPlaying && <span className="release-progress-bar" />}
        </div>
      </div>
    </div>
  );
}

function FloatingVideoPlayer({ clip, onClose, light }: { clip: VideoClip | null; onClose: () => void; light: boolean }) {
  if (!clip) return null;
  return (
    <div className="fixed inset-x-4 bottom-28 z-[95] mx-auto max-w-2xl">
      <div className={`rounded-[22px] p-3 shadow-[0_24px_90px_rgba(0,0,0,.24)] backdrop-blur-xl ${light ? "bg-white/92 text-[#111118]" : "border border-white/10 bg-[#11131d]/94 text-white"}`}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <strong className="line-clamp-1 text-sm">{clip.title}</strong>
          <button type="button" onClick={onClose} className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${light ? "bg-black/6" : "bg-white/10"}`} aria-label="Fermer">
            <X size={16} />
          </button>
        </div>
        <div className="aspect-video overflow-hidden rounded-[14px]">
          <iframe src={`${clip.embed}?rel=0&autoplay=1`} width="100%" height="100%" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
        </div>
      </div>
    </div>
  );
}

function OfficialSocialIcon({ kind }: { kind: SocialKind }) {
  const common = { width: 19, height: 19, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true };
  if (kind === "instagram") return <svg {...common}><path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.7a1.35 1.35 0 1 1 0 2.7 1.35 1.35 0 0 1 0-2.7ZM12 7.3a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4Zm0 2a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Z" /></svg>;
  if (kind === "youtube") return <svg {...common}><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.9 12l-6.3 3.6Z" /></svg>;
  if (kind === "spotify") return <svg {...common}><path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.5 17.3a.75.75 0 0 1-1 .25c-2.75-1.68-6.2-2.06-10.28-1.13a.75.75 0 1 1-.34-1.46c4.47-1.02 8.3-.58 11.37 1.3.36.22.47.68.25 1.04Zm1.47-3.26a.94.94 0 0 1-1.29.31c-3.14-1.93-7.93-2.49-11.64-1.36a.94.94 0 1 1-.55-1.8c4.26-1.3 9.55-.67 13.17 1.56.44.27.58.85.31 1.29Zm.13-3.4C15.33 8.4 9.11 8.2 5.5 9.3a1.12 1.12 0 1 1-.65-2.15c4.14-1.26 11.03-1.03 15.4 1.56a1.12 1.12 0 0 1-1.15 1.93Z" /></svg>;
  return <svg {...common}><path d="M18.8 4.2C15.7 2.9 10 2.8 5.2 4.1 3.8 4.5 3 5.6 3 7v10c0 1.7 1.3 3 3 3h12c1.7 0 3-1.3 3-3V7c0-1.2-.8-2.3-2.2-2.8ZM7 8.4c3.7-1 8.2-.9 11 .2v2.1c-2.8-1.1-7.3-1.2-11-.2V8.4Zm0 4.2c3.7-1 8.2-.9 11 .2v2.1c-2.8-1.1-7.3-1.2-11-.2v-2.1Z" /></svg>;
}

function dbTrackToItem(track: DbTrack): TrackItem {
  const rawDate = track.releasedAt || track.createdAt || "";
  const date = rawDate ? new Date(rawDate) : null;
  const lower = `${track.title} ${track.artistName}`.toLowerCase();
  const cover = track.cover || (lower.includes("echoes") ? artwork.echoes : lower.includes("superstition") ? artwork.superstition : artwork.paga);
  return {
    title: track.title,
    artist: track.artistName,
    year: date ? String(date.getFullYear()) : "Music",
    date: date ? date.toLocaleDateString("en", { day: "2-digit", month: "short", year: "numeric" }) : undefined,
    source: track.spotifyEmbedUrl ? "Spotify" : track.youtubeEmbedUrl ? "YouTube" : track.soundcloudEmbedUrl ? "SoundCloud" : "Music",
    external: track.externalUrl || track.spotifyEmbedUrl || track.youtubeEmbedUrl || "#",
    cover,
    spotify: track.spotifyEmbedUrl || undefined,
    youtube: track.youtubeEmbedUrl || undefined,
    player: track.soundcloudEmbedUrl || undefined,
  };
}

function ArtistProfile({
  name,
  eyebrow,
  text,
  image,
  socials,
  tracks,
  videos,
  light,
  labels,
  onPlay,
  onVideoPlay,
  reverse,
}: {
  name: string;
  eyebrow: string;
  text: string;
  image: string;
  socials: { href: string; kind: SocialKind; label: string }[];
  tracks: TrackItem[];
  videos: VideoClip[];
  light: boolean;
  labels: ReturnType<typeof getCopy>;
  onPlay: (track: TrackItem) => void;
  onVideoPlay: (clip: VideoClip) => void;
  reverse?: boolean;
}) {
  const latest = tracks.slice(0, 6);
  const catalogue = tracks;

  return (
    <section className="px-4 py-10 sm:px-6">
      <article className={`mx-auto max-w-7xl overflow-hidden rounded-[24px] px-4 py-6 shadow-[0_18px_58px_rgba(30,24,28,.08)] sm:px-6 ${light ? "bg-white/58 text-[#111118]" : "bg-[#202236] text-white"}`}>
        <div className={`grid gap-6 lg:items-center ${reverse ? "lg:grid-cols-[300px_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_300px]"}`}>
          <div className={reverse ? "lg:order-2" : ""}>
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#aa5d74]">{eyebrow}</p>
            <h2 className={`mt-4 text-[clamp(2.3rem,5vw,4.8rem)] font-black uppercase leading-[.9] tracking-[-.055em] ${light ? "text-[#111118]" : "text-white"}`}>{name}</h2>
            <p className={`mt-5 max-w-2xl text-sm leading-relaxed ${light ? "text-[#111118]/62" : "text-white/64"}`}>{text}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {socials.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={`${name} ${social.label}`} className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition ${light ? "bg-[#111118] text-white hover:bg-[#aa5d74]" : "bg-white/10 text-white hover:bg-white/18"}`}>
                  <OfficialSocialIcon kind={social.kind} />
                </a>
              ))}
            </div>
          </div>
          <figure className={`aspect-[4/4.4] w-full max-w-[300px] justify-self-center overflow-hidden rounded-[22px] shadow-[0_16px_44px_rgba(12,10,18,.12)] ${reverse ? "lg:order-1 lg:justify-self-start" : "lg:justify-self-end"} ${light ? "bg-white/72" : "border border-white/10 bg-white/[0.06]"}`}>
            <img src={image} alt={name} className="h-full w-full object-cover object-center" />
          </figure>
        </div>

        <div className="mt-10">
          <h3 className="mb-4 text-lg font-black uppercase tracking-[0.08em]">{labels.latest}</h3>
          <MusicRail tracks={latest} light={light} labels={labels} onPlay={onPlay} />
        </div>

        <div className="mt-8 grid gap-7 lg:grid-cols-2 lg:items-start">
          <div className="min-w-0">
            <h3 className="mb-4 text-lg font-black uppercase tracking-[0.08em]">{labels.catalogue}</h3>
            <CompactCatalogue tracks={catalogue} light={light} onPlay={onPlay} />
          </div>
          <div className={`min-w-0 lg:flex lg:min-h-[348px] lg:flex-col lg:justify-center lg:border-l lg:pl-7 ${light ? "border-[#111118]/18" : "border-white/16"}`}>
            <h3 className="mb-4 text-lg font-black uppercase tracking-[0.08em]">{labels.artistVideos}</h3>
            <VideoRail clips={videos} light={light} onPlay={onVideoPlay} />
          </div>
        </div>
      </article>
    </section>
  );
}

function InfoBlocks({ light }: { light: boolean }) {
  const labels = getCopy(useLocale());
  const steps = [
    { title: labels.how1Title, copy: labels.how1Copy },
    { title: labels.how2Title, copy: labels.how2Copy },
    { title: labels.how3Title, copy: labels.how3Copy },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((step) => (
        <article key={step.title} className="sherrie-action-card">
          <h3 className="text-xl font-black uppercase">{step.title}</h3>
          <p className="mt-3 text-sm leading-relaxed opacity-72">{step.copy}</p>
          <span className="mt-5 block text-2xl text-[#d85e98]">→</span>
        </article>
      ))}
    </div>
  );
}

function FooterActions({ light }: { light: boolean }) {
  const labels = getCopy(useLocale());
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const ok = response.ok || response.status === 201 || response.status === 409;
      setStatus(ok ? "success" : "error");
      if (ok) setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="sherrie-footer-zone px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <InfoBlocks light={light} />
        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_.85fr]">
          <form onSubmit={submit} className="sherrie-action-card">
            <h3 className="text-2xl font-black uppercase tracking-[0.04em]">{labels.newsletterTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed opacity-72">{labels.newsletterCopy}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder={labels.placeholder} className="sherrie-footer-input min-w-0 flex-1 rounded-2xl px-4 py-3 text-sm outline-none" />
              <button type="submit" disabled={status === "loading"} className="sherrie-primary-cta rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.12em]">
                {status === "loading" ? "..." : labels.subscribe}
              </button>
            </div>
            {status === "success" && <p className="mt-3 text-sm text-[#aa5d74]">OK</p>}
            {status === "error" && <p className="mt-3 text-sm text-[#aa5d74]">Erreur</p>}
          </form>
          <div className="sherrie-action-card">
            <h3 className="text-2xl font-black uppercase tracking-[0.04em]">{labels.contactTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed opacity-72">{labels.contactCopy}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/${locale}/sponsors`} className="sherrie-primary-cta rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.12em]">{labels.sponsorCta}</Link>
              <Link href={`/${locale}/rejoindre`} className="sherrie-outline-cta rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.12em]">{labels.joinCta}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BottomNav({ light }: { light: boolean }) {
  const labels = getCopy(useLocale());
  const locale = useLocale();
  return (
    <nav className="sherrie-floating-nav fixed inset-x-0 bottom-0 z-[80] px-4 pb-4 pt-3">
      <div className="mx-auto grid w-[min(92vw,500px)] grid-cols-3 items-center gap-1">
        <Link href={`/${locale}/dates`} className="sherrie-nav-button flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.16em]">
          <CalendarDays size={15} /> {labels.dates}
        </Link>
        <Link href={`/${locale}`} aria-label="Sherrie Sherrie" className="relative flex h-20 items-center justify-center">
          <span className="absolute h-16 w-36 rounded-full bg-[#ef6aa4]/18 blur-2xl" />
          <img src="/sherrie-sherrie.png" alt="Sherrie Sherrie" className="relative h-20 w-auto max-w-[220px] object-contain drop-shadow-[0_0_28px_rgba(239,106,164,.30)]" />
        </Link>
        <a href="#contact" className="sherrie-nav-button flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.16em]">
          {labels.contact} <MessageCircle size={15} />
        </a>
      </div>
    </nav>
  );
}

function SherrieHome({ events, tracks, videos, darkMode }: { events: EventItem[]; tracks: DbTrack[]; videos: DbVideo[]; darkMode: boolean }) {
  const locale = useLocale();
  const labels = getCopy(locale);
  const light = !darkMode;
  const [activeTrack, setActiveTrack] = useState<TrackItem | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoClip | null>(null);
  const [darkHeroIndex, setDarkHeroIndex] = useState(0);
  const sherrieEvents = events.filter((event) => event.isB2B || event.artists?.some((item) => item.artist.slug === "alexis-dante"));
  const featuredEvents = sherrieEvents.length ? sherrieEvents : events;

  const dbTracks = useMemo(() => tracks.map(dbTrackToItem), [tracks]);
  const pagaTracks = dbTracks.filter((track) => /paga/i.test(track.artist));
  const pagaList = [...pagaOfficialTracks, ...pagaTracks].filter((track, index, list) => list.findIndex((item) => item.title.toLowerCase() === track.title.toLowerCase()) === index);
  const alexisList = alexisTracks;
  const dbVideos = videos.map((video) => ({ title: video.title, embed: video.youtubeEmbedUrl }));
  const commonVideoList = commonVideos.concat(dbVideos.slice(0, 2));
  const pagaVideoList = [...pagaVideos, ...dbVideos].filter((clip, index, list) => list.findIndex((item) => item.title.toLowerCase() === clip.title.toLowerCase()) === index);

  useEffect(() => {
    if (!darkMode) {
      setDarkHeroIndex(0);
      return;
    }
    const timer = window.setInterval(() => {
      setDarkHeroIndex((current) => (current + 1) % darkHeroSlides.length);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [darkMode]);

  return (
    <>
      <div className={`sherrie-theme min-h-screen overflow-hidden transition-colors duration-500 ${light ? "bg-[#f7f4ef] text-[#111118]" : "bg-[#090708] text-white"}`}>
        <section className="relative min-h-[820px] overflow-hidden">
          {light ? (
            <img
              src="/images/sherrie/duo-booth.png"
              alt=""
              fetchPriority="high"
              className="absolute inset-0 h-full w-full scale-[1.18] object-cover object-[40%_42%] opacity-100 sm:scale-100 sm:object-[58%_42%]"
            />
          ) : (
            darkHeroSlides.map((slide, index) => (
              <img
                key={slide}
                src={slide}
                alt=""
                loading="eager"
                decoding="async"
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300 ${
                  darkHeroIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))
          )}
          <div className={`absolute inset-0 ${light ? "bg-[linear-gradient(90deg,rgba(247,244,239,.34),rgba(247,244,239,.18)_36%,rgba(247,244,239,.02)),linear-gradient(180deg,rgba(247,244,239,0),rgba(247,244,239,.58))]" : "bg-[linear-gradient(90deg,rgba(8,6,8,.50),rgba(8,6,8,.28)_36%,rgba(8,6,8,.06)),linear-gradient(180deg,rgba(8,6,8,.02),rgba(8,6,8,.60))]"}`} />
          <div className="relative z-10 mx-auto grid min-h-[760px] max-w-7xl items-center gap-10 px-4 pb-36 pt-28 sm:px-6 xl:grid-cols-[minmax(0,1fr)_290px]">
            <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: "easeOut" }}>
              <h1 className={`max-w-[800px] text-[clamp(3rem,7vw,6.4rem)] font-black uppercase leading-[.84] tracking-[-.07em] ${light ? "text-[#111118]" : "text-white"}`}>{labels.heroTitle}</h1>
              <img
                src="/sherrie-sherrie.png"
                alt="Sherrie Sherrie"
                className={`ml-auto mt-7 w-[min(52vw,230px)] saturate-90 contrast-125 drop-shadow-[0_0_28px_rgba(177,90,111,.20)] sm:ml-0 sm:w-[min(68vw,360px)] ${
                  light ? "block" : "hidden sm:block"
                }`}
              />
            </motion.div>
            <motion.div className="mt-24 justify-self-center sm:mt-12 xl:mt-0 xl:justify-self-auto" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}>
              <MiniDates events={featuredEvents} labels={labels} light={light} />
            </motion.div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
              <div>
                <p className="mb-4 text-[11px] font-black uppercase tracking-[0.34em] text-[#aa5d74]">{labels.storyEyebrow}</p>
                <h2 className={`text-[clamp(2.4rem,6vw,5.8rem)] font-black uppercase leading-[.88] tracking-[-.055em] ${light ? "text-[#111118]" : "text-white"}`}>{labels.storyTitle}</h2>
                <p className={`mt-6 text-sm leading-relaxed ${light ? "text-[#111118]/62" : "text-white/62"}`}>{labels.storyText}</p>
              </div>
              <AutoPhotoSlideshow light={light} />
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionHeader eyebrow={labels.soundsEyebrow} title={labels.soundsTitle} copy={labels.soundsCopy} light={light} />
            <MusicRail tracks={commonTracks} light={light} labels={labels} onPlay={setActiveTrack} />
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionHeader eyebrow={labels.videosEyebrow} title={labels.videosTitle} light={light} />
            <VideoRail clips={commonVideoList} light={light} onPlay={setActiveVideo} />
          </div>
        </section>

        <ArtistProfile
          name={labels.pagaProfileTitle}
          eyebrow={labels.pagaProfileEyebrow}
          text={labels.pagaProfileText}
          image="/images/sherrie/paga-profile-current.png"
          socials={[
            { label: "Instagram", href: "https://www.instagram.com/paga_lmsa", kind: "instagram" },
            { label: "YouTube", href: "https://www.youtube.com/@pagaproduction", kind: "youtube" },
            { label: "Spotify", href: "https://open.spotify.com/search/Paga%20DJ", kind: "spotify" },
          ]}
          tracks={pagaList}
          videos={pagaVideoList}
          light={light}
          labels={labels}
          onPlay={setActiveTrack}
          onVideoPlay={setActiveVideo}
        />

        <ArtistProfile
          name={labels.alexisProfileTitle}
          eyebrow={labels.alexisProfileEyebrow}
          text={labels.alexisProfileText}
          image="/images/sherrie/alexis-profile-bw.jpg"
          socials={[
            { label: "Instagram", href: "https://www.instagram.com/alexis.dante", kind: "instagram" },
            { label: "Spotify", href: "https://open.spotify.com/search/Alexis%20Dante", kind: "spotify" },
            { label: "Deezer", href: "https://www.deezer.com/search/Alexis%20Dante", kind: "deezer" },
          ]}
          tracks={alexisList}
          videos={sherrieVideos}
          light={light}
          labels={labels}
          onPlay={setActiveTrack}
          onVideoPlay={setActiveVideo}
          reverse
        />

        <FooterActions light={light} />
      </div>
      <FloatingTrackPlayer track={activeTrack} onClose={() => setActiveTrack(null)} light={light} />
      <FloatingVideoPlayer clip={activeVideo} onClose={() => setActiveVideo(null)} light={light} />
      <BottomNav light={light} />
    </>
  );
}

export default function MirageExperience({ events, tracks, videos }: { events: EventItem[]; tracks: DbTrack[]; videos: DbVideo[] }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(localStorage.getItem("sherrie-theme") === "dark");
    const handleThemeChange = (event: Event) => {
      const theme = (event as CustomEvent<"light" | "dark">).detail;
      setDarkMode(theme === "dark");
    };
    window.addEventListener("sherrie-theme-change", handleThemeChange);
    return () => window.removeEventListener("sherrie-theme-change", handleThemeChange);
  }, []);

  return <SherrieHome events={events} tracks={tracks} videos={videos} darkMode={darkMode} />;
}
