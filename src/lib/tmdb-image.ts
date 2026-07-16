/** TMDB image CDN helpers (클라이언트 안전) */

const TMDB_IMG = "https://media.themoviedb.org/t/p";

export type TmdbSize =
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "w1280"
  | "original";

export function tmdbImage(path: string | undefined, size: TmdbSize = "w500") {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${TMDB_IMG}/${size}${path.startsWith("/") ? path : `/${path}`}`;
}

export function parseAppMediaId(
  id: string,
): { type: "movie" | "tv"; tmdbId: number } | null {
  const m = id.match(/^tmdb-(m|t)-(\d+)$/);
  if (!m) return null;
  return {
    type: m[1] === "t" ? "tv" : "movie",
    tmdbId: Number(m[2]),
  };
}
