/** TMDB image CDN helpers (클라이언트 안전) */

const TMDB_IMG = "https://media.themoviedb.org/t/p";

export type TmdbSize =
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "w1280"
  | "original";

/** 공식 이미지 CDN — media.themoviedb.org는 여기로 301 리다이렉트한다 */
const TMDB_IMG_CDN = "https://image.tmdb.org/t/p";

function buildTmdbImageUrl(
  base: string,
  path: string | undefined,
  size: TmdbSize,
) {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${base}/${size}${path.startsWith("/") ? path : `/${path}`}`;
}

export function tmdbImage(path: string | undefined, size: TmdbSize = "w500") {
  return buildTmdbImageUrl(TMDB_IMG, path, size);
}

/**
 * 외부 크롤러(OG·트위터 카드)용 — 리다이렉트 없이 바로 이미지를 주는 CDN 주소.
 * 카카오톡 등 일부 크롤러는 og:image의 리다이렉트를 따라가지 않는다.
 */
export function tmdbImageForShare(
  path: string | undefined,
  size: TmdbSize = "w1280",
) {
  return buildTmdbImageUrl(TMDB_IMG_CDN, path, size);
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
