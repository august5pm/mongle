import "server-only";

import type { MediaItem, MediaType } from "@/data/mock";
import { parseAppMediaId } from "@/lib/tmdb-image";

const TMDB_API = "https://api.themoviedb.org/3";

type TmdbMovieListItem = {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  media_type?: "movie" | "tv" | "person";
};

type TmdbDetail = TmdbMovieListItem & {
  runtime?: number;
  episode_run_time?: number[];
  genres?: { id: number; name: string }[];
  credits?: {
    cast?: { name: string; character?: string }[];
    crew?: { name: string; job?: string }[];
  };
};

const GENRE_KO: Record<number, string> = {
  28: "액션",
  12: "모험",
  16: "애니메이션",
  35: "코미디",
  80: "범죄",
  99: "다큐",
  18: "드라마",
  10751: "가족",
  14: "판타지",
  36: "역사",
  27: "공포",
  10402: "음악",
  9648: "미스터리",
  10749: "로맨스",
  878: "SF",
  10770: "TV영화",
  53: "스릴러",
  10752: "전쟁",
  37: "서부",
  10759: "액션·모험",
  10765: "SF·판타지",
};

const TONES = [
  "linear-gradient(160deg, #1a1230 0%, #4a2a58 45%, #ffb3a7 150%)",
  "linear-gradient(160deg, #0c1420 0%, #1e3a5f 50%, #c9d8ff 140%)",
  "linear-gradient(160deg, #140a12 0%, #5b2145 50%, #ffc4b8 140%)",
  "linear-gradient(160deg, #0a1210 0%, #1a3d32 50%, #a8e6cf 140%)",
];

export function isTmdbConfigured() {
  return Boolean(process.env.TMDB_API_KEY?.trim());
}

function apiKey() {
  const key = process.env.TMDB_API_KEY?.trim();
  if (!key) throw new Error("TMDB_API_KEY가 설정되지 않았습니다.");
  return key;
}

export function toAppMediaId(type: MediaType, tmdbId: number) {
  return `tmdb-${type === "tv" ? "t" : "m"}-${tmdbId}`;
}

function yearFromDate(date?: string) {
  if (!date) return 0;
  const y = Number(date.slice(0, 4));
  return Number.isFinite(y) ? y : 0;
}

function toneFor(id: number) {
  return TONES[id % TONES.length];
}

function mapListItem(
  item: TmdbMovieListItem,
  forcedType?: MediaType,
): MediaItem | null {
  if (item.media_type === "person") return null;

  const mediaType: MediaType =
    forcedType ??
    (item.media_type === "tv"
      ? "tv"
      : item.media_type === "movie"
        ? "movie"
        : item.title
          ? "movie"
          : "tv");

  const title = (mediaType === "tv" ? item.name : item.title) || "제목 없음";
  const original =
    mediaType === "tv" ? item.original_name : item.original_title;
  const date = mediaType === "tv" ? item.first_air_date : item.release_date;
  const genres = (item.genre_ids ?? [])
    .map((id) => GENRE_KO[id])
    .filter(Boolean) as string[];

  return {
    id: toAppMediaId(mediaType, item.id),
    title,
    originalTitle: original,
    type: mediaType,
    year: yearFromDate(date),
    rating: Number((item.vote_average ?? 0).toFixed(1)),
    overview: item.overview?.trim() || "줄거리 정보가 아직 없어요.",
    genres: genres.length ? genres : ["영화"],
    posterTone: toneFor(item.id),
    backdropTone: toneFor(item.id + 1),
    posterPath: item.poster_path ?? undefined,
    backdropPath: item.backdrop_path ?? undefined,
  };
}

function mapDetail(detail: TmdbDetail, type: MediaType): MediaItem {
  const base = mapListItem(detail, type)!;
  const runtimeMin =
    type === "movie" ? detail.runtime : detail.episode_run_time?.[0];
  const director = detail.credits?.crew?.find(
    (c) => c.job === "Director",
  )?.name;
  const cast = (detail.credits?.cast ?? []).slice(0, 8).map((c) => ({
    name: c.name,
    role: c.character || "출연",
  }));
  const genres =
    detail.genres?.map((g) => GENRE_KO[g.id] ?? g.name).filter(Boolean) ??
    base.genres;

  return {
    ...base,
    genres: genres.length ? genres : base.genres,
    runtime: runtimeMin ? `${runtimeMin}분` : undefined,
    director,
    cast: cast.length ? cast : undefined,
  };
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${TMDB_API}${path}`);
  url.searchParams.set("api_key", apiKey());
  url.searchParams.set("language", "ko-KR");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 * 30 },
  });
  if (!res.ok) {
    throw new Error(`TMDB 요청 실패 (${res.status})`);
  }
  return (await res.json()) as T;
}

export async function searchTmdb(query: string, page = 1): Promise<MediaItem[]> {
  const q = query.trim();
  if (!q || !isTmdbConfigured()) return [];

  const data = await tmdbFetch<{ results: TmdbMovieListItem[] }>(
    "/search/multi",
    { query: q, page: String(page), include_adult: "false" },
  );

  return (data.results ?? [])
    .map((item) => mapListItem(item))
    .filter((x): x is MediaItem => Boolean(x?.posterPath));
}

export async function trendingTmdb(
  window: "day" | "week" = "week",
): Promise<MediaItem[]> {
  if (!isTmdbConfigured()) return [];
  const data = await tmdbFetch<{ results: TmdbMovieListItem[] }>(
    `/trending/all/${window}`,
  );
  return (data.results ?? [])
    .map((item) => mapListItem(item))
    .filter((x): x is MediaItem =>
      Boolean(x && (x.posterPath || x.backdropPath)),
    )
    .slice(0, 12);
}

export async function fetchTmdbMediaByAppId(
  appId: string,
): Promise<MediaItem | undefined> {
  const parsed = parseAppMediaId(appId);
  if (!parsed || !isTmdbConfigured()) return undefined;

  const path =
    parsed.type === "tv"
      ? `/tv/${parsed.tmdbId}`
      : `/movie/${parsed.tmdbId}`;

  const detail = await tmdbFetch<TmdbDetail>(path, {
    append_to_response: "credits",
  });
  return mapDetail(detail, parsed.type);
}

/** Discover movies by genre / sort — for home mood rails */
export async function discoverMoviesTmdb(
  params: Record<string, string>,
  limit = 10,
): Promise<MediaItem[]> {
  if (!isTmdbConfigured()) return [];
  const data = await tmdbFetch<{ results: TmdbMovieListItem[] }>(
    "/discover/movie",
    {
      include_adult: "false",
      sort_by: "popularity.desc",
      "vote_count.gte": "80",
      ...params,
    },
  );
  return (data.results ?? [])
    .map((item) => mapListItem(item, "movie"))
    .filter((x): x is MediaItem => Boolean(x?.posterPath))
    .slice(0, limit);
}

export type HomeRails = {
  featured: MediaItem;
  trending: MediaItem[];
  softFluffy: MediaItem[];
  rainyDay: MediaItem[];
};

export async function fetchHomeRails(): Promise<HomeRails | null> {
  if (!isTmdbConfigured()) return null;

  try {
    const [week, soft, rainy] = await Promise.all([
      trendingTmdb("week"),
      discoverMoviesTmdb(
        {
          with_genres: "10751|16|35|10749",
          "vote_average.gte": "6.5",
        },
        8,
      ),
      discoverMoviesTmdb(
        {
          with_genres: "18|9648|10749",
          "vote_average.gte": "7",
          sort_by: "vote_average.desc",
        },
        12,
      ),
    ]);

    const featured =
      week.find((m) => m.backdropPath) ?? week[0] ?? soft[0] ?? rainy[0];
    if (!featured) return null;

    const trending = week
      .filter((m) => m.id !== featured.id)
      .slice(0, 8)
      .map((m, i) => ({
        ...m,
        progress: Math.min(92, Math.max(35, Math.round(m.rating * 9) - i * 3)),
        remainingLabel: m.genres[0] ?? (m.type === "tv" ? "시리즈" : "영화"),
      }));

    return {
      featured,
      trending: trending.length ? trending : week.slice(0, 8),
      softFluffy: soft.slice(0, 4),
      rainyDay: rainy.slice(0, 10),
    };
  } catch {
    return null;
  }
}
