const SPOTIFY_OPEN_RE = /^https:\/\/open\.spotify\.com\/(track|album|playlist|artist|episode|show)\/([A-Za-z0-9]+)(?:[/?#].*)?$/;
const SPOTIFY_EMBED_RE = /^https:\/\/open\.spotify\.com\/embed\/(track|album|playlist|artist|episode|show)\/([A-Za-z0-9]+)(?:[/?#].*)?$/;

export function normalizeSpotifyEmbedUrl(url?: string | null) {
  const value = url?.trim();
  if (!value) return null;

  const embedded = value.match(SPOTIFY_EMBED_RE);
  if (embedded) {
    const [, type, id] = embedded;
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
  }

  const open = value.match(SPOTIFY_OPEN_RE);
  if (open) {
    const [, type, id] = open;
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
  }

  return value;
}

export function normalizeSpotifyExternalUrl(url?: string | null) {
  const value = url?.trim();
  if (!value) return null;

  const embedded = value.match(SPOTIFY_EMBED_RE);
  if (embedded) {
    const [, type, id] = embedded;
    return `https://open.spotify.com/${type}/${id}`;
  }

  return value;
}
