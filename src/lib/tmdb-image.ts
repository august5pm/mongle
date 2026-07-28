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

/** next/image blur용 — tone 그라데이션에서 첫 hex를 뽑아 단색 SVG data URL 생성 */
export function blurDataURLFromTone(tone: string): string {
  const match = tone.match(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/);
  let color = match ? `#${match[1]}` : "#272a2c";
  if (color.length === 4) {
    color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="12"><rect width="100%" height="100%" fill="${color}"/></svg>`;
  const encoded =
    typeof Buffer !== "undefined"
      ? Buffer.from(svg).toString("base64")
      : btoa(svg);
  return `data:image/svg+xml;base64,${encoded}`;
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
