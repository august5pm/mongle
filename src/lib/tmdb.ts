/** TMDB media CDN (public image host) */
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
